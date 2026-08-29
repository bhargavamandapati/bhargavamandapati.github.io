import {
  AIDL_PATH,
  JAVA_PATH,
  vehicleProperties,
  propertyByName,
  type EnumDefinition,
  type PropertyRelation,
  type RelationKind,
  type VehicleProperty,
  valueEnums,
} from '@/data/vehicle-properties'
import { csFile, csSearch } from '@/lib/aosp'

export {
  vehicleProperties,
  propertyByName,
  valueEnums,
  type VehicleProperty,
  type PropertyRelation,
  type RelationKind,
  type EnumDefinition,
}

/**
 * Enum definitions a property's value is drawn from.
 *
 * State properties usually declare two: their own enum and ErrorState, because
 * the VHAL reports "why this is unavailable" through the value rather than
 * through an exception. A consumer that only handles the first will treat an
 * error code as a real state.
 */
export function enumsFor(property: VehicleProperty): EnumDefinition[] {
  return property.dataEnums.map((n) => valueEnums[n]).filter(Boolean)
}

/** True when members combine with bitwise OR rather than being exclusive. */
export function isBitFlags(definition: EnumDefinition): boolean {
  return /\bbit flags?\b/i.test(definition.description)
}

export type ValueExample = {
  /** What a getter would actually hand back. */
  literal: string
  /** What that value means. */
  meaning: string
  /** Conversion or context worth stating alongside it. */
  note?: string
}

/**
 * Plausible magnitudes per unit.
 *
 * These are illustrative, not values read from a vehicle — the point is to show
 * the shape and scale a caller should expect, since the unit alone does not
 * tell you whether a range is reported in metres or kilometres.
 */
const UNIT_EXAMPLES: Record<string, { value: string; note: string }> = {
  METER_PER_SEC: { value: '27.8', note: 'metres per second — about 100 km/h or 62 mph' },
  RPM: { value: '1850.0', note: 'revolutions per minute' },
  HERTZ: { value: '50.0', note: 'hertz' },
  PERCENT: { value: '62.5', note: 'per cent' },
  MILLIMETER: { value: '4500.0', note: 'millimetres — 4.5 metres' },
  METER: { value: '187000.0', note: 'metres — about 187 km' },
  KILOMETER: { value: '42350.5', note: 'kilometres' },
  MILE: { value: '26315.0', note: 'miles' },
  CELSIUS: { value: '21.5', note: 'degrees Celsius — always Celsius on the wire' },
  FAHRENHEIT: { value: '70.7', note: 'degrees Fahrenheit' },
  DEGREES: { value: '-12.5', note: 'degrees' },
  MILLILITER: { value: '45000.0', note: 'millilitres — 45 litres' },
  LITER: { value: '45.0', note: 'litres' },
  US_GALLON: { value: '11.9', note: 'US gallons' },
  IMPERIAL_GALLON: { value: '9.9', note: 'imperial gallons' },
  NANO_SECS: { value: '250000000', note: 'nanoseconds' },
  MILLI_SECS: { value: '1800000', note: 'milliseconds — 30 minutes' },
  SECS: { value: '1800', note: 'seconds — 30 minutes' },
  YEAR: { value: '2026', note: 'calendar year' },
  MILLIWATTS: { value: '11000.0', note: 'milliwatts — 11 watts' },
  WATT_HOUR: { value: '58000.0', note: 'watt-hours — a 58 kWh pack' },
  AMPERE_HOURS: { value: '160.0', note: 'ampere-hours' },
  KILOWATT_HOUR: { value: '58.0', note: 'kilowatt-hours' },
  AMPERE: { value: '32.0', note: 'amperes' },
  MILLIAMPERE: { value: '32000.0', note: 'milliamperes' },
  VOLT: { value: '400.0', note: 'volts' },
  MILLIVOLT: { value: '400000.0', note: 'millivolts' },
  KILOPASCAL: { value: '240.0', note: 'kilopascals — about 35 psi' },
  PSI: { value: '35.0', note: 'pounds per square inch' },
  BAR: { value: '2.4', note: 'bar' },
}

/** Picks the enum member a real vehicle is most likely to report. */
function representativeMember(definition: EnumDefinition) {
  const skip = /^(UNKNOWN|OTHER|SHOULD_NOT_USE|.*_UNKNOWN|OTHER_.*)$/
  return definition.members.find((m) => !skip.test(m.name)) ?? definition.members[0]
}

/** A concrete example of what this property returns, with what it means. */
export function valueExample(property: VehicleProperty): ValueExample | undefined {
  const enums = enumsFor(property)
  const primary = enums[0]

  if (primary && primary.name !== 'ErrorState') {
    const member = representativeMember(primary)
    if (member) {
      return {
        literal: member.value,
        meaning: `${primary.name}.${member.name}`,
        note: isBitFlags(primary)
          ? 'These are bit flags — a real value may combine several with bitwise OR.'
          : member.description.split('\n')[0] || undefined,
      }
    }
  }

  if (property.type === 'BOOLEAN') {
    return { literal: 'true', meaning: 'the feature is on or the condition holds' }
  }

  if (property.type === 'STRING') {
    if (property.name === 'INFO_VIN') {
      return { literal: '"1HGCM82633A004352"', meaning: 'a 17-character VIN' }
    }
    return { literal: '"…"', meaning: 'a free-form string; see the description for the expected format' }
  }

  if (/PERCENT/.test(property.name)) {
    return {
      literal: '62.5',
      meaning: 'a percentage',
      note: 'Reported on a 0 to 100 scale, not 0 to 1.',
    }
  }

  const unit = property.unit ? UNIT_EXAMPLES[property.unit] : undefined
  if (unit) {
    const isVec = property.type.endsWith('_VEC')
    return {
      literal: isVec ? `[${unit.value}, …]` : unit.value,
      meaning: isVec ? `several values, each in ${property.unit}` : `a value in ${property.unit}`,
      note: unit.note,
    }
  }

  if (property.type === 'INT32' || property.type === 'INT64') {
    return { literal: '0', meaning: 'an integer; the description defines what it counts' }
  }
  if (property.type === 'FLOAT') {
    return { literal: '0.0', meaning: 'a float; the description defines what it measures' }
  }
  if (property.type.endsWith('_VEC')) {
    return { literal: '[…]', meaning: 'an array; the description defines the element order' }
  }
  if (property.type === 'MIXED') {
    return {
      literal: '{ int32Values, floatValues, stringValue }',
      meaning: 'a mixture of types',
      note: 'The configArray declares how many values of each type and in what order.',
    }
  }
  if (property.type === 'BYTES') {
    return { literal: 'byte[]', meaning: 'raw bytes; the description defines the encoding' }
  }
  return undefined
}

