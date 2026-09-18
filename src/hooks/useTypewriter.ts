import { useEffect, useRef, useState } from 'react'

/* -------------------------------------------------------------------------- */
/*  Types a string out, holds it, erases it, and goes again.                   */
/*                                                                            */
/*  One chain of timeouts rather than an interval, so each phase can have its  */
/*  own pace, and every pending timer is tracked and cleared on unmount — an   */
/*  orphaned loop would keep calling setState on a dead component forever.     */
/*                                                                            */
/*  The caller is expected to keep the real text in the document for screen    */
/*  readers; a string that types and erases on a loop is not something any     */
/*  assistive technology should be asked to follow.                            */
/* -------------------------------------------------------------------------- */

type Options = {
  /** Milliseconds per character while typing. */
  speed?: number
  /** Milliseconds per character while erasing — deletion reads faster. */
  eraseSpeed?: number
  /** How long the finished string sits before it is erased. */
  hold?: number
  /** Pause on the empty string before typing starts again. */
  restart?: number
  /** Wait before the very first character. */
  delay?: number
  /** Type once and stop. */
  loop?: boolean
  enabled?: boolean
}

export function useTypewriter(
  text: string,
  {
    speed = 55,
    eraseSpeed = 28,
    hold = 2400,
    restart = 600,
    delay = 500,
    loop = true,
    enabled = true,
  }: Options = {},
) {
  const [typed, setTyped] = useState(enabled ? '' : text)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setTyped(text)
      return
    }

    let cancelled = false
    let index = 0
    let erasing = false

    const schedule = (fn: () => void, ms: number) => {
      timer.current = window.setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
    }

    const tick = () => {
      if (cancelled) return

      if (!erasing) {
        index += 1
        setTyped(text.slice(0, index))

        if (index < text.length) return schedule(tick, speed)
        if (!loop) return

        erasing = true
        return schedule(tick, hold)
      }

      index -= 1
      setTyped(text.slice(0, index))

      if (index > 0) return schedule(tick, eraseSpeed)

      erasing = false
      schedule(tick, restart)
    }

    setTyped('')
    schedule(tick, delay)

    return () => {
      cancelled = true
      if (timer.current !== null) window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [text, speed, eraseSpeed, hold, restart, delay, loop, enabled])

  return { typed }
}
