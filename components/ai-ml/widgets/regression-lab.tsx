'use client'

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ActionButton, C, Choice, Panel, Readout, Slider } from './ui'

// --- math:start
export type Pt = { x: number; y: number }

export type Fit = { m: number; b: number; ok: boolean }

/** Ordinary least squares for y = m x + b. ok is false when all x are equal. */
export function leastSquares(pts: Pt[]): Fit {
  const n = pts.length
  if (n === 0) return { m: 0, b: 0, ok: false }
  const xb = pts.reduce((s, p) => s + p.x, 0) / n
  const yb = pts.reduce((s, p) => s + p.y, 0) / n
  let sxx = 0
  let sxy = 0
  for (const p of pts) {
    sxx += (p.x - xb) * (p.x - xb)
    sxy += (p.x - xb) * (p.y - yb)
  }
  if (sxx < 1e-12) return { m: 0, b: yb, ok: false }
  const m = sxy / sxx
  return { m, b: yb - m * xb, ok: true }
}

/** Mean squared error of the line y = m x + b over the points. */
export function mse(pts: Pt[], m: number, b: number): number {
  if (pts.length === 0) return 0
  return pts.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0) / pts.length
}

/** R^2 = 1 - SS_res / SS_tot. NaN when all y are equal (SS_tot = 0). */
export function rSquared(pts: Pt[], m: number, b: number): number {
  const n = pts.length
  if (n === 0) return NaN
  const yb = pts.reduce((s, p) => s + p.y, 0) / n
  const sst = pts.reduce((s, p) => s + (p.y - yb) ** 2, 0)
  if (sst < 1e-12) return NaN
  const ssr = pts.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0)
  return 1 - ssr / sst
}
// --- math:end

type Props = { points?: unknown; mode?: unknown }
type Mode = 'fit' | 'manual'

const XMAX = 10
const YMAX = 10
const W = 560
const H = 380
const PL = 40
const PR = 16
const PT = 12
const PB = 36
const PW = W - PL - PR
const PH = H - PT - PB

const sx = (x: number) => PL + (x / XMAX) * PW
const sy = (y: number) => PT + PH - (y / YMAX) * PH
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const round2 = (v: number) => Math.round(v * 100) / 100

const XS = [0.6, 1.4, 2.1, 2.9, 3.6, 4.4, 5.1, 5.9, 6.6, 7.4, 8.3, 9.2]
const mk = (ys: number[]): Pt[] => XS.map((x, i) => ({ x, y: ys[i] }))

const PRESETS: { id: string; label: string; pts: Pt[] }[] = [
  {
    id: 'noisy',
    label: 'Noisy line',
    // y = 0.8 x + 1 plus fixed noise
    pts: mk([1.9, 1.8, 3.2, 3.0, 4.3, 4.2, 5.4, 5.6, 6.2, 7.3, 7.4, 8.9]),
  },
  {
    id: 'outlier',
    label: 'Outlier',
    pts: mk([1.9, 1.8, 3.2, 3.0, 4.3, 4.2, 5.4, 5.6, 6.2, 7.3, 7.4, 0.8]),
  },
  {
    id: 'none',
    label: 'No relationship',
    pts: mk([5.2, 7.6, 2.8, 6.4, 4.1, 8.2, 3.3, 5.9, 2.2, 7.1, 4.8, 6.0]),
  },
]

function parsePoints(input: unknown): Pt[] {
  if (Array.isArray(input)) {
    const out: Pt[] = []
    for (const p of input) {
      let x: number
      let y: number
      if (Array.isArray(p) && p.length >= 2) {
        x = Number(p[0])
        y = Number(p[1])
      } else if (p && typeof p === 'object') {
        x = Number((p as { x?: unknown }).x)
        y = Number((p as { y?: unknown }).y)
      } else continue
      if (Number.isFinite(x) && Number.isFinite(y)) {
        out.push({ x: clamp(x, 0, XMAX), y: clamp(y, 0, YMAX) })
      }
    }
    if (out.length >= 2) return out.slice(0, 40)
  }
  return PRESETS[0].pts.map((p) => ({ ...p }))
}

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  const s = n.toFixed(digits)
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s
}

