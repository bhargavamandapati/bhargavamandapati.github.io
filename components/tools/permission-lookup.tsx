'use client'

import { useDeferredValue, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Search, X } from 'lucide-react'
import { carPermissions, propertySlug, vehicleProperties } from '@/lib/vehicle-properties'
import { cn } from '@/lib/utils'

const PROTECTION_LEVELS = ['Dangerous', 'Signature|Privileged', 'Signature', 'System', 'Normal'] as const

const PROTECTION_HINT: Record<string, string> = {
  Dangerous: 'Needs a runtime grant from the user, like camera or location.',
  'Signature|Privileged': 'Only a privileged system app, or one signed with the platform key.',
  Signature: 'Only an app signed with the same certificate as the platform.',
  System: 'Reserved for the system image itself.',
  Normal: 'Granted automatically at install — no prompt, no privilege needed.',
}

function ProtectionChip({ level }: { level?: string }) {
  const label = level ?? 'Not stated'
  return (
    <span
      className={cn('chip', level === 'Dangerous' && 'border-difficulty-advanced/50 text-difficulty-advanced')}
      title={level ? PROTECTION_HINT[level] : 'VehiclePropertyIds.java does not document a protection level for this one.'}
    >
      {label}
    </span>
  )
}

export function PermissionLookup() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<string | null>(null)
  const searchId = useId()
  const deferred = useDeferredValue(query.trim().toLowerCase())

  const permissionRows = useMemo(
    () =>
      Object.values(carPermissions).map((perm) => ({
        perm,
        readBy: vehicleProperties.filter((p) => p.readPermissions?.includes(perm.name)),
        writeBy: vehicleProperties.filter((p) => p.writePermissions?.includes(perm.name)),
      })),
    [],
  )

  const propertyMatches = useMemo(() => {
    if (!deferred) return []
    return vehicleProperties
      .filter((p) => p.name.toLowerCase().includes(deferred))
      .slice(0, 8)
  }, [deferred])

  const results = useMemo(() => {
    return permissionRows.filter(({ perm }) => {
      if (level && (perm.protection ?? 'Not stated') !== level) return false
      if (!deferred) return true
      return perm.value.toLowerCase().includes(deferred) || perm.name.toLowerCase().includes(deferred)
    })
  }, [permissionRows, deferred, level])

  // A property-name search should surface the permissions ITS reads/writes use,
  // not just permissions whose own string happens to contain the query.
  const propertyDriven = useMemo(() => {
    if (propertyMatches.length === 0) return null
    const names = new Set<string>()
    for (const p of propertyMatches) {
      p.readPermissions?.forEach((n) => names.add(n))
      p.writePermissions?.forEach((n) => names.add(n))
    }
    return permissionRows.filter((r) => names.has(r.perm.name))
  }, [propertyMatches, permissionRows])

  const shown = deferred && propertyDriven && propertyDriven.length > 0 ? propertyDriven : results

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-bg/85 px-4 py-4 backdrop-blur md:mx-0 md:rounded-xl md:border md:px-5">
        <label htmlFor={searchId} className="sr-only">
          Search by property name or permission string
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by property (PERF_VEHICLE_SPEED) or permission (CAR_SPEED)"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-fg outline-none placeholder:text-subtle focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
          />
        </div>

        {propertyMatches.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            Matches {propertyMatches.length} propert{propertyMatches.length === 1 ? 'y' : 'ies'} —
            showing the permissions their read/write access uses.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {PROTECTION_LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={level === l}
              onClick={() => setLevel((cur) => (cur === l ? null : l))}
              className={cn(
                'chip cursor-pointer transition-colors',
                level === l ? 'border-accent/60 bg-accent-soft text-accent' : 'hover:border-line-strong hover:text-fg',
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <p aria-live="polite" className="font-mono text-xs text-muted">
            {shown.length} of {permissionRows.length} permissions
          </p>
          {(query || level) && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setLevel(null)
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-fg"
            >
              <X aria-hidden className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          No permission matches that. Try the property name it gates, or clear the filter.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {shown.map(({ perm, readBy, writeBy }) => (
            <li key={perm.name} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <code className="font-mono text-sm font-semibold text-fg [overflow-wrap:anywhere]">
                  {perm.value}
                </code>
                <ProtectionChip level={perm.protection} />
              </div>
              {(readBy.length > 0 || writeBy.length > 0) && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {readBy.length > 0 && (
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                        Read access for
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {readBy.map((p) => (
                          <Link
                            key={p.name}
                            href={`/learn/vehicle-properties/${propertySlug(p)}/`}
                            className="chip transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {writeBy.length > 0 && (
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                        Write access for
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {writeBy.map((p) => (
                          <Link
                            key={p.name}
                            href={`/learn/vehicle-properties/${propertySlug(p)}/`}
                            className="chip transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs leading-relaxed text-subtle">
        Generated from{' '}
        <a
          href="https://cs.android.com/android/platform/superproject/main/+/main:packages/services/Car/car-lib/src/android/car/Car.java"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-accent hover:underline"
        >
          Car.java and VehiclePropertyIds.java
          <ExternalLink aria-hidden className="size-3" />
        </a>
        . &ldquo;Not stated&rdquo; means neither source declares a protection level for that
        permission, not that it is unprotected.
      </p>
    </div>
  )
}
