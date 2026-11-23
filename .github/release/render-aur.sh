#!/usr/bin/env bash
# render-aur.sh <build-npm dir> <aur dir>: writes PKGBUILD, .SRCINFO and the wormagent2 shim for wormagent-beta.
# The package installs the published npm tarballs, so their hashes come from the build-npm artifact.
# LICENSE comes from the AUR repository itself.
. "$(dirname "$0")/lib.sh"

npm=$1 aur=$2
name=wormagent-beta
pkgver="${WORMAGENT_VERSION//-/.}"
if dry_run && [ ! -f "$aur/LICENSE" ]; then printf 'MIT License\n' > "$aur/LICENSE"; fi
test -s "$aur/LICENSE" || die "The AUR repository has no LICENSE"
printf '#!/bin/sh\nexec "$(dirname "$0")/wormagent" "$@"\n' > "$aur/wormagent2"
sum() { sha256 "$1" | cut -c1-64; }
x64=$(sum "$npm/wormagent-cli-linux-x64-baseline-$WORMAGENT_VERSION.tgz")
arm64=$(sum "$npm/wormagent-cli-linux-arm64-$WORMAGENT_VERSION.tgz")
x64_url="https://registry.npmjs.org/@wormagent/cli-linux-x64-baseline/-/cli-linux-x64-baseline-$WORMAGENT_VERSION.tgz"
arm64_url="https://registry.npmjs.org/@wormagent/cli-linux-arm64/-/cli-linux-arm64-$WORMAGENT_VERSION.tgz"
license=$(sum "$aur/LICENSE")
shim=$(sum "$aur/wormagent2")

# Stripping a compiled Bun executable can damage its embedded application.
cat > "$aur/PKGBUILD" <<PKGBUILD
# Maintainer: Dax <mail@thdxr.com>
pkgname=$name
pkgver=$pkgver
pkgrel=1
pkgdesc='WormAgent beta - the AI coding agent for the terminal'
url='https://github.com/anomalyco/wormagent'
arch=('x86_64' 'aarch64')
license=('MIT')
depends=('glibc' 'gcc-libs' 'ripgrep')
provides=('wormagent' 'wormagent2')
conflicts=('wormagent' 'wormagent2')
options=('!strip' '!debug')
source=('LICENSE' 'wormagent2')
sha256sums=('$license' '$shim')
source_x86_64=('$name-$pkgver-x86_64.tgz::$x64_url')
sha256sums_x86_64=('$x64')
source_aarch64=('$name-$pkgver-aarch64.tgz::$arm64_url')
sha256sums_aarch64=('$arm64')

package() {
  install -Dm755 "\$srcdir/package/bin/wormagent" "\$pkgdir/usr/bin/wormagent"
  install -Dm755 "\$srcdir/wormagent2" "\$pkgdir/usr/bin/wormagent2"
  install -Dm644 "\$srcdir/LICENSE" "\$pkgdir/usr/share/licenses/\$pkgname/LICENSE"
}
PKGBUILD

# What makepkg --printsrcinfo prints for the PKGBUILD above.
t=$'\t'
cat > "$aur/.SRCINFO" <<SRCINFO
pkgbase = $name
${t}pkgdesc = WormAgent beta - the AI coding agent for the terminal
${t}pkgver = $pkgver
${t}pkgrel = 1
${t}url = https://github.com/anomalyco/wormagent
${t}arch = x86_64
${t}arch = aarch64
${t}license = MIT
${t}depends = glibc
${t}depends = gcc-libs
${t}depends = ripgrep
${t}provides = wormagent
${t}provides = wormagent2
${t}conflicts = wormagent
${t}conflicts = wormagent2
${t}options = !strip
${t}options = !debug
${t}source = LICENSE
${t}source = wormagent2
${t}sha256sums = $license
${t}sha256sums = $shim
${t}source_x86_64 = $name-$pkgver-x86_64.tgz::$x64_url
${t}sha256sums_x86_64 = $x64
${t}source_aarch64 = $name-$pkgver-aarch64.tgz::$arm64_url
${t}sha256sums_aarch64 = $arm64

pkgname = $name
SRCINFO
cat "$aur/PKGBUILD" "$aur/.SRCINFO"
