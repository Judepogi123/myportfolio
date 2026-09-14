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
  proof: string
}

/* Set VITE_CONTACT_EMAIL in .env to change the address everywhere it appears. */
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'talkto@thatonedev.com'

export const identity: Identity = {
  name:         'Jude Demnuvar L. Ribleza',
  shortName:    'Jude Ribleza',
  role:         'Full-Stack Developer',
  email:        CONTACT_EMAIL,
  phone:        '+63 930 432 0169',
  city:         'Philippines · GMT+8',
  availability: 'Working remotely with teams anywhere',
  tagline:      'Full-stack developer — web, mobile and desktop',
  headline:     'I build systems that have to keep working.',
  lead:
    "I'm Jude — a full-stack developer across web, mobile and desktop. I design multi-tenant platforms, offline-first apps and cryptographic document pipelines, and I own them end to end: schema, API, interface, tests, release, and the call when something breaks at eight in the morning.",
  /** Second paragraph of the hero — the proof behind the claim above. */
  proof:
    'Most recently as the sole engineer on a platform serving nine departments from one API across three client applications, hardened after a security review and released on its own pipeline.',
}

/* ------------------------------------------------------------------- nav -- */

export type NavItem = { id: string; label: string; index: string }

export const navItems: NavItem[] = [
  { index: '01', id: 'about',    label: 'About' },
  { index: '02', id: 'work',     label: 'Work' },
  { index: '03', id: 'problems', label: 'Problems' },
  { index: '04', id: 'projects', label: 'Projects' },
  { index: '05', id: 'toolkit',  label: 'Toolkit' },
  { index: '06', id: 'contact',  label: 'Contact' },
]

/* ----------------------------------------------------------------- about -- */

