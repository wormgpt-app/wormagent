export * as CodeModeApi from "./api.js"

import { makeGlobalNode } from "@wormagent/util/effect/app-node"
import { Context, Effect, Layer } from "effect"

export interface Interface {
  readonly fetch: (request: Request) => Effect.Effect<Response, Error>
}

/** Sends a Code Mode `wormagent://` request to this process's WormAgent API. The server provides the real one. */
export class Service extends Context.Service<Service, Interface>()("@wormagent/CodeModeApi") {}

const failing = (message: string): Interface => ({ fetch: () => Effect.fail(new Error(message)) })

export const unavailable = failing("wormagent:// URLs are unavailable in this environment.")

export const disabled = failing(
  'wormagent:// URLs are off. In a local or dev build, enable them with WORMAGENT_FLAGS=wormagent_api or "experimental": { "wormagent_api": true }.',
)

export const node = makeGlobalNode({
  service: Service,
  layer: Layer.succeed(Service, unavailable),
  deps: [],
})

/**
 * The API path and query an `wormagent:///api/...` URL names, with `/api/session/current` naming the calling session.
 * Only that form is accepted: no host (which keeps `wormagent://<host>/` free for reaching another server later) and
 * nothing outside `/api/`.
 */
export function path(raw: string, sessionID: string) {
  const parsed = URL.parse(raw)
  if (!parsed || !raw.startsWith("wormagent:///") || !parsed.pathname.startsWith("/api/"))
    return Effect.fail(
      new TypeError(`Invalid wormagent URI "${raw}": use wormagent:///api/..., for example "wormagent:///api/session".`),
    )
  const pathname = parsed.pathname.replace(/^\/api\/session\/current(?=\/|$)/, `/api/session/${sessionID}`)
  return Effect.succeed(`${pathname}${parsed.search}`)
}
