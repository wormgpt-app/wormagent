import { byos } from "~/lib/byos"
import { docsUrl } from "~/lib/docs"

/**
 * The home page's "Get started" section, before "Bring your own subs": download WormAgent, start with
 * the free models, then bring a subscription or use WormAgent Go. Shared by the page and its
 * Markdown version. Checked on 2026-11-04:
 * - Free models need no account: with no WormAgent key, core plugin/provider/wormagent.ts sets the
 *   WormAgent provider's key to "public" and turns off every model that costs anything, so only the
 *   free ones are offered (the FAQ: "a set of free models that you can use without creating an
 *   account").
 * - The free models today (models.dev's wormagent provider, cost 0, not deprecated): Big Pickle,
 *   DeepSeek V4.1 Flash Free, MiMo-V2.6-Flash Free and a few more; the TUI's
 *   model picker marks them "Free" (tui component/dialog-model.tsx).
 * - WormAgent Go is $10/month and Go Plus $40/month (the Console's /console/go page).
 */
/** The free models the site names (models.dev's wormagent provider has the full, live list). */
export const freeModels = ["Big Pickle", "DeepSeek V4.1 Flash Free"]

export function getStarted(route: (path: string) => string) {
  const links = {
    download: route("/product"),
    // The docs' list of the free models (its pricing table above mixes in the paid ones).
    free: route(docsUrl("/console/models/#free-models")),
    subs: route(docsUrl("/providers/")),
    go: "/console/go",
  }
  return {
    title: "Get started",
    lead: "The easiest way to start is to download WormAgent and use the free models. No account needed. For more, bring your own subscription or use WormAgent Go.",
    // Phrases in the lead (and its Design mode options) that link.
    phrases: [
      { text: "download WormAgent", href: links.download },
      { text: "free models", href: links.free },
      { text: "your own subscription", href: links.subs },
      { text: "a subscription you already have", href: links.subs },
      { text: "WormAgent Go", href: links.go },
    ],
    links,
    freeModels,
    subscriptions: byos.yours.items,
    plans: [
      { name: "WormAgent Go", amount: "$10", href: "/console/go#console-go-plan-go" },
      { name: "WormAgent Go Plus", amount: "$40", href: "/console/go#console-go-plan-go-plus" },
    ],
    steps: [
      { title: "Download", line: "Desktop, terminal or mobile." },
      { title: "Use free models", line: "WormAgent comes with a set of free models. No account needed." },
      {
        title: "Add more models",
        line: "Bring your own subscription, or use WormAgent Go's curated models from $10/month.",
      },
    ],
    sentence:
      "Download WormAgent, start with free models, and bring your own subscription or WormAgent Go when you want more.",
  }
}