export const about = {
  paragraphs: [
    "Most of what I've built is used by people who didn't get to choose it — staff at a counter, a manager approving something, a field team with no signal. Software nobody opted into has to be right the first time, because there is no churning away from it and no workaround to fall back on.",
    "So I take the whole line: the data model, the API, the interface, the tests, the release pipeline, and the call at eight in the morning when something is wrong. I'd rather ship one thing that survives a bad day than five that only survive a demo.",
  ],
  principles: [
    {
      title: 'Correctness before cleverness',
      body: 'Sync reconciles by record identity, money-shaped invariants live in the database rather than the app, and signature geometry is stored as fractions so two renderers cannot disagree. The interesting part is usually where a shortcut would have been silent.',
    },
    {
      title: 'Verified, not assumed',
      body: 'Around 1,100 assertions across 54 files run against a real database before a release goes out, and security fixes are confirmed against production rather than marked done in a ticket.',
    },
    {
      title: 'Built for the worst conditions, not the best',
      body: 'Bad connections, half-applied migrations, interrupted downloads, a provider having an outage — these are the normal case, and the design assumes them instead of apologising for them.',
    },
  ],
  /** What I can be handed. The point of this section: range, stated plainly. */
  capabilities: [
    {
      title: 'Multi-tenant platforms',
      body: 'One deployment serving separate organisations whose records must never meet, with scoping enforced on the server rather than in the interface.',
    },
    {
      title: 'Offline-first sync',
      body: 'On-device SQLite mirrors, write queues and reconciliation by identity — proven across 28,899 records with none duplicated and none lost.',
    },
    {
      title: 'Documents & e-signature',
      body: 'Server-side PDF rendering, signature placement that cannot drift between preview and print, and Ed25519 attestation any recipient can verify without an account.',
    },
    {
      title: 'Cross-platform delivery',
      body: 'One API behind a web portal, iOS and Android, and Windows desktop — each with its own release channel, from a single source of truth.',
    },
    {
      title: 'Security hardening',
      body: 'Led a review that closed 48 endpoints trusting client-supplied identity, and shut unauthenticated access to account, admin and personal-data routes.',
    },
    {
      title: 'Release engineering',
      body: 'End-to-end suites against a real database, signed auto-update channels, and deploys I own rather than hand over.',
    },
  ],
  facts: [
    { term: 'Currently',  detail: 'Sole engineer, government platform', sub: 'Nine departments, three client apps' },
    { term: 'Education',  detail: 'BS Information Technology',          sub: 'Major in Software Development' },
    { term: 'Based in',   detail: 'Philippines · GMT+8',                sub: 'Remote, across time zones' },
    { term: 'Languages',  detail: 'English, Filipino',                  sub: 'Written and spoken' },
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
    name:    'Multi-tenant Government Platform',
    client:  'Municipality of Gasan · Philippines',
    period:  '2026 — Present',
    status:  'current',
    role:    'Sole engineer — architecture to release',
    premise:
      'Nine departments — records, HR and payroll, inventory, pharmacy, clinical records, public employment — running on one API behind a React portal, an iOS and Android app, and two offline-capable Windows applications. Built multi-tenant from the schema up, so the same deployment can serve another organisation without their records ever meeting.',
    facts: [
      { value: '9',    label: 'departments in daily production' },
      { value: '3',    label: 'client apps, one shared API' },
      { value: '1.1k', label: 'assertions before each release' },
      { value: '48',   label: 'endpoints hardened after review' },
    ],
    highlights: [
      {
        title: 'An audit trail that holds up',
        body: 'Documents route to named parties, get signed, and get acknowledged on the record — every step timestamped and attributable, so “we never received that” stops being an argument anyone can have.',
      },
      {
        title: 'Tamper-evident documents, verifiable by anyone',
        body: 'Each issued PDF is attested over an Ed25519 hash chain, so a third party outside the organisation can test it for tampering with no account, no login, and no call to me.',
      },
      {
        title: 'Signing on a phone, without guessing',
        body: 'The server rasterises each page and the app lays the signature boxes over it exactly where the stamp will land — nobody signs a document they have not actually read.',
      },
      {
        title: 'Point-of-service that survives an outage',
        body: 'Two Windows applications keep inventory and dispensing running with no connection at all, then reconcile by record identity on reconnect — so a repeated sync can never double a transaction.',
      },
      {
        title: 'Forty-eight endpoints that trusted the client',
        body: 'I led the review that found routes accepting whatever identity the caller claimed, closed them, and re-tested each one against production rather than calling it fixed.',
      },
    ],
    stack: ['React 19', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'Expo', 'WinForms', 'Ed25519', 'Railway'],
  },
  {
    id:      'survey',
    name:    'Offline-First Field Data Platform',
    client:  'Private client',
    period:  '2024 — 2025',
    status:  'shipped',
    role:    'Full-stack developer',
    premise:
      'A records and data-collection platform for teams operating with no connectivity at all. The office plans, publishes and reconciles from a browser; the field carries a complete working copy on the handset and syncs when it can. One Fastify and Prisma API over PostgreSQL serving both.',
    facts: [
      { value: '28,899', label: 'records mirrored to a phone' },
      { value: '0',      label: 'duplicated, 0 missed' },
      { value: '4',      label: 'roles, one capability table' },
    ],
    highlights: [
      {
        title: 'Tens of thousands of records, on the device',
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

/* --------------------------------------------------- personal projects -- */

export type PersonalProject = {
  id: string
  name: string
  year: string
  status: 'Live' | 'In progress' | 'Prototype'
  /** Which line-art cover to draw — see ProjectCover. */
  motif: 'device' | 'ledger' | 'form' | 'sync' | 'feed'
  /** Drop a screenshot in public/projects/ and point at it, e.g. '/projects/giams.png'. */
  cover?: string
  /** Optional repo or demo. Leave out and the card renders without a link. */
  href?: string
  blurb: string
  stack: string[]
  /** The first project gets the wide card. */
  featured?: boolean
}

export const personalProjects: PersonalProject[] = [
  {
    id:       'mockup-studio',
    name:     'Mobile Mockup Studio',
    year:     '2026',
    status:   'In progress',
    motif:    'device',
    featured: true,
    blurb:
      'Animated device-mockup videos rendered and encoded entirely in the browser — phone frames in real 3D, keyframed motion, and an MP4 that never leaves the machine. No upload, no render queue, no server to pay for.',
    stack: ['React', 'Three.js', 'WebCodecs', 'mp4-muxer', 'ffmpeg.wasm', 'Supabase'],
  },
  {
    id:     'giams',
    name:   'GIAMS',
    year:   '2026',
    status: 'In progress',
    motif:  'ledger',
    blurb:
      'A double-entry accounting system built to a statutory standard, with the balance invariants enforced by database constraints rather than trusted to application code — so the books cannot be put out of balance by a bug.',
    stack: ['Tauri', 'Rust', 'PostgreSQL', 'TypeScript'],
  },
  {
    id:     'form-builder',
    name:   'Distributed Forms & E-Signature',
    year:   '2026',
    status: 'Live',
    motif:  'form',
    blurb:
      'An organisation designs a form once and publishes it to every unit beneath it, then tracks who has completed, signed and acknowledged it — with announcements and messaging in the same place, and each unit scoped to its own submissions.',
    stack: ['React', 'dnd-kit', 'pdf-lib', 'pdf.js', 'Supabase', 'Recharts'],
  },
  {
    id:     'inventory',
    name:   'Stockroom',
    year:   '2026',
    status: 'Prototype',
    motif:  'sync',
    blurb:
      'Counting stock on a phone that may have no signal: a SQLite mirror of the cloud database on the device, a queue for everything done offline, and a reconcile pass that cannot double a movement.',
    stack: ['Expo', 'Drizzle ORM', 'SQLite', 'Supabase', 'TanStack Query'],
  },
  {
    id:     'akp2026',
    name:   'AKP',
    year:   '2026',
    status: 'In progress',
    motif:  'feed',
    blurb:
      'A members-only social space — an activity feed, a directory that groups people by region and chapter, and profiles members actually keep up to date.',
    stack: ['Expo SDK 57', 'Expo Router', 'Supabase', 'Zustand', 'Zod'],
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
    title:   'The sweep that would have flooded every inbox',
    problem:
      'Run once uncapped, the first reminder pass would have mailed three months of dead paperwork to every signatory in the organisation on deploy morning.',
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
