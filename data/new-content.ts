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
  { area: 'learn', slug: 'audio/audio-control-hal', date: '2026-10-20' },
  { area: 'learn', slug: 'audio/bluetooth-audio-routing', date: '2026-10-20' },
  { area: 'learn', slug: 'audio/volume-dialog-and-callbacks', date: '2026-10-20' },
  { area: 'learn', slug: 'connectivity/car-dialer-app', date: '2026-10-20' },
  { area: 'learn', slug: 'connectivity/telecom-incallservice-chain', date: '2026-10-20' },
  { area: 'learn', slug: 'connectivity/hfp-client-state-machine', date: '2026-10-20' },
  { area: 'learn', slug: 'connectivity/pbap-contacts-sync', date: '2026-10-20' },
  { area: 'learn', slug: 'apps-media/voice-dialing-reference-assistant', date: '2026-10-20' },
  { area: 'learn', slug: 'cluster-displays/navigation-state-protobuf', date: '2026-10-20' },
  { area: 'learn', slug: 'cluster-displays/cluster-navigation-bridge', date: '2026-10-20' },
  { area: 'learn', slug: 'foundations/the-car-is-not-a-big-phone', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/open-source-licensing-and-compatibility', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/whos-who-in-an-aaos-programme', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/where-android-sits-in-the-vehicle', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/the-head-unit-hardware', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/aaos-among-automotive-operating-systems', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/safety-classes-in-a-nutshell', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/where-the-car-code-lives', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/partitions-treble-and-the-vendor-boundary', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/android-building-blocks-for-embedded-engineers', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/the-android-security-sandbox', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/the-services-behind-android-car', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/the-aaos-concept-map', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/your-first-hour-on-a-running-device', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/how-to-read-aosp-source', date: '2026-10-19' },
  { area: 'learn', slug: 'foundations/living-with-an-aosp-fork', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/surfaceflinger-hwc-multi-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/render-engine-deep-dive', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/gralloc-and-bufferqueue', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/hwc-composition-backends', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/protected-content-and-drm-buffers', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/choreographer-and-app-side-rendering', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/flag-secure-and-screenshots-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/vsync-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/insets-and-cutouts-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'graphics/graphics-topics-elsewhere', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/aaos-multi-display-overview', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/hvac-zones-vs-occupant-zones', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/app-control-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/app-lifecycle-display-removal', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/display-compatibility-mode', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/enabling-passenger-display-dynamic', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/enabling-passenger-display-static', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/input-routing-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/launcher-on-passenger-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/occupant-connection-cross-zone-apps', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/occupant-zone-config-deep-dive', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/occupant-zone-service-runtime', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/systemui-on-passenger-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/theming-per-display-app', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/ux-restrictions-per-display', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/audio-zones-overview', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/mdmu-concepts-hsum-vs-mumd', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/media-per-occupant-zone', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/permissions-and-selinux-for-mdmu', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/per-user-data-isolation', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/per-zone-user-assignment', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/build-integration-product-config', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/common-pitfalls-and-troubleshooting', date: '2026-10-19' },
  { area: 'tutorials', slug: 'multi-display/debugging-and-adb-toolkit', date: '2026-10-19' },
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
