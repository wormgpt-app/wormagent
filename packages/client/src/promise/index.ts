import type { WormAgent } from "./client.js"

export * from "./generated/index.js"
export { WormAgent } from "./client.js"
export { mediaHashFromUri, withMediaRefs, type MediaRequestOptions } from "./media.js"
export type {
  AgentApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcCallOptions,
  RpcClient,
  RpcEventPayload,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export type { EventSubscribeOutput as WormAgentEvent } from "./generated/types.js"
export type {
  MediaFileAttachment as PromptMediaFileAttachment,
  Attachment as PromptAttachment,
} from "@wormagent/schema/prompt"
export type WormAgentClient = ReturnType<typeof WormAgent.make>
