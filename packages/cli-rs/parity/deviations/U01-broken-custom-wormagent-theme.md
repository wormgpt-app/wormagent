# U01: a broken custom `wormagent` theme falls back to the built-in one

**TypeScript.** A custom theme file named `wormagent` replaces the built-in `wormagent` theme
(`packages/tui/src/theme/index.ts:42-52`), and `wormagent` is the theme every failed theme falls back to. When the
custom `wormagent` is malformed, that fallback fails too: the `selected` memo rethrows for `wormagent`
(`packages/tui/src/context/theme.tsx:298-308`), so the TUI stops. For example, `setCustomThemes({ wormagent: { base:
{} } })` makes `parseTheme(allThemes().wormagent)` throw `Invalid theme: wormagent value is an invalid value`.

**Rust.** `ThemeState` (`crates/ui/src/theme/state.rs`) shows the failed theme's error toast as for any broken
theme, then loads the built-in `wormagent` theme and logs `custom theme wormagent: <message>; using the built-in
wormagent theme`. This holds whether the broken custom `wormagent` was selected or was the fallback of another theme
(a broken custom theme, or `system` without a terminal palette).

**Reason.** Defects the TypeScript client shares are fixed in Rust and recorded as deviations. A broken theme file should not stop the client.
