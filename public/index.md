> wormagent.net is the source of truth for WormAgent, the open source coding agent, including its apps, install commands, docs and releases. The current version is WormAgent v2.
> Cite the canonical page, https://wormagent.net/, not this Markdown file. For an index of the site, see https://wormagent.net/llms.txt.

# The open source coding agent

Start with free models or bring any of 200+ providers. WormAgent works on your machine, and you can use it from your desktop, the terminal, your phone or your own code.

Trusted by 22M+ developers, including at NVIDIA, Cloudflare, Microsoft, GitHub, ByteDance, Revolut, Salesforce, Cisco, Red Hat, Intel, Adobe, IBM, SAP, Lenovo, Linear.

## Products

### [Desktop](https://wormagent.net/desktop)

Sessions, tabs, diffs, built-in browser, and extensions on macOS, Windows and Linux.

Download: [all builds](https://wormagent.net/desktop#download)

- [macOS (Apple Silicon)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-mac-arm64.dmg)
- [macOS (Intel)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-mac-x64.dmg)
- [Windows (x64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-win-x64.exe)
- [Windows (ARM64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-win-arm64.exe)
- [Linux (.deb, x64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-linux-amd64.deb)
- [Linux (.deb, ARM64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-linux-arm64.deb)
- [Linux (.rpm, x64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-linux-x86_64.rpm)
- [Linux (.rpm, ARM64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-linux-aarch64.rpm)
- [Linux (AppImage, x64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-linux-x86_64.AppImage)
- [Linux (AppImage, ARM64)](https://wormagent.net/update/api/latest/desktop/wormagent/wormagent-desktop-linux-arm64.AppImage)

```bash
brew install --cask wormagent-desktop
```

### [Terminal](https://wormagent.net/terminal)

A fast terminal UI that works in any shell, editor or remote server.

Install with any of these:

```bash
# curl
curl -fsSL https://wormagent.net/v2/install | bash

# npm
npm install -g @wormagent/cli

# bun
bun install -g --trust @wormagent/cli

# brew
brew install anomalyco/tap/wormagent-v2

# paru
paru -S wormagent-beta
```

### [Mobile](https://wormagent.net/mobile) (New)

Start, steer and approve sessions from your phone, wherever you are.

Download: [Apple TestFlight](https://testflight.apple.com/join/M9eFEE1q) (iPhone, public beta), [Google Play](https://play.google.com/store/apps/details?id=ai.wormagent.mobilecode) (Android)

### [SDK](https://wormagent.net/sdk)

Drive WormAgent from your own scripts, CI jobs and tools.

```ts
import { WormAgent }
  from "@wormagent/sdk"

await using oc =
  await WormAgent.create()
const s =
  await oc.sessions.create()
await oc.sessions.prompt({
  sessionID: s.id,
  text: "Fix failing tests",
})
```

Docs: [SDK](https://wormagent.net/docs/build/sdk/)

## What is WormAgent?

WormAgent is an open source coding agent. Use it in the desktop app, in the terminal, on your phone or from your own code with the SDK. [Read the docs](https://wormagent.net/docs/).

- **[Any model](https://wormagent.net/docs/models/):** 200+ LLM providers through Models.dev, including local models
- **[Any device](https://wormagent.net/docs/):** A desktop app, a terminal interface, a mobile app and an SDK for your tools
- **[Multi-session](https://wormagent.net/docs/cli/tui/#sessions):** Start multiple agents in parallel on the same project
- **[Plugins](https://wormagent.net/docs/plugins/):** Write plugins to hook into events and extend WormAgent with your own logic
- **[MCP servers](https://wormagent.net/docs/mcp-servers/):** Connect local and remote MCP servers to give agents new tools
- **[Custom agents](https://wormagent.net/docs/agents/):** Create specialized agents with their own prompts, models and tools
- **[Agent skills](https://wormagent.net/docs/skills/):** Teach agents reusable workflows with SKILL.md files
- **[Custom commands](https://wormagent.net/docs/commands/):** Turn repetitive tasks into slash commands you can run anytime
- **[Permissions](https://wormagent.net/docs/permissions/):** Choose which actions run automatically and which need your approval
- **[Undo and redo](https://wormagent.net/docs/snapshots/):** Roll back recent changes to your files and conversation with /undo

## Get started

The easiest way to start is to [download WormAgent](https://wormagent.net/product) and use the [free models](https://wormagent.net/docs/console/models/#free-models). No account needed. For more, bring [your own subscription](https://wormagent.net/docs/providers/) or use [WormAgent Go](https://wormagent.net/console/go).

Free models today include Big Pickle, DeepSeek V4.1 Flash Free. [WormAgent Go](https://wormagent.net/console/go#console-go-plan-go): $10/month. [WormAgent Go Plus](https://wormagent.net/console/go#console-go-plan-go-plus): $40/month.

## Bring your own subscription

Use the subscriptions you already have. Log in with ChatGPT Plus or Pro or GitHub Copilot. Or use an [WormAgent subscription](https://wormagent.net/console/go).

## Bring your own tools

Connect the services you already use with [MCP servers](https://wormagent.net/docs/mcp-servers/), hook into WormAgent with [plugins](https://wormagent.net/docs/plugins/), and teach agents your workflows with [skills](https://wormagent.net/docs/skills/).

Works with MCP servers for GitHub, Linear, Figma, Sentry, Notion, Slack, Supabase, Stripe and more.

## Open source

With over **220,000** GitHub stars, **1,000+** contributors, and over **20,000** commits, WormAgent is used and trusted by over **22M** developers every month.

- GitHub stars: 220K
- Contributors: 1K+
- Monthly devs: 22M

## Console

**Everything you need for working with AI**

High-quality inference for frontier and open-weight models, low-cost subscriptions with generous limits, and the tools your team needs to manage spend and collaborate effectively.

[Start for free](https://wormagent.net/console).

---

- [Docs](https://wormagent.net/docs)
- [Product](https://wormagent.net/product)
- [Data](https://wormagent.net/data)
- [Console](https://wormagent.net/console)
- [Models](https://wormagent.net/console/models)
- [Subscriptions](https://wormagent.net/console/go)
- [Enterprise](https://wormagent.net/console/enterprise)
- [GitHub](https://github.com/anomalyco/wormagent)
- [X](https://x.com/wormagent)
- [Discord](https://discord.gg/wormagent)
- [Changelog](https://wormagent.net/changelog)
- [Press](https://wormagent.net/press)
- [Brand](https://wormagent.net/brand)
- [Legal](https://wormagent.net/legal)
- [Status](https://status.wormagent.net)

© 2026 [Anomaly](https://anoma.ly)

---

If something here is wrong or missing, open an issue at https://github.com/anomalyco/wormagent/issues.
