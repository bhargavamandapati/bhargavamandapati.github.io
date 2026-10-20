'use client'

import { useId, useState } from 'react'
import { ActionButton, C, Choice, Panel, Readout, Slider } from './ui'

/* ------------------------------ pure math ------------------------------ */

export type FnKey = 'parabola' | 'double-well' | 'bumpy'

export interface FnDef {
  label: string
  expr: string
  f: (x: number) => number
  df: (x: number) => number
  domain: [number, number]
  defaultStart: number
}

export const FUNCTIONS: Record<FnKey, FnDef> = {
  parabola: {
    label: 'Parabola',
    expr: 'f(x) = x²',
    f: (x) => x * x,
    df: (x) => 2 * x,
    domain: [-4, 4],
    defaultStart: 3,
  },
  'double-well': {
    label: 'Double well',
    expr: 'f(x) = x⁴ − 3x² + x',
    f: (x) => x ** 4 - 3 * x * x + x,
    df: (x) => 4 * x ** 3 - 6 * x + 1,
    domain: [-2.2, 2.2],
    defaultStart: 1.5,
  },
  bumpy: {
    label: 'Bumpy',
    expr: 'f(x) = x² + 3 sin(2x)',
    f: (x) => x * x + 3 * Math.sin(2 * x),
    df: (x) => 2 * x + 6 * Math.cos(2 * x),
    domain: [-4, 4],
    defaultStart: 3,
  },
}

/** One heavy-ball step: v' = beta*v - lr*f'(x); x' = x + v'. With beta = 0 this is plain gradient descent. */
export function gdStep(
  df: (x: number) => number,
  x: number,
  v: number,
  lr: number,
  beta: number,
): { x: number; v: number } {
  const nv = beta * v - lr * df(x)
  return { x: x + nv, v: nv }
}

export const DIVERGE_LIMIT = 50

export type Status = 'start' | 'running' | 'converged' | 'diverged' | 'oscillating' | 'bouncing'

/** Classify the trajectory from the list of visited x values. */
export function analyze(path: number[], df: (x: number) => number): Status {
  const x = path[path.length - 1]
  if (!Number.isFinite(x) || Math.abs(x) > DIVERGE_LIMIT) return 'diverged'
  if (path.length === 1) return 'start'
  if (Math.abs(df(x)) < 1e-3) return 'converged'
  if (path.length >= 4) {
    const n = path.length
    const d1 = path[n - 3] - path[n - 4]
    const d2 = path[n - 2] - path[n - 3]
    const d3 = path[n - 1] - path[n - 2]
    if (d1 * d2 < 0 && d2 * d3 < 0) {
      return Math.abs(d3) >= 0.95 * Math.abs(d2) ? 'oscillating' : 'bouncing'
    }
  }
  return 'running'
}

/** Smallest f over the domain (sampled), used to tell a local minimum from the global one. */
export function globalMin(f: (x: number) => number, [a, b]: [number, number]): number {
  let m = Infinity
  for (let i = 0; i <= 2000; i++) m = Math.min(m, f(a + ((b - a) * i) / 2000))
  return m
}

/* -------------------------------- widget -------------------------------- */

interface Run {
  x: number
  v: number
  path: number[]
}

const W = 600
const H = 340
const M = { l: 44, r: 16, t: 14, b: 30 }

