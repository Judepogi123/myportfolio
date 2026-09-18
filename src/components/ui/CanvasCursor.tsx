import { useRef } from 'react'
import { useCanvasCursor } from '@/hooks/useCanvasCursor'
import { cn } from '@/lib/cn'

type CanvasCursorProps = {
  /** Cycle hue like the original Cursify component instead of the site accent. */
  rainbow?: boolean
  className?: string
}

/**
 * A pointer trail drawn on a full-viewport canvas. Sits under the reading
 * progress bar, never takes pointer events, and is hidden from assistive tech —
 * it is decoration, and the hook declines to run it on touch devices or when
 * reduced motion is requested.
 */
export function CanvasCursor({ rainbow = false, className }: CanvasCursorProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useCanvasCursor(ref, { rainbow })

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none fixed inset-0 z-30', className)}
    />
  )
}
