import type { ReactNode } from 'react'
import { contentId, isFree, realmOf, type GatedArea } from '@/data/access'
import { shouldRenderBody } from '@/lib/premium'
import { PremiumGate } from '@/components/premium/gate'

/**
 * Wraps anything that needs a key.
 *
 * The marker goes on this wrapper rather than an outer element so that whatever
 * sits alongside the content — an audio player, a page header — survives an
 * unlock rather than being replaced by it.
 *
 * When the body is not rendered, it is genuinely not rendered: the children are
 * never evaluated, so nothing about them reaches the RSC payload either. The
 * separate harvest build is where the encrypted copy comes from.
 */
export function Gated({
  area,
  slug,
  title,
  children,
  className,
  locked: lockedOverride,
}: {
  area: GatedArea
  slug?: string
  title: string
  children: ReactNode
  className?: string
  /**
   * Forces the lock on regardless of the policy.
   *
   * Needed where a page is partly open: the glossary answers "is this area
   * free?" with yes, so that the page renders at all, but the block holding the
   * terms that are not in the trial still has to be encrypted.
   */
  locked?: boolean
}) {
  const locked = lockedOverride ?? !isFree(area, slug)
  const id = contentId(area, slug)

  return (
    <>
      <div data-premium-body data-premium={locked ? id : undefined} className={className}>
        {shouldRenderBody(locked) && children}
      </div>
      {locked && <PremiumGate contentId={id} title={title} realm={realmOf(area)} />}
    </>
  )
}
