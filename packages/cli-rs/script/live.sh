#!/bin/sh
# Runs wormagent-native against the elected wormagent background service, as the root `dev:live` does for the
# TypeScript TUI: the dev storage channel, the service's URL, and its private password.
#
# Usage: script/live.sh [wormagent-native arguments...]
set -eu

rs=$(cd "$(dirname "$0")/.." && pwd)
server=$(wormagent service status)
WORMAGENT_PASSWORD=$(wormagent service get password)
WORMAGENT_TUI_CHANNEL=dev
export WORMAGENT_PASSWORD WORMAGENT_TUI_CHANNEL
# Builds from the workspace so cargo reads .cargo/config.toml, then runs in the caller's directory.
(cd "$rs" && cargo build --quiet --bin wormagent-native)
exec "$rs/target/debug/wormagent-native" "$@" --server "$server"
