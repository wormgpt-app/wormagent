// `debug paths db` with a relative `WORMAGENT_DB`, which resolves against the data directory.
import { defineCli } from "../../cli/run"

export default defineCli({
  args: ["debug", "paths", "db"],
  env: { WORMAGENT_DB: "../custom/./my.db" },
})
