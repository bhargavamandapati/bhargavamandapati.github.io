'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Pause, Play, RotateCcw } from 'lucide-react'
import {
  controls,
  controlGroups,
  initialState,
  type Control,
  type SimState,
} from '@/data/simulator'
import type { ExteriorScene } from './exterior-scene'
import type { InteriorScene, Readout } from './interior-scene'
import { VehicleInfo } from './vehicle-info'
import { cn } from '@/lib/utils'

const slug = (property: string) => property.toLowerCase().replace(/_/g, '-')

const GEAR: Record<number, string> = { 0x0004: 'P', 0x0002: 'R', 0x0001: 'N', 0x0008: 'D' }

/** One line in the event log, mirroring what a VHAL write looks like. */
type LogEntry = {
  id: number
  property: string
  value: string
  time: string
  inert: boolean
  /** What the write does to the car — the other half of the loop. */
  effect: string
}

function formatValue(control: Control, value: SimState[keyof SimState]): string {
  if (typeof value === 'boolean') return String(value)
  if (control.kind === 'enum') {
    const option = control.options?.find((o) => o.value === value)
    return option ? `${option.label} (${value})` : String(value)
  }
  return control.format ? `${value} ${control.unit ?? ''} — ${control.format(value as number)}` : `${value}${control.unit ? ' ' + control.unit : ''}`
}

