/**
 * The occupant-zone model behind the cockpit simulator.
 *
 * A zone ties a seat to its displays and to a user. Nearly every multi-display
 * bug in automotive comes from code that says "the display", "the user" or
 * "the current Activity" as though there were one of each — so the model here
 * keeps them separate and makes the wrong assumption visible.
 */

export type ZoneId = 'driver' | 'frontPassenger' | 'rearLeft' | 'rearRight'

export type DisplayKind = 'cluster' | 'centre' | 'passenger' | 'rear'

export type CockpitDisplay = {
  id: string
  kind: DisplayKind
  label: string
  /** Android display id, as getDisplayId() would report it. */
  displayId: number
  zone: ZoneId
  /** Driver-facing displays are the ones UX restrictions actually police. */
  driverFacing: boolean
}

export const displays: CockpitDisplay[] = [
  { id: 'cluster', kind: 'cluster', label: 'Instrument cluster', displayId: 1, zone: 'driver', driverFacing: true },
  { id: 'centre', kind: 'centre', label: 'Centre screen', displayId: 0, zone: 'driver', driverFacing: true },
  { id: 'passenger', kind: 'passenger', label: 'Front passenger', displayId: 2, zone: 'frontPassenger', driverFacing: false },
  { id: 'rearLeft', kind: 'rear', label: 'Rear left', displayId: 3, zone: 'rearLeft', driverFacing: false },
  { id: 'rearRight', kind: 'rear', label: 'Rear right', displayId: 4, zone: 'rearRight', driverFacing: false },
]

export type Zone = {
  id: ZoneId
  label: string
  /** VehicleAreaSeat constant name. */
  seat: string
  occupantZoneId: number
}

export const zones: Zone[] = [
  { id: 'driver', label: 'Driver', seat: 'SEAT_ROW_1_LEFT', occupantZoneId: 0 },
  { id: 'frontPassenger', label: 'Front passenger', seat: 'SEAT_ROW_1_RIGHT', occupantZoneId: 1 },
  { id: 'rearLeft', label: 'Rear left', seat: 'SEAT_ROW_2_LEFT', occupantZoneId: 2 },
  { id: 'rearRight', label: 'Rear right', seat: 'SEAT_ROW_2_RIGHT', occupantZoneId: 3 },
]

export type CockpitUser = { id: number; name: string; kind: 'system' | 'full' | 'guest' }

export const users: CockpitUser[] = [
  { id: 0, name: 'System (headless)', kind: 'system' },
  { id: 10, name: 'Driver profile', kind: 'full' },
  { id: 11, name: 'Second profile', kind: 'full' },
  { id: 12, name: 'Guest', kind: 'guest' },
]

/** What an app might be showing on a display. */
export type AppKind = 'media' | 'navigation' | 'video' | 'settings' | 'cluster' | 'none'

export const apps: { kind: AppKind; label: string; distractionOptimised: boolean }[] = [
  { kind: 'cluster', label: 'Cluster view', distractionOptimised: true },
  { kind: 'navigation', label: 'Navigation', distractionOptimised: true },
  { kind: 'media', label: 'Media browser', distractionOptimised: true },
  { kind: 'settings', label: 'Settings', distractionOptimised: false },
  { kind: 'video', label: 'Video player', distractionOptimised: false },
  { kind: 'none', label: 'Nothing running', distractionOptimised: true },
]

export type CockpitState = {
  /** Foreground user. User 0 stays running headless regardless. */
  foregroundUser: number
  /** Which user each non-driver zone is assigned to. */
  zoneUser: Record<ZoneId, number>
  occupied: Record<ZoneId, boolean>
  running: Record<string, AppKind>
  brightness: Record<string, number>
  speed: number
  nightMode: boolean
  /** Launch target for the demonstration, and whether a display was named. */
  launchDisplay: string
  nameTheDisplay: boolean
}

export const initialCockpit: CockpitState = {
  foregroundUser: 10,
  zoneUser: { driver: 10, frontPassenger: 11, rearLeft: 12, rearRight: 12 },
  occupied: { driver: true, frontPassenger: false, rearLeft: false, rearRight: false },
  running: {
    cluster: 'cluster',
    centre: 'navigation',
    passenger: 'video',
    rearLeft: 'none',
    rearRight: 'none',
  },
  brightness: { cluster: 80, centre: 70, passenger: 70, rearLeft: 60, rearRight: 60 },
  speed: 0,
  nightMode: false,
  launchDisplay: 'centre',
  nameTheDisplay: true,
}

/**
 * UX restrictions, derived from speed the way CarUxRestrictionsManager does.
 * Only driver-facing displays are policed — a rear passenger may watch a film.
 */
export function restrictionsFor(speed: number) {
  const moving = speed > 0.1
  return {
    moving,
    noVideo: moving,
    noSetup: moving,
    limitContent: moving,
    /** Maximum list items a restricted screen may show. */
    maxItems: moving ? 9 : Infinity,
    maxTextLength: moving ? 120 : Infinity,
  }
}
