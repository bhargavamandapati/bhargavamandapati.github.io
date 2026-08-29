'use client'

import { useCallback, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { Ban, Monitor, RotateCcw, TriangleAlert, User } from 'lucide-react'
import {
  apps,
  displays,
  initialCockpit,
  restrictionsFor,
  users,
  zones,
  type AppKind,
  type CockpitState,
} from '@/data/cockpit'
import { cn } from '@/lib/utils'

const slug = (p: string) => p.toLowerCase().replace(/_/g, '-')

function PropertyLink({ name }: { name: string }) {
  return (
    <Link
      href={`/learn/vehicle-properties/${slug(name)}/`}
      className="font-mono text-[0.68rem] text-muted transition-colors hover:text-accent [overflow-wrap:anywhere]"
    >
      {name}
    </Link>
  )
}

/** Renders what one display is actually showing, after the rules are applied. */
function Screen({
  label,
  displayId,
  zoneLabel,
  userName,
  app,
  blocked,
  reason,
  brightness,
  nightMode,
  driverFacing,
}: {
  label: string
  displayId: number
  zoneLabel: string
  userName: string
  app: AppKind
  blocked: boolean
  reason?: string
  brightness: number
  nightMode: boolean
  driverFacing: boolean
}) {
  const meta = apps.find((a) => a.kind === app)!
  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-colors',
        blocked ? 'border-difficulty-advanced/50' : 'border-line',
      )}
      style={{
        background: `color-mix(in srgb, var(--surface) ${Math.max(brightness, 35)}%, var(--bg))`,
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <span className="font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
          {label}
        </span>
        <span className="font-mono text-[0.62rem] text-subtle">display {displayId}</span>
      </div>

      <div className="mt-2 min-h-[3.6rem]">
        {blocked ? (
          <p className="flex items-start gap-1.5 text-[0.78rem] leading-relaxed text-difficulty-advanced">
            <Ban aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {reason}
          </p>
        ) : (
          <p className="text-sm font-medium text-fg">{meta.label}</p>
        )}
        {!blocked && app !== 'none' && (
          <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">
            {meta.distractionOptimised
              ? 'distractionOptimized — allowed while driving'
              : 'not distraction-optimised'}
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-2 font-mono text-[0.62rem] text-subtle">
        <span className="inline-flex items-center gap-1">
          <User aria-hidden className="size-3" />
          {userName}
        </span>
        <span>{zoneLabel}</span>
        <span>{brightness}%</span>
        {driverFacing && <span className="text-difficulty-advanced">driver-facing</span>}
        {nightMode && <span>night</span>}
      </div>
    </div>
  )
}

export function CockpitSimulator() {
  const [state, setState] = useState<CockpitState>({ ...initialCockpit })
  const id = useId()

  const set = useCallback(<K extends keyof CockpitState>(key: K, value: CockpitState[K]) => {
    setState((s) => ({ ...s, [key]: value }))
  }, [])

  const ux = useMemo(() => restrictionsFor(state.speed), [state.speed])

  const rows = displays.map((d) => {
    const zone = zones.find((z) => z.id === d.zone)!
    const userId = d.zone === 'driver' ? state.foregroundUser : state.zoneUser[d.zone]
    const user = users.find((u) => u.id === userId)!
    const app = state.running[d.id]
    const meta = apps.find((a) => a.kind === app)!

    // Only driver-facing displays are policed. This is the whole point.
    const blocked = d.driverFacing && ux.moving && !meta.distractionOptimised
    return {
      display: d,
      zone,
      user,
      app,
      blocked,
      reason: blocked
        ? `Blocked while moving — ${meta.label} is not marked distractionOptimized, and this display faces the driver.`
        : undefined,
    }
  })

  // The launch demonstration: where does an Activity actually land?
  const launched = state.nameTheDisplay
    ? displays.find((d) => d.id === state.launchDisplay)!
    : displays.find((d) => d.displayId === 0)!

  const blockedCount = rows.filter((r) => r.blocked).length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0">
        {/* ---- Cockpit plan ---- */}
        <div className="card p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Occupant zones
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            A zone ties a seat to its displays and to a user. Nothing here is “the” display or
            “the” user.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {zones.map((zone) => {
              const zoneDisplays = displays.filter((d) => d.zone === zone.id)
              const userId =
                zone.id === 'driver' ? state.foregroundUser : state.zoneUser[zone.id]
              const user = users.find((u) => u.id === userId)!
              const occupied = state.occupied[zone.id]
              return (
                <div
                  key={zone.id}
                  className={cn(
                    'rounded-lg border p-3',
                    occupied ? 'border-accent/45 bg-accent-soft/25' : 'border-line',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-fg">{zone.label}</span>
                    <span className="font-mono text-[0.62rem] text-subtle">
                      zone {zone.occupantZoneId}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[0.65rem] text-subtle [overflow-wrap:anywhere]">
                    {zone.seat}
                  </p>
                  <p className="mt-1.5 text-xs text-muted">
                    {occupied ? user.name : 'vacant'}
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] text-subtle [overflow-wrap:anywhere]">
                    {zoneDisplays.map((d) => `display ${d.displayId}`).join(' · ') || 'no display'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ---- Displays ---- */}
        <div className="card mt-4 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
              What each display is showing
            </h2>
            <span
              className={cn(
                'font-mono text-xs',
                ux.moving ? 'text-difficulty-advanced' : 'text-muted',
              )}
              aria-live="polite"
            >
              {ux.moving ? `driving · ${blockedCount} blocked` : 'parked · nothing restricted'}
            </span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
              <Screen
                key={row.display.id}
                label={row.display.label}
                displayId={row.display.displayId}
                zoneLabel={row.zone.label}
                userName={state.occupied[row.zone.id] ? row.user.name : 'vacant'}
                app={row.app}
                blocked={row.blocked}
                reason={row.reason}
                brightness={state.brightness[row.display.id]}
                nightMode={state.nightMode}
                driverFacing={row.display.driverFacing}
              />
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Restrictions police the <strong className="font-medium text-fg">driver-facing</strong>{' '}
            displays only. A rear passenger keeps watching whatever they were watching, which is why{' '}
            <PropertyLink name="SEAT_OCCUPANCY" /> and the zone graph matter as much as the speed
            does.
          </p>
        </div>

        {/* ---- Launch demonstration ---- */}
        <div className="card mt-4 p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Where does the Activity land?
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="min-w-0 rounded-lg border border-line p-3.5">
              <p className="font-mono text-[0.7rem] text-subtle">
                {state.nameTheDisplay ? 'with a launch display' : 'without one'}
              </p>
              <pre
                tabIndex={0}
                className="mt-2 overflow-x-auto font-mono text-[0.72rem] leading-relaxed text-muted"
              >
                <code>
                  {state.nameTheDisplay
                    ? `ActivityOptions options = ActivityOptions.makeBasic();\noptions.setLaunchDisplayId(${launched.displayId});\nstartActivity(intent, options.toBundle());`
                    : `startActivity(intent);`}
                </code>
              </pre>
            </div>
            <div
              className={cn(
                'min-w-0 rounded-lg border p-3.5',
                state.nameTheDisplay ? 'border-accent/50' : 'border-difficulty-advanced/50',
              )}
            >
              <p className="font-mono text-[0.7rem] text-subtle">lands on</p>
              <p className="mt-2 text-sm font-medium text-fg">
                {launched.label} · display {launched.displayId}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {state.nameTheDisplay
                  ? 'Exactly where you asked.'
                  : 'The default display — in front of the driver, whoever you meant it for. A service running as user 0 has no meaningful display of its own, so this is where it goes.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Controls ---- */}
      <div className="min-w-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
        <fieldset className="mb-5">
          <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
            Driving state
          </legend>
          <div className="card p-3.5">
            <label htmlFor={`${id}-speed`} className="text-sm font-medium text-fg">
              Vehicle speed
            </label>
            <div className="mt-0.5">
              <PropertyLink name="PERF_VEHICLE_SPEED" />
            </div>
            <input
              id={`${id}-speed`}
              type="range"
              min={0}
              max={40}
              step={1}
              value={state.speed}
              onChange={(e) => set('speed', Number(e.target.value))}
              className="mt-2 w-full accent-[var(--accent)]"
            />
            <p className="mt-1 font-mono text-[0.7rem] text-muted">
              {state.speed} m/s · {Math.round(state.speed * 3.6)} km/h
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Above zero, UX restrictions apply to the driver-facing displays.
            </p>
          </div>

          <div className="card mt-2 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <label htmlFor={`${id}-night`} className="text-sm font-medium text-fg">
                  Night mode
                </label>
                <div className="mt-0.5">
                  <PropertyLink name="NIGHT_MODE" />
                </div>
              </div>
              <input
                id={`${id}-night`}
                type="checkbox"
                checked={state.nightMode}
                onChange={(e) => set('nightMode', e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
            Users
          </legend>
          <div className="card divide-y divide-line">
            <div className="p-3.5">
              <label htmlFor={`${id}-fg`} className="text-sm font-medium text-fg">
                Foreground user
              </label>
              <select
                id={`${id}-fg`}
                value={state.foregroundUser}
                onChange={(e) => set('foregroundUser', Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                {users
                  .filter((u) => u.kind !== 'system')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} (user {u.id})
                    </option>
                  ))}
              </select>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                User 0 keeps running headless underneath, holding the vehicle services. Switching
                the foreground user does not restart it.
              </p>
            </div>
            {zones
              .filter((z) => z.id !== 'driver')
              .map((zone) => (
                <div key={zone.id} className="p-3.5">
                  <label
                    htmlFor={`${id}-${zone.id}-user`}
                    className="text-sm font-medium text-fg"
                  >
                    {zone.label} user
                  </label>
                  <select
                    id={`${id}-${zone.id}-user`}
                    value={state.zoneUser[zone.id]}
                    onChange={(e) =>
                      set('zoneUser', {
                        ...state.zoneUser,
                        [zone.id]: Number(e.target.value),
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                  >
                    {users
                      .filter((u) => u.kind !== 'system')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} (user {u.id})
                        </option>
                      ))}
                  </select>
                </div>
              ))}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
            Occupancy
          </legend>
          <div className="card divide-y divide-line">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-start justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <label htmlFor={`${id}-${zone.id}-occ`} className="text-sm font-medium text-fg">
                    {zone.label}
                  </label>
                  <div className="mt-0.5">
                    <PropertyLink name="SEAT_OCCUPANCY" />
                  </div>
                  <p className="mt-1 font-mono text-[0.62rem] text-subtle [overflow-wrap:anywhere]">
                    {zone.seat}
                  </p>
                </div>
                <input
                  id={`${id}-${zone.id}-occ`}
                  type="checkbox"
                  checked={state.occupied[zone.id]}
                  onChange={(e) =>
                    set('occupied', { ...state.occupied, [zone.id]: e.target.checked })
                  }
                  className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
                />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
            Displays
          </legend>
          <div className="card divide-y divide-line">
            {displays.map((d) => (
              <div key={d.id} className="p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <label htmlFor={`${id}-${d.id}-app`} className="text-sm font-medium text-fg">
                    {d.label}
                  </label>
                  <span className="font-mono text-[0.62rem] text-subtle">id {d.displayId}</span>
                </div>
                <select
                  id={`${id}-${d.id}-app`}
                  value={state.running[d.id]}
                  onChange={(e) =>
                    set('running', { ...state.running, [d.id]: e.target.value as AppKind })
                  }
                  className="mt-2 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                >
                  {apps.map((a) => (
                    <option key={a.kind} value={a.kind}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor={`${id}-${d.id}-bright`}
                  className="mt-2 block font-mono text-[0.65rem] text-subtle"
                >
                  brightness
                </label>
                <input
                  id={`${id}-${d.id}-bright`}
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={state.brightness[d.id]}
                  onChange={(e) =>
                    set('brightness', { ...state.brightness, [d.id]: Number(e.target.value) })
                  }
                  className="mt-1 w-full accent-[var(--accent)]"
                />
                <div className="mt-1">
                  <PropertyLink name="PER_DISPLAY_BRIGHTNESS" />
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
            Activity launch
          </legend>
          <div className="card p-3.5">
            <div className="flex items-start justify-between gap-3">
              <label htmlFor={`${id}-name`} className="text-sm font-medium text-fg">
                Name a launch display
              </label>
              <input
                id={`${id}-name`}
                type="checkbox"
                checked={state.nameTheDisplay}
                onChange={(e) => set('nameTheDisplay', e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
              />
            </div>
            <select
              value={state.launchDisplay}
              onChange={(e) => set('launchDisplay', e.target.value)}
              disabled={!state.nameTheDisplay}
              aria-label="Target display"
              className="mt-2 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-fg outline-none disabled:opacity-50 focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              {displays.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} (display {d.displayId})
                </option>
              ))}
            </select>
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
              <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              Turn this off to see where an unqualified <code className="font-mono">startActivity</code>{' '}
              actually goes.
            </p>
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => setState({ ...initialCockpit })}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm transition-colors hover:border-line-strong hover:bg-surface"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Reset
        </button>
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-subtle">
          <Monitor aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Display ids here follow the usual convention — 0 is the default display. On a real
          product they come from the occupant zone configuration, not from a constant.
        </p>
      </div>
    </div>
  )
}
