import { ArrowUp } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { identity, navItems } from '@/data/profile'

export function Footer() {
  const reduced = useReducedMotion()

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
        {/* The page has no fixed nav, so the way back lives here. */}
        <nav aria-label="Sections" className="border-b border-line pb-8">
          <ul className="-my-2 flex flex-wrap gap-x-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group inline-flex items-baseline gap-2 py-2.5 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
                >
                  <span className="font-mono text-xs text-ink-faint transition-colors duration-200 group-hover:text-accent">
                    {item.index}
                  </span>
                  <span className="link-underline">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs leading-relaxed text-ink-faint">
            © {new Date().getFullYear()} {identity.name}
            <span aria-hidden className="mx-2 hidden sm:inline">
              ·
            </span>
            <span className="mt-1 block sm:mt-0 sm:inline">
              React, Vite and Tailwind CSS
            </span>
          </p>

          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
          >
            Back to top
            <ArrowUp
              aria-hidden
              className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  )
}
