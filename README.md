# Portfolio — Jude Demnuvar L. Ribleza

Single-page portfolio. React 19 + TypeScript on Vite, styled with Tailwind CSS v4,
animated with Motion.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script             | What it does                                                  |
| ------------------ | ------------------------------------------------------------- |
| `npm run dev`      | Dev server with HMR                                            |
| `npm run build`    | Typecheck, then build to `dist/`                               |
| `npm run preview`  | Serve the built `dist/`                                        |
| `npm run typecheck`| `tsc --noEmit`                                                 |
| `npm run verify`   | 19 end-to-end checks against a running server (see below)      |
| `npm run shots`    | Full-page screenshots at four sizes into `screenshots/`        |

## Editing the content

Everything the page says lives in **`src/data/profile.ts`** — identity, metrics,
stack groups, experience, engineering problems, contact links, nav. The
components read from it and never hold copy of their own, so updating the résumé
means editing one file.

To add GitHub or LinkedIn, uncomment the entry in `contactLinks`. The contact
grid is `sm:grid-cols-3`, so a fourth item wraps cleanly.

## Design system

Tokens live at the top of `src/index.css`.

- **Type** — Geist Variable for text, Geist Mono Variable for labels, metrics and
  metadata. Self-hosted through `@fontsource-variable`, so there is no request to
  Google Fonts and no layout shift.
- **Colour** — semantic tokens only (`canvas`, `surface`, `raised`, `line`,
  `line-strong`, `ink`, `ink-muted`, `ink-faint`, `accent`). Light and dark are
  two sets of the same names; no component hard-codes a colour.
- **No shadows anywhere.** Hierarchy comes from 1px borders, background tone
  steps and whitespace. The only ring on the page is the focus outline, which is
  an accessibility affordance.
- **Accent is rationed** — roughly three uses per screen: the primary action, the
  live indicator, and whatever the cursor is currently on.
- **Separators** — grids use `gap-px` over a `bg-line` track, so hairlines stay
  correct at every breakpoint without nth-child arithmetic.

## Behaviour worth knowing

- **Theme** — an inline script in `index.html` applies the stored or system theme
  before first paint, so there is no flash. `useTheme` writes to `localStorage`
  **only when the visitor toggles**, so simply visiting never pins someone to
  whatever their system preference happened to be that day.
- **Scroll spy** — nothing in the nav is marked current while the hero is on
  screen; the last section wins once the page is scrolled to the bottom.
- **Reduced motion** — `prefers-reduced-motion` collapses every entrance to a
  short fade, drops the scroll animation, and is asserted in `npm run verify`.
- **Mobile sheet** — locks the body, closes on Escape, on link click, and on a
  resize past the `md` breakpoint.

## Verification

`npm run verify` drives the Microsoft Edge already installed on Windows through
`playwright-core`, so no browser download is needed. Start a server first:

```bash
npm run dev
```

```bash
npm run verify
```

It covers navigation and hash updates, theme toggle and persistence across a
reload, the work-experience expander, clipboard copy, back-to-top, the mobile
menu in four ways, reduced motion leaving nothing invisible, a single `h1`, every
button having an accessible name, and a clean console on desktop and mobile.

Against a production build instead:

```bash
npm run build && npm run preview -- --port 5182
```

```bash
URL=http://localhost:5182 npm run verify
```

## Deploying

Static output — `dist/` goes anywhere. On Vercel: framework **Vite**, build
`npm run build`, output `dist`.
