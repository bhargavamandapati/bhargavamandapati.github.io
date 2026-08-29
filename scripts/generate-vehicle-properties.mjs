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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchText(base, path, attempts = 6) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(`${base}/${path}?format=TEXT`)
      if (res.status === 429) throw new Error('HTTP 429 (rate limited)')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.text(), 'base64').toString('utf8')
    } catch (error) {
      lastError = error
      // googlesource rate-limits bursts hard; exponential backoff from 1s.
      if (attempt < attempts) await sleep(1000 * 2 ** (attempt - 1))
    }
  }
  throw new Error(`fetching ${path}: ${lastError?.message}`)
}

/** Runs tasks with bounded concurrency, so a burst is not throttled away. */
async function mapLimit(items, limit, fn) {
  const results = []
  const queue = [...items]
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) {
        const item = queue.shift()
        results.push(await fn(item))
        await sleep(120)
      }
    }),
  )
  return results
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
  // Collapse the blank lines the gutter leaves behind into paragraph breaks,
  // and unwrap javadoc inline tags so {@code true} reads as `true`.
  const text = prose
    .join('\n')
    .replace(/\{@(?:code|link|linkplain|literal)\s+([^}]*)\}/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
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
      dataEnums: allOf(ann.data_enum),
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


/**
 * Derives relationships between properties.
 *
 * Everything here is derived from the AIDL rather than hand-listed, so
 * regenerating cannot leave a relationship stale. Four sources:
 *
 *   1. Naming conventions the AIDL uses consistently — _ENABLED/_STATE,
 *      _COMMAND/_STATE, _WARNING.
 *   2. The @unit annotation, which pairs a measured value with the
 *      *_DISPLAY_UNITS property that decides how it is rendered.
 *   3. The HVAC power rule, which the AIDL states explicitly: only SEAT-area
 *      HVAC properties may be gated by HVAC_POWER_ON.
 *   4. Cross-references — one property naming another in its documentation.
 */
function deriveRelations(props) {
  const byName = new Map(props.map((p) => [p.name, p]))
  const names = new Set(byName.keys())
  const out = new Map(props.map((p) => [p.name, []]))

  const link = (from, to, kind, note) => {
    // Both ends must exist: a naming convention can imply a sibling that the
    // AIDL never actually defines.
    if (!names.has(from) || !names.has(to) || from === to) return
    const list = out.get(from)
    if (list.some((r) => r.name === to && r.kind === kind)) return
    list.push({ name: to, kind, note })
  }

  // 1. HVAC power gating. The AIDL is explicit that only SEAT-area HVAC
  //    properties may appear in HvacPower_DependentProperties, and which ones
  //    actually do is per-vehicle via configArray — hence "may require".
  const hvacGated = props
    .filter((p) => p.name.startsWith('HVAC_') && p.area === 'SEAT' && p.name !== 'HVAC_POWER_ON')
    .map((p) => p.name)
  for (const name of hvacGated) {
    link(name, 'HVAC_POWER_ON', 'requires',
      'HVAC must be powered on before this has effect. Which properties are gated is per-vehicle, declared in the HVAC_POWER_ON configArray.')
    link('HVAC_POWER_ON', name, 'gates',
      'Turning HVAC power off MAY mark this UNAVAILABLE.')
  }

  // 2. Measured value <-> the units property that formats it.
  const UNIT_FAMILIES = [
    ['VEHICLE_SPEED_DISPLAY_UNITS', ['METER_PER_SEC']],
    ['DISTANCE_DISPLAY_UNITS', ['MILLIMETER', 'METER', 'KILOMETER']],
    ['FUEL_VOLUME_DISPLAY_UNITS', ['MILLILITER']],
    ['EV_BATTERY_DISPLAY_UNITS', ['WATT_HOUR']],
    ['HVAC_TEMPERATURE_DISPLAY_UNITS', ['CELSIUS']],
    ['TIRE_PRESSURE_DISPLAY_UNITS', ['KILOPASCAL']],
  ]
  for (const [unitsProp, units] of UNIT_FAMILIES) {
    for (const p of props) {
      if (!p.unit || !units.includes(p.unit) || p.name === unitsProp) continue
      link(p.name, unitsProp, 'display-units',
        `The value is always reported in ${p.unit}; this property says which unit to display it in.`)
      link(unitsProp, p.name, 'formats', `Reported in ${p.unit}.`)
    }
  }

  // 3. Naming conventions.
  for (const name of names) {
    const pairs = [
      ['_COMMAND', '_STATE', 'command-for', 'commanded-by',
       'Write to this to act; read the state property to see the result.'],
      ['_ENABLED', '_STATE', 'toggles', 'toggled-by',
       'The feature must be enabled before the state property reports anything meaningful.'],
    ]
    for (const [suffix, other, kindA, kindB, note] of pairs) {
      if (!name.endsWith(suffix)) continue
      const base = name.slice(0, -suffix.length)
      const target = base + other
      link(name, target, kindA, note)
      link(target, name, kindB, note)
    }
    if (name.endsWith('_WARNING')) {
      const base = name.slice(0, -'_WARNING'.length)
      for (const sibling of [base + '_STATE', base + '_ENABLED', base + '_SYSTEM_ENABLED']) {
        link(name, sibling, 'warns-for', 'This reports the warning; the sibling reports or controls the system behind it.')
        link(sibling, name, 'has-warning', 'The warning surfaced by this system.')
      }
    }
  }

  // 4. Cross-references from the documentation itself.
  for (const p of props) {
    const mentioned = new Set(
      (p.description.match(/\b[A-Z][A-Z0-9_]{5,}\b/g) ?? []).filter((n) => names.has(n) && n !== p.name),
    )
    for (const target of mentioned) {
      link(p.name, target, 'mentions', 'Named in this property\u2019s documentation.')
      link(target, p.name, 'mentioned-by', 'This property is named in that one\u2019s documentation.')
    }
  }

  return out
}


