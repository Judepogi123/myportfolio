import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { about } from '@/data/profile'

export function About() {
  return (
    <Section id="about" index="01" title="How I work">
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
          <Reveal delay={0.1}>
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
    </Section>
  )
}
