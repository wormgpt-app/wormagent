// Every WormAgent install command the site shows: the home install row, the Terminal, Mini and SDK
// pages, the docs, llms.txt, the view-source comment, voice answers and the console API.
// Checked on 5 Nov 2026 against the release workflow on origin/dev (.github/release/publish-npm.sh,
// publish-homebrew.sh, publish-aur.sh, the repo's install script) and the live registries, where each
// one installed WormAgent 2.2.5:
// - npm: @wormagent/cli, dist-tag latest = 2.2.5. Its postinstall links the platform binary, so Bun
//   needs --trust and pnpm needs --allow-build. mise resolves `wormagent` to npm:@wormagent/cli.
// - https://wormagent.net/v2/install reads wormagent.net/update/api/latest/cli/npm (@wormagent/cli 2.2.5).
// - Homebrew: anomalyco/tap/wormagent-v2 = 2.2.5. AUR: wormagent-beta = 2.2.5-1.
// WormAgent 1 still lives under the old names: the wormagent-ai npm package (1.19.5),
// https://wormagent.net/install, anomalyco/tap/wormagent (1.19.5) and the wormagent-bin AUR package
// (1.19.5). test/install-commands.test.ts keeps them out of the site.

/** The home install row, the Terminal and Mini pages, llms.txt, the console API and the view-source comment. */
export const installs = [
  { id: "curl", name: "Script", command: "curl -fsSL https://wormagent.net/v2/install | bash" },
  { id: "npm", name: "npm", command: "npm install -g @wormagent/cli" },
  { id: "bun", name: "Bun", command: "bun install -g --trust @wormagent/cli" },
  { id: "brew", name: "Homebrew", command: "brew install anomalyco/tap/wormagent-v2" },
  { id: "paru", name: "AUR", command: "paru -S wormagent-beta" },
] as const

/** The docs intro's install tabs: every channel that installs WormAgent 2. */
export const docsInstalls = [
  { label: "curl", code: installs[0].command },
  { label: "homebrew", code: installs[3].command },
  { label: "npm", code: installs[1].command },
  { label: "bun", code: installs[2].command },
  { label: "pnpm", code: "pnpm add -g --allow-build=@wormagent/cli @wormagent/cli" },
  { label: "yarn", code: "yarn global add @wormagent/cli" },
  { label: "vite+", code: "vp install -g @wormagent/cli" },
  { label: "aur", code: installs[4].command },
  { label: "mise", code: "mise use -g wormagent" },
]

/** The v2 SDK (@wormagent/sdk, dist-tag latest = 2.2.5). */
export const sdkInstalls = [
  { id: "npm", command: "npm i @wormagent/sdk" },
  { id: "bun", command: "bun add @wormagent/sdk" },
] as const

/** The desktop app's Homebrew cask (wormagent-desktop = 2.2.5). */
export const desktopInstall = { id: "cask", command: "brew install --cask wormagent-desktop" }
