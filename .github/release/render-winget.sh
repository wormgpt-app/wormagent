#!/usr/bin/env bash
# render-winget.sh <sign-windows dir> <sign-desktop-windows-installer dir> <out dir>: writes the WinGet manifests for
# Anomaly.WormAgent and Anomaly.WormAgent.Desktop. Submission to microsoft/winget-pkgs is paused until the packages
# are accepted, so the workflow only uploads them.
. "$(dirname "$0")/lib.sh"

cli=$1 desktop=$2 out=$3
sum() { sha256 "$1" | cut -c1-64 | tr a-f A-F; }
base="https://wormagent.net/files/bin/$WORMAGENT_VERSION"
date=$(date -u +%F)
header() {
  printf '# yaml-language-server: $schema=https://aka.ms/winget-manifest.%s.1.12.0.schema.json\n\nPackageIdentifier: %s\nPackageVersion: %s\n' \
    "$2" "$1" "$WORMAGENT_VERSION"
}
footer() { printf 'ManifestType: %s\nManifestVersion: 1.12.0\n' "$1"; }
manifests() {
  local id=$1 name=$2 description=$3 moniker=$4
  shift 4
  mkdir -p "$out/$id"
  { header "$id" version; echo "DefaultLocale: en-US"; footer version; } > "$out/$id/$id.yaml"
  { header "$id" installer; printf '%s\n' "$@" "ReleaseDate: $date"; footer installer; } > "$out/$id/$id.installer.yaml"
  {
    header "$id" defaultLocale
    printf '%s\n' "PackageLocale: en-US" "Publisher: WormAgent" "PublisherUrl: https://anoma.ly/" \
      "PublisherSupportUrl: https://github.com/anomalyco/wormagent/issues" "PrivacyUrl: https://wormagent.net/legal/privacy-policy" \
      "PackageName: $name" "PackageUrl: https://wormagent.net/" "License: MIT" "LicenseUrl: https://github.com/anomalyco/wormagent/blob/HEAD/LICENSE" \
      "ShortDescription: $description" "Moniker: $moniker" "Tags:" "- ai" "- coding-agent" "- developer-tools" \
      "Documentations:" "- DocumentLabel: Docs" "  DocumentUrl: https://wormagent.net/docs"
    footer defaultLocale
  } > "$out/$id/$id.locale.en-US.yaml"
}

manifests Anomaly.WormAgent "WormAgent CLI" "The open source AI coding agent for the terminal." wormagent \
  "InstallerType: zip" "NestedInstallerType: portable" "NestedInstallerFiles:" \
  "- RelativeFilePath: wormagent.exe" "  PortableCommandAlias: wormagent" "Commands:" "- wormagent" "Installers:" \
  "- Architecture: x64" "  InstallerUrl: $base/wormagent-windows-x64-baseline.zip" "  InstallerSha256: $(sum "$cli/wormagent-windows-x64-baseline.zip")" \
  "- Architecture: arm64" "  InstallerUrl: $base/wormagent-windows-arm64.zip" "  InstallerSha256: $(sum "$cli/wormagent-windows-arm64.zip")"

# The display name and uninstall key match what the NSIS installer registers for ai.wormagent.desktop.
manifests Anomaly.WormAgent.Desktop "WormAgent" "The open source AI coding agent as a desktop app." wormagent-desktop \
  "InstallerType: nullsoft" "Scope: user" "UpgradeBehavior: install" "ProductCode: d074f30d-5f88-5885-b075-be1348cc7676" \
  "Protocols:" "- wormagent" "Installers:" \
  "- Architecture: x64" "  InstallerUrl: $base/wormagent-desktop-win-x64.exe" "  InstallerSha256: $(sum "$desktop/wormagent-desktop-win-x64.exe")" \
  "- Architecture: arm64" "  InstallerUrl: $base/wormagent-desktop-win-arm64.exe" "  InstallerSha256: $(sum "$desktop/wormagent-desktop-win-arm64.exe")"
tail -n +1 "$out"/*/*
