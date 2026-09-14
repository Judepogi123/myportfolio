/* -------------------------------------------------------------------------- */
/*  Portfolio copy. Written for this site — deliberately not the résumé text.  */
/*  The résumé is the exhaustive record; this is the edit of it.               */
/* -------------------------------------------------------------------------- */

export type Identity = {
  name: string
  shortName: string
  role: string
  email: string
  phone: string
  city: string
  availability: string
  /** Sits beside the copyright in the footer. */
  tagline: string
  headline: string
  lead: string
}

/* Set VITE_CONTACT_EMAIL in .env to change the address everywhere it appears. */
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'talkto@thatonedev.com'

export const identity: Identity = {
  name:         'Jude Demnuvar L. Ribleza',
  shortName:    'Jude Ribleza',
  role:         'Full-Stack Developer',
  email:        CONTACT_EMAIL,
  phone:        '+63 930 432 0169',
  city:         'Boac, Marinduque, Philippines',
  availability: 'Open to remote work',
  tagline:      'Full-stack developer — web, mobile and desktop',
  headline:     'I build software a town opens every morning.',
  lead:
    "I'm Jude — a full-stack developer in Marinduque, Philippines. For the past year I've been the only engineer on the system the Municipality of Gasan runs on: a portal for the offices, an app for phones, and two Windows programs that keep working when the connection doesn't.",
}

/* ------------------------------------------------------------------- nav -- */

export type NavItem = { id: string; label: string; index: string }

export const navItems: NavItem[] = [
  { index: '01', id: 'about',    label: 'About' },
  { index: '02', id: 'work',     label: 'Work' },
  { index: '03', id: 'problems', label: 'Problems' },
  { index: '04', id: 'toolkit',  label: 'Toolkit' },
  { index: '05', id: 'contact',  label: 'Contact' },
]

/* ----------------------------------------------------------------- about -- */

export const about = {
  paragraphs: [
    "Most of what I've built is used by people who didn't get to choose it. A clerk at a pharmacy counter. A department head signing a memo. A survey team two hours from the nearest signal. They open it because it's the tool — which changes what finished has to mean.",
    "So I take the whole line: the schema, the server, the interface, the tests, the release, and the call at eight in the morning when something is wrong. I'd rather ship one thing that survives a bad day than five that only demo well.",
  ],
  principles: [
    {
      title: 'Offline is a requirement, not a feature',
      body: 'A counter cannot stop serving people because the line went down. What I build keeps working unplugged and reconciles by record identity, so nothing doubles when it comes back.',
    },
    {
      title: 'Verified, not assumed',
      body: 'Around 1,100 assertions across 54 files run against a real database before a release goes out. Security fixes get confirmed against production, not marked done in a ticket.',
    },
    {
      title: 'Plain language, all the way down',
      body: 'No stack traces in front of a clerk. An error says what went wrong and what to do next — the same care the schema gets.',
    },
  ],
  facts: [
    { term: 'Currently',  detail: 'Municipality of Gasan',        sub: 'Sole developer · 2026 – present' },
    { term: 'Education',  detail: 'BS Information Technology',    sub: 'Major in Software Development' },
    { term: 'Based in',   detail: 'Marinduque, Philippines',      sub: 'GMT+8 · open to remote' },
    { term: 'Languages',  detail: 'English, Filipino',            sub: 'Written and spoken' },
  ],
}

/* ------------------------------------------------------------------ work -- */

export type Highlight = { title: string; body: string }

export type Project = {
  id: string
  name: string
  client: string
  period: string
  status: 'current' | 'shipped'
  role: string
  /** One sentence a non-technical reader can follow. */
  premise: string
  /** Short figures, shown in context under the project — never as bare trivia. */
  facts: { value: string; label: string }[]
  highlights: Highlight[]
  stack: string[]
}

