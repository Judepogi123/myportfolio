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
        // Decorative overlays cannot cover anything they do not take clicks for.
        if (style.pointerEvents === 'none') return false
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

    /*
     * Move the real mouse to the card's measured centre rather than using
     * locator.hover(). hover() re-resolves the element's position through its
     * own actionability pass, and while the entrance animations are still
     * settling it can aim at a stale box and land on nothing.
     */
    const box = await card.boundingBox()
    if (box) {
      await page.mouse.move(Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2))
    }
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
   * The typewriter loops: type, hold, erase, retype. Assert it both reaches
   * the full string and shrinks again — an earlier check compared against the
   * complete text once, which now lands mid-erase and fails at random.
   *
   * The untouched copy for screen readers matters more than any of it.
   */
  {
    const lengths = []
    let sawFullString = false

    for (let i = 0; i < 34; i += 1) {
      const text = await page.evaluate(
        () =>
          document
            .querySelector('a[href="#top"] span[aria-hidden]')
            ?.textContent?.trim() ?? '',
      )
      if (text === 'full-stack-developer') sawFullString = true
      lengths.push(text.length)
      await page.waitForTimeout(200)
    }

    let grew = false
    let shrank = false
    for (let i = 1; i < lengths.length; i += 1) {
      if (lengths[i] > lengths[i - 1]) grew = true
      if (lengths[i] < lengths[i - 1]) shrank = true
    }

    const forScreenReaders = await page.evaluate(
      () => document.querySelector('a[href="#top"] .sr-only')?.textContent?.trim() ?? '',
    )

    sawFullString && grew && shrank && forScreenReaders === 'full-stack-developer'
      ? pass('typewriter: loops, and reads correctly to assistive tech')
      : fail(
          'typewriter: loops',
          `full=${sawFullString} grew=${grew} shrank=${shrank} sr="${forScreenReaders}"`,
        )
  }

  /*
   * The ghost numeral behind each section heading is the parallax a visitor
   * can actually see — the dot grid moves too, but at fifteen percent opacity
   * nobody can tell. If this stops moving, the effect is effectively gone.
   */
  {
    const ghostY = async (scrollTarget) => {
      await page.evaluate((y) => {
        document.documentElement.style.scrollBehavior = 'auto'
        window.scrollTo({ top: y, behavior: 'instant' })
      }, scrollTarget)
      await page.waitForTimeout(400)
      return page.evaluate(() => {
        const el = document.querySelector('#work header .will-change-transform')
        if (!el) return null
        return Math.round(new DOMMatrixReadOnly(getComputedStyle(el).transform).f)
      })
    }

    const workTop = await page.evaluate(
      () => Math.round(document.getElementById('work').getBoundingClientRect().top + window.scrollY),
    )
    const before = await ghostY(Math.max(0, workTop - 600))
    const after = await ghostY(workTop + 200)

    before !== null && after !== null && Math.abs(after - before) > 15
      ? pass('parallax: section numeral drifts against the page', `${before}px -> ${after}px`)
      : fail('parallax: section numeral drifts', `${before} -> ${after}`)
  }

  /*
   * Parallax. This silently did nothing once already — useScroll resolved the
   * enclosing overflow-hidden section as its scroll container and pinned
   * progress at zero, which looks exactly like a page with no effect at all.
   * Assert the layers actually move, and move by different amounts.
   */
  {
    const translateY = (selector) =>
      page.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (!el) return null
        const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
        return Math.round(matrix.f)
      }, selector)

    /*
     * Setting scrollTop and reading straight back is unreliable here — the
     * position sometimes has not settled by the time the next evaluate runs,
     * which made this check compare two identical clamped values and "pass"
     * a completely static page. Wait until the browser agrees where it is.
     */
    const scrollToY = async (target) => {
      await page.evaluate((y) => {
        document.documentElement.style.scrollBehavior = 'auto'
        window.scrollTo({ top: y, behavior: 'instant' })
      }, target)

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const at = await page.evaluate(() => Math.round(window.scrollY))
        if (Math.abs(at - target) <= 2) return at
        await page.waitForTimeout(100)
      }
      return page.evaluate(() => Math.round(window.scrollY))
    }

    await scrollToY(0)
    await page.waitForTimeout(400)
    const restGrid = await translateY('#top .dot-grid')
    const restContent = await translateY('#top .dot-grid + div')

    await scrollToY(600)
    await page.waitForTimeout(600)
    const movedGrid = await translateY('#top .dot-grid')
    const movedContent = await translateY('#top .dot-grid + div')

    const gridMoved = Math.abs((movedGrid ?? 0) - (restGrid ?? 0)) > 20
    const contentMoved = Math.abs((movedContent ?? 0) - (restContent ?? 0)) > 10
    const differentRates = Math.abs((movedGrid ?? 0) - (movedContent ?? 0)) > 20

    gridMoved && contentMoved && differentRates
      ? pass('parallax: layers move at different rates', `grid ${movedGrid}px, copy ${movedContent}px`)
      : fail(
          'parallax: layers move at different rates',
          `grid ${restGrid}->${movedGrid}, copy ${restContent}->${movedContent}`,
        )
  }

  /*
   * The scroll-brightened prose. Its failure mode is text that never finishes
   * lightening — a paragraph left permanently at 28% opacity, which reads as
   * broken rather than stylish. After scrolling past, every word must be full.
   */
  {
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto'
      const about = document.getElementById('about')
      about?.scrollIntoView({ block: 'start' })
      await new Promise((r) => setTimeout(r, 300))
      window.scrollBy(0, about?.getBoundingClientRect().height ?? 1200)
      await new Promise((r) => setTimeout(r, 900))
    })

    const dim = await page.evaluate(() =>
      [...document.querySelectorAll('#about span')]
        .filter((el) => {
          const opacity = Number(getComputedStyle(el).opacity)
          return opacity > 0 && opacity < 0.9 && (el.textContent ?? '').trim().length > 1
        })
        .map((el) => (el.textContent ?? '').trim())
        .slice(0, 5),
    )

    dim.length === 0
      ? pass('scroll prose: every word reaches full opacity')
      : fail('scroll prose: words left dim after scrolling past', dim.join(' '))

    /*
     * Splitting a paragraph into per-word spans is an easy way to lose the
     * spaces between them — a flex container collapses them and the text
     * renders as one unreadable run. Catch it by looking for improbably long
     * unbroken strings.
     */
    const runTogether = await page.evaluate(() =>
      [...document.querySelectorAll('#about p')]
        .map((p) => (p.textContent ?? '').trim())
        .filter((text) => /\S{34,}/.test(text))
        .map((text) => text.slice(0, 60)),
    )

    runTogether.length === 0
      ? pass('scroll prose: words keep their spaces')
      : fail('scroll prose: words keep their spaces', runTogether.join(' | '))
  }

  /*
   * Collapsible sections. The trap here is a panel that is visually closed but
   * still in the accessibility tree — screen readers read it, Tab lands in it,
   * ctrl+F finds it. Every closed panel must be inert, every open one must not.
   */
  {
    const audit = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('button[aria-expanded]')].map((button) => {
          const panel = document.getElementById(button.getAttribute('aria-controls') ?? '')
          return {
            label: (button.textContent ?? '').trim().slice(0, 32),
            open: button.getAttribute('aria-expanded') === 'true',
            panelMissing: !panel,
            inert: panel?.hasAttribute('inert') ?? false,
          }
        }),
      )

    const atRest = await audit()
    const broken = atRest.filter((row) => row.panelMissing || row.open === row.inert)

    atRest.length > 0 && broken.length === 0
      ? pass('disclosure: closed panels are inert, open ones are not', `${atRest.length} panels`)
      : fail(
          'disclosure: closed panels are inert',
          broken.map((row) => `${row.label} open=${row.open} inert=${row.inert}`).join(' | ') ||
            'no collapsible panels found at all',
        )

    /*
     * Open and close one, then re-audit — an interrupted animation used to
     * leave a zero-height panel behind.
     *
     * Addressed by position, not by state: a selector like
     * [aria-expanded="false"] stops matching the moment it is clicked, so the
     * second click would land on a different element entirely.
     */
    const first = page.locator('#work button[aria-expanded]').nth(1)
    await first.scrollIntoViewIfNeeded()
    await first.click()
    await page.waitForTimeout(600)
    const opened = await first.getAttribute('aria-expanded')
    await first.click()
    await page.waitForTimeout(900)
    const closed = await first.getAttribute('aria-expanded')

    const afterToggle = await audit()
    const leaked = afterToggle.filter((row) => row.panelMissing || row.open === row.inert)

    opened === 'true' && closed === 'false' && leaked.length === 0
      ? pass('disclosure: opens, closes, and leaves nothing behind')
      : fail(
          'disclosure: opens, closes, and leaves nothing behind',
          `opened=${opened} closed=${closed} leaked=${leaked.length}`,
        )

    // Keyboard operable — it is a real button, so Enter must work.
    await first.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    const viaKeyboard = await first.getAttribute('aria-expanded')
    viaKeyboard === 'true'
      ? pass('disclosure: opens from the keyboard')
      : fail('disclosure: opens from the keyboard', `aria-expanded=${viaKeyboard}`)

    await first.click()
    await page.waitForTimeout(500)
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
    /*
     * Only count elements that actually widen the page. A layer deliberately
     * scaled past its frame — the parallaxing project covers, say — sticks out
     * of its own box but is clipped by an ancestor and scrolls nothing.
     */
    offenders: [...document.querySelectorAll('body *')]
      .filter((el) => {
        if (el.getBoundingClientRect().right <= window.innerWidth + 1) return false
        for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
          const overflowX = getComputedStyle(node).overflowX
          if (overflowX === 'hidden' || overflowX === 'clip') return false
        }
        return true
      })
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
  /*
   * The canvas cursor must decline on a touch device. A trail chasing a
   * pointer that does not exist is a permanently idle rAF loop eating battery
   * on a phone.
   */
  {
    const painted = await page.evaluate(async () => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return 'no canvas'
      document.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 120, clientY: 300, bubbles: true }),
      )
      await new Promise((r) => setTimeout(r, 300))
      const ctx = canvas.getContext('2d')
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let n = 0
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) n += 1
      return n
    })

    painted === 0 || painted === 'no canvas'
      ? pass('canvas cursor: stays idle on touch devices')
      : fail('canvas cursor: stays idle on touch devices', `${painted} pixels painted`)
  }

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

  /* Reduced motion means the cursor trail must not run either. */
  {
    const painted = await page.evaluate(async () => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return 'no canvas'
      for (let i = 0; i < 6; i += 1) {
        document.dispatchEvent(
          new PointerEvent('pointermove', { clientX: 200 + i * 60, clientY: 300, bubbles: true }),
        )
        await new Promise((r) => setTimeout(r, 60))
      }
      const ctx = canvas.getContext('2d')
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let n = 0
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) n += 1
      return n
    })

    painted === 0 || painted === 'no canvas'
      ? pass('canvas cursor: does not run under reduced motion')
      : fail('canvas cursor: does not run under reduced motion', `${painted} pixels painted`)
  }

  /* With reduced motion the prose must be plain text, not per-word spans. */
  const splitWords = await page.evaluate(
    () =>
      [...document.querySelectorAll('#about p')].filter(
        (p) => p.querySelectorAll('span').length > 5,
      ).length,
  )
  splitWords === 0
    ? pass('reduced motion: prose renders as plain paragraphs')
    : fail('reduced motion: prose renders as plain paragraphs', `${splitWords} still split`)

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
