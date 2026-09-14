import { Section } from '@/components/ui/Section'
import { Disclosure } from '@/components/ui/Disclosure'
import { Reveal } from '@/components/ui/Reveal'
import { about } from '@/data/profile'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      title="How I work"
      lead="Full-stack, end to end — and comfortable being the person accountable for whether it holds up."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="space-y-6 text-lg leading-relaxed text-ink-muted">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <ul className="mt-12">
            {about.principles.map((principle, i) => (
              <Reveal as="li" key={principle.title} delay={0.06 + i * 0.08} y={14}>
                <div className="group border-t border-line py-6 transition-colors duration-300">
                  <div className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-5 shrink-0 bg-line-strong transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-8 group-hover:bg-accent"
                    />
                    <div className="min-w-0">
                      <h3 className="text-base font-medium text-ink">{principle.title}</h3>
                      <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-muted">
                        {principle.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.1} className="lg:sticky lg:top-8">
            <dl className="divide-y divide-line rounded-2xl border border-line bg-surface/60">
              {about.facts.map((row) => (
                <div key={row.term} className="px-5 py-4">
                  <dt className="label">{row.term}</dt>
                  <dd className="mt-2">
                    <span className="block text-sm font-medium text-ink">{row.detail}</span>
                    <span className="mt-0.5 block text-xs text-ink-faint">{row.sub}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Range, stated plainly — the part a résumé bullet list buries. */}
      <div className="mt-16 border-t border-line pt-10 sm:mt-20 sm:pt-12">
        <Reveal>
          <div className="flex items-baseline gap-3">
            <h3 className="text-lg font-medium tracking-[-0.015em] text-ink">
              What I take on
            </h3>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </div>
        </Reveal>

        {/* Six headings read in a glance; the evidence for each is one tap away. */}
        <div className="mt-6 grid gap-x-12 sm:grid-cols-2">
          {about.capabilities.map((capability, i) => (
            <Reveal key={capability.title} delay={i * 0.04} y={14}>
              <Disclosure
                title={capability.title}
                marker={String(i + 1).padStart(2, '0')}
                className="h-full"
              >
                <p className="max-w-lg">{capability.body}</p>
              </Disclosure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
