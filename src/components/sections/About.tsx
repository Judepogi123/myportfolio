import { Section } from '@/components/ui/Section'
import { Disclosure } from '@/components/ui/Disclosure'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollRevealText } from '@/components/ui/ScrollRevealText'
import { about } from '@/data/profile'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      title="How I work"
      lead="Full-stack, end to end — and comfortable being the person accountable for whether it holds up."
    >
      {/* ---------------------------------------------- the pitch, and the facts -- */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {/* Brightens word by word on the way past, so the wall of prose has a pulse. */}
          <div className="space-y-7 text-lg leading-relaxed text-ink">
            {about.paragraphs.map((paragraph) => (
              <ScrollRevealText key={paragraph.slice(0, 24)} text={paragraph} />
            ))}
          </div>
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

      {/* ------------------------------------------------------------ principles -- */}
      {/*
        Three across instead of three stacked. Same words, a third of the
        vertical run, and the eye gets somewhere to go.
      */}
      <ul className="mt-16 grid gap-px bg-line sm:mt-20 md:grid-cols-3">
        {about.principles.map((principle, i) => (
          <Reveal as="li" key={principle.title} delay={i * 0.08} y={16} className="bg-canvas">
            <div className="group relative h-full overflow-hidden px-1 pb-7 pt-6 md:px-6">
              {/* Rule that draws across on hover — motion without elevation. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />

              <span
                aria-hidden
                className="block font-mono text-3xl font-medium tracking-[-0.04em] text-line-strong transition-colors duration-500 group-hover:text-accent sm:text-4xl"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-4 text-base font-medium text-ink sm:text-lg">
                {principle.title}
              </h3>

              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted transition-colors duration-300 group-hover:text-ink">
                {principle.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* ---------------------------------------------------------- capabilities -- */}
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
