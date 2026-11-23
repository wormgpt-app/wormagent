import { Agent } from "@wormagent/core/agent"
import { App } from "@wormagent/core/app"
import { Artifact } from "@wormagent/core/artifact"
import { BlobStore } from "@wormagent/core/blob-store"
import { AISDK } from "@wormagent/core/aisdk"
import { Automation } from "@wormagent/core/automation"
import { Command } from "@wormagent/core/command"
import { Config } from "@wormagent/core/config"
import { Credential } from "@wormagent/core/credential"
import { Database } from "@wormagent/core/database/database"
import { Environment } from "@wormagent/core/environment/index"
import { FileAccess } from "@wormagent/core/file-access"
import { Flag } from "@wormagent/core/flag"
import { LayerNodePlatform } from "@wormagent/util/effect/app-node-platform"
import { AppProcess } from "@wormagent/util/process"
import { LayerNode } from "@wormagent/util/effect/layer-node"
import { Bus } from "@wormagent/core/bus"
import { FileSystem } from "@wormagent/core/filesystem"
import { FSUtil } from "@wormagent/util/fs-util"
import { Global } from "@wormagent/util/global"
import { Form } from "@wormagent/core/form"
import { Generate } from "@wormagent/core/generate"
import { InstructionDiscovery } from "@wormagent/core/instruction-discovery"
import { Integration } from "@wormagent/core/integration"
import { Job } from "@wormagent/core/job"
import { KV } from "@wormagent/core/kv"
import { Location } from "@wormagent/core/location"
import { Mcp } from "@wormagent/core/mcp/index"
import { Model } from "@wormagent/core/model"
import { ModelsDev } from "@wormagent/core/models-dev"
import { Npm } from "@wormagent/util/npm"
import { Plugin } from "@wormagent/core/plugin"
import { PluginHooks } from "@wormagent/core/plugin/hooks"
import { Provider } from "@wormagent/core/provider"
import { Session } from "@wormagent/core/session"
import { SharedCache } from "@wormagent/core/shared-cache"
import { InstructionEntry } from "@wormagent/core/session/instruction-entry"
import { PersistentPty } from "@wormagent/core/persistent-pty"
import { LocationServiceMap } from "@wormagent/core/location-service-map"
import { AppNodeBuilder } from "@wormagent/core/effect/app-node-builder"
import { Permission } from "@wormagent/core/permission"
import { Reference } from "@wormagent/core/reference"
import { Rpc } from "@wormagent/core/rpc"
import { Skill } from "@wormagent/core/skill"
import { SkillDiscovery } from "@wormagent/core/skill/discovery"
import { Watcher } from "@wormagent/core/filesystem/watcher"
import { Tool } from "@wormagent/core/tool"
import { Vcs } from "@wormagent/core/vcs"
import { VideoGeneration } from "@wormagent/core/video-generation"
import { WebSearch } from "@wormagent/core/websearch"
import { Worktree } from "@wormagent/core/worktree"
import { WorktreeStrategies } from "@wormagent/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"
import { offlineModels } from "../fixture/models"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    follows: () => Effect.succeed(false),
    reject: () => Effect.succeed(false),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(
  Generate.Service,
  Generate.Service.of({
    text: () => Effect.succeed(""),
    image: () => Effect.die("unused"),
    decisions: () => Effect.die("unused"),
    video: {
      start: () => Effect.die("unused"),
      status: () => Effect.die("unused"),
      result: () => Effect.die("unused"),
      cancel: () => Effect.die("unused"),
    },
  }),
)

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    allows: () => Effect.succeed(false),
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
    nested: () => Effect.void,
  }),
)

export const makePluginTestLayer = (
  permission = permissionLayer,
  generate = generateLayer,
  replacements: LayerNode.Replacements = [],
) =>
  AppNodeBuilder.build(
    LayerNode.group([
      App.node,
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Flag.node,
      Database.node,
      Environment.node,
      FileAccess.node,
      Global.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      Artifact.node,
      AISDK.node,
      Automation.node,
      BlobStore.node,
      Provider.node,
      Model.node,
      ModelsDev.node,
      Command.node,
      InstructionDiscovery.node,
      Integration.node,
      Job.node,
      KV.node,
      Mcp.node,
      Session.node,
      SharedCache.node,
      InstructionEntry.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      VideoGeneration.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generate),
      Permission.node.replace(permission),
      offlineModels,
      ...replacements,
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
