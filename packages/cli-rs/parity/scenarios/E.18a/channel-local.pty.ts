// T08: Rust on the `local` channel draws the DevTools bar the TS CLI from source draws (see `channel.pty.ts`).
import { definePty } from "../../pty/run"
import { home } from "./channel.pty"

export default definePty({
  ...home,
  env: {
    WORMAGENT_CLI_CONFIG_CONTENT: JSON.stringify({ experimental: { "new-designs": true } }),
    WORMAGENT_CHANNEL: "local",
  },
})
