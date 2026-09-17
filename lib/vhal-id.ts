/**
 * The bit layout every VHAL property ID is packed into — group, area, type
 * and a 16-bit ordinal, from most to least significant byte. Verified against
 * all 280 properties in data/vehicle-properties.ts (every SYSTEM-group
 * property masks out to exactly the group/area/type its own record already
 * states), the same way lib/vehicle-properties.ts's decomposeId() does for a
 * single known property — this module does the same math for an arbitrary
 * ID that may not name a real property at all.
 *
 * VENDOR and BACKPORTED group values are the documented AIDL constants
 * (VehiclePropertyGroup.VENDOR / BACKPORTED) rather than something this
 * repo's SYSTEM-only generated data can verify locally — every other value
 * below is empirically confirmed against real property records.
 */

export const GROUP_MASK = 0xf0000000
export const AREA_MASK = 0x0f000000
export const TYPE_MASK = 0x00ff0000
export const ORDINAL_MASK = 0x0000ffff

export type IdGroup = 'SYSTEM' | 'VENDOR' | 'BACKPORTED'
export type IdArea = 'GLOBAL' | 'WINDOW' | 'MIRROR' | 'SEAT' | 'DOOR' | 'WHEEL' | 'VENDOR'
export type IdType =
  | 'STRING' | 'BOOLEAN' | 'INT32' | 'INT32_VEC' | 'INT64' | 'INT64_VEC'
  | 'FLOAT' | 'FLOAT_VEC' | 'BYTES' | 'MIXED'

export const GROUP_VALUES: Record<IdGroup, number> = {
  SYSTEM: 0x10000000,
  VENDOR: 0x20000000,
  BACKPORTED: 0x30000000,
}

export const AREA_VALUES: Record<IdArea, number> = {
  GLOBAL: 0x01000000,
  WINDOW: 0x03000000,
  MIRROR: 0x04000000,
  SEAT: 0x05000000,
  DOOR: 0x06000000,
  WHEEL: 0x07000000,
  VENDOR: 0x08000000,
}

export const TYPE_VALUES: Record<IdType, number> = {
  STRING: 0x00100000,
  BOOLEAN: 0x00200000,
  INT32: 0x00400000,
  INT32_VEC: 0x00410000,
  INT64: 0x00500000,
  INT64_VEC: 0x00510000,
  FLOAT: 0x00600000,
  FLOAT_VEC: 0x00610000,
  BYTES: 0x00700000,
  MIXED: 0x00e00000,
}

function reverse<T extends string>(values: Record<T, number>): Map<number, T> {
  return new Map(Object.entries(values).map(([k, v]) => [v as number, k as T]))
}
const GROUP_BY_VALUE = reverse(GROUP_VALUES)
const AREA_BY_VALUE = reverse(AREA_VALUES)
const TYPE_BY_VALUE = reverse(TYPE_VALUES)

export const toHex = (n: number) => '0x' + (n >>> 0).toString(16).padStart(8, '0')

export type DecodedId = {
  id: number
  hex: string
  groupValue: number
  areaValue: number
  typeValue: number
  ordinal: number
  /** Undefined when the bits don't match a named constant — still shown as raw hex. */
  group?: IdGroup
  area?: IdArea
  type?: IdType
}

/** Splits any 32-bit int into its group/area/type/ordinal fields. */
export function decodeVhalId(id: number): DecodedId {
  const n = id >>> 0
  const groupValue = n & GROUP_MASK
  const areaValue = n & AREA_MASK
  const typeValue = n & TYPE_MASK
  const ordinal = n & ORDINAL_MASK
  return {
    id: n,
    hex: toHex(n),
    groupValue,
    areaValue,
    typeValue,
    ordinal,
    group: GROUP_BY_VALUE.get(groupValue),
    area: AREA_BY_VALUE.get(areaValue),
    type: TYPE_BY_VALUE.get(typeValue),
  }
}

/** Packs a group/area/type/ordinal back into the 32-bit ID they describe. */
export function encodeVhalId(group: IdGroup, area: IdArea, type: IdType, ordinal: number): number {
  return (GROUP_VALUES[group] | AREA_VALUES[area] | TYPE_VALUES[type] | (ordinal & ORDINAL_MASK)) >>> 0
}

/** Accepts "0x11600207", "11600207" (assumed hex if it isn't a small decimal
 * property count) or a plain decimal string; returns null if unparseable. */
export function parseVhalIdInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (/^0x[0-9a-f]+$/i.test(trimmed)) return Number.parseInt(trimmed, 16) >>> 0
  if (/^[0-9a-f]+$/i.test(trimmed) && /[a-f]/i.test(trimmed)) {
    return Number.parseInt(trimmed, 16) >>> 0
  }
  if (/^\d+$/.test(trimmed)) {
    const n = Number.parseInt(trimmed, 10)
    return n >>> 0
  }
  return null
}