/**
 * Loads the enum definitions a property's values are drawn from.
 *
 * Without these a reader is told "the value is a LaneCenteringAssistState" and
 * has to go and find out what that means. With them the page can list the
 * actual values and what each one signifies.
 */
async function fetchEnums(names) {
  const out = new Map()
  const failed = []
  await mapLimit([...names], 3, async (name) => {
      let src
      try {
        src = await fetchText(HW, `${AIDL_DIR}/${name}.aidl`)
      } catch (error) {
        failed.push(`${name} (${error.message})`)
        return
      }
      const lines = src.split('\n')
      const members = []
      let doc = null
      let header = null
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*\/\*/.test(lines[i])) {
          const buf = []
          while (i < lines.length) {
            buf.push(lines[i])
            if (/\*\//.test(lines[i])) break
            i++
          }
          doc = buf.join('\n')
          continue
        }
        // The doc block immediately before `enum X {` describes the enum itself.
        if (/^\s*(@[\w]+\s+)?enum\s+\w+/.test(lines[i])) {
          if (doc) header = parseDoc(doc).text
          doc = null
          continue
        }
        const m = lines[i].match(/^\s{4}([A-Z][A-Z0-9_]*)\s*=\s*([^,]+),/)
        if (!m) continue
        const [, member, rawValue] = m
        members.push({
          name: member,
          value: rawValue.trim(),
          description: doc ? parseDoc(doc).text : '',
        })
        doc = null
      }
      if (members.length) out.set(name, { name, description: header ?? '', members })
  })
  // Silently omitting an enum would ship a page telling the reader a value is a
  // LaneKeepAssistState without saying what that can be. Fail instead.
  if (failed.length) {
    throw new Error(`could not fetch ${failed.length} enum(s):\n  ${failed.join('\n  ')}`)
  }
  return out
}


/**
 * Where each value enum lives in the public Car API.
 *
 * Derived from VehiclePropertyIds.java's own imports rather than guessed,
 * because car-lib renames several of the AIDL enums — the AIDL's
 * VehicleHvacFanDirection is CarHvacFanDirection in car-lib, EvConnectorType is
 * EvChargingConnectorType, and the toll-collection pair gain a Vehicle prefix.
 * Enums in the android.car package itself are referenced without an import.
 */
