<p align="center">
  <a href="https://wormagent.net">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="WormAgent logo">
    </picture>
  </a>
</p>
<p align="center">AI-kodeagent med åpen kildekode.</p>
<p align="center">
  <a href="https://wormagent.net/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@wormagent/cli"><img alt="npm" src="https://img.shields.io/npm/v/@wormagent/cli?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/wormagent/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/wormagent/release.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![WormAgent Terminal UI](services/site/public/v1/docs/assets/lander/screenshot.png)](https://wormagent.net)

---

### Installasjon

```bash
# YOLO
curl -fsSL https://wormagent.net/v2/install | bash

# Pakkehåndterere
npm i -g @wormagent/cli@latest      # eller bun/pnpm/yarn
brew install anomalyco/tap/wormagent-v2 # macOS og Linux (anbefalt, alltid oppdatert)
brew install wormagent              # macOS og Linux (offisiell brew-formel, oppdateres sjeldnere)
sudo pacman -S wormagent            # Arch Linux (Stable)
paru -S wormagent-beta              # Arch Linux (Latest from AUR)
mise use -g wormagent               # alle OS
nix run github:anomalyco/wormagent  # Nix
```

> [!TIP]
> Fjern versjoner eldre enn 0.1.x før du installerer.

### Desktop-app (BETA)

WormAgent er også tilgjengelig som en desktop-app. Last ned fra [wormagent.net/download](https://wormagent.net/download).

| Plattform             | Nedlasting                         |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `wormagent-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `wormagent-desktop-mac-x64.dmg`     |
| Windows               | `wormagent-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm` eller AppImage      |

```bash
# macOS (Homebrew)
brew install --cask wormagent-desktop
```

#### Installasjonsmappe

Installasjonsskriptet installerer WormAgent i `$HOME/.wormagent/bin`.

### Agents

WormAgent har to innebygde agents du kan bytte mellom med `Tab`-tasten.

- **build** - Standard, agent med full tilgang for utviklingsarbeid
- **plan** - Skrivebeskyttet agent for analyse og kodeutforsking
  - Nekter filendringer som standard
  - Spør om tillatelse før bash-kommandoer
  - Ideell for å utforske ukjente kodebaser eller planlegge endringer

Det finnes også en **general**-subagent for komplekse søk og flertrinnsoppgaver.
Den brukes internt og kan kalles via `@general` i meldinger.

Les mer om [agents](https://wormagent.net/docs/agents).

### Dokumentasjon

For mer info om hvordan du konfigurerer WormAgent, [**se dokumentasjonen**](https://wormagent.net/docs).

### Bidra

Hvis du vil bidra til WormAgent, les [contributing docs](./CONTRIBUTING.md) før du sender en pull request.

### Bygge på WormAgent

Hvis du jobber med et prosjekt som er relatert til WormAgent og bruker "wormagent" som en del av navnet; for eksempel "wormagent-dashboard" eller "wormagent-mobile", legg inn en merknad i README som presiserer at det ikke er bygget av WormAgent-teamet og ikke er tilknyttet oss på noen måte.

---

**Bli med i fellesskapet** [Discord](https://discord.gg/wormagent) | [X.com](https://x.com/wormagent)
