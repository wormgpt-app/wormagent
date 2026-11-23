import { Database } from "@wormagent/core/database/database"
import { V1Migration } from "@wormagent/core/database/v1-migration"
import { App } from "@wormagent/core/app"
import { CodeModeApi } from "@wormagent/core/codemode/api"
import { LayerNode } from "@wormagent/util/effect/layer-node"
import { Node } from "@wormagent/util/effect/app-node"
import { fetchLayer, httpClient, httpFetch } from "@wormagent/util/effect/app-node-platform"
import { AppNodeBuilder } from "@wormagent/core/effect/app-node-builder"
import { Bus } from "@wormagent/core/bus"
import { EventLogger } from "@wormagent/core/event-logger"
import { FileSystemSearch } from "@wormagent/core/filesystem/search"
import { Credential } from "@wormagent/core/credential"
import { Config } from "@wormagent/core/config"
import { PermissionSaved } from "@wormagent/core/permission/saved"
import { PtyTicket } from "@wormagent/core/pty/ticket"
import { PersistentPty } from "@wormagent/core/persistent-pty"
import { Project } from "@wormagent/core/project"
import { BlobStore } from "@wormagent/core/blob-store"
import { VideoGeneration } from "@wormagent/core/video-generation"
import { Worktree } from "@wormagent/core/worktree"
import { Session } from "@wormagent/core/session"
import { Instance } from "@wormagent/core/instance/service"
import { SessionTransfer } from "@wormagent/core/session/transfer"
import { InstructionEntry } from "@wormagent/core/session/instruction-entry"
import { ShellSelect } from "@wormagent/core/shell/select"
import { Shell } from "@wormagent/core/shell"
import { Job } from "@wormagent/core/job"
import { KV } from "@wormagent/core/kv"
import { Mcp } from "@wormagent/core/mcp/index"
import { Global } from "@wormagent/util/global"
import { FSUtil } from "@wormagent/util/fs-util"
import { InstructionDiscovery } from "@wormagent/core/instruction-discovery"
import { LocationServiceMap } from "@wormagent/core/location-service-map"
import { LocationActivity } from "@wormagent/core/location-activity"
import { Identity } from "@wormagent/core/machine/identity"
import { Machines } from "@wormagent/core/machine/machines"
import { SessionSearchBuild } from "@wormagent/core/session/search-build"
import { ModelsDev } from "@wormagent/core/models-dev"
import { SessionRestart } from "@wormagent/core/session/execution/restart"
import { Automation } from "@wormagent/core/automation"
import { PluginUpdate } from "@wormagent/core/plugin/update"
import { SdkPlugins } from "@wormagent/core/plugin/sdk"
import { WellKnown } from "@wormagent/core/wellknown"
import { Workspace } from "@wormagent/core/workspace"
import { Watcher } from "@wormagent/core/filesystem/watcher"
import { FileWatch } from "@wormagent/core/filesystem/file-watch"
import { HttpEffect, HttpRouter } from "effect/http"
import { HttpApiBuilder } from "effect/http-api"
import { Context, Effect, Layer, Option } from "effect"
import { Base64 } from "effect/encoding"
import { Api } from "./api"
import { ServerAuth } from "./auth"
import { CorsConfig } from "./cors"
import { handlers } from "./handlers"
import { authorizationLayer } from "./middleware/authorization"
import { schemaErrorLayer } from "./middleware/schema-error"
import { defectResponseLayer } from "./middleware/defect-response"
import { ServerPairing } from "./pairing"
import { layer } from "./location"
import { formLocationLayer } from "./middleware/form-location"
import { sessionLocationLayer } from "./middleware/session-location"
import { ServerInfo } from "./server-info"
import type { ServerOptions } from "./options"

const applicationServiceNodes = [
  App.node,
  CodeModeApi.node,
  Global.node,
  FSUtil.node,
  Database.node,
  KV.node,
  Bus.node,
  // Before the jobs and sessions, so they are released after them: a shutdown's interrupted shell calls and jobs
  // still reach the daemon to stop their commands, and a command being created never falls back to spawning.
  PersistentPty.node,
  // Daemon-run shell commands belong to the server, so a Location closing never takes them down.
  Shell.daemonNode,
  EventLogger.node,
  httpClient,
  Job.node,
  Project.node,
  Project.sweepNode,
  Worktree.node,
  Session.node,
  Instance.node,
  SessionTransfer.node,
  InstructionEntry.node,
  SdkPlugins.node,
  PluginUpdate.node,
  PermissionSaved.node,
  PtyTicket.node,
  Credential.node,
  WellKnown.node,
  ServerPairing.node,
  LocationServiceMap.node,
  LocationActivity.node,
  SessionRestart.node,
  Automation.node,
  // Read by the blob route.
  BlobStore.node,
  // Started with the server, so its leader election and polling resume jobs even before anyone calls the video API.
  VideoGeneration.node,
  SessionSearchBuild.node,
  Workspace.node,
  // The machine list: where a carrier hands over the workers dialing in from other computers.
  Machines.node,
  // The home's key, which the link's handshake signs with.
  Identity.node,
  FileWatch.node,
] as const
const applicationServices = LayerNode.group(applicationServiceNodes)

export function createRoutes(
  options: ServerOptions = {},
  serviceURLs: () => ReadonlyArray<string> = () => [],
  overrides: LayerNode.Replacements = [],
) {
  return makeRoutes(options.password ? Option.some(options.password) : Option.none(), options, serviceURLs, overrides)
}

