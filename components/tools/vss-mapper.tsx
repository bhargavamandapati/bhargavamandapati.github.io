'use client'

import { useDeferredValue, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { vssMappings, MISMATCH_LABEL, type MismatchKind } from '@/data/vss-mapping'
import { propertyByName, propertySlug } from '@/lib/vehicle-properties'
import { cn } from '@/lib/utils'

const MISMATCH_KINDS = Object.keys(MISMATCH_LABEL) as MismatchKind[]

const MISMATCH_TONE: Record<MismatchKind, string> = {
  none: 'border-accent/50 text-accent',
  unit: 'border-difficulty-advanced/50 text-difficulty-advanced',
  encoding: 'border-difficulty-advanced/50 text-difficulty-advanced',
  granularity: '',
  'no-equivalent': '',
}

export function VssMapper() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<MismatchKind | null>(null)
  const searchId = useId()
  const deferred = useDeferredValue(query.trim().toLowerCase())

  const results = useMemo(() => {
    return vssMappings.filter((m) => {
      if (kind && m.mismatch !== kind) return false
      if (!deferred) return true
      return (
        m.vssPath.toLowerCase().includes(deferred) ||
        (m.property ?? '').toLowerCase().includes(deferred)
      )
    })
  }, [deferred, kind])

  const directCount = vssMappings.filter((m) => m.mismatch === 'none').length

  return (
    <div>
      <div className="card p-4">
        <p className="text-sm text-fg">
          <strong className="font-medium">{directCount}</strong> of {vssMappings.length} verified
          pairs below are a direct match. The rest need a real conversion — a unit, an encoding, or
          an addressing scheme that doesn&rsquo;t line up — which is worth knowing before you wire a
          data broker straight into a VHAL mock and assume the numbers agree.
        </p>
      </div>

      <div className="sticky top-16 z-20 mt-4 -mx-4 border-b border-line bg-bg/85 px-4 py-4 backdrop-blur md:mx-0 md:rounded-xl md:border md:px-5">
        <label htmlFor={searchId} className="sr-only">
          Search by VSS path or AAOS property name
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Vehicle.Speed, PERF_VEHICLE_SPEED…"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-fg outline-none placeholder:text-subtle focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {MISMATCH_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind((cur) => (cur === k ? null : k))}
              className={cn(
                'chip cursor-pointer transition-colors',
                kind === k ? 'border-accent/60 bg-accent-soft text-accent' : 'hover:border-line-strong hover:text-fg',
              )}
            >
              {MISMATCH_LABEL[k]}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <p aria-live="polite" className="font-mono text-xs text-muted">
            {results.length} of {vssMappings.length} pairs
          </p>
          {(query || kind) && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setKind(null)
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-fg"
            >
              <X aria-hidden className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">No pair matches that.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {results.map((m) => {
            const prop = m.property ? propertyByName.get(m.property) : undefined
            return (
              <li key={m.vssPath} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm">
                    <code className="text-fg [overflow-wrap:anywhere]">{m.vssPath}</code>
                    <span className="text-subtle">↔</span>
                    {prop ? (
                      <Link
                        href={`/learn/vehicle-properties/${propertySlug(prop)}/`}
                        className="font-semibold text-accent hover:underline [overflow-wrap:anywhere]"
                      >
                        {m.property}
                      </Link>
                    ) : (
                      <span className="text-subtle">(none)</span>
                    )}
                  </div>
                  <span className={cn('chip shrink-0', MISMATCH_TONE[m.mismatch])}>
                    {MISMATCH_LABEL[m.mismatch]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.note}</p>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-6 text-xs leading-relaxed text-subtle">
        VSS paths checked against the{' '}
        <a
          href="https://github.com/COVESA/vehicle_signal_specification"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          COVESA Vehicle Signal Specification
        </a>
        . A curated set of commonly-needed pairs, not an exhaustive tree — read{' '}
        <Link href="/learn/sdv/vss-and-kuksa/" className="text-accent hover:underline">
          VSS and the Eclipse Kuksa databroker
        </Link>{' '}
        for why the full mapping is deliberately generated per-programme rather than a fixed table.
      </p>
    </div>
  )
}
