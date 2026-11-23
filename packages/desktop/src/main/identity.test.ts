import { expect, test } from "bun:test"
import { isCollidingDevShortcut, resolveIdentity } from "./identity"

test.each([
  {
    channel: "dev",
    packaged: true,
    appName: "WormAgent Dev",
    appID: "ai.wormagent.desktop.dev",
    appUserModelID: "ai.wormagent.desktop.dev",
  },
  {
    channel: "beta",
    packaged: true,
    appName: "WormAgent Beta",
    appID: "ai.wormagent.desktop.beta",
    appUserModelID: "ai.wormagent.desktop.beta",
  },
  {
    channel: "prod",
    packaged: true,
    appName: "WormAgent",
    appID: "ai.wormagent.desktop",
    appUserModelID: "ai.wormagent.desktop",
  },
  {
    channel: "local",
    packaged: false,
    appName: "WormAgent Dev",
    appID: "ai.wormagent.desktop.dev",
    appUserModelID: "ai.wormagent.desktop.local",
  },
  {
    channel: "dev",
    packaged: false,
    appName: "WormAgent Dev",
    appID: "ai.wormagent.desktop.dev",
    appUserModelID: "ai.wormagent.desktop.local",
  },
] as const)(
  "identity for $channel (packaged=$packaged) isolates unpackaged AUMID from installed channels",
  ({ channel, packaged, appName, appID, appUserModelID }) => {
    expect(resolveIdentity(channel, packaged)).toEqual({ appName, appID, appUserModelID })
  },
)

const installedExe = "C:\\Users\\user\\AppData\\Local\\Programs\\ai.wormagent.desktop.dev\\WormAgent Dev.exe"

const devElectron = "D:\\repo\\node_modules\\electron\\dist\\electron.exe"

test.each([
  {
    name: "unpackaged Electron.lnk claiming the installed dev AUMID",
    shortcut: { appUserModelId: "ai.wormagent.desktop.dev", target: devElectron },
    expected: true,
  },
  {
    name: "case-insensitive AUMID match",
    shortcut: { appUserModelId: "AI.WormAgent.Desktop.Dev", target: devElectron },
    expected: true,
  },
  {
    name: "unpackaged Electron.lnk with the isolated local AUMID",
    shortcut: { appUserModelId: "ai.wormagent.desktop.local", target: devElectron },
    expected: false,
  },
  {
    name: "unrelated app shortcut",
    shortcut: { appUserModelId: "com.example.other", target: devElectron },
    expected: false,
  },
  {
    name: "shortcut without an AUMID",
    shortcut: { target: devElectron },
    expected: false,
  },
  {
    name: "shortcut targeting the installed executable itself",
    shortcut: { appUserModelId: "ai.wormagent.desktop.dev", target: installedExe.toLowerCase() },
    expected: false,
  },
])("isCollidingDevShortcut returns $expected for $name", ({ shortcut, expected }) => {
  expect(isCollidingDevShortcut(shortcut, "ai.wormagent.desktop.dev", installedExe)).toBe(expected)
})
