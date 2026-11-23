import path from "node:path"
import { WORMAGENT_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.WORMAGENT_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(WORMAGENT_CHANNEL) ||
    process.env.WORMAGENT_DISABLE_CHANNEL_DB === "1" ||
    process.env.WORMAGENT_DISABLE_CHANNEL_DB === "true"
      ? "wormagent.db"
      : `wormagent-${WORMAGENT_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