function deriveEnumImports(javaSrc) {
  const imports = new Map()
  for (const [, fqn] of javaSrc.matchAll(/^import\s+(android\.car\.[\w.]+);/gm)) {
    imports.set(fqn.split('.').pop(), fqn)
  }
  // Referenced via {@link X#...} but not imported => same package as the file.
  for (const [, name] of javaSrc.matchAll(/\{@link\s+([A-Z]\w+)#/g)) {
    if (!imports.has(name)) imports.set(name, `android.car.${name}`)
  }

  // AIDL name -> car-lib name, where they differ.
  const RENAMED = {
    VehicleHvacFanDirection: 'CarHvacFanDirection',
    EvConnectorType: 'EvChargingConnectorType',
    ElectronicTollCollectionCardStatus: 'VehicleElectronicTollCollectionCardStatus',
    ElectronicTollCollectionCardType: 'VehicleElectronicTollCollectionCardType',
  }

  return (aidlName) => {
    const javaName = RENAMED[aidlName] ?? aidlName
    const fqn = imports.get(javaName)
    return fqn ? { javaName, importPath: fqn } : undefined
  }
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

// ErrorState is declared alongside many state enums and must be handled too.
const enumNames = new Set(props.flatMap((p) => p.dataEnums))
enumNames.add('ErrorState')
const enums = await fetchEnums(enumNames)

// Attach the car-lib import for each property's primary value enum.
const lookupEnumImport = deriveEnumImports(javaSrc)
for (const p of props) {
  const primary = p.dataEnums.find((n) => n !== 'ErrorState') ?? p.dataEnums[0]
  if (primary) p.enumImport = lookupEnumImport(primary)
}

const relations = deriveRelations(props)
for (const p of props) {
  // Cross-references are the weakest signal, so they sort last.
  const order = ['requires', 'gates', 'command-for', 'commanded-by', 'toggles', 'toggled-by',
                 'warns-for', 'has-warning', 'display-units', 'formats', 'mentions', 'mentioned-by']
  p.related = (relations.get(p.name) ?? []).sort(
    (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.name.localeCompare(b.name),
  )
}

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
  /** Every declared enum. State properties often declare their own plus ErrorState. */
  dataEnums: string[]
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
  /** Derived relationships to other properties. */
  related: PropertyRelation[]
  /** Where the primary value enum lives in car-lib, when it is exposed there. */
  enumImport?: { javaName: string; importPath: string }
}

export type RelationKind =
  | 'requires' | 'gates'
  | 'command-for' | 'commanded-by'
  | 'toggles' | 'toggled-by'
  | 'warns-for' | 'has-warning'
  | 'display-units' | 'formats'
  | 'mentions' | 'mentioned-by'

export type PropertyRelation = {
  name: string
  kind: RelationKind
  note: string
}

export const AIDL_PATH =
  '${AIDL_DIR}/VehicleProperty.aidl'
export const JAVA_PATH = '${JAVA_PATH}'

export const vehicleProperties: VehicleProperty[] = ${JSON.stringify(props, null, 2)}

export type EnumMember = {
  name: string
  /** The literal from the AIDL — often a bit flag or an explicit ordinal. */
  value: string
  description: string
}

export type EnumDefinition = {
  name: string
  description: string
  members: EnumMember[]
}

export const valueEnums: Record<string, EnumDefinition> = ${JSON.stringify(Object.fromEntries(enums), null, 2)}

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
const withRel = props.filter((p) => p.related.length).length
const relCount = props.reduce((n, p) => n + p.related.length, 0)
console.log(`with relationships : ${withRel} (${relCount} links)`)
console.log(`enum imports mapped: ${props.filter((p) => p.enumImport).length} of ${props.filter((p) => p.dataEnums.length).length} with an enum`)
console.log(`enum definitions   : ${enums.size} (${[...enums.values()].reduce((n, e) => n + e.members.length, 0)} members)`)
const missingEnums = [...enumNames].filter((n) => !enums.has(n))
if (missingEnums.length) console.log(`  NOT FOUND: ${missingEnums.join(', ')}`)
console.log(
  `AIDL/car-lib ID divergence: ${divergent.length}` +
    (divergent.length ? ' -> ' + divergent.map((p) => p.name).join(', ') : ''),
)
