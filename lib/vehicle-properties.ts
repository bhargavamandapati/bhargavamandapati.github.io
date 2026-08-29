import {
  AIDL_PATH,
  JAVA_PATH,
  vehicleProperties,
  propertyByName,
  type VehicleProperty,
} from '@/data/vehicle-properties'
import { csFile, csSearch } from '@/lib/aosp'

export { vehicleProperties, propertyByName, type VehicleProperty }

const HW_INTERFACES = `hardware/interfaces/${AIDL_PATH}`
const CAR_SERVICE = `packages/services/Car/${JAVA_PATH}`

/**
 * Deep link to the property's definition in VehicleProperty.aidl.
 *
 * Line-anchored, so it lands on the exact definition. Line numbers drift as
 * AOSP changes, which is what `codeSearchUrl` is for.
 */
export function aidlUrl(property: VehicleProperty): string {
  return csFile(HW_INTERFACES, property.aidlLine)
}

/** Deep link to the constant in car-lib, for properties in the public Car API. */
export function javaUrl(property: VehicleProperty): string | undefined {
  return property.javaLine === undefined ? undefined : csFile(CAR_SERVICE, property.javaLine)
}

/** Name search across AOSP — survives the line drift that anchors do not. */
export function codeSearchUrl(property: VehicleProperty): string {
  return csSearch(property.name)
}

/** The enum that constrains this property's values, when it declares one. */
export function dataEnumUrl(property: VehicleProperty): string | undefined {
  return property.dataEnum === undefined ? undefined : csSearch(property.dataEnum)
}

/** First sentence of the description, for list rows. */
export function summarise(property: VehicleProperty): string {
  // Take the opening paragraph first — many descriptions start with a bare noun
  // phrase and no full stop, so sentence-splitting alone runs into the next one.
  const paragraph = property.description.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim()
  const stop = paragraph.search(/\.\s|\.$/)
  const sentence = stop === -1 ? paragraph : paragraph.slice(0, stop + 1)
  return sentence.length > 180 ? sentence.slice(0, 177).trimEnd() + '…' : sentence
}

/**
 * Properties are named by a functional prefix — HVAC_*, EV_*, SEAT_* — which is
 * the axis people actually browse by, so it is derived rather than hand-curated.
 */
const PREFIX_GROUPS: { label: string; test: (name: string) => boolean }[] = [
  { label: 'Vehicle information', test: (n) => n.startsWith('INFO_') || n === 'VEHICLE_CURB_WEIGHT' || n.startsWith('GENERAL_SAFETY_REGULATION') },
  { label: 'Electric vehicle', test: (n) => n.startsWith('EV_') },
  { label: 'HVAC & climate', test: (n) => n.startsWith('HVAC_') },
  { label: 'Seats', test: (n) => n.startsWith('SEAT_') },
  { label: 'Steering & pedals', test: (n) => n.startsWith('STEERING_WHEEL_') || n.startsWith('ACCELERATOR_PEDAL') || n.startsWith('BRAKE_PEDAL') || n === 'VEHICLE_HORN_ENGAGED' },
  { label: 'ADAS & driver assistance', test: (n) => /^(ADAPTIVE_CRUISE|AUTOMATIC_EMERGENCY|BLIND_SPOT|CROSS_TRAFFIC|CRUISE_CONTROL|DRIVER_DROWSINESS|DRIVER_DISTRACTION|ELECTRONIC_STABILITY|EMERGENCY_LANE|FORWARD_COLLISION|HANDS_ON_DETECTION|LANE_|LOW_SPEED_|ULTRASONICS_SENSOR|VEHICLE_DRIVING_AUTOMATION)/.test(n) },
  { label: 'Performance & motion', test: (n) => n.startsWith('PERF_') || n.startsWith('WHEEL_TICK') },
  { label: 'Engine & powertrain', test: (n) => n.startsWith('ENGINE_') || n.startsWith('GEAR_') || n.startsWith('CURRENT_GEAR') || n.startsWith('PARKING_BRAKE') },
  { label: 'Fuel & energy', test: (n) => n.startsWith('FUEL_') || n.startsWith('RANGE_') || n.startsWith('DISTANCE_') || n.startsWith('INSTANTANEOUS_') },
  { label: 'Tyres, brakes & chassis', test: (n) => n.startsWith('TIRE_') || n.startsWith('CRITICALLY_LOW_TIRE') || n.startsWith('BRAKE_') || n.startsWith('ABS_') || n.startsWith('TRACTION_') || n.startsWith('IMPACT_') || n.startsWith('TRAILER_') || n.startsWith('VEHICLE_PASSIVE_SUSPENSION') },
  { label: 'Doors, windows & mirrors', test: (n) => n.startsWith('DOOR_') || n.startsWith('WINDOW_') || n.startsWith('MIRROR_') || n.startsWith('GLOVE_BOX_') },
  { label: 'Windshield & wipers', test: (n) => n.startsWith('WINDSHIELD_') },
  { label: 'Lights', test: (n) => n.includes('LIGHTS_') || n.startsWith('TURN_SIGNAL') },
  { label: 'Displays & HMI', test: (n) => n.startsWith('HW_') || n.startsWith('CLUSTER_') || n.startsWith('CABIN_') || n.startsWith('EVS_') || n.startsWith('PER_DISPLAY_') || n.startsWith('DISPLAY_') || n.startsWith('HEAD_UP_DISPLAY') || n.startsWith('CAMERA_SERVICE') },
  { label: 'Power & shutdown', test: (n) => n.startsWith('AP_POWER') || n.startsWith('POWER_') || n.startsWith('CURRENT_POWER_POLICY') || n.startsWith('SHUTDOWN_') || n.startsWith('IGNITION_') || n.startsWith('VEHICLE_IN_USE') },
  { label: 'Diagnostics & OBD2', test: (n) => n.startsWith('OBD2_') || n.startsWith('OBD_') || n.includes('DIAGNOSTIC') || n.startsWith('WATCHDOG') || n.startsWith('STORAGE_') || n === 'VHAL_HEARTBEAT' },
  { label: 'Time & clocks', test: (n) => n.endsWith('_EPOCH_TIME') || n === 'EXTERNAL_CAR_TIME' },
  { label: 'Users & security', test: (n) => n.startsWith('INITIAL_USER') || n.startsWith('SWITCH_USER') || n.startsWith('CREATE_USER') || n.startsWith('REMOVE_USER') || n.startsWith('USER_IDENTIFICATION') || n.startsWith('VALET_MODE') || n.startsWith('ELECTRONIC_TOLL_COLLECTION') },
  { label: 'Vehicle Map Service', test: (n) => n.startsWith('VEHICLE_MAP') || n.startsWith('VMS_') },
  { label: 'Platform & VHAL internals', test: (n) => n.startsWith('SUPPORTED_PROPERTY_IDS') || n.startsWith('SUPPORT_CUSTOMIZE') || n.startsWith('DISABLED_OPTIONAL_FEATURES') },
  { label: 'Units & display settings', test: (n) => n.endsWith('_DISPLAY_UNITS') },
  { label: 'External conditions', test: (n) => n.startsWith('ENV_') || n.startsWith('NIGHT_MODE') || n.startsWith('LOCATION_') },
]

