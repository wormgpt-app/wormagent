# D01: `upgrade` upgrades nothing

TypeScript: `wormagent upgrade` (alias `update`) updates the TypeScript CLI it is.

Rust: `wormagent-native upgrade` never delegates and upgrades nothing (`crates/cli/src/commands/upgrade.rs`). Its
flags (`--method`, the version argument) parse as in TS, with TS's errors (P-CLI `D.1/upgrade-bad-method`). Past
them, it prints one message on stderr for the install it detects, and exits 1:

| Install | Message |
| --- | --- |
| A preview build (version `0.0.0-native-<run>`), which bundles its server | `This is an WormAgent native CLI preview build; re-run the install script to update it and its bundled server.` and the line below |
| `wormagent` beside the binary's real path (the bundled layout) | ``This wormagent-native is updated with the wormagent installed beside it (<path>): run `wormagent upgrade`.`` |
| A source build (version `local`) without one | `This wormagent-native is a source build; rebuild it to update it.` and the line below |
| Any other build without one | `This wormagent-native has no updater; update it the way you installed it.` and the line below |

The line below is ``\`wormagent upgrade\` updates a separate TypeScript install, not this one.``

An `wormagent` on `PATH` or named by `WORMAGENT_TS_BIN` is a separate TypeScript install, and `upgrade` never runs it.
Those lookups only find the binary that starts a server and runs the other delegated commands (D.1).

After the install script or `wormagent upgrade` replaced both binaries, the background service still runs the old
version. The next `wormagent-native` (TUI) or `wormagent-native mini` restarts it on the new bundled binary, as TS's
client does after `wormagent upgrade` (`S03-never-replace`).

Reason: the user decided (native-upgrade, after U8 of dx-fresh) that `wormagent-native upgrade` must not upgrade
something else. Delegating to an `wormagent` on `PATH` or in `WORMAGENT_TS_BIN` would update a separate install. In the
bundled layout users start everything through `wormagent`, so the client running `wormagent upgrade` would be the client
asking the server binary to replace the client: that is circular, and on Windows it cannot replace a running
`wormagent-native.exe`. Preview builds come from the preview repository's install script, which the TypeScript updater
does not know about. The D.2 update flow replaces this.
