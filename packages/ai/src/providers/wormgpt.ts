import {
  mergeTransport,
  mergeProviderOptions,
  ProviderID,
  type ModelID,
  type ProviderOptions,
  type RequestOptions,
} from "../schema/index.js"
import { OpenAICompatibleChat } from "../protocols/openai-compatible-chat.js"
import { OpenAIEmbeddings, type OptionsInput as OpenAIEmbeddingOptionsInput } from "../protocols/openai-embeddings.js"
import { OpenAIImages } from "../protocols/openai-images.js"
import { SystemOne } from "../protocols/system-one.js"
import { MediaRoute } from "../route/media.js"
import { AuthOptions, type ProviderAuthOption } from "../route/auth-options.js"
import type { ProviderPackage } from "../provider-package.js"
import type { OpenAIProviderOptionsInput } from "./openai-options.js"
import { toConfig } from "./settings.js"

export const id = ProviderID.make("wormgpt")
const defaultBaseURL = "https://wormgpt.app/v1"

export type Config = Omit<RequestOptions, "providerOptions"> &
  ProviderAuthOption<"optional"> & {
    readonly provider?: string
    readonly baseURL?: string
    readonly providerOptions?: OpenAIProviderOptionsInput
  }

export type Settings = ProviderPackage.Settings &
  OpenAIProviderOptionsInput & {
    readonly apiKey?: string | false
    readonly baseURL?: string
    readonly provider?: string
  }

export const routes = [OpenAICompatibleChat.route]

export const configure = (input: Config = {}) => {
  const provider = input.provider ?? "wormgpt"
  const baseURL = input.baseURL ?? defaultBaseURL
  const { provider: _, baseURL: _b, apiKey: _apiKey, auth: _auth, ...rest } = input as any
  const auth = AuthOptions.bearer(input as any, "WORMGPT_API_KEY")
  const route = OpenAICompatibleChat.route.with({
    ...rest,
    provider,
    endpoint: { baseURL },
    auth,
  })
  const media = MediaRoute.deployment({ ...input, baseURL } as any, auth)
  const embeddingRoute = OpenAIEmbeddings.route.with({
    provider,
    endpoint: { baseURL },
    auth,
    ...mergeTransport(input as any),
  })
  const decisionRoute = SystemOne.route.with({
    provider,
    endpoint: { baseURL },
    auth,
    ...mergeTransport(input as any),
  })
  return {
    id: ProviderID.make(provider),
    model: (modelID: string | ModelID) => route.model<OpenAIProviderOptionsInput>({ id: modelID }),
    image: (modelID: string | ModelID, providerOptions?: ProviderOptions) =>
      OpenAIImages.model({
        ...media,
        id: modelID,
        provider,
        providerOptions: mergeProviderOptions(
          /gpt-image|chatgpt-image/.test(String(modelID)) ? undefined : { response_format: "b64_json" },
          providerOptions,
        ),
      }),
    embedding: (modelID: string | ModelID, providerOptions?: ProviderOptions) =>
      embeddingRoute.model<OpenAIEmbeddingOptionsInput>({ id: modelID, providerOptions }),
    decision: (modelID: string | ModelID, providerOptions?: ProviderOptions) =>
      decisionRoute.model({ id: modelID, compatibility: { mediaInput: "root" }, providerOptions }),
    configure,
  }
}

export const provider = {
  id,
  configure,
}

export const model: ProviderPackage.Model<Settings, OpenAIProviderOptionsInput> = (modelID, settings) =>
  configure(config(settings)).model(modelID)
export const imageModel = (modelID: string, settings: Settings) => {
  const input = config(settings)
  return configure(input).image(modelID, input.providerOptions)
}
export const embeddingModel = (modelID: string, settings: Settings) => {
  const input = config(settings)
  return configure(input).embedding(modelID, input.providerOptions)
}
export const decisionModel = (modelID: string, settings: Settings) => {
  const input = config(settings)
  return configure(input).decision(modelID, input.providerOptions)
}

function config({ provider, ...settings }: Settings) {
  return { ...toConfig(settings as any), provider: provider ?? "wormgpt", baseURL: (settings as any).baseURL ?? defaultBaseURL }
}

export * as WormGPT from "./wormgpt.js"

