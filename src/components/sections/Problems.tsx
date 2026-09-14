import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Collapse } from '@/components/ui/Disclosure'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { problems, type Problem } from '@/data/profile'
import { cn } from '@/lib/cn'

/*
 * The problem is the interesting half, so it stays open. The approach is the
 * answer — worth a beat of thinking before it appears, and worth not making
 * the section three times taller than it needs to be.
 */
function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <article className="group flex h-full flex-col bg-canvas px-5 py-7 transition-colors duration-300 hover:bg-surface sm:px-7 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-ink-faint">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="rounded-md border border-line bg-raised px-2 py-[3px] font-mono text-[11px] tracking-tight text-ink-muted transition-colors duration-300 group-hover:border-accent-line group-hover:bg-accent-soft group-hover:text-accent">
          {problem.tag}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-medium leading-snug tracking-[-0.015em] text-ink">
        {problem.title}
      </h3>

      <p className="mt-3 text-base leading-relaxed text-ink-muted">{problem.problem}</p>

      <div className="mt-auto pt-6">
        <div className="border-t border-line pt-4">
          <button
            type="button"
            aria-expanded={revealed}
            aria-controls={`approach-${problem.id}`}
            onClick={() => setRevealed((value) => !value)}
            className="-my-1.5 inline-flex items-center gap-2 rounded-md py-1.5 text-left font-mono text-xs font-medium uppercase tracking-[0.13em] text-ink-faint transition-colors duration-200 hover:text-accent"
          >
            {revealed ? 'Approach' : 'Show approach'}
            <ArrowRight
              aria-hidden
              className={cn(
                'size-3.5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                revealed ? 'rotate-90' : 'group-hover:translate-x-0.5',
              )}
            />
          </button>

          <Collapse open={revealed} id={`approach-${problem.id}`}>
            <p className="pt-3 text-base leading-relaxed text-ink">{problem.solution}</p>
          </Collapse>
        </div>
      </div>
    </article>
  )
}

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
            <ProblemCard problem={problem} index={i} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
