import { defineCli } from "../../cli/run"

// `mcp add --global` in a home without `~/.config/wormagent`: the directory is created, as TS's
// `Global.Service` does, and the server goes into a new `wormagent.json`.
export default defineCli({
  args: ["mcp", "add", "remote", "--global", "--url", "https://mcp.example.test/mcp"],
  collect: ["home/.config/wormagent/wormagent.json", "work/wormagent.json"],
})
