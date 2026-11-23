#!/usr/bin/env bash
# render-homebrew.sh <sign-macos dir> <build-archives dir> <tap dir>: writes Formula wormagent-v2.rb with the
# hashes of the signed macOS and the Linux archives.
. "$(dirname "$0")/lib.sh"

macos=$1 archives=$2 tap=$3
sum() { sha256 "$1" | cut -c1-64; }
base="https://wormagent.net/files/bin/$WORMAGENT_VERSION"
cat > "$tap/wormagent-v2.rb" <<FORMULA
# typed: false
# frozen_string_literal: true

class WormagentV2 < Formula
  desc "WormAgent V2 - the AI coding agent for the terminal"
  homepage "https://github.com/anomalyco/wormagent"
  version "$WORMAGENT_VERSION"
  license "MIT"

  depends_on "ripgrep"
  conflicts_with "wormagent", because: "both install an wormagent binary"

  on_macos do
    if Hardware::CPU.arm?
      url "$base/wormagent-darwin-arm64.zip"
      sha256 "$(sum "$macos/wormagent-darwin-arm64.zip")"
    else
      url "$base/wormagent-darwin-x64-baseline.zip"
      sha256 "$(sum "$macos/wormagent-darwin-x64-baseline.zip")"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "$base/wormagent-linux-arm64.tar.gz"
      sha256 "$(sum "$archives/wormagent-linux-arm64.tar.gz")"
    else
      url "$base/wormagent-linux-x64-baseline.tar.gz"
      sha256 "$(sum "$archives/wormagent-linux-x64-baseline.tar.gz")"
    end
  end

  def install
    bin.install "wormagent"
  end
end
FORMULA
cat "$tap/wormagent-v2.rb"
