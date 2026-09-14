import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  /*
   * Vite only hands the browser variables starting with one of these, and the
   * prefix is the safety gate: anything matching it is inlined into the public
   * bundle in plain text.
   *
   * SERVICE_ is here because Vercel would not take VITE_API_URL. Treat it with
   * exactly the same caution as VITE_ — never put a key, token or password
   * behind either prefix. Those belong on the API, which is why the Resend key
   * lives in thatonedev-api and never here. `npm run build` greps the output
   * for leaked secrets as a backstop.
   */
  envPrefix: ['VITE_', 'SERVICE_'],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
