// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { WormAgent } from "./client.js"

export * from "./generated/index"
export { WormAgent } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@wormagent/schema/agent"
export { Command } from "@wormagent/schema/command"
export { Config } from "@wormagent/schema/config"
export { Credential } from "@wormagent/schema/credential"
export { Event } from "@wormagent/schema/event"
export { EventLog } from "@wormagent/schema/event-log"
export { FileSystem } from "@wormagent/schema/filesystem"
export { Form } from "@wormagent/schema/form"
export { Integration } from "@wormagent/schema/integration"
export { Location } from "@wormagent/schema/location"
export { Model } from "@wormagent/schema/model"
export { Permission } from "@wormagent/schema/permission"
export { PermissionSaved } from "@wormagent/schema/permission-saved"
export { Project } from "@wormagent/schema/project"
export { Worktree } from "@wormagent/schema/worktree"
export { Vcs } from "@wormagent/schema/vcs"
export { Provider } from "@wormagent/schema/provider"
export { Pty } from "@wormagent/schema/pty"
export { Question } from "@wormagent/schema/question"
export { Reference } from "@wormagent/schema/reference"
export { WebSearch } from "@wormagent/schema/websearch"
export { AbsolutePath, RelativePath } from "@wormagent/schema/schema"
export { Session } from "@wormagent/schema/session"
export { SessionInbox } from "@wormagent/schema/session-inbox"
export { SessionMessage } from "@wormagent/schema/session-message"
export { Skill } from "@wormagent/schema/skill"
export { Prompt } from "@wormagent/schema/prompt"
export { PromptInput } from "@wormagent/schema/prompt-input"
export type { WormAgentEvent } from "@wormagent/protocol/groups/event"
export type WormAgentClient = Effect.Success<ReturnType<typeof WormAgent.make>>
