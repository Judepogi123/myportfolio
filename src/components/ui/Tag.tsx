import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type TagProps = {
  children: ReactNode
  tone?: 'neutral' | 'accent'
  className?: string
}

export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-[3px] font-mono text-xs tracking-tight transition-colors duration-200',
        tone === 'accent'
          ? 'border-accent-line bg-accent-soft text-accent'
          : 'border-line bg-raised text-ink-muted hover:border-line-strong hover:text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
