import { expect, test } from "bun:test"
import type { IntegrationInfo } from "@wormagent/client"
import { loginChoices } from "../src/commands/handlers/auth/login"

const integration = (value: Partial<IntegrationInfo> & Pick<IntegrationInfo, "id" | "name">): IntegrationInfo => ({
  methods: [{ type: "key" }],
  connections: [],
  ...value,
})

test("groups the CLI choices like /connect while keeping stable login IDs", () => {
  expect(
    loginChoices([
      integration({ id: "mistral", name: "Mistral" }),
      integration({ id: "openai", name: "OpenAI" }),
      integration({ id: "linear", name: "Linear", metadata: { source: "mcp" } }),
      integration({ id: "github", name: "GitHub", metadata: { source: "mcp" } }),
      integration({ id: "wormagent", name: "WormAgent Console" }),
      integration({
        id: "wormagent-go",
        name: "WormAgent Go",
        connections: [{ type: "credential", id: "go", label: "Go", method: "key" }],
      }),
      integration({ id: "unused", name: "Unused", methods: [{ type: "env", names: ["UNUSED_KEY"] }] }),
    ]),
  ).toEqual([
    { value: "github", label: "GitHub", category: "MCP", connected: false },
    { value: "linear", label: "Linear", category: "MCP", connected: false },
    { value: "wormagent-go", label: "WormAgent Go", category: "Popular", connected: true },
    { value: "wormagent", label: "WormAgent Console", category: "Popular", connected: false },
    { value: "openai", label: "OpenAI", category: "Popular", connected: false },
    { value: "mistral", label: "Mistral", category: "Services", connected: false },
  ])
})

test("hides WormAgent Go until a Go key is saved", () => {
  expect(
    loginChoices([
      integration({ id: "wormagent", name: "WormAgent Console" }),
      integration({ id: "wormagent-go", name: "WormAgent Go", connections: [{ type: "env", name: "WORMAGENT_API_KEY" }] }),
    ]).map((choice) => choice.value),
  ).toEqual(["wormagent"])
})