export function categoryOf(property: VehicleProperty): string {
  return PREFIX_GROUPS.find((g) => g.test(property.name))?.label ?? 'Other'
}

export type PropertyCategory = { label: string; properties: VehicleProperty[] }

/** Every property, grouped by category. Categories with nothing in them are dropped. */
export function groupedProperties(): PropertyCategory[] {
  const byLabel = new Map<string, VehicleProperty[]>()
  for (const property of vehicleProperties) {
    const label = categoryOf(property)
    const bucket = byLabel.get(label)
    if (bucket) bucket.push(property)
    else byLabel.set(label, [property])
  }
  const ordered = [...PREFIX_GROUPS.map((g) => g.label), 'Other']
  return ordered
    .filter((label) => byLabel.has(label))
    .map((label) => ({ label, properties: byLabel.get(label)! }))
}

/** Slug used in the URL for a property's detail page. */
export function propertySlug(property: VehicleProperty | string): string {
  return (typeof property === 'string' ? property : property.name).toLowerCase().replace(/_/g, '-')
}

export function propertyBySlug(slug: string): VehicleProperty | undefined {
  return vehicleProperties.find((p) => propertySlug(p) === slug)
}

/** Compact shape sent to the browser for client-side filtering. */
export type PropertyRow = {
  name: string
  slug: string
  hex: string
  id: number
  area: string
  type: string
  access: string
  changeMode: string
  category: string
  summary: string
  inCarApi: boolean
  deprecated: boolean
}

export function propertyRows(): PropertyRow[] {
  return vehicleProperties.map((p) => ({
    name: p.name,
    slug: propertySlug(p),
    hex: p.hex,
    id: p.id,
    area: p.area,
    type: p.type,
    access: p.access ?? '—',
    changeMode: p.changeMode ?? '—',
    category: categoryOf(p),
    summary: summarise(p),
    inCarApi: p.javaLine !== undefined,
    deprecated: p.deprecated,
  }))
}

/** Human-readable decomposition of the 32-bit ID, for the detail page. */
export function decomposeId(property: VehicleProperty) {
  const h = (n: number) => '0x' + (n >>> 0).toString(16).padStart(8, '0')
  return [
    { label: 'Group', mask: h(0xf0000000), value: h(property.id & 0xf0000000), name: property.group },
    { label: 'Area', mask: h(0x0f000000), value: h(property.id & 0x0f000000), name: property.area },
    { label: 'Type', mask: h(0x00ff0000), value: h(property.id & 0x00ff0000), name: property.type },
    {
      label: 'Ordinal',
      mask: h(0x0000ffff),
      value: h(property.id & 0x0000ffff),
      name: '0x' + property.ordinal.toString(16),
    },
  ]
}
