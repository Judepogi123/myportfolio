import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="group relative grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
    >
      <Sun
        aria-hidden
        className="absolute size-[17px] rotate-0 scale-100 opacity-100 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] dark:-rotate-90 dark:scale-50 dark:opacity-0"
      />
      <Moon
        aria-hidden
        className="absolute size-[17px] rotate-90 scale-50 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  )
}
