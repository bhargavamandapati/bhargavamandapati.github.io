'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import {
  decodeVhalId,
  encodeVhalId,
  parseVhalIdInput,
  GROUP_VALUES,
  AREA_VALUES,
  TYPE_VALUES,
  toHex,
  type IdGroup,
  type IdArea,
  type IdType,
} from '@/lib/vhal-id'
import { vehicleProperties, propertySlug } from '@/lib/vehicle-properties'
import { csFile } from '@/lib/aosp'
import { AIDL_PATH } from '@/data/vehicle-properties'
import { cn } from '@/lib/utils'

const propertyById = new Map(vehicleProperties.map((p) => [p.id, p]))

const GROUPS = Object.keys(GROUP_VALUES) as IdGroup[]
const AREAS = Object.keys(AREA_VALUES) as IdArea[]
const TYPES = Object.keys(TYPE_VALUES) as IdType[]

function Field({
  label,
  mask,
  value,
  name,
  known,
}: {
  label: string
  mask: string
  value: string
  name: string
  known: boolean
}) {
  return (
    <div className="card p-4">
      <p className="font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
        {label} <span className="text-subtle/70">· mask {mask}</span>
      </p>
      <p className="mt-1.5 font-mono text-sm font-semibold text-fg">{value}</p>
      <p className={cn('mt-1 text-xs', known ? 'text-accent' : 'text-difficulty-advanced')}>
        {known ? name : `${name} — not a named constant`}
      </p>
    </div>
  )
}

export function VhalIdDecoder() {
  const [raw, setRaw] = useState('0x11600207')
  const [group, setGroup] = useState<IdGroup>('SYSTEM')
  const [area, setArea] = useState<IdArea>('GLOBAL')
  const [type, setType] = useState<IdType>('FLOAT')
  const [ordinal, setOrdinal] = useState('0x0207')

  const parsed = useMemo(() => parseVhalIdInput(raw), [raw])
  const decoded = useMemo(() => (parsed !== null ? decodeVhalId(parsed) : null), [parsed])
  const match = decoded ? propertyById.get(decoded.id) : undefined

  const builtOrdinal = useMemo(() => parseVhalIdInput(ordinal) ?? 0, [ordinal])
  const built = useMemo(
    () => encodeVhalId(group, area, type, builtOrdinal),
    [group, area, type, builtOrdinal],
  )
  const builtMatch = propertyById.get(built)

  function applyDecoded(id: number) {
    const d = decodeVhalId(id)
    setRaw(d.hex)
    if (d.group) setGroup(d.group)
    if (d.area) setArea(d.area)
    if (d.type) setType(d.type)
    setOrdinal(toHex(d.ordinal))
  }

  return (
    <div>
      <div className="card p-5">
        <label htmlFor="vhal-raw" className="block text-sm font-medium text-fg">
          Paste a property ID
        </label>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Hex (<code className="font-mono text-[0.9em]">0x11600207</code>) or decimal — from a
          log line, a <code className="font-mono text-[0.9em]">dumpsys</code> dump, or a raw
          getProperty() call.
        </p>
        <input
          id="vhal-raw"
          type="text"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          className="mt-3 w-full rounded-lg border border-line bg-surface px-3 py-2.5 font-mono text-sm text-fg outline-none placeholder:text-subtle focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
          placeholder="0x11600207"
        />

        {parsed === null ? (
          <p className="mt-4 text-sm text-difficulty-advanced">
            That doesn&rsquo;t parse as a hex or decimal ID.
          </p>
        ) : (
          decoded && (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Field
                  label="Group"
                  mask="0xf0000000"
                  value={toHex(decoded.groupValue)}
                  name={decoded.group ?? 'unknown'}
                  known={Boolean(decoded.group)}
                />
                <Field
                  label="Area"
                  mask="0x0f000000"
                  value={toHex(decoded.areaValue)}
                  name={decoded.area ?? 'unknown'}
                  known={Boolean(decoded.area)}
                />
                <Field
                  label="Type"
                  mask="0x00ff0000"
                  value={toHex(decoded.typeValue)}
                  name={decoded.type ?? 'unknown'}
                  known={Boolean(decoded.type)}
                />
                <Field
                  label="Ordinal"
                  mask="0x0000ffff"
                  value={toHex(decoded.ordinal)}
                  name={`${decoded.ordinal} decimal`}
                  known
                />
              </div>

              <div className="mt-4 rounded-lg border border-line bg-surface-2 p-4">
                {match ? (
                  <p className="text-sm text-fg">
                    Matches{' '}
                    <Link
                      href={`/learn/vehicle-properties/${propertySlug(match)}/`}
                      className="font-mono font-semibold text-accent hover:underline"
                    >
                      {match.name}
                    </Link>{' '}
                    <span className="text-muted">— {match.description.split('\n')[0]}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted">
                    {decoded.group && decoded.area && decoded.type
                      ? "Every field decodes to a named constant, but no SYSTEM property in VehicleProperty.aidl uses this exact ordinal — likely a vendor-defined property, or one from a newer/older AOSP revision than this reference."
                      : 'One or more fields don’t match a named constant at all — this probably isn’t a real VHAL property ID.'}
                  </p>
                )}
              </div>
            </>
          )
        )}
      </div>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-medium text-fg">Build one instead</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Pick a group, area and type, and an ordinal — the same fields VehicleProperty.aidl
          combines to compose every property ID.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="vhal-group" className="block font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
              Group
            </label>
            <select
              id="vhal-group"
              value={group}
              onChange={(e) => setGroup(e.target.value as IdGroup)}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-2.5 py-2 font-mono text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vhal-area" className="block font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
              Area
            </label>
            <select
              id="vhal-area"
              value={area}
              onChange={(e) => setArea(e.target.value as IdArea)}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-2.5 py-2 font-mono text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vhal-type" className="block font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
              Type
            </label>
            <select
              id="vhal-type"
              value={type}
              onChange={(e) => setType(e.target.value as IdType)}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-2.5 py-2 font-mono text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vhal-ordinal" className="block font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
              Ordinal
            </label>
            <input
              id="vhal-ordinal"
              type="text"
              value={ordinal}
              onChange={(e) => setOrdinal(e.target.value)}
              spellCheck={false}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-2.5 py-2 font-mono text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface-2 p-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-subtle">Result</p>
            <p className="mt-1 font-mono text-lg font-semibold text-fg">{toHex(built)}</p>
            {builtMatch && (
              <p className="mt-1 text-xs text-accent">
                = <span className="font-mono">{builtMatch.name}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => applyDecoded(built)}
            className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            Decode this
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-subtle">
        Group, area and type constants come from{' '}
        <a
          href={csFile(`hardware/interfaces/${AIDL_PATH}`)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-accent hover:underline"
        >
          VehicleProperty.aidl
          <ExternalLink aria-hidden className="size-3" />
        </a>{' '}
        and are verified against all {vehicleProperties.length} SYSTEM-group properties in the{' '}
        <Link href="/learn/vehicle-properties/" className="text-accent hover:underline">
          property reference
        </Link>
        . VENDOR and BACKPORTED group values are the documented constants — no SYSTEM-only
        reference can confirm those empirically.
      </p>
    </div>
  )
}
