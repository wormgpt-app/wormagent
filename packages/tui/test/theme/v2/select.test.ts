import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@wormagent/theme/tui"
import { getWormAgentClassicTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getWormAgentClassicTheme(), "light")
  const dark = selectTheme(getWormAgentClassicTheme(), "dark")
  expect(selectTheme(getWormAgentClassicTheme())).toEqual(light)
  expect(light.hue).toEqual(getWormAgentClassicTheme().light.hue)
  expect(dark.text).toEqual(getWormAgentClassicTheme().base.text)
  expect(dark.hue).toEqual(getWormAgentClassicTheme().dark.hue)
  expect(selectThemeMode(getWormAgentClassicTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getWormAgentClassicTheme().base, light: getWormAgentClassicTheme().light } as const
  const darkOnly = { base: getWormAgentClassicTheme().base, dark: getWormAgentClassicTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getWormAgentClassicTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getWormAgentClassicTheme(), "dark"), mode: "dark" })
})
