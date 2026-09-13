import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  index: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
}

export function Section({ id, index, title, lead, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('border-t border-line', className)}>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <Reveal>
          <header className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3">
              <span className="label">{index}</span>
              <span aria-hidden className="h-px flex-1 bg-line sm:max-w-24" />
            </div>

            <h2 className="mt-4 text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl">
              {title}
            </h2>

            {lead ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
                {lead}
              </p>
            ) : null}
          </header>
        </Reveal>

        {children}
      </div>
    </section>
  )
}
