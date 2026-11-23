import { Plugin } from "@wormagent/plugin/tui"
import { createMermaidCodeBlockRenderer } from "./markdown.js"
import { resolveWormAgentDiagramPalette } from "./palette.js"

export default Plugin.define({
  id: "wormagent.merman",
  setup(context) {
    context.markdown.registerCodeBlockRenderer(
      "mermaid",
      createMermaidCodeBlockRenderer(context.renderer, () => ({
        colors: resolveWormAgentDiagramPalette(context.theme, context.themeMode),
      })),
    )
  },
})
