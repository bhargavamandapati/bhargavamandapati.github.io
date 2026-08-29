/**
 * Generates data/vehicle-properties.ts from AOSP.
 *
 * Two upstream sources are merged:
 *
 *   VehicleProperty.aidl        the canonical HAL definition — every property,
 *                               its ID arithmetic, and the @change_mode /
 *                               @access / @unit / @data_enum annotations.
 *   VehiclePropertyIds.java     the public Car API surface — which properties
 *                               apps can actually reach, and the permission
 *                               each one needs.
 *
 * A property present in the AIDL but absent from the Java file is real, but
 * only reachable from the platform side, which is worth showing explicitly.
 *
 * Run with: node scripts/generate-vehicle-properties.mjs
 */
import { writeFileSync } from 'node:fs'

const HW = 'https://android.googlesource.com/platform/hardware/interfaces/+/refs/heads/main'
const CAR = 'https://android.googlesource.com/platform/packages/services/Car/+/refs/heads/main'
const AIDL_DIR = 'automotive/vehicle/aidl_property/android/hardware/automotive/vehicle'
const AIDL_PATH = `${AIDL_DIR}/VehicleProperty.aidl`
const JAVA_PATH = 'car-lib/src/android/car/VehiclePropertyIds.java'

async function fetchText(base, path) {
  const res = await fetch(`${base}/${path}?format=TEXT`)
  if (!res.ok) throw new Error(`${res.status} fetching ${path}`)
  return Buffer.from(await res.text(), 'base64').toString('utf8')
}

/** Bitfield masks, from VehiclePropertyGroup / VehicleArea / VehiclePropertyType. */
const GROUPS = { 0x10000000: 'SYSTEM', 0x20000000: 'VENDOR', 0x30000000: 'BACKPORTED' }
const AREAS = {
  0x01000000: 'GLOBAL', 0x03000000: 'WINDOW', 0x04000000: 'MIRROR', 0x05000000: 'SEAT',
  0x06000000: 'DOOR', 0x07000000: 'WHEEL', 0x08000000: 'VENDOR',
}
const TYPES = {
  0x00100000: 'STRING', 0x00200000: 'BOOLEAN', 0x00400000: 'INT32', 0x00410000: 'INT32_VEC',
  0x00500000: 'INT64', 0x00510000: 'INT64_VEC', 0x00600000: 'FLOAT', 0x00610000: 'FLOAT_VEC',
  0x00700000: 'BYTES', 0x00e00000: 'MIXED',
}

/** Symbolic terms, e.g. `VehicleArea.GLOBAL`, used instead of hex in newer entries. */
const SYMBOLS = new Map()
for (const [table, values] of [
  ['VehiclePropertyGroup', GROUPS], ['VehicleArea', AREAS], ['VehiclePropertyType', TYPES],
]) {
  for (const [value, name] of Object.entries(values)) {
    SYMBOLS.set(`${table}.${name}`, Number(value))
  }
}

/** Sums an ID expression whose terms may be hex literals, symbols, or both. */
function evalIdExpression(expr) {
  let total = 0
  let matched = 0
  for (const token of expr.match(/0x[0-9a-fA-F]+|[A-Za-z]+\.[A-Z][A-Z0-9_]*/g) ?? []) {
    const value = token.startsWith('0x') ? parseInt(token, 16) : SYMBOLS.get(token)
    if (value === undefined) return null
    total += value
    matched++
  }
  return matched ? total >>> 0 : null
}

/** Strips the ` * ` gutter and pulls the @annotations out of a doc comment. */
function parseDoc(raw) {
  const lines = raw
    .replace(/^\s*\/\*+/, '')
    .replace(/\*\/\s*$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, ''))

  const ann = {}
  const prose = []
  for (const line of lines) {
    const m = line.match(/^\s*@(\w+)\s*(.*)$/)
    if (m) {
      const [, key, value] = m
      ;(ann[key] ??= []).push(value.trim())
      continue
    }
    prose.push(line)
  }
  // Collapse the blank lines the gutter leaves behind into paragraph breaks.
  const text = prose.join('\n').replace(/\n{3,}/g, '\n\n').trim()
  return { text, ann }
}

