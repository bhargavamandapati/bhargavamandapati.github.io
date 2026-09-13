/**
 * Recently-shipped topics and tutorials — drives the "New" badge on their
 * index cards.
 *
 * Add a line here whenever a brand-new page ships (not an enrichment of an
 * existing one), alongside the matching entry in `data/changelog.ts`. Each
 * entry ages out of the badge on its own after `NEW_BADGE_DAYS` — nothing
 * needs to be removed by hand.
 */

export type NewContentArea = 'learn' | 'sdv' | 'tutorials'

export type NewContentEntry = {
  area: NewContentArea
  /** Matches the page's own slug, e.g. "framework/custom-task-monitor". */
  slug: string
  /** ISO date the page shipped. */
  date: string
}

export const NEW_BADGE_DAYS = 21

export const newContent: NewContentEntry[] = [
  { area: 'tutorials', slug: 'framework/custom-task-monitor', date: '2026-09-13' },
  { area: 'learn', slug: 'connectivity/esim-provisioning', date: '2026-09-12' },
  { area: 'learn', slug: 'security/can-bus-security', date: '2026-09-12' },
  { area: 'learn', slug: 'car-framework/uds-diagnostics', date: '2026-09-12' },
  { area: 'learn', slug: 'platform-build/ci-device-flashing', date: '2026-09-12' },
]

export function isNewContent(area: NewContentArea, slug: string): boolean {
  const entry = newContent.find((e) => e.area === area && e.slug === slug)
  if (!entry) return false
  const ageMs = Date.now() - new Date(entry.date).getTime()
  return ageMs >= 0 && ageMs <= NEW_BADGE_DAYS * 24 * 60 * 60 * 1000
}
