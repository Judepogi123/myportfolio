/*
 * Full-page captures at four sizes, into ./screenshots. Also reports page
 * height, horizontal overflow and console errors per size.
 *
 *   npm run dev && npm run shots
 */
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const URL = process.env.URL ?? 'http://localhost:5173'
const OUT = process.env.OUT ?? 'screenshots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: process.env.CHANNEL ?? 'msedge' })

const jobs = [
  { name: 'desktop-dark',  width: 1440, height: 900, scheme: 'dark',  full: true },
  { name: 'desktop-light', width: 1440, height: 900, scheme: 'light', full: true },
  { name: 'mobile-dark',   width: 390,  height: 844, scheme: 'dark',  full: true },
  { name: 'tablet-light',  width: 820,  height: 1100, scheme: 'light', full: true },
]

for (const job of jobs) {
  const context = await browser.newContext({
    viewport: { width: job.width, height: job.height },
    deviceScaleFactor: 1,
    colorScheme: job.scheme,
  })
  const page = await context.newPage()

  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

  await page.goto(URL, { waitUntil: 'networkidle' })
  // Let every scroll-triggered reveal fire before capturing.
  await page.evaluate(async () => {
    const previous = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'

    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((r) => setTimeout(r, 900))
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 400))

    document.documentElement.style.scrollBehavior = previous
  })
  await page.waitForTimeout(700)

  await page.screenshot({ path: `${OUT}/${job.name}.png`, fullPage: job.full })

  const height = await page.evaluate(() => document.body.scrollHeight)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )
  console.log(
    `${job.name}: height=${height} horizontalOverflow=${overflow} errors=${errors.length}`,
  )
  if (errors.length) console.log('  ', errors.slice(0, 5).join(' | '))

  await context.close()
}

await browser.close()