export default function RegressionLab({ points, mode: modeProp }: Props) {
  const initial = useRef<Pt[] | null>(null)
  if (initial.current === null) initial.current = parsePoints(points)
  const [pts, setPts] = useState<Pt[]>(() => initial.current!.map((p) => ({ ...p })))
  const [mode, setMode] = useState<Mode>(modeProp === 'manual' ? 'manual' : 'fit')
  const [mh, setMh] = useState(0.5)
  const [bh, setBh] = useState(2)
  const [drag, setDrag] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const fit = leastSquares(pts)
  const shown = mode === 'fit' ? fit : { m: mh, b: bh, ok: true }
  const shownMse = mse(pts, shown.m, shown.b)
  const shownR2 = rSquared(pts, shown.m, shown.b)
  const bestMse = mse(pts, fit.m, fit.b)

  const move = (i: number, x: number, y: number) =>
    setPts((prev) => prev.map((p, j) => (j === i ? { x: clamp(x, 0, XMAX), y: clamp(y, 0, YMAX) } : p)))

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (drag === null || !svgRef.current) return
    const r = svgRef.current.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    const vx = ((e.clientX - r.left) / r.width) * W
    const vy = ((e.clientY - r.top) / r.height) * H
    move(drag, round2(((vx - PL) / PW) * XMAX), round2(((PT + PH - vy) / PH) * YMAX))
  }

  const onKey = (i: number, e: KeyboardEvent<SVGCircleElement>) => {
    const step = e.shiftKey ? 0.5 : 0.1
    const p = pts[i]
    let dx = 0
    let dy = 0
    if (e.key === 'ArrowLeft') dx = -step
    else if (e.key === 'ArrowRight') dx = step
    else if (e.key === 'ArrowUp') dy = step
    else if (e.key === 'ArrowDown') dy = -step
    else return
    e.preventDefault()
    move(i, round2(p.x + dx), round2(p.y + dy))
  }

  const loadPreset = (p: Pt[]) => setPts(p.map((q) => ({ ...q })))

  const lineY = (x: number) => shown.m * x + shown.b
  const bestY = (x: number) => fit.m * x + fit.b

  const label =
    `Scatter plot of ${pts.length} points with the ${mode === 'fit' ? 'least-squares' : 'hand-set'} line ` +
    `y = ${fmt(shown.m)} x ${shown.b < 0 ? '-' : '+'} ${fmt(Math.abs(shown.b))}. ` +
    `Mean squared error ${fmt(shownMse)}, R squared ${fmt(shownR2)}.` +
    (mode === 'manual' ? ` Best fit would be slope ${fmt(fit.m)}, intercept ${fmt(fit.b)}, error ${fmt(bestMse)}.` : '')

  const xt = [0, 2, 4, 6, 8, 10]
  const yt = [0, 2, 4, 6, 8, 10]

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Choice
          label="Mode"
          value={mode}
          options={[
            { value: 'fit', label: 'Best fit' },
            { value: 'manual', label: 'Set line by hand' },
          ]}
          onChange={setMode}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Presets">
        <span className="text-xs text-muted">Presets</span>
        {PRESETS.map((p) => (
          <ActionButton key={p.id} onClick={() => loadPreset(p.pts)}>
            {p.label}
          </ActionButton>
        ))}
        <ActionButton onClick={() => loadPreset(initial.current!)}>Reset</ActionButton>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        className="mx-auto block w-full select-none"
        style={{ maxWidth: 720, touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
      >
        <defs>
          <clipPath id="regression-lab-clip">
            <rect x={PL} y={PT} width={PW} height={PH} />
          </clipPath>
        </defs>
        <rect x={PL} y={PT} width={PW} height={PH} fill={C.surface} stroke={C.strong} />
        {xt.map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} y1={PT} x2={sx(t)} y2={PT + PH} stroke={C.line} opacity={0.6} />
            <text x={sx(t)} y={PT + PH + 16} fill={C.subtle} fontSize={11} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        {yt.map((t) => (
          <g key={`y${t}`}>
            <line x1={PL} y1={sy(t)} x2={PL + PW} y2={sy(t)} stroke={C.line} opacity={0.6} />
            <text x={PL - 6} y={sy(t) + 4} fill={C.subtle} fontSize={11} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        <text x={PL + PW / 2} y={H - 4} fill={C.muted} fontSize={12} textAnchor="middle">
          x
        </text>
        <text x={12} y={PT + PH / 2} fill={C.muted} fontSize={12} textAnchor="middle" transform={`rotate(-90 12 ${PT + PH / 2})`}>
          y
        </text>

        <g clipPath="url(#regression-lab-clip)">
          {mode === 'manual' && fit.ok && (
            <line
              x1={sx(0)}
              y1={sy(bestY(0))}
              x2={sx(XMAX)}
              y2={sy(bestY(XMAX))}
              stroke={C.info}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          )}
          {pts.map((p, i) => (
            <line
              key={`r${i}`}
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(p.x)}
              y2={sy(lineY(p.x))}
              stroke={C.danger}
              strokeWidth={1.5}
              opacity={0.85}
            />
          ))}
          <line
            x1={sx(0)}
            y1={sy(lineY(0))}
            x2={sx(XMAX)}
            y2={sy(lineY(XMAX))}
            stroke={C.accent}
            strokeWidth={2.5}
          />
        </g>

        {pts.map((p, i) => (
          <circle
            key={i}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={drag === i ? 8 : 6.5}
            fill={C.fg}
            fillOpacity={0.85}
            stroke={C.surface}
            strokeWidth={1.5}
            tabIndex={0}
            aria-label={`Point ${i + 1} at x ${fmt(p.x)}, y ${fmt(p.y)}. Drag or use arrow keys to move, hold Shift for bigger steps.`}
            style={{ cursor: drag === i ? 'grabbing' : 'grab', touchAction: 'none', outlineOffset: 3 }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              setDrag(i)
            }}
            onKeyDown={(e) => onKey(i, e)}
          />
        ))}
      </svg>

      <p className="text-xs text-subtle">
        Drag a point, or focus one and use the arrow keys (Shift for larger steps). Red segments are the residuals.
      </p>

      {mode === 'manual' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Slider label="Slope m" value={mh} min={-3} max={3} step={0.05} onChange={setMh} format={fmt} />
          <Slider label="Intercept b" value={bh} min={-5} max={15} step={0.1} onChange={setBh} format={fmt} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label={mode === 'fit' ? 'Slope m' : 'Your m'} value={fmt(shown.m)} />
        <Readout label={mode === 'fit' ? 'Intercept b' : 'Your b'} value={fmt(shown.b)} />
        <Readout label="MSE" value={fmt(shownMse)} hint="mean of squared residuals" />
        <Readout label="R²" value={fmt(shownR2)} hint={Number.isNaN(shownR2) ? 'undefined: all y equal' : '1 − SSres / SStot'} />
      </div>

      {mode === 'manual' && (
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Readout label="Best-fit m" value={fmt(fit.m)} />
            <Readout label="Best-fit b" value={fmt(fit.b)} />
            <Readout label="Best-fit MSE" value={fmt(bestMse)} hint={`yours is ${fmt(shownMse - bestMse)} higher`} />
          </div>
          <div>
            <ActionButton
              onClick={() => {
                setMh(clamp(Math.round(fit.m * 20) / 20, -3, 3))
                setBh(clamp(Math.round(fit.b * 10) / 10, -5, 15))
              }}
            >
              Snap sliders to best fit
            </ActionButton>
          </div>
          <p className="text-xs text-subtle">The dashed line is the least-squares fit; no other line has a lower MSE.</p>
        </div>
      )}
      {!fit.ok && <p className="text-xs text-muted">All points share one x, so the slope is undefined; the flat mean line is shown.</p>}
    </Panel>
  )
}
