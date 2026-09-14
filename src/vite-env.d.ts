/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public contact address, inlined at build time. See .env.example. */
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