/**
 * Sentences from the AIDL that constrain what a value may be.
 *
 * Pulled from the property's own documentation rather than paraphrased, so the
 * rule shown is the rule as written.
 */
export function valueRules(property: VehicleProperty): string[] {
  const CONSTRAINT =
    /(configArray|min(Float|Int32|Int64)Value|max(Float|Int32|Int64)Value|supportedEnumValues|HasSupportedValueInfo|hasSupportedValuesList|hasMinSupportedValue|must (be|return|communicate|not|always)|0 to 100|UNAVAILABLE|ErrorState)/

  return property.description
    .split(/\n\s*\n/)
    .flatMap((para) => para.replace(/\s+/g, ' ').split(/(?<=\.)\s+(?=[A-Z])/))
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 30 && sentence.length < 320 && CONSTRAINT.test(sentence))
    .slice(0, 6)
}

/**
 * How each relationship reads on the page.
 *
 * `strength` separates the relationships that change what you must *do* from
 * the ones that are only a documentation cross-reference — so a genuine
 * dependency is never buried among incidental mentions.
 */
export const RELATION_META: Record<
  RelationKind,
  { label: string; blurb: string; strength: 'dependency' | 'pairing' | 'reference' }
> = {
  requires: {
    label: 'Requires',
    blurb: 'Set this first, or the property below has no effect.',
    strength: 'dependency',
  },
  gates: {
    label: 'Gates',
    blurb: 'These may become UNAVAILABLE when this property is off.',
    strength: 'dependency',
  },
  'command-for': {
    label: 'Commands',
    blurb: 'Write here to act; read the state property to see the result.',
    strength: 'pairing',
  },
  'commanded-by': {
    label: 'Commanded by',
    blurb: 'Written to by this property to change behaviour.',
    strength: 'pairing',
  },
  toggles: {
    label: 'Enables',
    blurb: 'Must be enabled before the state property reports anything meaningful.',
    strength: 'dependency',
  },
  'toggled-by': {
    label: 'Enabled by',
    blurb: 'Reports nothing meaningful until this toggle is on.',
    strength: 'dependency',
  },
  'warns-for': {
    label: 'Warns for',
    blurb: 'This carries the warning; the sibling reports or controls the system.',
    strength: 'pairing',
  },
  'has-warning': {
    label: 'Warning property',
    blurb: 'The warning surfaced by this system.',
    strength: 'pairing',
  },
  'display-units': {
    label: 'Displayed using',
    blurb: 'The value is always reported in a fixed unit; this says how to render it.',
    strength: 'pairing',
  },
  formats: {
    label: 'Formats',
    blurb: 'Values whose display unit this property selects.',
    strength: 'pairing',
  },
  mentions: {
    label: 'References',
    blurb: 'Named in this property\u2019s own documentation.',
    strength: 'reference',
  },
  'mentioned-by': {
    label: 'Referenced by',
    blurb: 'Properties whose documentation names this one.',
    strength: 'reference',
  },
}

export type RelationGroup = {
  kind: RelationKind
  label: string
  blurb: string
  strength: 'dependency' | 'pairing' | 'reference'
  properties: VehicleProperty[]
}

/** Relations grouped by kind, dependencies first. */
export function relationGroups(property: VehicleProperty): RelationGroup[] {
  const byKind = new Map<RelationKind, VehicleProperty[]>()
  for (const rel of property.related) {
    const target = propertyByName.get(rel.name)
    if (!target) continue
    const bucket = byKind.get(rel.kind)
    if (bucket) bucket.push(target)
    else byKind.set(rel.kind, [target])
  }
  const rank = { dependency: 0, pairing: 1, reference: 2 }
  return [...byKind.entries()]
    .map(([kind, properties]) => ({ kind, ...RELATION_META[kind], properties }))
    .sort((a, b) => rank[a.strength] - rank[b.strength] || a.label.localeCompare(b.label))
}

/** True when a property has a relationship that changes how you must use it. */
export function hasDependency(property: VehicleProperty): boolean {
  return property.related.some((r) => RELATION_META[r.kind].strength === 'dependency')
}

/** Nodes for the relationship diagram — dependencies and pairings only. */
export function diagramRelations(
  property: VehicleProperty,
  limit = 8,
): { name: string; kind: RelationKind; label: string }[] {
  return property.related
    .filter((r) => RELATION_META[r.kind].strength !== 'reference')
    .slice(0, limit)
    .map((r) => ({ name: r.name, kind: r.kind, label: RELATION_META[r.kind].label }))
}

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
  /** Has a relationship that changes how the property must be used. */
  hasDependency: boolean
  relatedCount: number
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
    hasDependency: hasDependency(p),
    relatedCount: p.related.length,
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
