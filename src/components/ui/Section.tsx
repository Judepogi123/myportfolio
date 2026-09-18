import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Parallax } from './Parallax'
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
        {/*
          A large ghost numeral behind the heading, drifting against the page
          as it passes. This is the parallax you can actually see — a dot grid
          at nine percent opacity moves too, but nobody can tell.

          overflow-hidden is scoped to this header only: putting it on the
          section would break the `position: sticky` meta column in Work.
        */}
        <header className="relative mb-10 overflow-hidden sm:mb-14">
          <Parallax
            distance={120}
            className="pointer-events-none absolute -top-16 right-0 select-none sm:-top-24"
          >
            <span
              aria-hidden
              className="block font-mono text-[7rem] font-medium leading-none tracking-[-0.06em] text-line-strong/35 sm:text-[11rem] lg:text-[14rem]"
            >
              {index}
            </span>
          </Parallax>

          <Reveal className="relative">
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
          </Reveal>
        </header>

        {children}
      </div>
    </section>
  )
}
