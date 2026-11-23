import {
  Agent,
  Command,
  Connection,
  Credential,
  Integration,
  Model,
  Plugin,
  Provider,
  Reference,
  Skill,
} from "@wormagent/plugin/effect"
import { Tool } from "@wormagent/schema/tool"

const key = Symbol.for("wormagent.plugin.v2.effect")
;(globalThis as typeof globalThis & { [key]?: unknown })[key] = {
  Agent,
  Command,
  Connection,
  Credential,
  Integration,
  Model,
  Plugin,
  Provider,
  Reference,
  Skill,
  Tool: { Error: Tool.Error },
}
