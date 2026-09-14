/*
 * Runs after `vite build`. Catches the class of bug where the production
 * bundle ends up pointing at a machine that only exists on a developer's
 * desk — a build host that was never given VITE_API_URL, a stray .env.local,
 * a hard-coded port left behind in a hurry.
 *
 * Cheap to run, and the failure it prevents is invisible until a real visitor
 * hits it.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist/assets'

/*
 * Ports matter here. Axios ships a bare `http://localhost` as its own internal
 * fallback for non-browser environments, so flagging portless localhost would
 * fail on every build for a string that is not ours. A localhost URL with a
 * port is always something a developer pointed at their own machine.
 */
const FORBIDDEN = [
  { pattern: /https?:\/\/localhost:\d+/g, why: 'a localhost URL with a port' },
  { pattern: /https?:\/\/127\.0\.0\.1:\d+/g, why: 'a loopback URL with a port' },
  { pattern: /\bre_[A-Za-z0-9_]{20,}/g, why: 'what looks like a Resend API key' },
]

/*
 * The contact form is useless if its API host is missing from the bundle.
 * Follow whatever the build was configured with, so pointing at a staging API
 * is allowed — what is not allowed is ending up with nothing.
 *
 * Must stay in step with the default in src/lib/api.ts.
 */
const DEFAULT_API_URL = 'https://service-production-696e.up.railway.app'

const configured =
  process.env.SERVICE_API_URL?.trim() || process.env.VITE_API_URL?.trim() || DEFAULT_API_URL

let REQUIRED_HOST
try {
  REQUIRED_HOST = new URL(configured).host
} catch {
  console.error(`check-bundle: "${configured}" is not a usable API URL.`)
  process.exit(1)
}

let files
try {
  files = readdirSync(DIST).filter((name) => /\.(js|css)$/.test(name))
} catch {
  console.error(`check-bundle: no ${DIST} — run the build first.`)
  process.exit(1)
}

const problems = []
let sawRequiredHost = false

for (const name of files) {
  const contents = readFileSync(join(DIST, name), 'utf8')

  if (contents.includes(REQUIRED_HOST)) sawRequiredHost = true

  for (const { pattern, why } of FORBIDDEN) {
    const hits = [...new Set(contents.match(pattern) ?? [])]
    for (const hit of hits) problems.push(`${name}: ${why} — ${hit}`)
  }
}

if (!sawRequiredHost) {
  problems.push(
    `the API host ${REQUIRED_HOST} is missing — the contact form would have nowhere to post`,
  )
}

if (problems.length > 0) {
  console.error('\ncheck-bundle: the built bundle contains things it must not ship with:\n')
  for (const problem of problems) console.error(`  ✗ ${problem}`)
  console.error(
    '\nIf this is the API URL, set VITE_API_URL on the build host, or fix the\n' +
      'default in src/lib/api.ts. A localhost URL in a shipped bundle fails for\n' +
      'every visitor with ERR_CONNECTION_REFUSED.\n',
  )
  process.exit(1)
}

console.log(`check-bundle: ${files.length} files clean — no localhost URLs, no secrets.`)
