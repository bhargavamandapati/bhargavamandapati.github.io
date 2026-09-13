import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/** The mark on a just-shipped card — recognised at a glance, like LockBadge. */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span className={cn('new-badge', className)}>
      <Sparkles aria-hidden className="size-2.5" />
      <span className="sr-only">Recently added: </span>
      New
    </span>
  )
}
