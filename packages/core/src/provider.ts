export * as Provider from "./provider.js"

import { Context, Effect, Layer, Option, Schema, Stream, Struct } from "effect"
import { Provider } from "@wormagent/schema/provider"
import { Model } from "@wormagent/schema/model"
import { makeLocationNode } from "@wormagent/util/effect/app-node"
import { HttpTimeout, type ProviderPackage } from "@wormagent/ai/effect"
import { Npm } from "@wormagent/util/npm"
import type { DeepMutable } from "./schema.js"
import { importModule, resolveModule } from "@wormagent/util/runtime-import"
import { Bus } from "./bus.js"
import { Integration } from "./integration.js"
import { State } from "./state.js"
import { IntegrationConnection } from "./integration/connection.js"
import { Credential } from "@wormagent/schema/credential"
import { Location } from "./location.js"
import { freeze } from "immer"
import { AISDKNative } from "./aisdk-native.js"

export { AISDK_PREFIX, aisdk, isAISDK, mergeHeaders, mergeOverlay, packageName } from "./aisdk-native.js"

export const ID = Provider.ID
export type ID = typeof ID.Type

export class LoadError extends Schema.TaggedError<LoadError>()("Provider.LoadError", {
  package: Schema.String,
  cause: Schema.Defect(),
}) {}

