import { motion, useScroll, useSpring } from 'motion/react'

/**
 * The only fixed element on the page: a 2px reading indicator.
 * No bar, no floating nav — just how far down you are.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
    />
  )
}
