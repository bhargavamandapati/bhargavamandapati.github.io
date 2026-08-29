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
import type { CameraPreset, CarScene, Readout } from './scene'
import { cn } from '@/lib/utils'

const CAMERAS: { value: CameraPreset; label: string }[] = [
  { value: 'three-quarter', label: 'Three-quarter' },
  { value: 'side', label: 'Side' },
  { value: 'front', label: 'Front' },
  { value: 'top', label: 'Top' },
]

const slug = (property: string) => property.toLowerCase().replace(/_/g, '-')

/** One line in the event log, mirroring what a VHAL write looks like. */
type LogEntry = { id: number; property: string; value: string; time: string; inert: boolean }

function formatValue(control: Control, value: SimState[keyof SimState]): string {
  if (typeof value === 'boolean') return String(value)
  if (control.kind === 'enum') {
    const option = control.options?.find((o) => o.value === value)
    return option ? `${option.label} (${value})` : String(value)
  }
  return control.format ? `${value} ${control.unit ?? ''} — ${control.format(value as number)}` : `${value}${control.unit ? ' ' + control.unit : ''}`
}

export function CarSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<CarScene | null>(null)
  const stateRef = useRef<SimState>({ ...initialState })
  const rafRef = useRef<number>(0)

  const [state, setState] = useState<SimState>({ ...initialState })
  const [readout, setReadout] = useState<Readout>({ effectiveSpeed: 0, cabinTemp: 21, lowTyres: [] })
  const [camera, setCamera] = useState<CameraPreset>('three-quarter')
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
        }
        return [entry, ...entries].slice(0, 40)
      })
    },
    [],
  )

  // Build the scene once, on the client, after the module is dynamically loaded.
  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    import('./scene')
      .then(({ createCarScene }) => {
        if (cancelled) return
        const { width, height } = wrap.getBoundingClientRect()
        sceneRef.current = createCarScene(canvas, width, height)
        sceneRef.current.setCameraPreset(camera)
        setReady(true)
      })
      .catch(() => {
        // WebGL unavailable or the chunk failed — the panel still works.
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
    // Built once; camera changes are pushed through their own effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    sceneRef.current?.setCameraPreset(camera)
  }, [camera])

  // Resize with the container rather than the window.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) sceneRef.current?.resize(width, height)
    })
    observer.observe(wrap)
    return () => observer.disconnect()
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
      const next = sceneRef.current?.update(stateRef.current, delta, elapsed)
      sceneRef.current?.render()
      if (next && sincePublish > 0.16) {
        sincePublish = 0
        setReadout(next)
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="min-w-0">
        {/* ---- Scene ---- */}
        <div
          ref={wrapRef}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-bg-subtle"
        >
          <canvas
            ref={canvasRef}
            className="size-full"
            role="img"
            aria-label={`3D car. Speed ${kmh} kilometres per hour, cabin ${readout.cabinTemp.toFixed(1)} degrees. The dashboard below states the full vehicle state in text.`}
          />
          {!ready && !failed && (
            <p className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
              Loading the scene…
            </p>
          )}
          {failed && (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted">
              The 3D view could not start — WebGL may be unavailable. The controls and the
              dashboard below still work.
            </p>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {CAMERAS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCamera(c.value)}
                aria-pressed={camera === c.value}
                className={cn(
                  'chip cursor-pointer backdrop-blur transition-colors',
                  camera === c.value
                    ? 'border-accent/60 bg-accent text-accent-fg'
                    : 'bg-surface/80 hover:text-fg',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

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

        {/* ---- Cluster readout ---- */}
        <div className="card mt-4 p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Instrument cluster
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Readouts label="Speed" value={`${kmh}`} unit="km/h" />
            <Readouts label="Cabin" value={readout.cabinTemp.toFixed(1)} unit="°C" />
            <Readouts label="Battery" value={`${state.batteryLevel}`} unit="%" />
            <Readouts
              label="Range"
              value={`${Math.round((state.batteryLevel / 100) * 420)}`}
              unit="km"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-live="polite">
            {state.parkingBrake && <Telltale tone="warn">PARKING BRAKE</Telltale>}
            {readout.lowTyres.length > 0 && (
              <Telltale tone="warn">TYRE PRESSURE · {readout.lowTyres.length} low</Telltale>
            )}
            {state.chargePortConnected && state.chargePortOpen && (
              <Telltale tone="ok">CHARGING</Telltale>
            )}
            {state.headlights && <Telltale tone="ok">{state.highBeam ? 'MAIN BEAM' : 'LIGHTS'}</Telltale>}
            {state.cruiseEnabled && <Telltale tone="ok">CRUISE</Telltale>}
            {state.laneKeepEnabled && <Telltale tone="ok">LANE KEEP</Telltale>}
            {state.hvacPower && state.hvacAc && <Telltale tone="ok">A/C</Telltale>}
            {state.ignition < 3 && <Telltale tone="muted">IGNITION OFF</Telltale>}
          </div>
        </div>

        {/* ---- Event log ---- */}
        <div className="card mt-4 p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Property writes
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Every control below is a real vehicle property. This is what your changes would look
            like arriving at the VHAL.
          </p>
          <ul className="mt-3 max-h-56 overflow-y-auto font-mono text-xs">
            {log.length === 0 && (
              <li className="py-2 text-subtle">Change something to see the writes.</li>
            )}
            {log.map((entry) => (
              <li key={entry.id} className="flex flex-wrap gap-x-3 border-b border-line py-1.5 last:border-b-0">
                <span className="text-subtle">{entry.time}</span>
                <Link
                  href={`/learn/vehicle-properties/${slug(entry.property)}/`}
                  className="text-accent hover:underline"
                >
                  {entry.property}
                </Link>
                <span className="text-muted [overflow-wrap:anywhere]">= {entry.value}</span>
                {entry.inert && (
                  <span className="text-difficulty-advanced">accepted · no effect</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- Controls ---- */}
      <div className="min-w-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
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
