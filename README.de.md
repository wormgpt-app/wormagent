<p align="center">
  <a href="https://wormagent.net">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="WormAgent logo">
    </picture>
  </a>
</p>
<p align="center">Der Open-Source KI-Coding-Agent.</p>
<p align="center">
  <a href="https://wormagent.net/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@wormagent/cli"><img alt="npm" src="https://img.shields.io/npm/v/@wormagent/cli?style=flat-square" /></a>
  <a href="https://github.com/wormgpt-app/wormagent/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/wormgpt-app/wormagent/release.yml?style=flat-square&branch=dev" /></a>
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

### Installation

```bash
# YOLO
curl -fsSL https://wormagent.net/v2/install | bash

# Paketmanager
npm i -g @wormagent/cli@latest      # oder bun/pnpm/yarn
brew install wormgpt-app/tap/wormagent-v2 # macOS und Linux (empfohlen, immer aktuell)
brew install wormagent              # macOS und Linux (offizielle Brew-Formula, seltener aktualisiert)
sudo pacman -S wormagent            # Arch Linux (Stable)
paru -S wormagent-beta              # Arch Linux (Latest from AUR)
mise use -g wormagent               # jedes Betriebssystem
nix run github:wormgpt-app/wormagent  # Nix
```

> [!TIP]
> Entferne Versionen älter als 0.1.x vor der Installation.

### Desktop-App (BETA)

WormAgent ist auch als Desktop-Anwendung verfügbar. Lade sie von [wormagent.net/download](https://wormagent.net/download) herunter.

| Plattform             | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `wormagent-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `wormagent-desktop-mac-x64.dmg`     |
| Windows               | `wormagent-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm` oder AppImage       |

```bash
# macOS (Homebrew)
brew install --cask wormagent-desktop
```

#### Installationsverzeichnis

Das Installationsskript installiert WormAgent in `$HOME/.wormagent/bin`.

### Agents

WormAgent enthält zwei eingebaute Agents, zwischen denen du mit der `Tab`-Taste wechseln kannst.

- **build** - Standard-Agent mit vollem Zugriff für Entwicklungsarbeit
- **plan** - Nur-Lese-Agent für Analyse und Code-Exploration
  - Verweigert Datei-Edits standardmäßig
  - Fragt vor dem Ausführen von bash-Befehlen nach
  - Ideal zum Erkunden unbekannter Codebases oder zum Planen von Änderungen

Außerdem ist ein **general**-Subagent für komplexe Suchen und mehrstufige Aufgaben enthalten.
Dieser wird intern genutzt und kann in Nachrichten mit `@general` aufgerufen werden.

Mehr dazu unter [Agents](https://wormagent.net/docs/agents).

### Dokumentation

Mehr Infos zur Konfiguration von WormAgent findest du in unseren [**Docs**](https://wormagent.net/docs).

### Beitragen

Wenn du zu WormAgent beitragen möchtest, lies bitte unsere [Contributing Docs](./CONTRIBUTING.md), bevor du einen Pull Request einreichst.

### Auf WormAgent aufbauen

Wenn du an einem Projekt arbeitest, das mit WormAgent zusammenhängt und "wormagent" als Teil seines Namens verwendet (z.B. "wormagent-dashboard" oder "wormagent-mobile"), füge bitte einen Hinweis in deine README ein, dass es nicht vom WormAgent-Team gebaut wird und nicht in irgendeiner Weise mit uns verbunden ist.

---

**Tritt unserer Community bei** [Discord](https://discord.gg/wormagent) | [X.com](https://x.com/wormagent)
