import { useId, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  Collapsible content.                                                       */
/*                                                                            */
/*  The panel is never unmounted — it animates between height 0 and auto and   */
/*  is marked `inert` when closed. Unmounting through AnimatePresence left a   */
/*  zero-height panel behind whenever an exit animation was interrupted, which */
/*  a screen reader would still happily read out. Keeping one element and      */
/*  letting `inert` remove it from the tab order and the accessibility tree    */
/*  has no such race.                                                          */
/* -------------------------------------------------------------------------- */

type CollapseProps = {
  open: boolean
  children: ReactNode
  id?: string
  labelledBy?: string
  className?: string
}

export function Collapse({ open, children, id, labelledBy, className }: CollapseProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      id={id}
      role={labelledBy ? 'region' : undefined}
      aria-labelledby={labelledBy}
      // Closed content must not be readable, focusable or findable.
      inert={!open}
      aria-hidden={!open}
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{
        duration: reduced ? 0 : 0.36,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: reduced ? 0 : 0.22 },
      }}
      className={cn('overflow-hidden', className)}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */

type DisclosureProps = {
  title: string
  children: ReactNode
  /** Small monospace marker to the left of the title. */
  marker?: string
  defaultOpen?: boolean
  /** Heading level the title should render as. */
  as?: 'h3' | 'h4'
  className?: string
}

export function Disclosure({
  title,
  children,
  marker,
  defaultOpen = false,
  as: Heading = 'h4',
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()
  const buttonId = useId()

  return (
    <div className={cn('group border-t border-line', className)}>
      <Heading>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start gap-4 py-5 text-left sm:gap-6"
        >
          {marker ? (
            <span
              aria-hidden
              className={cn(
                'mt-1 shrink-0 font-mono text-xs transition-colors duration-300',
                open ? 'text-accent' : 'text-ink-faint group-hover:text-accent',
              )}
            >
              {marker}
            </span>
          ) : null}

          <span
            className={cn(
              'flex-1 text-base font-medium text-ink transition-colors duration-300 sm:text-lg',
              !open && 'group-hover:text-accent',
            )}
          >
            {title}
          </span>

          <span
            aria-hidden
            className={cn(
              'mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
              open
                ? 'rotate-45 border-accent-line bg-accent-soft text-accent'
                : 'border-line text-ink-faint group-hover:border-line-strong group-hover:text-ink',
            )}
          >
            <Plus className="size-3.5" />
          </span>
        </button>
      </Heading>

      <Collapse open={open} id={contentId} labelledBy={buttonId}>
        <div
          className={cn(
            'pb-6 text-base leading-relaxed text-ink-muted',
            marker ? 'pl-[30px] sm:pl-[46px]' : '',
          )}
        >
          {children}
        </div>
      </Collapse>
    </div>
  )
}
