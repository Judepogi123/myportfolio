/*
 * End-to-end checks for the behaviour that is easy to break by accident:
 * in-page navigation, theme persistence, the copy button, reduced motion and
 * mobile layout. Drives the installed Edge, so nothing needs downloading.
 *
 *   npm run dev        # in one terminal
 *   npm run verify     # in another
 *
 * Point it elsewhere with URL=http://localhost:5182 npm run verify
 */
import { chromium } from 'playwright-core'

const URL = process.env.URL ?? 'http://localhost:5173'

const browser = await chromium.launch({ channel: process.env.CHANNEL ?? 'msedge' })
const results = []
const fail = (name, detail) => results.push(`FAIL ${name} — ${detail}`)
const pass = (name, detail = '') => results.push(`ok   ${name} ${detail}`)

const SECTIONS = ['about', 'work', 'problems', 'projects', 'toolkit', 'contact']

/* ------------------------------------------------------- desktop journey -- */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(URL, { waitUntil: 'networkidle' })

  // Every section the navigation offers actually exists.
  const missing = await page.evaluate(
    (ids) => ids.filter((id) => !document.getElementById(id)),
    SECTIONS,
  )
  missing.length === 0
    ? pass('sections: every nav target exists')
    : fail('sections: every nav target exists', `missing ${missing.join(', ')}`)

  // Nothing is pinned over the content except the 2px reading indicator.
  const pinned = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => {
        const style = getComputedStyle(el)
        if (style.position !== 'fixed' && style.position !== 'sticky') return false
        const box = el.getBoundingClientRect()
        return box.height > 8 && box.top < 60
      })
      .map((el) => el.tagName + '.' + String(el.className).slice(0, 40)),
  )
  pinned.length === 0
    ? pass('layout: no fixed header over the page')
    : fail('layout: no fixed header over the page', pinned.join(' | '))

  // An anchor click lands on the section and updates the hash.
  await page.locator('a[href="#problems"]').first().click()
  await page.waitForTimeout(1200)
  const landed = await page.evaluate(() => ({
    hash: location.hash,
    top: Math.round(document.getElementById('problems').getBoundingClientRect().top),
  }))
  landed.hash === '#problems' && Math.abs(landed.top) < 80
    ? pass('nav: anchor scrolls to the section and sets the hash')
    : fail('nav: anchor scrolls to the section', JSON.stringify(landed))

  // The reading indicator tracks scroll position.
  const progress = await page.evaluate(() => {
    const bar = document.querySelector('.fixed.top-0.h-0\\.5, [class*="origin-left"]')
    if (!bar) return null
    const matrix = new DOMMatrixReadOnly(getComputedStyle(bar).transform)
    return matrix.a
  })
  progress !== null && progress > 0.05
    ? pass('progress: indicator advances with scroll', `scaleX=${progress?.toFixed(2)}`)
    : fail('progress: indicator advances with scroll', `scaleX=${progress}`)

  // Project cards must visibly react to a pointer: the cover motif takes the
  // accent colour and the border lifts. Easy to lose to a typo'd class.
  {
    const card = page.locator('#projects li .group').nth(1)
    await card.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    const read = () =>
      card.evaluate((el) => ({
        border: getComputedStyle(el).borderTopColor,
        motif: getComputedStyle(el.querySelector('svg')).color,
      }))
    const resting = await read()
    await card.hover()
    await page.waitForTimeout(800)
    const hovered = await read()

    hovered.border !== resting.border && hovered.motif !== resting.motif
      ? pass('projects: card reacts to hover')
      : fail(
          'projects: card reacts to hover',
          `border ${resting.border} -> ${hovered.border}, motif ${resting.motif} -> ${hovered.motif}`,
        )

    await page.mouse.move(0, 0)
  }

  /*
   * The contact form must validate in the browser before it ever calls the
   * API, and must say so in plain language. Submitting empty sends nothing.
   */
  {
    await page.locator('a[href="#contact"]').first().click()
    await page.waitForTimeout(900)
    await page.getByRole('button', { name: 'Send message' }).click()
    await page.waitForTimeout(700)

    const state = await page.evaluate(() => {
      const form = document.querySelector('#contact form')
      return {
        invalid: [...form.querySelectorAll('[aria-invalid="true"]')].map((el) => el.id),
        messages: [...form.querySelectorAll('p')]
          .map((p) => p.textContent.trim())
          .filter((t) => t && t.length < 140),
        honeypotVisible: (() => {
          const pot = document.getElementById('website')
          if (!pot) return 'missing'
          return pot.getBoundingClientRect().right > 0
        })(),
      }
    })

    const flagged = ['name', 'email', 'message'].every((id) => state.invalid.includes(id))
    const readable = !state.messages.some((m) => /required|invalid|string|expected/i.test(m))

    flagged && readable
      ? pass('contact: empty submit is caught in the browser, in plain language')
      : fail(
          'contact: empty submit is caught in the browser',
          `invalid=${state.invalid.join(',')} messages=${state.messages.join(' | ')}`,
        )

    state.honeypotVisible === false
      ? pass('contact: honeypot stays off-screen')
      : fail('contact: honeypot stays off-screen', String(state.honeypotVisible))
  }

  // Theme toggle flips the root class and persists.
  const before = await page.evaluate(() => document.documentElement.className)
  await page.getByRole('button', { name: /Switch to .* theme/ }).click()
  await page.waitForTimeout(450)
  const after = await page.evaluate(() => document.documentElement.className)
  const stored = await page.evaluate(() => localStorage.getItem('theme'))
  before !== after && stored
    ? pass('theme: toggles and persists', `-> ${stored}`)
    : fail('theme: toggles and persists', `${before} -> ${after}, stored=${stored}`)

  await page.reload({ waitUntil: 'networkidle' })
  const afterReload = await page.evaluate(() => ({
    cls: document.documentElement.className,
    stored: localStorage.getItem('theme'),
  }))
  afterReload.cls.includes('dark') === (afterReload.stored === 'dark')
    ? pass('theme: survives a reload with no flash mismatch')
    : fail('theme: survives a reload', JSON.stringify(afterReload))

  // Copy button.
  await page.locator('a[href="#contact"]').first().click()
  await page.waitForTimeout(900)
  // Compare against the address the page actually renders rather than a
  // literal, so changing VITE_CONTACT_EMAIL does not break this check.
  const shown = await page.locator('#contact-email').innerText()
  await page.getByRole('button', { name: 'Copy address' }).click()
  await page.waitForTimeout(300)
  const clip = await page.evaluate(() => navigator.clipboard.readText())
  clip === shown.trim() && clip.includes('@')
    ? pass('contact: copies the address', clip)
    : fail('contact: copies the address', `copied "${clip}", shown "${shown}"`)
  ;(await page.getByRole('button', { name: 'Copied' }).isVisible())
    ? pass('contact: shows copied feedback')
    : fail('contact: copied feedback', 'no label')

  // Back to top.
  await page.getByRole('button', { name: 'Back to top' }).click()
  await page.waitForTimeout(1400)
  const y = await page.evaluate(() => window.scrollY)
  y < 40 ? pass('footer: back to top works') : fail('footer: back to top', `y=${y}`)

  errors.length === 0
    ? pass('console: clean on desktop')
    : fail('console: clean on desktop', errors.slice(0, 3).join(' | '))

  await context.close()
}

