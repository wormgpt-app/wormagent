interface ImportMetaEnv {
  readonly WORMAGENT_CHANNEL: string
  readonly WORMAGENT_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
