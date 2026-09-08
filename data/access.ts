/**
 * Which material is open, which needs a key, and which key.
 *
 * Two keys rather than one. Learn AAOS and everything built around it — the
 * tutorials, the property reference, the simulators, the glossary — is one
 * body of work; the SDV track is another, and someone may want only one of
 * them. Holding a key for one says nothing about the other.
 *
 * The rule is inverted on purpose: material is locked unless it is listed here.
 * Adding a topic should not silently give it away, and the free list is short
 * enough to review at a glance.
 *
 * Blog posts are never locked. They are how anyone arrives in the first place,
 * and a locked front door has nothing behind it.
 */

/** The two independently purchasable bodies of work. */
export type Realm = 'learn' | 'sdv'

/** Everything that can be locked, and which realm's key opens it. */
export type GatedArea =
  | 'learn'
  | 'tutorials'
  | 'properties'
  | 'simulator'
  | 'cockpit'
  | 'glossary'
  | 'sdv'

const REALM_OF: Record<GatedArea, Realm> = {
  learn: 'learn',
  tutorials: 'learn',
  properties: 'learn',
  simulator: 'learn',
  cockpit: 'learn',
  glossary: 'learn',
  sdv: 'sdv',
}

export const REALM_LABEL: Record<Realm, string> = {
  learn: 'Learn AAOS',
  sdv: 'Software-defined vehicles',
}

/** Areas whose items are listed individually, so some can be free. */
type TopicArea = Extract<GatedArea, 'learn' | 'sdv' | 'tutorials' | 'properties'>

/**
 * The trial. A reader should be able to judge whether the rest is worth asking
 * for, so these are whole topics rather than truncated ones — the foundations
 * everything else assumes, plus one entry point per track.
 */
export const FREE_TOPICS: Record<TopicArea, string[]> = {
  learn: [
    'foundations/what-is-aaos',
    'foundations/architecture-overview',
    'foundations/boot-sequence',
  ],
  sdv: ['architecture/service-oriented-architecture'],
  tutorials: ['apps-ui/custom-rro'],
  /**
   * Four properties, chosen to demonstrate the shape of the reference rather
   * than to be useful on their own: a sensor, a gated feature, an enum, and a
   * level. Between them they show the value types, the permission model and a
   * dependency, which is what a reader is really evaluating.
   */
  properties: [
    'perf-vehicle-speed',
    'hvac-power-on',
    'gear-selection',
    'ev-battery-level',
  ],
}

/**
 * Glossary terms readable without a key.
 *
 * These are the words that appear in the free topics, so the trial reads
 * properly: meeting an undefined term in the first paragraph of a sample is a
 * poor advertisement for a glossary.
 */
export const FREE_GLOSSARY_TERMS = ['AAOS', 'VHAL', 'AOSP', 'OEM', 'ECU', 'Android Auto']

/**
 * Simulator controls usable without a key, named by the property behind them.
 *
 * A simulator you cannot touch demonstrates nothing, so the trial keeps the
 * ones that actually move the car — drive it, change gear, watch the battery,
 * and turn on the HVAC that everything else in that panel depends on.
 */
export const FREE_SIMULATOR_PROPERTIES = [
  'PERF_VEHICLE_SPEED',
  'GEAR_SELECTION',
  'EV_BATTERY_LEVEL',
  'HVAC_POWER_ON',
  'PARKING_BRAKE_ON',
]

export function isFreeTerm(term: string): boolean {
  return FREE_GLOSSARY_TERMS.includes(term)
}

export function isFreeControl(property: string): boolean {
  return FREE_SIMULATOR_PROPERTIES.includes(property)
}

/** Areas that are locked as a whole — no per-item trial. */
const WHOLE_AREAS: GatedArea[] = ['cockpit']

export function realmOf(area: GatedArea): Realm {
  return REALM_OF[area]
}

/** True when this material is readable without a key. */
export function isFree(area: GatedArea, slug?: string): boolean {
  if (WHOLE_AREAS.includes(area)) return false
  // The glossary and the simulator are free in part: which parts is decided by
  // FREE_GLOSSARY_TERMS and FREE_SIMULATOR_PROPERTIES, item by item, so the
  // pages themselves open.
  if (area === 'glossary' || area === 'simulator') return true
  if (!slug) return false
  return FREE_TOPICS[area as TopicArea]?.includes(slug) ?? false
}

/** Stable identifier for a piece of encrypted content. */
export function contentId(area: GatedArea, slug?: string): string {
  return slug ? `${area}__${slug.replace(/\//g, '_')}` : area
}

export const access = {
  /** Where the encrypted payloads are served from. */
  payloadPath: '/premium',
  /** Storage key per realm, so one key never implies the other. */
  storageKey: (realm: Realm) => `bm:access-key:${realm}`,
  freeCount: Object.values(FREE_TOPICS).reduce((n, list) => n + list.length, 0),
  /**
   * Whether a locked item in a list can still be opened.
   *
   * Off means the card is inert: a reader sees the lock without a dead click.
   * On means it opens the topic's own lock screen, which is where the request
   * link lives. Flip this if the greyed-out lists read as broken rather than
   * gated.
   */
  lockedCardsClickable: false,
} as const
