import { contentId, realmOf, type GatedArea } from '@/data/access'
import { PremiumGate } from '@/components/premium/gate'

/**
 * The lock shown in place of an interactive tool.
 *
 * There is no article to decrypt here, so the gate runs in key-only mode: it
 * verifies the key against a small token and reloads, which is what lets the
 * tool mount.
 */
export function ToolLocked({ area, title }: { area: GatedArea; title: string }) {
  return (
    <PremiumGate contentId={contentId(area)} title={title} realm={realmOf(area)} mode="key-only" />
  )
}
