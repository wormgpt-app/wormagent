import { ensurePluginRuntime, provides } from "@wormagent/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@wormagent/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@wormagent/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
