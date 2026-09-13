import { identity, navItems } from '@/data/profile'
import { ThemeToggle } from './ThemeToggle'

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
        <span className="hidden font-mono text-xs text-ink-faint sm:inline">
          {identity.role.toLowerCase().replace(/\s+/g, '-')}
        </span>
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