type InstanceNode = (
  replacements: () => LayerNode.Replacements,
) => LayerNode.Provider<Instance.Service, never, typeof Node.tags.values.global>

export function createEmbeddedRoutes(
  options: ServerOptions = {},
  overrides: LayerNode.Replacements = [],
  instances?: InstanceNode,
) {
  return makeRoutes(Option.none(), options, () => [], overrides, instances)
}

function makeRoutes(
  password: Option.Option<string>,
  options: ServerOptions,
  serviceURLs: () => ReadonlyArray<string>,
  // Runtime-profile replacements (e.g. workerd) applied after the standard set, so later entries win.
  overrides: LayerNode.Replacements,
  instances?: InstanceNode,
) {
  const auth = ServerAuth.Config.configLayer({ password })
  // Code Mode `wormagent://` fetches go straight to this router, set once the router below is built. They carry the
  // server's own credential, added here after the script handed the request over, so the script never sees it.
  const credential = Option.map(password, (value) => `Basic ${Base64.encode(`wormagent:${value}`)}`)
  let internal: ((request: Request) => Promise<Response>) | undefined
  const standard: LayerNode.Replacements = [
    CodeModeApi.node.replace(
      Layer.succeed(
        CodeModeApi.Service,
        CodeModeApi.Service.of({
          fetch: (request) =>
            Effect.suspend(() => {
              const handle = internal
              if (!handle) return Effect.fail(new Error("The WormAgent API is not ready yet."))
              if (Option.isSome(credential)) request.headers.set("authorization", credential.value)
              return Effect.tryPromise({
                try: () => handle(request),
                catch: (error) => (error instanceof Error ? error : new Error(String(error))),
              })
            }),
        }),
      ),
    ),
    Database.node.replace(Database.configured(options.database)),
    PersistentPty.node.replace(PersistentPty.configured(options.pty)),
    Bus.node.replace(Bus.configured({ persist: options.events?.persist })),
    App.node.replace(App.configured(options.app)),
    ModelsDev.node.replace(ModelsDev.configured(options.models)),
    httpFetch.replace(fetchLayer(options.fetch)),
    Watcher.node.replace(Watcher.configured({ enabled: options.fs?.filewatcher })),
    FileWatch.node.replace(FileWatch.configured({ enabled: options.fs?.filewatcher })),
    FileSystemSearch.node.replace(FileSystemSearch.configured({ fff: options.fs?.fff })),
    Global.node.replace(Global.layerWith(options.config?.directory ? { config: options.config.directory } : {})),
    Config.node.replace(
      Config.configured({
        project: options.config?.project,
        claude: options.config?.claude,
        file: options.config?.file,
        content: options.config?.content,
      }),
    ),
    InstructionDiscovery.node.replace(
      InstructionDiscovery.configured({
        project: options.config?.project,
        claude: options.instructions?.claude,
      }),
    ),
    ShellSelect.node.replace(ShellSelect.configured({ gitbash: options.windows?.gitbash })),
    Mcp.node.replace(
      Mcp.configured({
        clientInfo: {
          name: "wormagent",
          version: options.app?.version ?? "unknown",
        },
      }),
    ),
  ]
  const build = (overrides: LayerNode.Replacements) => {
    const replacements: LayerNode.Replacements = [
      ...standard,
      // Private instances resolve this list lazily so they inherit the complete host graph, including the selector.
      ...(instances ? [Instance.node.replace(instances(() => replacements))] : []),
      ...overrides,
    ]
    return AppNodeBuilder.build(applicationServices, replacements)
  }
  const serviceLayer = options.simulation
    ? Layer.unwrap(
        Effect.gen(function* () {
          const { simulationReplacements } = yield* Effect.promise(() => import("@wormagent/simulation/backend"))
          const simulation = yield* simulationReplacements({ version: App.make(options.app).version })
          return build([...overrides, ...simulation])
        }),
      )
    : build(overrides)
  return serviceLayer.pipe(
    Layer.flatMap((context) => {
      const services = Layer.succeedContext(context)
      const requestServices = Layer.merge(
        Layer.succeedContext(
          Context.pick(
            Database.Service,
            Credential.Service,
            PermissionSaved.Service,
            PluginUpdate.Service,
            Project.Service,
            WellKnown.Service,
          )(context),
        ),
        ServerInfo.layer(serviceURLs, Context.get(context, Global.Service).tmp, options.app),
      )
      const api = HttpApiBuilder.layer(Api, { openapiPath: "/openapi.json" }).pipe(
        Layer.provide(handlers.pipe(Layer.provide(services), Layer.provide(Layer.succeed(CorsConfig, options)))),
        Layer.provide(formLocationLayer),
        Layer.provide(sessionLocationLayer),
        Layer.provide(layer),
        Layer.provide(authorizationLayer),
        Layer.provide(schemaErrorLayer),
        Layer.provide(auth),
        HttpRouter.provideRequest(requestServices),
        Layer.merge(defectResponseLayer),
        Layer.provideMerge(services),
        Layer.provideMerge(HttpRouter.layer),
        Layer.tap((context) =>
          Effect.sync(() => {
            internal = Context.get(context, HttpRouter.HttpRouter)
              .asHttpEffect()
              .pipe(HttpEffect.toWebHandlerWith(context))
          }),
        ),
      )
      return Layer.merge(api, V1Migration.layer.pipe(Layer.provide(services)))
    }),
  )
}
