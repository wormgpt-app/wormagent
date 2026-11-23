export const CONSOLE_URL = "https://wormagent.net/console"

// An MCP server WormAgent Console delivers through its gateway, with the gateway token that names its workspace.
// `protocol` is the pin Console sets while the member hasn't connected their account.
export function consoleGateway(slug: string, options: { workspace?: string; protocol?: "2026-07-28" } = {}) {
  const claims = Buffer.from(JSON.stringify({ u: "user_fixture", w: options.workspace ?? "org_acme", d: 1 }))

  return {
    type: "remote",
    url: `${CONSOLE_URL}/api/integration-gateway/${slug}/mcp`,
    oauth: false,
    headers: { authorization: `Bearer ocgw_${claims.toString("base64url")}.signature` },
    protocol: options.protocol,
  }
}

// The WormAgent Console integration with a saved sign-in.
export const consoleSignIn = {
  id: "wormagent",
  name: "WormAgent",
  methods: [{ id: "oauth", type: "oauth" }],
  connections: [{ type: "credential", id: "cred_console", label: "Acme", method: "oauth" }],
}
