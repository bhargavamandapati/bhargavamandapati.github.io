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
  { area: 'tutorials', slug: 'multi-display/aaos-multi-display-overview', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/hvac-zones-vs-occupant-zones', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/app-control-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/app-lifecycle-display-removal', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/display-compatibility-mode', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/enabling-passenger-display-dynamic', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/enabling-passenger-display-static', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/input-routing-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/launcher-on-passenger-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/occupant-connection-cross-zone-apps', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/occupant-zone-config-deep-dive', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/occupant-zone-service-runtime', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/systemui-on-passenger-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/theming-per-display-app', date: '2026-10-19' },
  { area: 'tutorials', slug: 'passenger-display/ux-restrictions-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'mdmu/audio-zones-overview', date: '2026-10-19' },
  { area: 'tutorials', slug: 'mdmu/mdmu-concepts-hsum-vs-mumd', date: '2026-10-19' },
  { area: 'tutorials', slug: 'mdmu/media-per-occupant-zone', date: '2026-10-19' },
  { area: 'tutorials', slug: 'mdmu/permissions-and-selinux-for-mdmu', date: '2026-10-19' },
  { area: 'tutorials', slug: 'mdmu/per-user-data-isolation', date: '2026-10-19' },
  { area: 'tutorials', slug: 'mdmu/per-zone-user-assignment', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display-debugging/build-integration-product-config', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display-debugging/common-pitfalls-and-troubleshooting', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display-debugging/debugging-and-adb-toolkit', date: '2026-10-19' },
  { area: 'sdv', slug: 'architecture/fail-operational-and-redundancy', date: '2026-09-14' },
  { area: 'sdv', slug: 'communication/choosing-a-communication-pattern', date: '2026-09-14' },
  { area: 'sdv', slug: 'ivi/projection-and-phone-integration', date: '2026-09-14' },
  { area: 'sdv', slug: 'ivi/personalization-and-profiles', date: '2026-09-14' },
  { area: 'sdv', slug: 'delivery/model-based-development', date: '2026-09-14' },
  { area: 'sdv', slug: 'delivery/calibration-and-parameter-management', date: '2026-09-14' },
  { area: 'sdv', slug: 'safety-security/secure-boot-and-root-of-trust', date: '2026-09-14' },
  { area: 'sdv', slug: 'safety-security/threat-modeling-an-sdv', date: '2026-09-14' },
  { area: 'sdv', slug: 'end-to-end/bringing-a-sensor-online', date: '2026-09-14' },
  { area: 'learn', slug: 'car-framework/app-focus-arbitration', date: '2026-09-13' },
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
