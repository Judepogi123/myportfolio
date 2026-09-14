import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import { identity } from '@/data/profile'

export function Hero() {
  const reduced = useReducedMotion()

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0.3 : 0.85,
      delay: reduced ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  })

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-18 pt-18 sm:px-8 sm:pb-24 sm:pt-24 lg:px-12 lg:pb-28 lg:pt-28">
        <motion.p {...rise(0)} className="label">
          {identity.role} · Web, mobile &amp; desktop
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-6 max-w-4xl text-[2.125rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink sm:text-5xl sm:leading-[1.04] sm:tracking-[-0.038em] lg:text-6xl"
        >
          I build systems that
          <br className="hidden sm:block" />{' '}
          <span className="relative inline-block">
            have to keep working
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reduced ? 0 : 0.9,
                delay: reduced ? 0 : 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-accent/70"
            />
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.18)}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted"
        >
          {identity.lead}
        </motion.p>

        <motion.p
          {...rise(0.22)}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ink-faint"
        >
          {identity.proof}
        </motion.p>

        <motion.div {...rise(0.26)} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-xl border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-3 hover:border-accent hover:bg-accent"
          >
            See the work
            <ArrowDownRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>

          <a
            href={`mailto:${identity.email}`}
            className="inline-flex items-center rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong hover:bg-raised"
          >
            {identity.email}
          </a>
        </motion.div>

        <motion.p
          {...rise(0.32)}
          className="mt-10 font-mono text-xs text-ink-faint"
        >
          {identity.city} · {identity.availability}
        </motion.p>
      </div>
    </section>
  )
}
