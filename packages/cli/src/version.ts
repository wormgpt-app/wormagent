import { Option, Schema } from "effect"

declare const WORMAGENT_VERSION: string
declare const WORMAGENT_CHANNEL: string
declare const WORMAGENT_ARTIFACT: string
declare const WORMAGENT_RELEASE_HIGHLIGHTS: string

const version = typeof WORMAGENT_VERSION === "string" ? WORMAGENT_VERSION : "local"
const channel = typeof WORMAGENT_CHANNEL === "string" ? WORMAGENT_CHANNEL : "local"
const artifact = typeof WORMAGENT_ARTIFACT === "string" ? WORMAGENT_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof WORMAGENT_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(WORMAGENT_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as WORMAGENT_VERSION,
  channel as WORMAGENT_CHANNEL,
  artifact as WORMAGENT_ARTIFACT,
  highlights as WORMAGENT_HIGHLIGHTS,
}
export const WORMAGENT_LOCAL = channel === "local"
