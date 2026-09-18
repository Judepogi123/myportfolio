import { useReducedMotion } from 'motion/react'
import { identity, navItems } from '@/data/profile'
import { useTypewriter } from '@/hooks/useTypewriter'
import { cn } from '@/lib/cn'
import { ThemeToggle } from './ThemeToggle'

const ROLE_SLUG = identity.role.toLowerCase().replace(/\s+/g, '-')

function TypedRole() {
  const reduced = useReducedMotion()
  const { typed } = useTypewriter(ROLE_SLUG, { enabled: !reduced })

  return (
    /*
     * Reserved width. The string types and erases on a loop, and letting the
     * box follow it would drag the whole brand lockup left and right forever.
     */
    <span
      className="hidden font-mono text-xs text-ink-faint sm:inline-block"
      style={{ minWidth: `${ROLE_SLUG.length}ch` }}
    >
      {/* The real text, for screen readers — never the half-typed version. */}
      <span className="sr-only">{ROLE_SLUG}</span>

      <span aria-hidden className="inline-flex items-center">
        {typed}
        <span
          className={cn(
            'ml-px inline-block h-[1em] w-[1px] translate-y-[0.1em] bg-accent',
            reduced ? 'opacity-0' : 'animate-caret',
          )}
        />
      </span>
    </span>
  )
}

/**
 * Sits in the flow at the top of the page and scrolls away with it.
 * Nothing here follows the visitor down the page.
 */
export function TopBar() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-6 sm:px-8 sm:pt-8 lg:px-12">
      <a href="#top" className="-my-2 flex items-baseline gap-2 rounded-sm py-2">
        <span className="text-sm font-semibold tracking-[-0.01em] text-ink">
          {identity.shortName}
        </span>
        <TypedRole />
      </a>

      <div className="flex items-center gap-1 sm:gap-2">
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </div>
  )
}
