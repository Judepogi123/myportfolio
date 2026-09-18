import { useEffect, type RefObject } from 'react'

/* -------------------------------------------------------------------------- */
/*  Canvas cursor — the spring-chain trail from Cursify, rewritten.            */
/*                                                                            */
/*  Same effect: a set of node chains that spring toward the pointer, each     */
/*  drawn as a smoothed quadratic curve. The original is `@ts-nocheck` and     */
/*  carries a few faults that matter on a real site, all fixed here:           */
/*                                                                            */
/*    · it called preventDefault on every touchmove, which stops the page      */
/*      scrolling on a phone entirely                                          */
/*    · its blur handler set running = true, so the loop never paused and      */
/*      kept burning frames in a background tab                                */
/*    · cleanup removed freshly-created closures rather than the listeners it  */
/*      actually added, so nothing was ever detached                           */
/*    · the canvas ignored devicePixelRatio, so the trail was blurry           */
/*                                                                            */
/*  It also honours reduced motion, skips touch-only devices, and follows the  */
/*  page's own accent colour rather than cycling through rainbow hues.         */
/* -------------------------------------------------------------------------- */

type Options = {
  /** How many chains trail the pointer. */
  trails?: number
  /** Nodes per chain — longer means a lazier tail. */
  size?: number
  friction?: number
  dampening?: number
  tension?: number
  /**
   * Cycle hue like the original instead of using the site accent.
   * Off by default: a rainbow trail fights a one-accent palette.
   */
  rainbow?: boolean
}

type Config = {
  trails: number
  size: number
  friction: number
  dampening: number
  tension: number
}

const DEFAULTS: Config = {
  trails: 20,
  size: 50,
  friction: 0.5,
  dampening: 0.25,
  tension: 0.98,
}

class Node {
  x = 0
  y = 0
  vx = 0
  vy = 0
}

/** Slow sine used for the colour cycle. */
class Oscillator {
  private phase: number
  private readonly offset: number
  private readonly frequency: number
  private readonly amplitude: number
  private current = 0

  constructor(phase: number, offset: number, frequency: number, amplitude: number) {
    this.phase = phase
    this.offset = offset
    this.frequency = frequency
    this.amplitude = amplitude
  }

  update(): number {
    this.phase += this.frequency
    this.current = this.offset + Math.sin(this.phase) * this.amplitude
    return this.current
  }
}

class Line {
  private readonly spring: number
  private readonly friction: number
  private readonly nodes: Node[] = []

  constructor(spring: number, config: Config, origin: { x: number; y: number }) {
    this.spring = spring + 0.1 * Math.random() - 0.02
    this.friction = config.friction + 0.01 * Math.random() - 0.002

    for (let i = 0; i < config.size; i += 1) {
      const node = new Node()
      node.x = origin.x
      node.y = origin.y
      this.nodes.push(node)
    }
  }

  update(pointer: { x: number; y: number }, config: Config): void {
    let spring = this.spring
    const head = this.nodes[0]
    if (!head) return

    head.vx += (pointer.x - head.x) * spring
    head.vy += (pointer.y - head.y) * spring

    for (let i = 0; i < this.nodes.length; i += 1) {
      const node = this.nodes[i]
      if (!node) continue

      if (i > 0) {
        const previous = this.nodes[i - 1]
        if (previous) {
          node.vx += (previous.x - node.x) * spring
          node.vy += (previous.y - node.y) * spring
          node.vx += previous.vx * config.dampening
          node.vy += previous.vy * config.dampening
        }
      }

      node.vx *= this.friction
      node.vy *= this.friction
      node.x += node.vx
      node.y += node.vy

      spring *= config.tension
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const first = this.nodes[0]
    if (!first) return

    let x = first.x
    let y = first.y

    ctx.beginPath()
    ctx.moveTo(x, y)

    let i = 1
    for (; i < this.nodes.length - 2; i += 1) {
      const node = this.nodes[i]
      const next = this.nodes[i + 1]
      if (!node || !next) break

      x = 0.5 * (node.x + next.x)
      y = 0.5 * (node.y + next.y)
      ctx.quadraticCurveTo(node.x, node.y, x, y)
    }

    const node = this.nodes[i]
    const next = this.nodes[i + 1]
    if (node && next) ctx.quadraticCurveTo(node.x, node.y, next.x, next.y)

    ctx.stroke()
    ctx.closePath()
  }
}

export function useCanvasCursor(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: Options = {},
): void {
  const { rainbow = false, ...overrides } = options

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* A trail that follows a pointer makes no sense without one, and reduced
       motion is an explicit request not to animate. */
    const wantsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!wantsMotion || !hasPointer) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const config = { ...DEFAULTS, ...overrides }
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const oscillator = new Oscillator(Math.random() * 2 * Math.PI, 285, 0.0015, 85)

    let lines: Line[] = []
    let running = true

    /* Theme-dependent values, cached. Reading them per frame would force a
       style recalculation sixty times a second. */
    let dark = document.documentElement.classList.contains('dark')
    let accent = '#7aa2ff'

    const readTheme = () => {
      dark = document.documentElement.classList.contains('dark')
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim()
      if (value) accent = value
    }

    const buildLines = () => {
      lines = []
      for (let i = 0; i < config.trails; i += 1) {
        lines.push(new Line(0.4 + (i / config.trails) * 0.025, config, pointer))
      }
    }

    /* Retina-aware sizing: back the canvas with real pixels, then scale the
       drawing context so coordinates stay in CSS pixels. */
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const strokeStyle = () => {
      const hue = Math.round(oscillator.update())
      return rainbow ? `hsla(${hue}, 50%, 50%, 0.2)` : accent
    }

    const render = () => {
      if (!running) return

      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      /* Additive blending only reads against a dark ground; on the light
         theme it would wash out, so composite normally there. */
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      ctx.globalAlpha = rainbow ? 1 : dark ? 0.22 : 0.14
      ctx.strokeStyle = strokeStyle()
      ctx.lineWidth = 1

      for (const line of lines) {
        line.update(pointer, config)
        line.draw(ctx)
      }

      ctx.globalAlpha = 1
      window.requestAnimationFrame(render)
    }

    // Read-only: never preventDefault here, or the page stops scrolling.
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const start = () => {
      if (running) return
      running = true
      window.requestAnimationFrame(render)
    }

    const stop = () => {
      running = false
    }

    /*
     * Only a hidden tab pauses the loop. Binding to window blur as well looks
     * sensible and is not: a window can be visible while unfocused — another
     * app has focus, or devtools does — and the trail would sit frozen under a
     * pointer that is plainly still moving over it.
     */
    const onVisibility = () => (document.hidden ? stop() : start())

    readTheme()
    resize()
    buildLines()
    window.requestAnimationFrame(render)

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    /* The theme toggle swaps a class on <html>; pick the new accent up then. */
    const themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      themeObserver.disconnect()
      running = false
      document.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [canvasRef, rainbow, options.trails, options.size, options.friction, options.dampening, options.tension])
}
