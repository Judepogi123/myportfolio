import { ArrowUpRight, Copy, Check } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Parallax } from '@/components/ui/Parallax'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/contact/ContactForm'
import { contactLinks, identity } from '@/data/profile'

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(identity.email)
    } catch {
      // Clipboard blocked (insecure context or denied) — fall back to a
      // selection the visitor can copy by hand.
      const range = document.createRange()
      const node = document.getElementById('contact-email')
      if (node) {
        range.selectNodeContents(node)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      return
    }

    setCopied(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-line-strong hover:bg-raised hover:text-ink"
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
      {copied ? (
        <Check aria-hidden className="size-4 text-accent" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
    </button>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      {/* Same lag as the hero, so the page opens and closes on the same note. */}
      <Parallax distance={110} className="pointer-events-none absolute -inset-y-28 inset-x-0">
        <div
          aria-hidden
          className="dot-grid size-full [mask-image:linear-gradient(to_top,black,transparent_72%)]"
        />
      </Parallax>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="label">06</span>
            <span aria-hidden className="h-px flex-1 bg-line sm:max-w-24" />
          </div>

          <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl">
            Have something that has to work
            <span className="text-ink-faint"> every working day?</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal delay={0.06}>
              <p className="max-w-md text-lg leading-relaxed text-ink-muted">
                I am open to remote work and happy to talk through a system you
                are planning, inheriting, or trying to rescue.
              </p>

              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
                Tell me roughly what you need and I will come back with whether
                I am the right person for it — and if I am not, who might be.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${identity.email}`}
                  className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong hover:bg-raised"
                >
                  Email instead
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <CopyEmailButton />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <ContactForm />
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.16}>
          <dl className="mt-14 grid gap-px bg-line sm:grid-cols-3">
            {contactLinks.map((link) => (
              <div key={link.id} className="bg-canvas px-5 py-5">
                <dt className="label">{link.label}</dt>
                <dd className="mt-2">
                  <a
                    href={link.href}
                    id={link.id === 'email' ? 'contact-email' : undefined}
                    className="link-underline inline-block py-1 text-sm font-medium text-ink"
                  >
                    {link.value}
                  </a>
                </dd>
              </div>
            ))}

            <div className="bg-canvas px-5 py-5">
              <dt className="label">Location</dt>
              <dd className="mt-2 text-sm font-medium text-ink">
                Philippines · GMT+8
                <span className="mt-0.5 block text-xs font-normal text-ink-faint">
                  {identity.availability}
                </span>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
