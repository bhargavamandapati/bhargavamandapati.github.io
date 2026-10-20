'use client'

import { useMemo, useState } from 'react'
import { ActionButton, C, Panel, Readout, Slider } from './ui'

// --- math:start
export type Mat = [number, number, number, number] // a, b, c, d for [[a, b], [c, d]]

export function det2([a, b, c, d]: Mat): number {
  return a * d - b * c
}

export function trace2([a, , , d]: Mat): number {
  return a + d
}

/** Apply the matrix to a column vector (x, y). */
export function apply2([a, b, c, d]: Mat, x: number, y: number): [number, number] {
  return [a * x + b * y, c * x + d * y]
}

export type Eigenvalues =
  | { kind: 'real'; values: [number, number] }
  | { kind: 'complex'; re: number; im: number }

/** Roots of lambda^2 - trace*lambda + det = 0. */
export function eigenvalues2(m: Mat): Eigenvalues {
  const tr = trace2(m)
  const dt = det2(m)
  const disc = (tr * tr) / 4 - dt
  const eps = 1e-12
  if (disc >= -eps) {
    const s = Math.sqrt(Math.max(disc, 0))
    return { kind: 'real', values: [tr / 2 + s, tr / 2 - s] }
  }
  return { kind: 'complex', re: tr / 2, im: Math.sqrt(-disc) }
}

/** One unit eigenvector per distinct real eigenvalue (empty for complex). */
export function eigenvectors2(m: Mat): { lambda: number; v: [number, number] }[] {
  const ev = eigenvalues2(m)
  if (ev.kind !== 'real') return []
  const [a, b, c, d] = m
  const tiny = 1e-9
  const norm = (x: number, y: number): [number, number] => {
    const n = Math.hypot(x, y)
    return [x / n, y / n]
  }
  if (Math.abs(b) < tiny && Math.abs(c) < tiny) {
    // diagonal matrix: the axes are eigenvectors
    if (Math.abs(a - d) < tiny) return [{ lambda: a, v: [1, 0] }]
    return [
      { lambda: a, v: [1, 0] },
      { lambda: d, v: [0, 1] },
    ]
  }
  const [l1, l2] = ev.values
  const one = (l: number): [number, number] =>
    Math.abs(b) > tiny ? norm(b, l - a) : norm(l - d, c)
  if (Math.abs(l1 - l2) < 1e-9) return [{ lambda: l1, v: one(l1) }]
  return [
    { lambda: l1, v: one(l1) },
    { lambda: l2, v: one(l2) },
  ]
}
// --- math:end

type Props = { matrix?: unknown }

const PRESETS: { id: string; label: string; m: Mat }[] = [
  { id: 'identity', label: 'Identity', m: [1, 0, 0, 1] },
  {
    id: 'rotate',
    label: 'Rotate 45°',
    m: [Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2],
  },
  { id: 'scale', label: 'Scale', m: [1.5, 0, 0, 0.5] },
  { id: 'shear', label: 'Shear', m: [1, 1, 0, 1] },
  { id: 'reflect', label: 'Reflect', m: [1, 0, 0, -1] },
  { id: 'squash', label: 'Squash (singular)', m: [1, 2, 0.5, 1] },
]

function parseMatrix(input: unknown): Mat {
  if (Array.isArray(input) && input.length === 2) {
    const [r0, r1] = input as unknown[]
    if (Array.isArray(r0) && Array.isArray(r1) && r0.length === 2 && r1.length === 2) {
      const v = [r0[0], r0[1], r1[0], r1[1]].map(Number)
      if (v.every((n) => Number.isFinite(n))) {
        return v.map((n) => Math.min(2, Math.max(-2, n))) as Mat
      }
    }
  }
  return [1, 0, 0, 1]
}

function fmt(n: number, digits = 2): string {
  const s = n.toFixed(digits)
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s
}

function fmtComplexPart(re: number, im: number): string {
  return `${fmt(re)} ± ${fmt(im)}i`
}

