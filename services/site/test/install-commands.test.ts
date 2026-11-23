import { describe, expect, test } from "bun:test"
import path from "node:path"
import { Glob } from "bun"
import { desktopInstall, docsInstalls, installs, sdkInstalls } from "../src/lib/install-commands"

// The site shows WormAgent 2. These names install WormAgent 1 (see src/lib/install-commands.ts):
// the wormagent-ai npm package, the unversioned install script, the tap's wormagent formula and the
// wormagent-bin AUR package. Scoped @wormagent-ai/... packages are code samples, not installs.
const v1 = [
  { name: "the wormagent-ai npm package", pattern: /(?<![@\w/-])wormagent-ai(?![\w/-])/ },
  { name: "the WormAgent 1 install script", pattern: /wormagent\.ai\/install\b/ },
  { name: "the tap's WormAgent 1 formula", pattern: /anomalyco\/tap\/wormagent(?![\w-])/ },
  { name: "the wormagent-bin AUR package", pattern: /\bwormagent-bin\b/ },
  { name: "the AUR wormagent package", pattern: /\b(paru|yay|pacman) -S wormagent(?![\w-])/ },
]

const app = path.join(import.meta.dir, "..")
// Site copy and the sources of every generated text file (llms.txt, llms-full.txt, the .md pages,
// the view-source comment, voice answers). Not .output: a stale build would fail the test.
const roots = ["src", "public", "script"]
const text = /\.(tsx?|jsx?|css|md|mdx|txt|json|html|xml|webmanifest)$/
// Stored GitHub data (script/github-snapshot.ts): past release notes may name WormAgent 1 packages
// as history, not as an install command. The V1 docs are WormAgent 1's, so they install it.
const exempt = (file: string) => file === "src/lib/github-snapshot.json" || file.startsWith("src/docs/v1/")

async function files() {
  const found = await Promise.all(
    roots.map((root) =>
      Array.fromAsync(new Glob(`${root}/**/*`).scan({ cwd: app, onlyFiles: true, dot: true })).then(
        (files) => files.map((file) => file.replaceAll("\\", "/")),
        () => [],
      ),
    ),
  )
  return found.flat().filter((file) => text.test(file) && !exempt(file) && !file.includes("node_modules"))
}

describe("install commands", () => {
  test("every command installs WormAgent 2", () => {
    const commands = [
      ...installs.map((item) => item.command),
      ...docsInstalls.map((item) => item.code),
      ...sdkInstalls.map((item) => item.command),
      desktopInstall.command,
    ]
    commands.forEach((command) => v1.forEach((item) => expect(command).not.toMatch(item.pattern)))
    expect(installs.map((item) => item.command)).toEqual([
      "curl -fsSL https://wormagent.net/v2/install | bash",
      "npm install -g @wormagent/cli",
      "bun install -g --trust @wormagent/cli",
      "brew install anomalyco/tap/wormagent-v2",
      "paru -S wormagent-beta",
    ])
  })

  test("site copy and generated text name no WormAgent 1 install", async () => {
    const list = await files()
    expect(list.length).toBeGreaterThan(100)
    const hits = (
      await Promise.all(
        list.map(async (file) =>
          (await Bun.file(path.join(app, file)).text()).split("\n").flatMap((line, index) =>
            // Comments may name the WormAgent 1 packages to explain why the site doesn't.
            /^\s*(\/\/|\*|\/\*)/.test(line)
              ? []
              : v1.filter((item) => item.pattern.test(line)).map((item) => `${file}:${index + 1} ${item.name}`),
          ),
        ),
      )
    ).flat()
    expect(hits).toEqual([])
  })
})
