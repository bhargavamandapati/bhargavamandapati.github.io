'use client'

import { LockBadge } from '@/components/premium/lock-badge'
import { useRealmUnlocked } from '@/lib/use-realm-unlocked'

/**
 * The "N terms need a key" line above the locked glossary categories.
 *
 * A client component because it is the one piece of this page that has to
 * disagree with the server: the server has no way to know a given visitor
 * already holds a Learn AAOS key, so it always renders as if they don't.
 * useRealmUnlocked corrects that after hydration, the same way a sidebar row
 * or the header's own badge already do.
 */
export function GlossaryLockNotice({ count }: { count: number }) {
  const unlocked = useRealmUnlocked('learn')
  if (unlocked) return null

  return (
    <p className="mb-8 inline-flex items-center gap-2 text-sm text-muted">
      <LockBadge />
      The remaining {count} terms need a Learn AAOS key.
    </p>
  )
}
