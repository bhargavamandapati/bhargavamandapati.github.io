import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The mark on a locked item in a list.
 *
 * Small and consistent everywhere, because its job is to be recognised rather
 * than read: after the first one, a reader should be able to scan a list and
 * know what is open without stopping on each row.
 */
export function LockBadge({ className, label = 'Locked' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.65rem] text-subtle',
        className,
      )}
    >
      <Lock aria-hidden className="size-2.5" />
      <span className="sr-only">This topic requires access: </span>
      {label}
    </span>
  )
}

/** Wraps a locked row so it reads as unavailable rather than broken. */
export const lockedRowClass = 'opacity-55 saturate-50'
