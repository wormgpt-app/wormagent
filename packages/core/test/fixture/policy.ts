import { Config } from "@wormagent/core/config"
import { ConfigIntegration } from "@wormagent/core/config/integration"
import { ConfigPolicyPlugin } from "@wormagent/core/config/plugin/policy"
import { Integration } from "@wormagent/core/integration"
import { Mcp } from "@wormagent/core/mcp/index"
import { Skill } from "@wormagent/core/skill"
import { Info } from "@wormagent/schema/config"
import { ConfigPolicy } from "@wormagent/schema/config/policy"
import { ID } from "@wormagent/schema/event"
import { Credential } from "@wormagent/core/credential"
import { WebSearch } from "@wormagent/core/websearch"
import { Effect, Schema, Stream } from "effect"
import { host } from "../plugin/host"

/** A connected organization's policy as the WormAgent Console delivers it: an integration config document. */
export function organizationPolicy(policies: ConfigPolicy.Info[], organization?: string) {
  return new ConfigIntegration.Document({
    type: "document",
    integrationID: Integration.ID.make("wormagent"),
    connection: { type: "env", name: "WORMAGENT_API_KEY" },
    organization,
    info: Schema.decodeUnknownSync(Info)({ policies }),
  })
}

/** Replaces the connected organization's policy, or removes it; publish `Event.Updated` to make plugins reload. */
export const setOrganizationPolicy = Effect.fn(function* (policies: ConfigPolicy.Info[] | undefined) {
  const config = yield* Config.Service
  yield* config.integration?.(Integration.ID.make("wormagent"), policies && organizationPolicy(policies)) ?? Effect.void
})

// Exercise the real policy plugin against supplied catalogs without unrelated provider/permission setup.
export const registerIntegrationPolicy = Effect.fn(function* (input: {
  mcp?: Mcp.Interface
  skill?: Skill.Interface
  events?: Stream.Stream<{ readonly type: string }, unknown>
}) {
  yield* ConfigPolicyPlugin.Plugin.effect(
    host({
      event: {
        subscribe: () =>
          (input.events ?? Stream.never).pipe(
            Stream.filter((event) => event.type === "config.updated"),
            Stream.map(() => ({ id: ID.create(), created: Date.now(), type: "config.updated" as const, data: {} })),
          ),
      },
      provider: {
        list: () => Effect.die("unused provider.list"),
        get: () => Effect.die("unused provider.get"),
        transform: () => Effect.succeed({ dispose: Effect.void }),
        reload: () => Effect.void,
      },
      mcp: {
        list: () => Effect.die("unused mcp.list"),
        transform: (callback) => input.mcp?.transform(callback) ?? Effect.succeed({ dispose: Effect.void }),
        reload: () => input.mcp?.reload() ?? Effect.void,
      },
      skill: {
        list: () => Effect.die("unused skill.list"),
        transform: (callback) => input.skill?.transform(callback) ?? Effect.succeed({ dispose: Effect.void }),
        reload: () => input.skill?.reload() ?? Effect.void,
      },
      permission: {
        hook: () => Effect.succeed({ dispose: Effect.void }),
        list: () => Effect.die("unused permission.list"),
        get: () => Effect.die("unused permission.get"),
        reply: () => Effect.die("unused permission.reply"),
        assert: () => Effect.die("unused permission.assert"),
      },
    }),
  ).pipe(
    Effect.provideService(
      Credential.Service,
      Credential.Service.of({
        all: () => Effect.succeed([]),
        list: () => Effect.succeed([]),
        get: () => Effect.succeed(undefined),
        refresh: () => Effect.die("unused Credential.refresh"),
        create: () => Effect.die("unused Credential.create"),
        activate: () => Effect.die("unused Credential.activate"),
        update: () => Effect.die("unused Credential.update"),
        remove: () => Effect.die("unused Credential.remove"),
      }),
    ),
    Effect.provideService(
      WebSearch.Service,
      WebSearch.Service.of({
        available: () => Effect.die("unused WebSearch.available"),
        providers: () => Effect.die("unused WebSearch.providers"),
        default: () => Effect.die("unused WebSearch.default"),
        select: () => Effect.die("unused WebSearch.select"),
        query: () => Effect.die("unused WebSearch.query"),
        transform: () => Effect.succeed({ dispose: Effect.void }),
        reload: () => Effect.void,
      }),
    ),
  )
})
