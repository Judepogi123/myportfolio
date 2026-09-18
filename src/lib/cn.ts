import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins class names and resolves Tailwind conflicts, so a later `px-6` wins
 * over an earlier `px-4` instead of both landing in the DOM. Same signature
 * Cursify and shadcn components expect.
 */
export function cn(...values: ClassValue[]): string {
  return twMerge(clsx(values))
}

export type { ClassValue }