const R = 5 // half-range in plane units
const S = 50 // pixels per unit

const px = (x: number) => x * S
const py = (y: number) => -y * S

export default function MatrixLab({ matrix }: Props) {
  const [m, setM] = useState<Mat>(() => parseMatrix(matrix))
  const [showEig, setShowEig] = useState(false)
  const [a, b, c, d] = m

  const setEntry = (i: number, v: number) =>
    setM((prev) => prev.map((x, j) => (j === i ? v : x)) as Mat)

  const dt = det2(m)
  const tr = trace2(m)
  const ev = useMemo(() => eigenvalues2(m), [m])
  const vecs = useMemo(() => eigenvectors2(m), [m])
  const isComplex = ev.kind === 'complex'

  const T = (x: number, y: number): [number, number] => {
    const [u, v] = apply2(m, x, y)
    return [px(u), py(v)]
  }

  const ticks = Array.from({ length: 2 * R + 1 }, (_, i) => i - R)
  const L = 12
  const e1 = apply2(m, 1, 0)
  const e2 = apply2(m, 0, 1)

  const arrow = (tip: [number, number], color: string, label: string) => {
    const x = px(tip[0])
    const y = py(tip[1])
    const len = Math.hypot(x, y)
    const parts = [
      <line key="l" x1={0} y1={0} x2={x} y2={y} stroke={color} strokeWidth={3} strokeLinecap="round" />,
    ]
    if (len > 6) {
      const ux = x / len
      const uy = y / len
      const hl = 12
      const hw = 5.5
      const bx = x - ux * hl
      const by = y - uy * hl
      parts.push(
        <polygon
          key="h"
          points={`${x},${y} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`}
          fill={color}
        />,
      )
    }
    parts.push(
      <text
        key="t"
        x={x + (len > 1 ? (x / len) * 10 : 10)}
        y={y + (len > 1 ? (y / len) * 10 : -8) + 4}
        fill={color}
        fontSize={13}
        fontWeight={600}
        textAnchor="middle"
      >
        {label}
      </text>,
    )
    return <g>{parts}</g>
  }

  const evSummary = isComplex
    ? `complex eigenvalues ${fmtComplexPart(ev.re, ev.im)}, so no real direction is preserved`
    : `real eigenvalues ${fmt(ev.values[0])} and ${fmt(ev.values[1])}`
  const label =
    `Plane transformed by the matrix [[${fmt(a)}, ${fmt(b)}], [${fmt(c)}, ${fmt(d)}]]. ` +
    `The first basis vector moves to (${fmt(e1[0])}, ${fmt(e1[1])}) and the second to (${fmt(e2[0])}, ${fmt(e2[1])}). ` +
    `Determinant ${fmt(dt)}, trace ${fmt(tr)}, ${evSummary}.`

  const eigColors = [C.info, C.danger]

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Presets">
        <span className="text-xs text-muted">Presets</span>
        {PRESETS.map((p) => (
          <ActionButton key={p.id} onClick={() => setM(p.m)}>
            {p.label}
          </ActionButton>
        ))}
      </div>

      <svg
        viewBox={`${-R * S} ${-R * S} ${2 * R * S} ${2 * R * S}`}
        role="img"
        aria-label={label}
        className="mx-auto block w-full"
        style={{ maxWidth: 520 }}
      >
        <defs>
          <clipPath id="matrix-lab-clip">
            <rect x={-R * S} y={-R * S} width={2 * R * S} height={2 * R * S} />
          </clipPath>
        </defs>
        <rect x={-R * S} y={-R * S} width={2 * R * S} height={2 * R * S} fill={C.surface} />
        <g clipPath="url(#matrix-lab-clip)">
          {/* original grid */}
          {ticks.map((k) => (
            <g key={`o${k}`} stroke={C.line} strokeWidth={k === 0 ? 1.5 : 1} opacity={k === 0 ? 0.9 : 0.5}>
              <line x1={px(k)} y1={py(-L)} x2={px(k)} y2={py(L)} />
              <line x1={px(-L)} y1={py(k)} x2={px(L)} y2={py(k)} />
            </g>
          ))}
          {/* transformed grid */}
          {ticks.map((k) => {
            const [x1, y1] = T(k, -L)
            const [x2, y2] = T(k, L)
            const [x3, y3] = T(-L, k)
            const [x4, y4] = T(L, k)
            return (
              <g key={`t${k}`} stroke={C.accent} strokeWidth={k === 0 ? 2 : 1} opacity={k === 0 ? 0.8 : 0.45}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} />
                <line x1={x3} y1={y3} x2={x4} y2={y4} />
              </g>
            )
          })}
          {/* original unit square outline */}
          <rect
            x={0}
            y={py(1)}
            width={S}
            height={S}
            fill="none"
            stroke={C.muted}
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          {/* transformed unit square */}
          <polygon
            points={[T(0, 0), T(1, 0), T(1, 1), T(0, 1)].map((p) => p.join(',')).join(' ')}
            fill={C.accent}
            fillOpacity={0.22}
            stroke={C.accent}
            strokeWidth={1.5}
          />
          {/* eigenvector directions */}
          {showEig &&
            vecs.map((e, i) => (
              <line
                key={i}
                x1={px(-e.v[0] * 8)}
                y1={py(-e.v[1] * 8)}
                x2={px(e.v[0] * 8)}
                y2={py(e.v[1] * 8)}
                stroke={eigColors[i % 2]}
                strokeWidth={2}
                strokeDasharray="7 5"
              />
            ))}
          {/* transformed basis vectors */}
          {arrow(e1, C.danger, "e₁'")}
          {arrow(e2, C.info, "e₂'")}
        </g>
        <rect
          x={-R * S}
          y={-R * S}
          width={2 * R * S}
          height={2 * R * S}
          fill="none"
          stroke={C.strong}
          strokeWidth={1}
        />
      </svg>

      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="a (top left)" value={a} min={-2} max={2} step={0.1} onChange={(v) => setEntry(0, v)} format={fmt} />
        <Slider label="b (top right)" value={b} min={-2} max={2} step={0.1} onChange={(v) => setEntry(1, v)} format={fmt} />
        <Slider label="c (bottom left)" value={c} min={-2} max={2} step={0.1} onChange={(v) => setEntry(2, v)} format={fmt} />
        <Slider label="d (bottom right)" value={d} min={-2} max={2} step={0.1} onChange={(v) => setEntry(3, v)} format={fmt} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="Matrix" value={`[${fmt(a)} ${fmt(b)}; ${fmt(c)} ${fmt(d)}]`} />
        <Readout
          label="Determinant"
          value={fmt(dt)}
          hint={
            Math.abs(dt) < 1e-9
              ? 'area collapses to a line'
              : dt < 0
                ? `area × ${fmt(Math.abs(dt))}, orientation flipped`
                : `area × ${fmt(dt)}`
          }
        />
        <Readout label="Trace" value={fmt(tr)} hint="a + d" />
        <Readout
          label="Eigenvalues"
          value={isComplex ? fmtComplexPart(ev.re, ev.im) : `${fmt(ev.values[0])}, ${fmt(ev.values[1])}`}
          hint={isComplex ? 'complex: a rotation part' : undefined}
        />
      </div>

      <div className="grid gap-1 text-xs text-muted">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showEig}
            disabled={isComplex}
            onChange={(e) => setShowEig(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span>Show eigenvector directions</span>
        </label>
        {isComplex ? (
          <p>No real eigenvectors: every direction is turned, so there is nothing to draw.</p>
        ) : (
          showEig && (
            <ul className="font-mono tabular-nums">
              {vecs.map((e, i) => (
                <li key={i} style={{ color: eigColors[i % 2] }}>
                  λ = {fmt(e.lambda)} along ({fmt(e.v[0])}, {fmt(e.v[1])})
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </Panel>
  )
}
