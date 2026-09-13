import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { problems } from '@/data/profile'

export function Problems() {
  return (
    <Section
      id="problems"
      index="03"
      title="Three decisions worth explaining"
      lead="Short, because the interesting part is the reasoning — not the feature list."
    >
      <ul className="grid gap-px bg-line lg:grid-cols-3">
        {problems.map((problem, i) => (
          <Reveal as="li" key={problem.id} delay={i * 0.07} y={16} className="bg-canvas">
            <article className="group flex h-full flex-col px-5 py-7 transition-colors duration-300 hover:bg-surface sm:px-7 sm:py-8">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="rounded-md border border-line bg-raised px-2 py-[3px] font-mono text-[11px] tracking-tight text-ink-muted transition-colors duration-300 group-hover:border-accent-line group-hover:bg-accent-soft group-hover:text-accent">
                  {problem.tag}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-medium leading-snug tracking-[-0.015em] text-ink">
                {problem.title}
              </h3>

              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                {problem.problem}
              </p>

              <div className="mt-auto pt-6">
                <div className="border-t border-line pt-4">
                  <span className="label">Approach</span>
                  <p className="mt-2 text-base leading-relaxed text-ink">
                    {problem.solution}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
