/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public contact address, inlined at build time. See .env.example. */
  readonly VITE_CONTACT_EMAIL?: string
  /** Base URL of thatonedev-api, which delivers the contact form. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
