import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@wormagent/httpapi-codegen"
import {
  ClientApi,
  clientNamespace,
  deprecatedClientPaths,
  effectOmitEndpoints,
  groupNames,
  promiseOmitEndpoints,
} from "@wormagent/protocol/client"
import { Agent } from "@wormagent/schema/agent"
import { Artifact } from "@wormagent/schema/artifact"
import { Automation } from "@wormagent/schema/automation"
import { Command } from "@wormagent/schema/command"
import { Config } from "@wormagent/schema/config"
import { Credential } from "@wormagent/schema/credential"
import { Event } from "@wormagent/schema/event"
import { EventLog } from "@wormagent/schema/event-log"
import { FileDiff } from "@wormagent/schema/file-diff"
import { FileSystem } from "@wormagent/schema/filesystem"
import { Form } from "@wormagent/schema/form"
import { Generate } from "@wormagent/schema/generate"
import { Instruction } from "@wormagent/schema/instruction"
import { InstructionEntry } from "@wormagent/schema/instruction-entry"
import { Integration } from "@wormagent/schema/integration"
import { Job } from "@wormagent/schema/job"
import { Location } from "@wormagent/schema/location"
import { Mcp } from "@wormagent/schema/mcp"
import { Model } from "@wormagent/schema/model"
import { Money } from "@wormagent/schema/money"
import { Permission } from "@wormagent/schema/permission"
import { PermissionSaved } from "@wormagent/schema/permission-saved"
import { Plugin } from "@wormagent/schema/plugin"
import { Project } from "@wormagent/schema/project"
import { Worktree } from "@wormagent/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@wormagent/schema/prompt"
import { PromptInput } from "@wormagent/schema/prompt-input"
import { Provider } from "@wormagent/schema/provider"
import { Pty } from "@wormagent/schema/pty"
import { PtyTicket } from "@wormagent/schema/pty-ticket"
import { Question } from "@wormagent/schema/question"
import { Reference } from "@wormagent/schema/reference"
import { AbsolutePath, RelativePath } from "@wormagent/schema/schema"
import { Session } from "@wormagent/schema/session"
import { SessionMessage } from "@wormagent/schema/session-message"
import { SessionInbox } from "@wormagent/schema/session-inbox"
import { Shell } from "@wormagent/schema/shell"
import { Skill } from "@wormagent/schema/skill"
import { Snapshot } from "@wormagent/schema/snapshot"
import { UsageLimits } from "@wormagent/schema/usage-limits"
import { Vcs } from "@wormagent/schema/vcs"
import { WebSearch } from "@wormagent/schema/websearch"
import { Workspace } from "@wormagent/schema/workspace"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, {
  groupNames,
  omitEndpoints: promiseOmitEndpoints,
  namespace: clientNamespace,
  aliases: deprecatedClientPaths,
})
const effectContract = compile(ClientApi, {
  groupNames,
  omitEndpoints: effectOmitEndpoints,
  namespace: clientNamespace,
  aliases: deprecatedClientPaths,
})
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@wormagent/schema/agent", Agent),
  ...namespaceTypes("Artifact", "@wormagent/schema/artifact", Artifact),
  ...namespaceTypes("Automation", "@wormagent/schema/automation", Automation),
  ...namespaceTypes("Command", "@wormagent/schema/command", Command),
  ...namespaceTypes("Config", "@wormagent/schema/config", Config),
  ...namespaceTypes("Credential", "@wormagent/schema/credential", Credential),
  ...namespaceTypes("Event", "@wormagent/schema/event", Event),
  ...namespaceTypes("EventLog", "@wormagent/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@wormagent/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@wormagent/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@wormagent/schema/form", Form),
  ...namespaceTypes("Generate", "@wormagent/schema/generate", Generate),
  ...namespaceTypes("Instruction", "@wormagent/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@wormagent/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@wormagent/schema/integration", Integration),
  ...namespaceTypes("Job", "@wormagent/schema/job", Job),
  typeReference("Location.PublicRef", "@wormagent/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@wormagent/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@wormagent/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@wormagent/schema/model", Model),
  ...namespaceTypes("Money", "@wormagent/schema/money", Money),
  ...namespaceTypes("Permission", "@wormagent/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@wormagent/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@wormagent/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@wormagent/schema/project", Project),
  ...namespaceTypes("Worktree", "@wormagent/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@wormagent/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@wormagent/schema/provider", Provider),
  ...namespaceTypes("Pty", "@wormagent/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@wormagent/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@wormagent/schema/question", Question),
  ...namespaceTypes("Reference", "@wormagent/schema/reference", Reference),
  ...namespaceTypes("Session", "@wormagent/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@wormagent/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@wormagent/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@wormagent/schema/shell", Shell),
  ...namespaceTypes("Skill", "@wormagent/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@wormagent/schema/snapshot", Snapshot),
  ...namespaceTypes("UsageLimits", "@wormagent/schema/usage-limits", UsageLimits),
  ...namespaceTypes("Vcs", "@wormagent/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@wormagent/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@wormagent/schema/workspace", Workspace),
  typeReference("Prompt", "@wormagent/schema/prompt", Prompt),
  typeReference("PromptMention", "@wormagent/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@wormagent/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@wormagent/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@wormagent/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@wormagent/schema/schema", RelativePath),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "WormAgentEvent",
              import: 'import type { WormAgentEvent } from "@wormagent/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}
