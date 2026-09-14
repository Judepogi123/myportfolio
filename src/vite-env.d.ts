/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public contact address, inlined at build time. See .env.example. */
  readonly VITE_CONTACT_EMAIL?: string
  /**
   * Base URL of thatonedev-api, which delivers the contact form.
   * Optional — src/lib/api.ts falls back to the deployed service.
   */
  readonly SERVICE_API_URL?: string
  /** Older name for SERVICE_API_URL; still honoured. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
