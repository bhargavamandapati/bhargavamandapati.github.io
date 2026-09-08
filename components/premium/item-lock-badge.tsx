'use client'

import { isFree, realmOf, type GatedArea } from '@/data/access'
import { useRealmUnlocked } from '@/lib/use-realm-unlocked'
import { LockBadge } from '@/components/premium/lock-badge'

/**
 * The badge on a section index card.
 *
 * The card itself is server-rendered and always a real link — these index
 * pages never made a locked card inert, only the sidebar and the property
 * browser do that — so the only thing that needs the visitor's own browser
 * state is whether the badge should still be there at all.
 */
export function ItemLockBadge({
  area,
  slug,
  className,
}: {
  area: GatedArea
  slug: string
  className?: string
}) {
  const unlocked = useRealmUnlocked(realmOf(area))
  if (isFree(area, slug) || unlocked) return null
  return <LockBadge className={className} />
}