const packages = new Map<string, Promise<unknown>>()
const builtins = new Map<string, () => Promise<unknown>>([
  ["@wormagent/ai/providers/alibaba", () => import("@wormagent/ai/providers/alibaba")],
  ["@wormagent/ai/providers/alibaba/chat", () => import("@wormagent/ai/providers/alibaba/chat")],
  ["@wormagent/ai/providers/alibaba/messages", () => import("@wormagent/ai/providers/alibaba/messages")],
  ["@wormagent/ai/providers/alibaba/responses", () => import("@wormagent/ai/providers/alibaba/responses")],
  ["@wormagent/ai/providers/alibaba/images", () => import("@wormagent/ai/providers/alibaba/images")],
  ["@wormagent/ai/providers/alibaba/embeddings", () => import("@wormagent/ai/providers/alibaba/embeddings")],
  ["@wormagent/ai/providers/amazon-bedrock", () => import("@wormagent/ai/providers/amazon-bedrock")],
  ["@wormagent/ai/providers/amazon-bedrock/mantle", () => import("@wormagent/ai/providers/amazon-bedrock/mantle")],
  [
    "@wormagent/ai/providers/amazon-bedrock/mantle/chat",
    () => import("@wormagent/ai/providers/amazon-bedrock/mantle/chat"),
  ],
  [
    "@wormagent/ai/providers/amazon-bedrock/mantle/messages",
    () => import("@wormagent/ai/providers/amazon-bedrock/mantle/messages"),
  ],
  [
    "@wormagent/ai/providers/amazon-bedrock/mantle/responses",
    () => import("@wormagent/ai/providers/amazon-bedrock/mantle/responses"),
  ],
  ["@wormagent/ai/providers/anthropic", () => import("@wormagent/ai/providers/anthropic")],
  ["@wormagent/ai/providers/anthropic-compatible", () => import("@wormagent/ai/providers/anthropic-compatible")],
  ["@wormagent/ai/providers/azure", () => import("@wormagent/ai/providers/azure")],
  ["@wormagent/ai/providers/azure/chat", () => import("@wormagent/ai/providers/azure/chat")],
  ["@wormagent/ai/providers/azure/responses", () => import("@wormagent/ai/providers/azure/responses")],
  ["@wormagent/ai/providers/azure/images", () => import("@wormagent/ai/providers/azure/images")],
  ["@wormagent/ai/providers/azure/embeddings", () => import("@wormagent/ai/providers/azure/embeddings")],
  ["@wormagent/ai/providers/azure/messages", () => import("@wormagent/ai/providers/azure/messages")],
  ["@wormagent/ai/providers/baseten", () => import("@wormagent/ai/providers/baseten")],
  ["@wormagent/ai/providers/baseten/decisions", () => import("@wormagent/ai/providers/baseten/decisions")],
  ["@wormagent/ai/providers/byteplus/videos", () => import("@wormagent/ai/providers/byteplus/videos")],
  ["@wormagent/ai/providers/cerebras", () => import("@wormagent/ai/providers/cerebras")],
  ["@wormagent/ai/providers/cloudflare-ai-gateway", () => import("@wormagent/ai/providers/cloudflare-ai-gateway")],
  [
    "@wormagent/ai/providers/cloudflare-ai-gateway/decisions",
    () => import("@wormagent/ai/providers/cloudflare-ai-gateway/decisions"),
  ],
  ["@wormagent/ai/providers/cloudflare-workers-ai", () => import("@wormagent/ai/providers/cloudflare-workers-ai")],
  [
    "@wormagent/ai/providers/cloudflare-workers-ai/decisions",
    () => import("@wormagent/ai/providers/cloudflare-workers-ai/decisions"),
  ],
  [
    "@wormagent/ai/providers/cloudflare-workers-ai/images",
    () => import("@wormagent/ai/providers/cloudflare-workers-ai/images"),
  ],
  ["@wormagent/ai/providers/cohere", () => import("@wormagent/ai/providers/cohere")],
  ["@wormagent/ai/providers/cohere/chat", () => import("@wormagent/ai/providers/cohere/chat")],
  ["@wormagent/ai/providers/cohere/embeddings", () => import("@wormagent/ai/providers/cohere/embeddings")],
  ["@wormagent/ai/providers/deepinfra", () => import("@wormagent/ai/providers/deepinfra")],
  ["@wormagent/ai/providers/deepinfra/embeddings", () => import("@wormagent/ai/providers/deepinfra/embeddings")],
  ["@wormagent/ai/providers/deepseek", () => import("@wormagent/ai/providers/deepseek")],
  ["@wormagent/ai/providers/digitalocean", () => import("@wormagent/ai/providers/digitalocean")],
  ["@wormagent/ai/providers/digitalocean/decisions", () => import("@wormagent/ai/providers/digitalocean/decisions")],
  ["@wormagent/ai/providers/digitalocean/embeddings", () => import("@wormagent/ai/providers/digitalocean/embeddings")],
  ["@wormagent/ai/providers/digitalocean/images", () => import("@wormagent/ai/providers/digitalocean/images")],
  ["@wormagent/ai/providers/digitalocean/responses", () => import("@wormagent/ai/providers/digitalocean/responses")],
  ["@wormagent/ai/providers/fireworks", () => import("@wormagent/ai/providers/fireworks")],
  ["@wormagent/ai/providers/fireworks/embeddings", () => import("@wormagent/ai/providers/fireworks/embeddings")],
  ["@wormagent/ai/providers/google", () => import("@wormagent/ai/providers/google")],
  ["@wormagent/ai/providers/google/decisions", () => import("@wormagent/ai/providers/google/decisions")],
  ["@wormagent/ai/providers/google/interactions", () => import("@wormagent/ai/providers/google/interactions")],
  ["@wormagent/ai/providers/google/embeddings", () => import("@wormagent/ai/providers/google/embeddings")],
  ["@wormagent/ai/providers/google/images", () => import("@wormagent/ai/providers/google/images")],
  ["@wormagent/ai/providers/google/videos", () => import("@wormagent/ai/providers/google/videos")],
  ["@wormagent/ai/providers/google-vertex", () => import("@wormagent/ai/providers/google-vertex")],
  ["@wormagent/ai/providers/google-vertex/chat", () => import("@wormagent/ai/providers/google-vertex/chat")],
  ["@wormagent/ai/providers/google-vertex/gemini", () => import("@wormagent/ai/providers/google-vertex/gemini")],
  [
    "@wormagent/ai/providers/google-vertex/interactions",
    () => import("@wormagent/ai/providers/google-vertex/interactions"),
  ],
  ["@wormagent/ai/providers/google-vertex/messages", () => import("@wormagent/ai/providers/google-vertex/messages")],
  ["@wormagent/ai/providers/google-vertex/mistral", () => import("@wormagent/ai/providers/google-vertex/mistral")],
  ["@wormagent/ai/providers/google-vertex/responses", () => import("@wormagent/ai/providers/google-vertex/responses")],
  ["@wormagent/ai/providers/google-vertex/embeddings", () => import("@wormagent/ai/providers/google-vertex/embeddings")],
  ["@wormagent/ai/providers/google-vertex/images", () => import("@wormagent/ai/providers/google-vertex/images")],
  ["@wormagent/ai/providers/google-vertex-messages", () => import("@wormagent/ai/providers/google-vertex-messages")],
  ["@wormagent/ai/providers/groq", () => import("@wormagent/ai/providers/groq")],
  ["@wormagent/ai/providers/meta", () => import("@wormagent/ai/providers/meta")],
  ["@wormagent/ai/providers/meta/chat", () => import("@wormagent/ai/providers/meta/chat")],
  ["@wormagent/ai/providers/meta/images", () => import("@wormagent/ai/providers/meta/images")],
  ["@wormagent/ai/providers/meta/messages", () => import("@wormagent/ai/providers/meta/messages")],
  ["@wormagent/ai/providers/meta/responses", () => import("@wormagent/ai/providers/meta/responses")],
  ["@wormagent/ai/providers/minimax", () => import("@wormagent/ai/providers/minimax")],
  ["@wormagent/ai/providers/minimax/chat", () => import("@wormagent/ai/providers/minimax/chat")],
  ["@wormagent/ai/providers/minimax/images", () => import("@wormagent/ai/providers/minimax/images")],
  ["@wormagent/ai/providers/minimax/messages", () => import("@wormagent/ai/providers/minimax/messages")],
  ["@wormagent/ai/providers/minimax/responses", () => import("@wormagent/ai/providers/minimax/responses")],
  ["@wormagent/ai/providers/minimax/videos", () => import("@wormagent/ai/providers/minimax/videos")],
  ["@wormagent/ai/providers/mistral", () => import("@wormagent/ai/providers/mistral")],
  ["@wormagent/ai/providers/moonshot", () => import("@wormagent/ai/providers/moonshot")],
  ["@wormagent/ai/providers/moonshot/chat", () => import("@wormagent/ai/providers/moonshot/chat")],
  ["@wormagent/ai/providers/moonshot/messages", () => import("@wormagent/ai/providers/moonshot/messages")],
  ["@wormagent/ai/providers/moonshot/responses", () => import("@wormagent/ai/providers/moonshot/responses")],
  ["@wormagent/ai/providers/openai", () => import("@wormagent/ai/providers/openai")],
  ["@wormagent/ai/providers/openai/chat", () => import("@wormagent/ai/providers/openai/chat")],
  ["@wormagent/ai/providers/openai/responses", () => import("@wormagent/ai/providers/openai/responses")],
  ["@wormagent/ai/providers/openai/images", () => import("@wormagent/ai/providers/openai/images")],
  ["@wormagent/ai/providers/openai/embeddings", () => import("@wormagent/ai/providers/openai/embeddings")],
  ["@wormagent/ai/providers/openai-compatible", () => import("@wormagent/ai/providers/openai-compatible")],
  [
    "@wormagent/ai/providers/openai-compatible/responses",
    () => import("@wormagent/ai/providers/openai-compatible/responses"),
  ],
  ["@wormagent/ai/providers/openai-compatible/images", () => import("@wormagent/ai/providers/openai-compatible/images")],
  [
    "@wormagent/ai/providers/openai-compatible/decisions",
    () => import("@wormagent/ai/providers/openai-compatible/decisions"),
  ],
  [
    "@wormagent/ai/providers/openai-compatible/embeddings",
    () => import("@wormagent/ai/providers/openai-compatible/embeddings"),
  ],
  [
    "@wormagent/ai/providers/openai-compatible-responses",
    () => import("@wormagent/ai/providers/openai-compatible-responses"),
  ],
  ["@wormagent/ai/providers/wormagent/decisions", () => import("@wormagent/ai/providers/wormagent/decisions")],
  ["@wormagent/ai/providers/wormgpt", () => import("@wormagent/ai/providers/wormgpt")],
  ["@wormagent/ai/providers/openrouter", () => import("@wormagent/ai/providers/openrouter")],
  ["@wormagent/ai/providers/openrouter/decisions", () => import("@wormagent/ai/providers/openrouter/decisions")],
  ["@wormagent/ai/providers/openrouter/embeddings", () => import("@wormagent/ai/providers/openrouter/embeddings")],
  ["@wormagent/ai/providers/openrouter/images", () => import("@wormagent/ai/providers/openrouter/images")],
  ["@wormagent/ai/providers/openrouter/videos", () => import("@wormagent/ai/providers/openrouter/videos")],
  ["@wormagent/ai/providers/openrouter/responses", () => import("@wormagent/ai/providers/openrouter/responses")],
  ["@wormagent/ai/providers/togetherai", () => import("@wormagent/ai/providers/togetherai")],
  ["@wormagent/ai/providers/typesafe-ai/decisions", () => import("@wormagent/ai/providers/typesafe-ai/decisions")],
  ["@wormagent/ai/providers/venice", () => import("@wormagent/ai/providers/venice")],
  ["@wormagent/ai/providers/venice/responses", () => import("@wormagent/ai/providers/venice/responses")],
  ["@wormagent/ai/providers/volcengine/videos", () => import("@wormagent/ai/providers/volcengine/videos")],
  ["@wormagent/ai/providers/vercel-ai-gateway", () => import("@wormagent/ai/providers/vercel-ai-gateway")],
  ["@wormagent/ai/providers/vercel-ai-gateway/chat", () => import("@wormagent/ai/providers/vercel-ai-gateway/chat")],
  [
    "@wormagent/ai/providers/vercel-ai-gateway/messages",
    () => import("@wormagent/ai/providers/vercel-ai-gateway/messages"),
  ],
  [
    "@wormagent/ai/providers/vercel-ai-gateway/responses",
    () => import("@wormagent/ai/providers/vercel-ai-gateway/responses"),
  ],
  [
    "@wormagent/ai/providers/vercel-ai-gateway/decisions",
    () => import("@wormagent/ai/providers/vercel-ai-gateway/decisions"),
  ],
  ["@wormagent/ai/providers/vercel-ai-gateway/images", () => import("@wormagent/ai/providers/vercel-ai-gateway/images")],
  [
    "@wormagent/ai/providers/vercel-ai-gateway/embeddings",
    () => import("@wormagent/ai/providers/vercel-ai-gateway/embeddings"),
  ],
  ["@wormagent/ai/providers/xai", () => import("@wormagent/ai/providers/xai")],
  ["@wormagent/ai/providers/xai/images", () => import("@wormagent/ai/providers/xai/images")],
  ["@wormagent/ai/providers/xai/videos", () => import("@wormagent/ai/providers/xai/videos")],
  ["@wormagent/ai/providers/zai", () => import("@wormagent/ai/providers/zai")],
  ["@wormagent/ai/providers/zai/chat", () => import("@wormagent/ai/providers/zai/chat")],
  ["@wormagent/ai/providers/zai/images", () => import("@wormagent/ai/providers/zai/images")],
  ["@wormagent/ai/providers/zai-coding-plan", () => import("@wormagent/ai/providers/zai-coding-plan")],
  ["@wormagent/ai/providers/zai-coding-plan/chat", () => import("@wormagent/ai/providers/zai-coding-plan/chat")],
  ["@wormagent/ai/providers/zai-coding-plan/messages", () => import("@wormagent/ai/providers/zai-coding-plan/messages")],
  [
    "@wormagent/ai/providers/zai-coding-plan/responses",
    () => import("@wormagent/ai/providers/zai-coding-plan/responses"),
  ],
])

