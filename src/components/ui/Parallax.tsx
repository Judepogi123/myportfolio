import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  Depth by moving layers at different rates.                                 */
/*                                                                            */
/*  Driven by window scroll against the element's own measured position,       */
/*  rather than useScroll's `target` option. `target` resolves a scroll         */
/*  container by walking up the tree, and every one of these layers lives      */
/*  inside a section with `overflow: hidden` — which gets picked as the        */
/*  container, never scrolls, and pins progress at zero forever. Measuring     */
/*  explicitly removes the guesswork.                                          */
/*                                                                            */
/*  Transform only, so nothing reflows while scrolling.                        */
/* -------------------------------------------------------------------------- */

type ParallaxProps = {
  children: ReactNode
  /**
   * Pixels the layer drifts over its full pass through the viewport.
   * Positive lags behind the page; negative leads it.
   */
  distance?: number
  /** Render as a span where a div would be invalid — inside a button, say. */
  as?: 'div' | 'span'
  className?: string
}

export function Parallax({ children, distance = 80, as = 'div', className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  /* Where this element sits in the document, and how far it travels. */
  const [range, setRange] = useState<[number, number]>([0, 1])

  useEffect(() => {
    const measure = () => {
      const node = ref.current
      if (!node) return

      const box = node.getBoundingClientRect()
      const top = box.top + window.scrollY

      // Enters the viewport at its bottom edge, leaves past its top.
      const start = top - window.innerHeight
      const end = top + box.height
      setRange([start, Math.max(end, start + 1)])
    }

    measure()

    const observer = new ResizeObserver(measure)
    if (ref.current) observer.observe(ref.current)
    window.addEventListener('resize', measure)

    // The page grows as scroll-reveals fire; re-measure once things settle.
    const settle = window.setTimeout(measure, 800)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.clearTimeout(settle)
    }
  }, [])

  const y = useTransform(scrollY, range, [-distance / 2, distance / 2], {
    clamp: true,
  })

  const Tag = as === 'span' ? motion.span : motion.div

  if (reduced) {
    return as === 'span' ? (
      <span className={className}>{children}</span>
    ) : (
      <div className={className}>{children}</div>
    )
  }

  return (
    <Tag
      ref={ref as never}
      style={{ y }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </Tag>
  )
}