export function CarSimulator() {
  const insideCanvas = useRef<HTMLCanvasElement>(null)
  const insideWrap = useRef<HTMLDivElement>(null)
  const outsideCanvas = useRef<HTMLCanvasElement>(null)
  const outsideWrap = useRef<HTMLDivElement>(null)
  const interior = useRef<InteriorScene | null>(null)
  const exterior = useRef<ExteriorScene | null>(null)
  const readoutRef = useRef<Readout>({ effectiveSpeed: 0, cabinTemp: 21, lowTyres: 0 })
  const stateRef = useRef<SimState>({ ...initialState })
  const rafRef = useRef<number>(0)

  const [state, setState] = useState<SimState>({ ...initialState })
  const [readout, setReadout] = useState<Readout>({ effectiveSpeed: 0, cabinTemp: 21, lowTyres: 0 })
  // Start paused for anyone who has asked for reduced motion — the scene is
  // continuous animation, and Play is right there.
  const [running, setRunning] = useState(true)
  const [ready, setReady] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])
  const [failed, setFailed] = useState(false)
  const logId = useRef(0)
  const groupId = useId()

  // Keep a ref in sync so the animation loop never closes over stale state.
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setRunning(false)
  }, [])

  const set = useCallback(
    <K extends keyof SimState>(key: K, value: SimState[K], control: Control, inert: boolean) => {
      setState((s) => ({ ...s, [key]: value }))
      setLog((entries) => {
        const entry: LogEntry = {
          id: logId.current++,
          property: control.property,
          value: formatValue(control, value),
          time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          inert,
          effect: control.affects,
        }
        return [entry, ...entries].slice(0, 40)
      })
    },
    [],
  )

  // Build both scenes once, on the client, after the modules load.
  useEffect(() => {
    let cancelled = false
    const inWrap = insideWrap.current
    const outWrap = outsideWrap.current
    const inCanvas = insideCanvas.current
    const outCanvas = outsideCanvas.current
    if (!inWrap || !outWrap || !inCanvas || !outCanvas) return

    Promise.all([import('./interior-scene'), import('./exterior-scene')])
      .then(([inMod, outMod]) => {
        if (cancelled) return
        const a = inWrap.getBoundingClientRect()
        const b = outWrap.getBoundingClientRect()
        interior.current = inMod.createInteriorScene(inCanvas, a.width, a.height)
        exterior.current = outMod.createExteriorScene(outCanvas, b.width, b.height)
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
      interior.current?.dispose()
      exterior.current?.dispose()
      interior.current = null
      exterior.current = null
    }
  }, [])

  // Resize with the containers rather than the window.
  useEffect(() => {
    const observers: ResizeObserver[] = []
    for (const [wrap, get] of [
      [insideWrap.current, () => interior.current],
      [outsideWrap.current, () => exterior.current],
    ] as const) {
      if (!wrap) continue
      const o = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) get()?.resize(width, height)
      })
      o.observe(wrap)
      observers.push(o)
    }
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // The animation loop. Readouts are pushed to React at ~6fps, not 60, so the
  // panel updating never competes with the scene for frame budget.
  useEffect(() => {
    if (!ready) return
    let last = performance.now()
    let elapsed = 0
    let sincePublish = 0

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame)
      const delta = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!running) return
      elapsed += delta
      sincePublish += delta
      const state = stateRef.current
      const powered = state.ignition >= 3
      const moving = state.gear === 0x0008 || state.gear === 0x0002
      const r = readoutRef.current
      r.effectiveSpeed = powered && moving && !state.parkingBrake ? state.speed : 0
      r.lowTyres = [state.tyreFrontLeft, state.tyreFrontRight, state.tyreRearLeft, state.tyreRearRight]
        .filter((kpa) => kpa < 180).length

      interior.current?.update(state, r, delta, elapsed)
      exterior.current?.update(state, delta, elapsed)
      interior.current?.render()
      exterior.current?.render()

      if (sincePublish > 0.16) {
        sincePublish = 0
        setReadout({ ...r })
      }
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [ready, running])

  const grouped = useMemo(
    () => controlGroups.map((group) => ({ group, items: controls.filter((c) => c.group === group) })),
    [],
  )

  const gated = useCallback(
    (control: Control) => control.requires !== undefined && !state[control.requires],
    [state],
  )

  const reset = () => {
    setState({ ...initialState })
    setLog([])
  }

  const kmh = Math.round(readout.effectiveSpeed * 3.6)
  const openDoors = [
    state.doorFrontLeft,
    state.doorFrontRight,
    state.doorRearLeft,
    state.doorRearRight,
  ].filter(Boolean).length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="min-w-0">
        {/* ---- Inside the car ---- */}
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)]">
          <figure className="min-w-0">
            <div
              ref={insideWrap}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-[#070a0f]"
            >
              <canvas
                ref={insideCanvas}
                className="size-full"
                role="img"
                aria-label={`Driver's view. Speed ${kmh} kilometres per hour, gear ${GEAR[state.gear] ?? 'unknown'}, cabin ${readout.cabinTemp.toFixed(1)} degrees. The cluster panel below states everything in text.`}
              />
              {!ready && !failed && (
                <p className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
                  Loading the cabin…
                </p>
              )}
              {failed && (
                <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted">
                  The 3D view could not start — WebGL may be unavailable. Every control and readout
                  below still works.
                </p>
              )}
              <span className="pointer-events-none absolute left-3 top-3 chip bg-surface/80 backdrop-blur">
                Inside · driver
              </span>
              <div className="absolute right-3 top-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setRunning((r) => !r)}
                  className="chip cursor-pointer bg-surface/80 backdrop-blur hover:text-fg"
                  aria-label={running ? 'Pause the simulation' : 'Resume the simulation'}
                >
                  {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  {running ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="chip cursor-pointer bg-surface/80 backdrop-blur hover:text-fg"
                >
                  <RotateCcw className="size-3.5" />
                  Reset
                </button>
              </div>
            </div>
            <figcaption className="mt-2 text-xs leading-relaxed text-muted">
              Cluster, centre screen, steering wheel and its controls, gear selector and the vents.
              The screens are drawn live from the property values.
            </figcaption>
          </figure>

          {/* ---- Outside the car ---- */}
          <figure className="min-w-0">
            <div
              ref={outsideWrap}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-line bg-[#070a0f]"
            >
              <canvas
                ref={outsideCanvas}
                className="size-full"
                role="img"
                aria-label={`Top view of the car. ${openDoors === 0 ? 'All doors closed' : `${openDoors} door${openDoors > 1 ? 's' : ''} open`}, boot ${state.bootOpen ? 'open' : 'closed'}, ${readout.lowTyres} tyres low.`}
              />
              <span className="pointer-events-none absolute left-3 top-3 chip bg-surface/80 backdrop-blur">
                Outside · top view
              </span>
            </div>
            <figcaption className="mt-2 text-xs leading-relaxed text-muted">
              Doors, boot, charge flap, lights, steering and tyre warnings — the state you cannot
              see from the driver&rsquo;s seat.
            </figcaption>
          </figure>
        </div>

        {/* ---- Cluster readout ---- */}
        <div className="card mt-4 p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Vehicle state, in text
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Readouts label="Speed" value={`${kmh}`} unit="km/h" />
            <Readouts label="Gear" value={GEAR[state.gear] ?? '—'} unit="" />
            <Readouts label="Cabin" value={readout.cabinTemp.toFixed(1)} unit="°C" />
            <Readouts label="Battery" value={`${state.batteryLevel}`} unit="%" />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-live="polite">
            {state.ignition < 3 && <Telltale tone="muted">IGNITION OFF</Telltale>}
            {state.parkingBrake && <Telltale tone="warn">PARKING BRAKE</Telltale>}
            {readout.lowTyres > 0 && (
              <Telltale tone="warn">TYRE PRESSURE · {readout.lowTyres} low</Telltale>
            )}
            {openDoors > 0 && <Telltale tone="warn">{openDoors} DOOR OPEN</Telltale>}
            {state.bootOpen && <Telltale tone="warn">BOOT OPEN</Telltale>}
            {state.chargePortConnected && state.chargePortOpen && (
              <Telltale tone="ok">CHARGING</Telltale>
            )}
            {state.headlights && (
              <Telltale tone="ok">{state.highBeam ? 'MAIN BEAM' : 'LIGHTS'}</Telltale>
            )}
            {state.cruiseEnabled && <Telltale tone="ok">CRUISE</Telltale>}
            {state.laneKeepEnabled && <Telltale tone="ok">LANE KEEP</Telltale>}
            {state.hvacPower && state.hvacAc && <Telltale tone="ok">A/C</Telltale>}
          </div>
        </div>

        {/* ---- Event log ---- */}
        <div className="card mt-4 p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Property writes
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Every control is a real vehicle property. This is the write arriving at the VHAL, and
            what it does to the car.
          </p>
          <ul className="mt-3 max-h-56 overflow-y-auto font-mono text-xs">
            {log.length === 0 && (
              <li className="py-2 text-subtle">Change something to see the writes.</li>
            )}
            {log.map((entry) => (
              <li key={entry.id} className="border-b border-line py-2 last:border-b-0">
                <div className="flex flex-wrap gap-x-3">
                  <span className="text-subtle">{entry.time}</span>
                  <Link
                    href={`/learn/vehicle-properties/${slug(entry.property)}/`}
                    className="text-accent hover:underline"
                  >
                    {entry.property}
                  </Link>
                  <span className="text-muted [overflow-wrap:anywhere]">= {entry.value}</span>
                </div>
                <p
                  className={cn(
                    'mt-1 font-sans text-[0.72rem] leading-relaxed',
                    entry.inert ? 'text-difficulty-advanced' : 'text-subtle',
                  )}
                >
                  {entry.inert ? 'Accepted, and nothing happened — its dependency is off.' : entry.effect}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- Controls ---- */}
      <div className="min-w-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
        <div className="mb-5">
          <VehicleInfo />
        </div>
        {grouped.map(({ group, items }) => (
          <fieldset key={group} className="mb-5">
            <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
              {group}
            </legend>
            <div className="card divide-y divide-line">
              {items.map((control) => (
                <ControlRow
                  key={`${control.key}-${control.label}`}
                  control={control}
                  value={state[control.key]}
                  gatedBy={gated(control)}
                  idPrefix={groupId}
                  onChange={(v) => set(control.key, v as never, control, gated(control))}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}

function Readouts({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">{label}</p>
      <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-fg">
        {value}
        <span className="ml-1 text-sm font-normal text-muted">{unit}</span>
      </p>
    </div>
  )
}

function Telltale({ tone, children }: { tone: 'ok' | 'warn' | 'muted'; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'chip',
        tone === 'warn' && 'border-difficulty-advanced/50 text-difficulty-advanced',
        tone === 'ok' && 'border-accent/50 text-accent',
      )}
    >
      {children}
    </span>
  )
}

function ControlRow({
  control,
  value,
  gatedBy,
  idPrefix,
  onChange,
}: {
  control: Control
  value: SimState[keyof SimState]
  /** True when a dependency is unmet — the control still works, it just does nothing. */
  gatedBy: boolean
  idPrefix: string
  onChange: (value: number | boolean) => void
}) {
  const id = `${idPrefix}-${control.key}-${control.label.replace(/\s+/g, '')}`
  return (
    <div className={cn('p-3.5', gatedBy && 'bg-difficulty-advanced/[0.04]')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-medium text-fg">
            {control.label}
          </label>
          <Link
            href={`/learn/vehicle-properties/${slug(control.property)}/`}
            className="mt-0.5 flex items-center gap-1 font-mono text-[0.68rem] text-muted transition-colors hover:text-accent"
          >
            {control.property}
            <ExternalLink aria-hidden className="size-3 shrink-0" />
          </Link>
        </div>
        {control.kind === 'toggle' && (
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
          />
        )}
      </div>

      {control.kind === 'range' && (
        <div className="mt-2">
          <input
            id={id}
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
          <p className="mt-1 font-mono text-[0.7rem] text-muted">
            {String(value)}
            {control.unit ? ` ${control.unit}` : ''}
            {control.format ? ` · ${control.format(Number(value))}` : ''}
          </p>
        </div>
      )}

      {control.kind === 'enum' && (
        <select
          id={id}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          {control.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      <p className="mt-1.5 text-xs leading-relaxed text-muted">{control.affects}</p>
      {control.note && <p className="mt-1 text-xs leading-relaxed text-subtle">{control.note}</p>}
      {gatedBy && control.requires && (
        <p className="mt-1.5 font-mono text-[0.68rem] leading-relaxed text-difficulty-advanced">
          The write is accepted and does nothing —{' '}
          {controls.find((c) => c.key === control.requires)?.property} is off.
        </p>
      )}
    </div>
  )
}
