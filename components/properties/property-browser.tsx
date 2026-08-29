'use client'

import { useDeferredValue, useMemo, useState, useId } from 'react'
import Link from 'next/link'
import { ChevronDown, Search, X } from 'lucide-react'
import type { PropertyRow } from '@/lib/vehicle-properties'
import { cn } from '@/lib/utils'

type Facet = { key: keyof PropertyRow; label: string; values: string[] }

const ACCESS_HINT: Record<string, string> = {
  READ: 'App can read only',
  WRITE: 'App can write only',
  READ_WRITE: 'App can read and write',
  NONE: 'Not accessible',
}

function Pill({
  active,
  children,
  onClick,
  count,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'chip cursor-pointer transition-colors',
        active
          ? 'border-accent/60 bg-accent-soft text-accent'
          : 'hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
      {count !== undefined && <span className="font-mono text-[0.7rem]">{count}</span>}
    </button>
  )
}

export function PropertyBrowser({ rows }: { rows: PropertyRow[] }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string | null>>({})
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchId = useId()
  const facetsId = useId()
  const deferred = useDeferredValue(query)

  const facets = useMemo<Facet[]>(() => {
    const uniq = (key: keyof PropertyRow) =>
      [...new Set(rows.map((r) => String(r[key])))].sort()
    return [
      { key: 'category', label: 'Category', values: uniq('category') },
      { key: 'area', label: 'Area type', values: uniq('area') },
      { key: 'type', label: 'Value type', values: uniq('type') },
      { key: 'access', label: 'Access', values: uniq('access') },
      { key: 'changeMode', label: 'Change mode', values: uniq('changeMode') },
    ]
  }, [rows])

  const results = useMemo(() => {
    const needle = deferred.trim().toLowerCase()
    // A bare hex or decimal ID should find its property directly.
    const asNumber = needle.startsWith('0x')
      ? Number.parseInt(needle, 16)
      : /^\d+$/.test(needle)
        ? Number.parseInt(needle, 10)
        : Number.NaN

    return rows.filter((row) => {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== null && String(row[key as keyof PropertyRow]) !== value) return false
      }
      if (!needle) return true
      if (!Number.isNaN(asNumber) && row.id === asNumber) return true
      return (
        row.name.toLowerCase().includes(needle) ||
        row.hex.includes(needle) ||
        row.summary.toLowerCase().includes(needle) ||
        row.category.toLowerCase().includes(needle)
      )
    })
  }, [rows, deferred, filters])

  const activeCount = Object.values(filters).filter((v) => v !== null).length
  const hasFilters = activeCount > 0 || query.trim() !== ''

  /** Count of matches a facet value would yield, given the other active filters. */
  const countFor = (key: keyof PropertyRow, value: string) =>
    results.filter((r) => String(r[key]) === value).length

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-bg/85 px-4 py-4 backdrop-blur md:mx-0 md:rounded-xl md:border md:px-5">
        <label htmlFor={searchId} className="sr-only">
          Search vehicle properties by name, ID or description
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 280 properties — name, 0x hex ID, or description"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-fg outline-none placeholder:text-subtle focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls={facetsId}
          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-md font-mono text-xs text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/40 md:hidden"
        >
          <ChevronDown
            aria-hidden
            className={cn('size-3.5 transition-transform', filtersOpen && 'rotate-180')}
          />
          Filters
          {activeCount > 0 && <span className="text-accent">({activeCount})</span>}
        </button>

        <div
          id={facetsId}
          className={cn(
            'mt-3 flex-wrap items-start gap-x-4 gap-y-3 md:flex',
            filtersOpen ? 'flex' : 'hidden',
          )}
        >
          {facets.map((facet) => {
            // Options that would return nothing are dead ends, so hide them —
            // but never hide the one that is currently applied.
            const values = facet.values.filter(
              (value) => filters[facet.key] === value || countFor(facet.key, value) > 0,
            )
            if (values.length === 0) return null
            return (
              <fieldset key={facet.key} className="min-w-0">
                <legend className="mb-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                  {facet.label}
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((value) => {
                    const active = filters[facet.key] === value
                    return (
                      <Pill
                        key={value}
                        active={active}
                        count={active ? undefined : countFor(facet.key, value)}
                        onClick={() =>
                          setFilters((f) => ({ ...f, [facet.key]: active ? null : value }))
                        }
                      >
                        {value}
                      </Pill>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <p aria-live="polite" className="font-mono text-xs text-muted">
            {results.length} of {rows.length} properties
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setFilters({})
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <X aria-hidden className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          No property matches that. Try a shorter search, or clear the filters.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {results.map((row) => (
            <li key={row.name}>
              <Link
                href={`/learn/vehicle-properties/${row.slug}/`}
                className="card group block px-4 py-3.5 transition-colors hover:border-accent/40"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <code className="font-mono text-sm font-semibold text-fg [overflow-wrap:anywhere] group-hover:text-accent">
                    {row.name}
                  </code>
                  <code className="font-mono text-xs text-subtle">{row.hex}</code>
                  {row.deprecated && (
                    <span className="chip border-difficulty-advanced/40 text-difficulty-advanced">
                      deprecated
                    </span>
                  )}
                  {!row.inCarApi && (
                    <span className="chip" title="Defined in the HAL but not exposed in the public Car API">
                      platform only
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">
                  {row.summary}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="chip">{row.area}</span>
                  <span className="chip">{row.type}</span>
                  <span className="chip" title={ACCESS_HINT[row.access]}>
                    {row.access}
                  </span>
                  <span className="chip">{row.changeMode}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