/** `VehiclePropertyAccess.READ_WRITE` -> `READ_WRITE`. */
const short = (v) => (v ?? '').split('.').pop() || undefined
/** First value of a repeated annotation. */
const first1 = (a) => (Array.isArray(a) ? a[0] : a)
/** All values of a repeated annotation, deduped and shortened. */
const allOf = (a) => (Array.isArray(a) ? [...new Set(a.map(short).filter(Boolean))] : [])

function parseAidl(src) {
  const lines = src.split('\n')
  const out = []
  let doc = null
  let docStart = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^\s*\/\*/.test(line)) {
      const buf = []
      docStart = i
      while (i < lines.length) {
        buf.push(lines[i])
        if (/\*\//.test(lines[i])) break
        i++
      }
      doc = buf.join('\n')
      continue
    }

    const m = line.match(/^\s{4}([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    const [, name, first] = m
    if (name === 'INVALID') { doc = null; continue }

    // The value is a sum of hex terms that may wrap across lines.
    let expr = first
    let j = i
    while (!expr.includes(',') && j + 1 < lines.length) {
      j++
      expr += ' ' + lines[j].trim()
    }
    const valuePart = expr.slice(0, expr.indexOf(','))
    const id = evalIdExpression(valuePart)
    if (id === null) { doc = null; continue }

    const { text, ann } = doc ? parseDoc(doc) : { text: '', ann: {} }

    out.push({
      name,
      id,
      hex: '0x' + id.toString(16).padStart(8, '0'),
      group: GROUPS[id & 0xf0000000] ?? 'UNKNOWN',
      area: AREAS[id & 0x0f000000] ?? 'UNKNOWN',
      type: TYPES[id & 0x00ff0000] ?? 'UNKNOWN',
      /** The 16-bit ordinal that is unique within the group. */
      ordinal: id & 0x0000ffff,
      changeMode: short(first1(ann.change_mode)),
      // A property declaring both READ_WRITE and READ means an implementation
      // may support either; the first is the fullest access it can offer.
      access: short(first1(ann.access)),
      accessModes: allOf(ann.access),
      unit: short(first1(ann.unit)),
      dataEnum: short(first1(ann.data_enum)),
      version: ann.version ? Number(first1(ann.version)) : undefined,
      deprecated: Boolean(ann.deprecated) || /\bdeprecated\b/i.test(text.slice(0, 200)),
      description: text,
      aidlLine: docStart + 1,
    })
    doc = null
    i = j
  }
  return out
}

/** Pulls permissions and the javadoc line number out of the public Car API. */
function parseJava(src) {
  const lines = src.split('\n')
  const map = new Map()
  let pending = { read: [], write: [], both: [], line: 0 }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^\s*\/\*\*/.test(line)) pending = { read: [], write: [], both: [], line: i + 1 }

    // @RequiresPermission(...) may wrap, and .Read/.Write variants nest it.
    const pm = line.match(/@RequiresPermission(\.Read|\.Write)?\s*\(/)
    if (pm) {
      let block = lines[i]
      let depth = (block.match(/\(/g) ?? []).length - (block.match(/\)/g) ?? []).length
      let k = i
      while (depth > 0 && k + 1 < lines.length) {
        k++
        block += ' ' + lines[k].trim()
        depth += (lines[k].match(/\(/g) ?? []).length - (lines[k].match(/\)/g) ?? []).length
      }
      const perms = [...block.matchAll(/Car\.(PERMISSION_[A-Z0-9_]+)/g)].map((x) => x[1])
      const bucket = pm[1] === '.Read' ? 'read' : pm[1] === '.Write' ? 'write' : 'both'
      pending[bucket].push(...perms)
      i = k
      continue
    }

    const dm = line.match(/public static final int ([A-Z][A-Z0-9_]*)\s*=\s*(-?\d+)\s*;/)
    if (dm) {
      map.set(dm[1], {
        id: Number(dm[2]) >>> 0,
        javaLine: pending.line,
        readPermissions: [...new Set([...pending.read, ...pending.both])],
        writePermissions: [...new Set([...pending.write, ...pending.both])],
      })
      pending = { read: [], write: [], both: [], line: 0 }
    }
  }
  return map
}

const [aidlSrc, javaSrc] = await Promise.all([
  fetchText(HW, AIDL_PATH),
  fetchText(CAR, JAVA_PATH),
])

const props = parseAidl(aidlSrc)
const java = parseJava(javaSrc)

let inJava = 0
for (const p of props) {
  const j = java.get(p.name)
  if (j) {
    inJava++
    p.javaLine = j.javaLine
    p.readPermissions = j.readPermissions
    p.writePermissions = j.writePermissions
    if (j.id !== p.id) p.javaId = j.id
  }
}
const divergent = props.filter((p) => p.javaId !== undefined)

const banner = `// GENERATED FILE — do not edit by hand.
// Run: node scripts/generate-vehicle-properties.mjs
//
// Source of truth:
//   ${AIDL_PATH}
//   ${JAVA_PATH}
// Generated from AOSP main on ${new Date().toISOString().slice(0, 10)}.
`

const body = `${banner}
export type PropertyGroup = 'SYSTEM' | 'VENDOR' | 'BACKPORTED'
export type PropertyArea =
  | 'GLOBAL' | 'WINDOW' | 'MIRROR' | 'SEAT' | 'DOOR' | 'WHEEL' | 'VENDOR'
export type PropertyValueType =
  | 'STRING' | 'BOOLEAN' | 'INT32' | 'INT32_VEC' | 'INT64' | 'INT64_VEC'
  | 'FLOAT' | 'FLOAT_VEC' | 'BYTES' | 'MIXED'

export type VehicleProperty = {
  /** AIDL enum name, e.g. PERF_VEHICLE_SPEED. */
  name: string
  /** Full 32-bit property ID. */
  id: number
  hex: string
  group: PropertyGroup
  area: PropertyArea
  type: PropertyValueType
  /** The 16-bit ordinal unique within the group. */
  ordinal: number
  changeMode?: string
  access?: string
  unit?: string
  /** Name of the enum that constrains this property's values, if any. */
  dataEnum?: string
  /** Minimum HAL version that defines this property. */
  version?: number
  deprecated: boolean
  description: string
  /** Line of the definition in VehicleProperty.aidl. */
  aidlLine: number
  /** Line in VehiclePropertyIds.java — absent means not in the public Car API. */
  javaLine?: number
  readPermissions?: string[]
  writePermissions?: string[]
  /** Every access mode the AIDL declares; more than one means either is valid. */
  accessModes: string[]
  /** Set only when car-lib's constant disagrees with the AIDL's computed ID. */
  javaId?: number
}

export const AIDL_PATH =
  '${AIDL_DIR}/VehicleProperty.aidl'
export const JAVA_PATH = '${JAVA_PATH}'

export const vehicleProperties: VehicleProperty[] = ${JSON.stringify(props, null, 2)}

export const propertyByName = new Map(vehicleProperties.map((p) => [p.name, p]))
`

writeFileSync('data/vehicle-properties.ts', body)

console.log(`properties parsed : ${props.length}`)
console.log(`in public Car API : ${inJava}`)
console.log(`platform-only     : ${props.length - inJava}`)
console.log(`missing changeMode: ${props.filter((p) => !p.changeMode).length}`)
console.log(`missing access    : ${props.filter((p) => !p.access).length}`)
console.log(`unknown group/area/type: ${props.filter((p) => [p.group, p.area, p.type].includes('UNKNOWN')).length}`)
console.log(`empty description : ${props.filter((p) => !p.description.trim()).length}`)
console.log(
  `AIDL/car-lib ID divergence: ${divergent.length}` +
    (divergent.length ? ' -> ' + divergent.map((p) => p.name).join(', ') : ''),
)