/** Native `@wormagent/ai/providers/*` entrypoints bundled with Core and loadable by name from config. */
export const builtinPackages: ReadonlySet<string> = new Set(builtins.keys())

export const loadPackage = Effect.fn("Provider.loadPackage")(function* (input: string, npm?: Npm.Interface) {
  const specifier = AISDKNative.packageName(input)
  const builtin = builtins.get(specifier)
  if (builtin) return yield* importPackage(specifier, specifier, builtin)
  const resolved = yield* Effect.sync(() => {
    if (specifier.startsWith("file://") || specifier.startsWith("@wormagent/ai/")) return specifier
    try {
      return import.meta.resolve(specifier)
    } catch {
      return undefined
    }
  })
  if (resolved) return yield* importPackage(specifier, resolved)
  if (!npm) {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} is not installed`),
    })
  }
  const parts = specifier.split("/")
  const root = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? specifier)
  const installed = yield* npm.add(root).pipe(Effect.mapError((cause) => new LoadError({ package: specifier, cause })))
  const entrypoint = yield* Effect.try({
    try: () => resolveModule(specifier, installed.directory),
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  return yield* importPackage(specifier, entrypoint)
})

const settingsKeys = Struct.keys(Provider.Settings.schema.fields)
const providerOnlyKeys = settingsKeys.filter((key) => !(key in Model.Settings.schema.fields))

/** The provider options: every settings key WormAgent doesn't read itself. */
export function nativeSettings(settings: Settings) {
  return Struct.omit(settings, settingsKeys)
}

/** Settings a model inherits from its provider. */
export function modelSettings(settings: Settings | undefined) {
  return settings && Struct.omit(settings, providerOnlyKeys)
}

const decodeTimeout = Schema.decodeUnknownOption(HttpTimeout)

/** Applied to `headerTimeout` when provider settings leave it unset or invalid. */
export const DEFAULT_TIMEOUT_MS = 300_000

/**
 * Applied to `chunkTimeout` when provider settings leave it unset or invalid. Some providers, such as DeepSeek, have
 * specifically asked clients to allow at least 15 minutes, because their models can stream nothing for minutes while
 * they reason.
 */
export const DEFAULT_CHUNK_TIMEOUT_MS = 900_000

/** One timeout setting without a default; invalid values are dropped. */
export function timeout(value: unknown) {
  return Option.getOrUndefined(decodeTimeout(value))
}

/** Request timeouts from provider settings, resolved for every route. `timeout` has no default. */
export function timeouts(settings: Readonly<Record<string, unknown>>) {
  return {
    timeout: timeout(settings.timeout),
    headerTimeout: timeout(settings.headerTimeout) ?? DEFAULT_TIMEOUT_MS,
    chunkTimeout: timeout(settings.chunkTimeout) ?? DEFAULT_CHUNK_TIMEOUT_MS,
  }
}

const decodeEncoding = Schema.decodeUnknownOption(Provider.Encoding)

/** Request body encoding from provider or model settings; invalid values are dropped. */
export function encoding(settings: Readonly<Record<string, unknown>>) {
  return Option.getOrUndefined(decodeEncoding(settings.encoding))
}

const decodeTls = Schema.decodeUnknownOption(Provider.Tls)

/** Client certificate from provider settings. An empty `cert` or `key`, such as a missing `{file:}`, leaves it unset. */
export function tls(settings: Readonly<Record<string, unknown>>) {
  const value = Option.getOrUndefined(decodeTls(settings.tls))
  return value?.cert && value.key ? value : undefined
}

export const Request = Provider.Request
export type Request = Provider.Request

export const Compaction = Provider.Compaction
export type Compaction = Provider.Compaction

export const Cache = Provider.Cache
export type Cache = Provider.Cache

export const Transport = Provider.Transport
export type Transport = Provider.Transport

export const Settings = Provider.Settings
export type Settings = Provider.Settings

export const Info = Provider.Info
export type Info = Provider.Info

export type MutableInfo = DeepMutable<Info>

export { Event } from "@wormagent/schema/provider"

/** Provider metadata owns its drafts; model definitions remain immutable inputs. */
export type Definition = {
  readonly provider: Info
  readonly models: ReadonlyMap<Model.ID, Model.Info>
  readonly sourceConnection?: IntegrationConnection.Info
}

export interface Editor {
  readonly list: () => readonly Definition[]
  readonly get: (providerID: ID) => Definition | undefined
  readonly add: (definition: {
    readonly info: Info
    readonly models: readonly Model.Info[]
    readonly sourceConnection?: IntegrationConnection.Info
  }) => void
  readonly update: (providerID: ID, update: (provider: MutableInfo) => void) => void
  readonly remove: (providerID: ID) => void
  readonly models: {
    readonly set: (providerID: ID, models: readonly Model.Info[]) => void
    readonly update: (providerID: ID, modelID: Model.ID, update: (model: DeepMutable<Model.Info>) => void) => void
    readonly remove: (providerID: ID, modelID: Model.ID) => void
  }
}

export interface Snapshot {
  readonly records: ReadonlyMap<ID, Definition>
  readonly available: readonly Definition[]
  readonly providers: readonly Info[]
}

export interface Interface extends State.Transformable<Editor> {
  readonly get: (providerID: ID) => Effect.Effect<Info | undefined>
  readonly all: () => Effect.Effect<readonly Info[]>
  readonly available: () => Effect.Effect<readonly Info[]>
  /** Internal definition/access snapshot; raw model inventories never cross the HTTP API. */
  readonly snapshot: () => Effect.Effect<Snapshot>
}

export class Service extends Context.Service<Service, Interface>()("@wormagent/Provider") {}

// Every location references the same index for a shared immutable definition array.
const definitions = new WeakMap<readonly Model.Info[], Map<ID, ReadonlyMap<Model.ID, Model.Info>>>()
function index(providerID: ID, models: readonly Model.Info[]) {
  const indexes = definitions.get(models) ?? new Map<ID, ReadonlyMap<Model.ID, Model.Info>>()
  const cached = indexes.get(providerID)
  if (cached) return cached
  // Model shares these definitions without copying, so a foreign definition takes this provider's identity here.
  const result = freeze(
    new Map(models.map((model) => [model.id, model.providerID === providerID ? model : { ...model, providerID }])),
    true,
  )
  indexes.set(providerID, result)
  definitions.set(models, indexes)
  return result
}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const bus = yield* Bus.Service
    const integrations = yield* Integration.Service
    const location = yield* Location.Service
    const state = State.create<
      Map<
        ID,
        {
          provider: MutableInfo
          models: ReadonlyMap<Model.ID, Model.Info>
          sourceConnection?: IntegrationConnection.Info
        }
      >,
      Editor
    >({
      name: "provider",
      initial: () => new Map(),
      editor: (records) => {
        const maps = new WeakSet<ReadonlyMap<Model.ID, Model.Info>>()
        const models = new WeakSet<Model.Info>()
        const entry = (id: ID) => {
          const current = records.get(id)
          if (current) return current
          const added = { provider: Info.empty(id) as MutableInfo, models: new Map<Model.ID, Model.Info>() }
          records.set(id, added)
          maps.add(added.models)
          return added
        }
        const writable = (id: ID) => {
          const record = entry(id)
          if (maps.has(record.models)) return record.models as Map<Model.ID, Model.Info>
          const owned = new Map(record.models)
          record.models = owned
          maps.add(owned)
          return owned
        }
        return {
          list: () => Array.from(records.values()),
          get: (id) => records.get(id),
          add: (definition) => {
            records.set(definition.info.id, {
              provider: structuredClone(definition.info) as MutableInfo,
              models: index(definition.info.id, definition.models),
              sourceConnection: definition.sourceConnection,
            })
          },
          update: (id, update) => {
            const record = entry(id)
            update(record.provider)
            record.provider.id = id
            AISDKNative.rewrite(record.provider, {
              builtins: builtinPackages,
              specifier: record.provider.package,
              providerID: id,
              canonical: record.provider.canonical,
            })
          },
          remove: (id) => {
            records.delete(id)
          },
          models: {
            set: (id, values) => {
              entry(id).models = index(id, values)
            },
            update: (providerID, modelID, update) => {
              const record = entry(providerID)
              const target = writable(providerID)
              const current = target.get(modelID)
              const model = // An earlier add/set can publish and freeze an owned model within this fold.
                (
                  current && models.has(current) && !Object.isFrozen(current)
                    ? current
                    : current
                      ? structuredClone(current)
                      : Model.Info.default(providerID, modelID)
                ) as DeepMutable<Model.Info>
              update(model)
              model.id = modelID
              model.providerID = providerID
              AISDKNative.rewrite(model, {
                builtins: builtinPackages,
                specifier: model.package ?? record.provider.package,
                providerID,
                canonical: model.canonical ?? record.provider.canonical,
                modelID: model.modelID ?? modelID,
              })
              models.add(model)
              target.set(modelID, model)
            },
            remove: (providerID, modelID) => {
              if (!records.has(providerID)) return
              writable(providerID).delete(modelID)
            },
          },
        }
      },
      notify: () => notify,
    })
    // Registrations may outlive a borrowed service layer; their later disposal must
    // not query dependencies that have already closed.
    yield* Effect.addFinalizer(() => State.shutdown(state.reload()))
    let cached: { records: Snapshot["records"]; value: Snapshot } | undefined
    const snapshot = Effect.fn("Provider.snapshot")(function* () {
      while (true) {
        const revision = integrations.revision()
        const records = state.get()
        // Connection presence decides availability; resolving OAuth tokens belongs to execution.
        const connections = yield* integrations.list()
        // Either fold can disable a plugin that also contributed to the other domain.
        if (revision !== integrations.revision() || records !== state.get()) continue
        const byID = new Map(connections.map((integration) => [integration.id, integration]))
        const available = Array.from(records.values()).filter((record) => {
          if (record.provider.activation === "disabled") return false
          const integration = byID.get(record.provider.integrationID ?? Integration.ID.make(record.provider.id))
          // Never combine the previous account's discovered endpoints/models with a new connection.
          if (
            record.sourceConnection &&
            IntegrationConnection.key(record.sourceConnection) !==
              IntegrationConnection.key(integration?.connections[0])
          )
            return false
          if (record.provider.activation === "enabled") return true
          if (integration?.connections.length) return true
          return record.provider.integrationID === undefined && !integration
        })
        // A credential change that leaves the same definitions available is not a catalog change.
        if (
          cached?.records === records &&
          cached.value.available.length === available.length &&
          cached.value.available.every((record, index) => record === available[index])
        )
          return cached.value
        const value = freeze({ records, available, providers: available.map((record) => record.provider) }, true)
        cached = { records, value }
        return value
      }
    })
    let published: Snapshot | undefined
    const notify: Effect.Effect<void> = Effect.gen(function* () {
      const value = yield* snapshot()
      if (value === published) return
      published = value
      yield* bus.publish(
        Provider.Event.Updated,
        {},
        {
          location: { directory: location.directory, workspaceID: location.workspaceID },
        },
      )
    })
    yield* bus.subscribe([Integration.Event.Updated, Credential.Event.Switched]).pipe(
      Stream.runForEach(() => notify),
      Effect.forkScoped({ startImmediately: true }),
    )
    return Service.of({
      transform: state.transform,
      reload: state.reload,
      get: Effect.fn("Provider.get")((id) => Effect.sync(() => freeze(state.get().get(id)?.provider, true))),
      all: Effect.fn("Provider.all")(() =>
        Effect.sync(() => Array.from(state.get().values(), (record) => freeze(record.provider, true))),
      ),
      available: Effect.fn("Provider.available")(() => snapshot().pipe(Effect.map((value) => value.providers))),
      snapshot,
    })
  }),
)

export const node = makeLocationNode({ service: Service, layer, deps: [Bus.node, Integration.node, Location.node] })

const importPackage = Effect.fn("Provider.importPackage")(function* (
  specifier: string,
  entrypoint: string,
  load = () => importModule(entrypoint),
) {
  const module = yield* Effect.tryPromise({
    try: () => {
      const existing = packages.get(entrypoint)
      if (existing) return existing
      const loaded = load()
      packages.set(entrypoint, loaded)
      return loaded
    },
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  if (typeof module !== "object" || module === null || typeof (module as { model?: unknown }).model !== "function") {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} does not export model(modelID, settings)`),
    })
  }
  return module as ProviderPackage.Definition
})