/* -------------------------------------------------------- mobile journey -- */
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(URL, { waitUntil: 'networkidle' })

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    offenders: [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .map((el) => el.tagName + '.' + String(el.className).slice(0, 40))
      .slice(0, 5),
  }))
  overflow.scrollWidth <= overflow.innerWidth + 1 && overflow.offenders.length === 0
    ? pass('mobile: no horizontal overflow')
    : fail('mobile: no horizontal overflow', JSON.stringify(overflow))

  // Everything is one column at phone width.
  const multiColumn = await page.evaluate(
    () =>
      [...document.querySelectorAll('.grid')].filter((el) => {
        const columns = getComputedStyle(el).gridTemplateColumns.split(' ').length
        return columns > 1
      }).length,
  )
  multiColumn === 0
    ? pass('mobile: every grid collapses to one column')
    : fail('mobile: every grid collapses to one column', `${multiColumn} still multi-column`)

  // The footer navigation reaches each section.
  await page.locator('footer a[href="#toolkit"]').click()
  await page.waitForTimeout(1200)
  const atToolkit = await page.evaluate(
    () => Math.abs(document.getElementById('toolkit').getBoundingClientRect().top) < 90,
  )
  atToolkit
    ? pass('mobile: footer navigation reaches a section')
    : fail('mobile: footer navigation reaches a section', 'did not land')

  // Tap targets are big enough to hit with a thumb.
  const small = await page.evaluate(
    () =>
      [...document.querySelectorAll('a, button')]
        .filter((el) => {
          const box = el.getBoundingClientRect()
          return box.height > 0 && box.height < 24
        })
        .map((el) => (el.textContent ?? '').trim().slice(0, 24) || el.tagName),
  )
  small.length === 0
    ? pass('mobile: tap targets are at least 24px tall')
    : fail('mobile: tap targets are at least 24px tall', small.join(' | '))

  errors.length === 0
    ? pass('console: clean on mobile')
    : fail('console: clean on mobile', errors.slice(0, 3).join(' | '))

  await context.close()
}

/* ------------------------------------------------- reduced motion / a11y -- */
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 160))
    }
  })
  await page.waitForTimeout(500)
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('main *')].filter((el) => {
        const style = getComputedStyle(el)
        return style.opacity === '0' && el.getBoundingClientRect().height > 0
      }).length,
  )
  hidden === 0
    ? pass('reduced motion: everything is visible')
    : fail('reduced motion: everything is visible', `${hidden} elements at opacity 0`)

  const headings = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => h.tagName),
  )
  headings.filter((h) => h === 'H1').length === 1
    ? pass('a11y: exactly one h1')
    : fail('a11y: exactly one h1', headings.join(','))

  const unlabelled = await page.evaluate(
    () =>
      [...document.querySelectorAll('button')].filter(
        (b) => !b.textContent?.trim() && !b.getAttribute('aria-label'),
      ).length,
  )
  unlabelled === 0
    ? pass('a11y: every button has a name')
    : fail('a11y: every button has a name', `${unlabelled} without`)

  await context.close()
}

await browser.close()

console.log(results.join('\n'))
const failures = results.filter((r) => r.startsWith('FAIL')).length
console.log(`\n${results.length - failures} passed, ${failures} failed`)
process.exit(failures ? 1 : 0)
