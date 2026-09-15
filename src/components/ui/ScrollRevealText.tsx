import { useRef, type ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'

/* -------------------------------------------------------------------------- */
/*  Prose that brightens word by word as it scrolls past.                      */
/*                                                                            */
/*  The resting state is dim but still legible — never invisible — so the      */
/*  paragraph reads fine if the effect never runs at all: no JavaScript, a     */
/*  stalled scroll, or a visitor who has asked for reduced motion.             */
/* -------------------------------------------------------------------------- */

const RESTING_OPACITY = 0.28

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [RESTING_OPACITY, 1])

  return (
    <motion.span style={{ opacity }} className="transition-none">
      {children}{' '}
    </motion.span>
  )
}

type ScrollRevealTextProps = {
  text: string
  className?: string
}

export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  /*
   * Finishes while the paragraph is still comfortably on screen — waiting for
   * it to reach the top would leave the last words dim on a short page.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.55'],
  })

  const words = text.split(' ')

  if (reduced) {
    return <p className={className}>{text}</p>
  }

  return (
    /*
     * Plain inline flow — no flex. A flex container makes every word a flex
     * item, and the space that separates them is collapsed away, which runs
     * the whole paragraph into one word.
     */
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        // Overlapping ranges keep the brightening continuous rather than steppy.
        const end = Math.min(1, start + 2 / words.length)

        return (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}