export const projects: Project[] = [
  {
    id:      'gasan',
    name:    'Municipal Information System',
    client:  'Municipality of Gasan, Marinduque',
    period:  '2026 — Present',
    status:  'current',
    role:    'Sole developer',
    premise:
      'The software a town hall runs on. Nine of its offices — records, HR and payroll, the supply room, the pharmacy, the health centre, the public employment desk — work out of one system instead of nine sets of folders.',
    facts: [
      { value: '9',  label: 'offices using it daily' },
      { value: '3',  label: 'apps, one shared backend' },
      { value: '1.1k', label: 'assertions before each release' },
    ],
    highlights: [
      {
        title: 'A paper trail that can be proved',
        body: 'Memos route to named offices, get signed, and get acknowledged on the record — every step timestamped and attributable. “We never received that” stops being an argument you can have.',
      },
      {
        title: 'Documents anyone can check',
        body: 'Each issued PDF is attested over an Ed25519 hash chain, so a recipient outside the LGU can test it for tampering without an account, a login, or a phone call to me.',
      },
      {
        title: 'Signing on a phone, without guessing',
        body: 'The server rasterises each page and the app lays the signature boxes over it exactly where the stamp will land — nobody signs a document they have not actually read.',
      },
      {
        title: 'Counters that stay open',
        body: 'Two Windows programs keep the stockroom and the pharmacy serving people with no connection at all, then reconcile by record identity so a repeated sync can never double a transaction.',
      },
      {
        title: 'Forty-eight doors that were unlocked',
        body: 'I led the review that found endpoints trusting whatever identity the client claimed, closed them, and re-tested each one against production rather than calling it fixed.',
      },
    ],
    stack: ['React 19', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'Expo', 'WinForms', 'Ed25519', 'Railway'],
  },
  {
    id:      'survey',
    name:    'Field Survey & Records Platform',
    client:  'Private client · Marinduque',
    period:  '2024 — 2025',
    status:  'shipped',
    role:    'Full-stack developer',
    premise:
      'A records and interviewing platform for teams working where there is no mobile signal — the office plans and publishes from a browser, the field carries everything it needs on the phone.',
    facts: [
      { value: '28,899', label: 'records mirrored to a phone' },
      { value: '0',      label: 'duplicated, 0 missed' },
      { value: '4',      label: 'roles, one capability table' },
    ],
    highlights: [
      {
        title: 'A whole municipality, on the device',
        body: 'Records mirror into on-device SQLite in batches, written by identity — so an interrupted download resumes instead of duplicating. Proved across 28,899 records in 15 pages: nothing doubled, nothing lost.',
      },
      {
        title: 'Deletions that actually travel',
        body: 'A stamp-and-sweep pass marks every row a sync touches and clears what the server no longer sends, so a record removed at the office does not quietly live on in the field.',
      },
      {
        title: 'Quotas you can watch fill',
        body: "Each area's sample updates as interviews land, broken down by age and gender, so a team knows which ones are still needed instead of tallying by hand at the end of the day.",
      },
      {
        title: 'A phone nobody has ever signed into',
        body: 'An office-issued code and passcode pull a whole team onto a handset, each account at its own permission level — four roles resolved from one capability table rather than role checks scattered through the app.',
      },
    ],
    stack: ['React', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'Expo', 'SQLite', 'Zustand'],
  },
]

/* -------------------------------------------------------------- problems -- */

export type Problem = {
  id: string
  tag: string
  title: string
  problem: string
  solution: string
}

export const problems: Problem[] = [
  {
    id:      'signature-drift',
    tag:     'Geometry',
    title:   'A signature that cannot drift',
    problem:
      'The preview on a phone had to land exactly where the finished PDF stamps it — two renderers, two coordinate systems, one legally meaningful document.',
    solution:
      'Store placements as fractions of the page instead of pixels. Preview and print divide by the same number, so they cannot disagree at any screen size.',
  },
  {
    id:      'reminder-flood',
    tag:     'Blast radius',
    title:   'The sweep that would have flooded the town',
    problem:
      'Run once uncapped, the first reminder pass would have mailed three months of dead paperwork to every signatory on deploy morning.',
    solution:
      'An age ceiling, plus pacing held in the database rather than the scheduler. Anything unsigned that long is waiting on a decision, not a nudge — so reminders stay something people read.',
  },
  {
    id:      'wasm-pdf',
    tag:     'Build size',
    title:   'Rendering PDFs without a native module',
    problem:
      'Rasterising pages on the handset meant a native dependency, a heavier binary, and a build that breaks on every SDK bump.',
    solution:
      'Move rasterising to the server behind a WASM build and cache the page images on the device. No new native dependency, and upgrades stopped being a gamble.',
  },
]

/* --------------------------------------------------------------- toolkit -- */

export type ToolGroup = { id: string; title: string; note: string; items: string[] }

export const toolkit: ToolGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    note: 'Portals people work in all day',
    items: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'React Hook Form', 'Zod'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    note: 'Built to run without a signal',
    items: ['React Native', 'Expo SDK 54', 'Expo Router', 'EAS Build', 'Zustand', 'Socket.IO', 'SQLite'],
  },
  {
    id: 'backend',
    title: 'Backend',
    note: 'One API behind every surface',
    items: ['Node.js', 'Fastify', 'Prisma', 'PostgreSQL', 'JWT & Argon2', 'Socket.IO', 'REST design'],
  },
  {
    id: 'desktop',
    title: 'Desktop',
    note: 'Counters that cannot go down',
    items: ['C# / .NET WinForms', 'SQLite', 'Tauri (Rust)', 'Signed auto-update'],
  },
  {
    id: 'delivery',
    title: 'Delivery',
    note: 'Shipping and proving it works',
    items: ['Railway', 'Vercel', 'EAS', 'Git & GitHub', 'End-to-end suites', 'Production verification'],
  },
  {
    id: 'craft',
    title: 'Also on hand',
    note: 'Picked up where a job needed it',
    items: ['pdf-lib', 'MuPDF (WASM)', 'Ed25519 signing', 'Barcode / QR', 'Cloudinary'],
  },
]

/* ---------------------------------------------------------------- contact -- */

export type ContactLink = { id: string; label: string; value: string; href: string }

export const contactLinks: ContactLink[] = [
  { id: 'email', label: 'Email', value: identity.email, href: `mailto:${identity.email}` },
  { id: 'phone', label: 'Phone', value: identity.phone, href: `tel:${identity.phone.replace(/\s/g, '')}` },
  // Add GitHub / LinkedIn here once those profiles are public:
  // { id: 'github', label: 'GitHub', value: 'github.com/<handle>', href: 'https://github.com/<handle>' },
]
