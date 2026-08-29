'use client'

import { Check, Circle } from 'lucide-react'
import { useProgress } from './progress'
import { cn } from '@/lib/utils'

/** The control at the foot of a topic that records it as read. */
export function MarkRead({ href }: { href: string }) {
  const { isRead, toggle, ready } = useProgress()
  const done = isRead(href)

  return (
    <button
      type="button"
      onClick={() => toggle(href)}
      aria-pressed={ready ? done : undefined}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors',
        done
          ? 'border-accent/50 bg-accent-soft text-accent'
          : 'border-line text-muted hover:border-line-strong hover:text-fg',
      )}
    >
      {done ? <Check aria-hidden className="size-4" /> : <Circle aria-hidden className="size-4" />}
      {done ? 'Marked as read' : 'Mark as read'}
    </button>
  )
}