function fresh(x: number): Run {
  return { x, v: 0, path: [x] }
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

function fmt(v: number, d = 3) {
  if (!Number.isFinite(v)) return v > 0 ? '+∞' : v < 0 ? '−∞' : 'NaN'
  if (Math.abs(v) >= 1e6) return v.toExponential(2)
  return v.toFixed(d).replace('-', '−')
}

export default function GradientDescent({
  fn = 'parabola',
  learningRate = 0.1,
  start,
}: {
  fn?: FnKey
  learningRate?: number
  start?: number
}) {
  const initKey: FnKey = fn in FUNCTIONS ? fn : 'parabola'
  const initDef = FUNCTIONS[initKey]
  const initStart = clamp(start ?? initDef.defaultStart, initDef.domain[0], initDef.domain[1])

  const [key, setKey] = useState<FnKey>(initKey)
  const [lr, setLr] = useState(clamp(learningRate, 0.01, 1.2))
  const [beta, setBeta] = useState(0)
  const [startX, setStartX] = useState(initStart)
  const [run, setRun] = useState<Run>(fresh(initStart))
  const clipId = useId().replace(/:/g, '')

  const def = FUNCTIONS[key]
  const [x0, x1] = def.domain
  const status = analyze(run.path, def.df)
  const stopped = status === 'diverged'

  // vertical range from sampled curve
  let ymin = Infinity
  let ymax = -Infinity
  for (let i = 0; i <= 200; i++) {
    const y = def.f(x0 + ((x1 - x0) * i) / 200)
    ymin = Math.min(ymin, y)
    ymax = Math.max(ymax, y)
  }
  const pad = (ymax - ymin) * 0.08
  ymin -= pad
  ymax += pad

  const sx = (x: number) => M.l + ((x - x0) / (x1 - x0)) * (W - M.l - M.r)
  const sy = (y: number) => H - M.b - ((y - ymin) / (ymax - ymin)) * (H - M.t - M.b)

  const curve = Array.from({ length: 241 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 240
    return `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(def.f(x)).toFixed(1)}`
  }).join(' ')

  const cx = run.x
  const inView = Number.isFinite(cx) && cx >= x0 && cx <= x1
  const fx = def.f(cx)
  const g = def.df(cx)
  const shown = run.path.slice(-300).filter((p) => p >= x0 && p <= x1)
  const pts = shown.map((p) => `${sx(p).toFixed(1)},${sy(def.f(p)).toFixed(1)}`).join(' ')

  const stepOnce = (r: Run): Run => {
    if (analyze(r.path, def.df) === 'diverged') return r
    const n = gdStep(def.df, r.x, r.v, lr, beta)
    const path = [...r.path, n.x]
    if (path.length > 2000) path.splice(0, path.length - 2000)
    return { x: n.x, v: n.v, path }
  }
  const step = () => setRun((r) => stepOnce(r))
  const run20 = () =>
    setRun((r) => {
      let cur = r
      for (let i = 0; i < 20; i++) cur = stepOnce(cur)
      return cur
    })
  const reset = () => setRun(fresh(startX))

  const steps = run.path.length - 1
  const gmin = globalMin(def.f, def.domain)

  let note: string
  switch (status) {
    case 'start':
      note = `Press Step. Each step moves x by −learning rate × slope = ${fmt(-lr * g)}.`
      break
    case 'running':
      note = 'Descending: each step moves against the slope, and steps shrink as the slope flattens.'
      break
    case 'converged':
      note =
        fx > gmin + 0.05
          ? `Settled where the slope is ≈ 0, but f = ${fmt(fx)} is higher than the lowest point (${fmt(gmin)}): a local minimum. Try another start x.`
          : 'Converged: the slope is ≈ 0, so the steps have shrunk to nothing.'
      break
    case 'diverged':
      note = 'Diverged: the steps are so large they overshoot more each time and x blows up. Lower the learning rate and Reset.'
      break
    case 'oscillating':
      note = 'Oscillating: each step overshoots the minimum by as much as it started, so x jumps back and forth without settling. Lower the learning rate.'
      break
    default:
      note = 'Bouncing across the minimum, but each bounce is smaller, so it is still settling. A smaller learning rate would approach smoothly.'
  }

  const label = `${def.expr}. Gradient descent after ${steps} steps: x = ${fmt(cx)}, f(x) = ${fmt(fx)}, slope ${fmt(g)}. ${note}`
  const xticks: number[] = []
  for (let t = Math.ceil(x0); t <= x1; t++) xticks.push(t)
  const yticks = Array.from({ length: 5 }, (_, i) => ymin + ((ymax - ymin) * i) / 4)

  // tangent at current point
  const tan = inView ? { a: [x0, fx + g * (x0 - cx)], b: [x1, fx + g * (x1 - cx)] } : null

  return (
    <Panel>
      <Choice
        label="Function"
        value={key}
        options={(Object.keys(FUNCTIONS) as FnKey[]).map((k) => ({ value: k, label: FUNCTIONS[k].label }))}
        onChange={(k) => {
          setKey(k)
          setStartX(FUNCTIONS[k].defaultStart)
          setRun(fresh(FUNCTIONS[k].defaultStart))
        }}
      />
      <p className="font-mono text-xs text-muted">{def.expr}</p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        className="h-auto max-h-[560px] w-full rounded-lg border border-line bg-surface"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={M.l} y={M.t} width={W - M.l - M.r} height={H - M.t - M.b} />
          </clipPath>
        </defs>
        {yticks.map((t, i) => (
          <g key={i}>
            <line x1={M.l} x2={W - M.r} y1={sy(t)} y2={sy(t)} stroke={C.line} strokeWidth={1} />
            <text x={M.l - 6} y={sy(t) + 3} textAnchor="end" fontSize={10} fill={C.subtle}>
              {t.toFixed(1).replace('-', '−')}
            </text>
          </g>
        ))}
        {xticks.map((t) => (
          <text key={t} x={sx(t)} y={H - M.b + 14} textAnchor="middle" fontSize={10} fill={C.subtle}>
            {String(t).replace('-', '−')}
          </text>
        ))}
        <text x={W - M.r} y={H - 4} textAnchor="end" fontSize={10} fill={C.subtle}>
          x
        </text>
        <g clipPath={`url(#${clipId})`}>
          <path d={curve} fill="none" stroke={C.fg} strokeWidth={2} />
          {tan && (
            <line
              x1={sx(tan.a[0])}
              y1={sy(tan.a[1])}
              x2={sx(tan.b[0])}
              y2={sy(tan.b[1])}
              stroke={C.info}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          )}
          {shown.length > 1 && (
            <polyline points={pts} fill="none" stroke={C.accent} strokeWidth={1.25} opacity={0.6} />
          )}
          {shown.slice(0, -1).map((p, i) => (
            <circle key={i} cx={sx(p)} cy={sy(def.f(p))} r={2.5} fill={C.accent} opacity={0.5} />
          ))}
        </g>
        {inView && <circle cx={sx(cx)} cy={sy(fx)} r={6} fill={C.accent} stroke={C.surface} strokeWidth={2} />}
        {!inView && (
          <text x={W / 2} y={M.t + 16} textAnchor="middle" fontSize={12} fill={C.danger}>
            x = {fmt(cx)} is off the chart
          </text>
        )}
        <g fontSize={10} fill={C.muted}>
          <line x1={M.l + 8} x2={M.l + 28} y1={M.t + 12} y2={M.t + 12} stroke={C.info} strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={M.l + 34} y={M.t + 15}>
            tangent (slope f′(x))
          </text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="x" value={fmt(cx)} />
        <Readout label="f(x)" value={fmt(fx)} />
        <Readout label="f′(x) slope" value={fmt(g)} />
        <Readout label="steps" value={String(steps)} />
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`rounded-lg border px-3 py-2 text-sm ${
          stopped || status === 'oscillating' ? 'border-danger text-danger' : 'border-line text-muted'
        }`}
      >
        {note}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="Learning rate" value={lr} min={0.01} max={1.2} step={0.01} onChange={setLr} format={(v) => v.toFixed(2)} />
        <Slider
          label="Start x (resets the run)"
          value={startX}
          min={x0}
          max={x1}
          step={0.05}
          onChange={(v) => {
            setStartX(v)
            setRun(fresh(v))
          }}
          format={(v) => fmt(v, 2)}
        />
        <Slider label="Momentum (0 = plain)" value={beta} min={0} max={0.95} step={0.05} onChange={setBeta} format={(v) => v.toFixed(2)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={step}>Step</ActionButton>
        <ActionButton onClick={run20}>Run 20</ActionButton>
        <ActionButton onClick={reset}>Reset</ActionButton>
      </div>
      <p className="text-xs text-subtle">
        Update: x ← x − lr · f′(x){beta > 0 ? `, with momentum v ← ${beta.toFixed(2)}·v − lr · f′(x), x ← x + v` : ''}.
      </p>
    </Panel>
  )
}
