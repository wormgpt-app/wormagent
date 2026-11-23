import os from "node:os"
import path from "node:path"

// Each isolated home gets its own XDG_CACHE_HOME, where Bun would otherwise keep its transpiler cache,
// so every spawned CLI process would transpile the source from scratch. Share one cache instead.
export const transpilerCache = path.join(os.tmpdir(), "wormagent-test-transpiler-cache")

export function isolatedEnv(root: string, overrides: Record<string, string | undefined> = {}) {
  return {
    ...process.env,
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: transpilerCache,
    HOME: root,
    WORMAGENT_CLI_CONFIG_CONTENT: undefined,
    WORMAGENT_CONFIG_CONTENT: "{}",
    WORMAGENT_CONFIG_DIR: path.join(root, "config"),
    WORMAGENT_DB: path.join(root, "wormagent.db"),
    WORMAGENT_DISABLE_FILEWATCHER: "true",
    WORMAGENT_DISABLE_MODELS_FETCH: "true",
    WORMAGENT_TEST_HOME: root,
    XDG_CACHE_HOME: path.join(root, "cache"),
    XDG_CONFIG_HOME: path.join(root, "xdg-config"),
    XDG_DATA_HOME: path.join(root, "data"),
    XDG_STATE_HOME: path.join(root, "state"),
    ...overrides,
  }
}
