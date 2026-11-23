import { expect, test } from "bun:test"
import { consoleProviderGroup, consoleProviderName } from "./console"

test("groups only providers managed by the active Console workspace", () => {
  const direct = { id: "openai", integrationID: "openai", name: "WormGPT / OpenAI" }

  const group = consoleProviderGroup([
    { id: "wormagent", integrationID: "wormagent", name: "WormGPT / WormAgent" },
    { id: "console-openai", integrationID: "wormagent", name: "WormGPT / OpenAI" },
    { id: "console-google", integrationID: "wormagent", name: "WormGPT / Google" },
    direct,
  ])

  expect(group).toBeDefined()

  if (!group) throw new Error("Expected Console provider group")
  expect(group.workspace).toBe("WormGPT")
  expect(group.providers.map((provider) => provider.id)).toEqual(["wormagent", "console-openai", "console-google"])
  expect(consoleProviderName(group, group.providers[1].name)).toBe("OpenAI")
  expect(group.providers).not.toContain(direct)
})
