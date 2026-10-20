'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { ActionButton, C, Choice, Panel, Readout, Slider } from './ui'

/* ------------------------------------------------------------------ */
/* Pure math (exported so it can be tested without a browser)          */
/* ------------------------------------------------------------------ */

export type Activation = 'step' | 'sigmoid' | 'tanh' | 'relu' | 'leaky'

export const LEAKY_SLOPE = 0.1

export const ACTIVATIONS: { value: Activation; label: string }[] = [
  { value: 'step', label: 'Step' },
  { value: 'sigmoid', label: 'Sigmoid' },
  { value: 'tanh', label: 'tanh' },
  { value: 'relu', label: 'ReLU' },
  { value: 'leaky', label: 'Leaky ReLU' },
]

/** Pre-activation z = w1 x1 + w2 x2 + b. */
export function preActivation(w1: number, w2: number, b: number, x1: number, x2: number): number {
  return w1 * x1 + w2 * x2 + b
}

export function activate(kind: Activation, z: number): number {
  switch (kind) {
    case 'step':
      return z >= 0 ? 1 : 0
    case 'sigmoid':
      // Numerically stable logistic function.
      return z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z))
    case 'tanh':
      return Math.tanh(z)
    case 'relu':
      return Math.max(0, z)
    case 'leaky':
      return z >= 0 ? z : LEAKY_SLOPE * z
  }
}

/** da/dz. For step and the kinks of ReLU the value at z = 0 is a convention. */
export function derivative(kind: Activation, z: number): number {
  switch (kind) {
    case 'step':
      return 0
    case 'sigmoid': {
      const a = activate('sigmoid', z)
      return a * (1 - a)
    }
    case 'tanh': {
      const a = Math.tanh(z)
      return 1 - a * a
    }
    case 'relu':
      return z > 0 ? 1 : 0
    case 'leaky':
      return z > 0 ? 1 : LEAKY_SLOPE
  }
}

/** Does the neuron say "class 1" at this z? (output on the high side) */
export function fires(kind: Activation, z: number): boolean {
  return kind === 'step' ? z >= 0 : z > 0
}

/** Map an output to 0..1 for colouring (0 = low colour, 1 = accent). */
export function heatLevel(kind: Activation, a: number): number {
  switch (kind) {
    case 'step':
    case 'sigmoid':
      return a
    case 'tanh':
      return (a + 1) / 2
    case 'relu':
      return Math.tanh(a / 2)
    case 'leaky':
      return 0.5 + 0.5 * Math.tanh(a / 2)
  }
}

/**
 * The line w1 x1 + w2 x2 + b = 0 as two far-apart points, or null when both
 * weights are zero (no line exists). Clip it to the plot when drawing.
 */
export function decisionLine(
  w1: number,
  w2: number,
  b: number,
  reach = 20,
): [[number, number], [number, number]] | null {
  const n2 = w1 * w1 + w2 * w2
  if (n2 < 1e-12) return null
  const n = Math.sqrt(n2)
  const p0: [number, number] = [(-b * w1) / n2, (-b * w2) / n2]
  const d: [number, number] = [-w2 / n, w1 / n]
  return [
    [p0[0] - d[0] * reach, p0[1] - d[1] * reach],
    [p0[0] + d[0] * reach, p0[1] + d[1] * reach],
  ]
}

export type Task = 'AND' | 'OR' | 'XOR'
export const CORNERS: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
]
export function target(task: Task, x1: number, x2: number): 0 | 1 {
  if (task === 'AND') return x1 === 1 && x2 === 1 ? 1 : 0
  if (task === 'OR') return x1 === 1 || x2 === 1 ? 1 : 0
  return x1 !== x2 ? 1 : 0
}
export function countCorrect(task: Task, kind: Activation, w1: number, w2: number, b: number): number {
  let ok = 0
  for (const [x1, x2] of CORNERS) {
    const f = fires(kind, preActivation(w1, w2, b, x1, x2)) ? 1 : 0
    if (f === target(task, x1, x2)) ok++
  }
  return ok
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const LO = -1
const HI = 2
const SIZE = 320
const PAD = 28
const INNER = SIZE - 2 * PAD
const CELLS = 30

const px = (x: number) => PAD + ((x - LO) / (HI - LO)) * INNER
const py = (y: number) => SIZE - PAD - ((y - LO) / (HI - LO)) * INNER
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const r2 = (v: number) => Math.round(v * 100) / 100
const f2 = (v: number) => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2)

const ZMAX = 6
function yRange(kind: Activation): [number, number] {
  switch (kind) {
    case 'step':
    case 'sigmoid':
      return [-0.2, 1.2]
    case 'tanh':
      return [-1.2, 1.2]
    case 'relu':
      return [-0.5, ZMAX]
    case 'leaky':
      return [-1, ZMAX]
  }
}

const heatFill = (t: number) =>
  `color-mix(in srgb, ${C.accent} ${Math.round(clamp(t, 0, 1) * 100)}%, ${C.info})`

const PRESETS: { id: string; label: string; task: Task; w1: number; w2: number; b: number }[] = [
  { id: 'and', label: 'AND', task: 'AND', w1: 1, w2: 1, b: -1.5 },
  { id: 'or', label: 'OR', task: 'OR', w1: 1, w2: 1, b: -0.5 },
  { id: 'xor', label: 'Try XOR', task: 'XOR', w1: 1, w2: 1, b: -0.5 },
]

const EXPLAIN: Record<Task, string> = {
  AND: 'AND is 1 only when both inputs are 1, and one straight line can put (1,1) alone on the firing side.',
  OR: 'OR is 1 when either input is 1, and one straight line can cut (0,0) off from the other three corners.',
  XOR: 'XOR wants 1 at (0,1) and (1,0) but 0 at (0,0) and (1,1), and no single straight line can separate those two pairs, so one neuron always misses at least one corner.',
}

function isActivation(v: unknown): v is Activation {
  return v === 'step' || v === 'sigmoid' || v === 'tanh' || v === 'relu' || v === 'leaky'
}
function num(v: unknown, fallback: number, lo = -3, hi = 3) {
  return typeof v === 'number' && Number.isFinite(v) ? clamp(v, lo, hi) : fallback
}

export default function NeuronLab({
  activation,
  weights,
  bias,
  inputs,
}: {
  activation?: string
  weights?: number[]
  bias?: number
  inputs?: number[]
}) {
  const [kind, setKind] = useState<Activation>(isActivation(activation) ? activation : 'sigmoid')
  const [w1, setW1] = useState(num(weights?.[0], 1))
  const [w2, setW2] = useState(num(weights?.[1], 1))
  const [b, setB] = useState(num(bias, -0.5))
  const [x1, setX1] = useState(num(inputs?.[0], 1, LO, HI))
  const [x2, setX2] = useState(num(inputs?.[1], 0, LO, HI))
  const [task, setTask] = useState<Task>('OR')
  const clipId = useId()
  const dragging = useRef(false)

  const z = preActivation(w1, w2, b, x1, x2)
  const a = activate(kind, z)
  const dz = derivative(kind, z)
  const showDeriv = kind === 'sigmoid' || kind === 'tanh'
  const correct = countCorrect(task, kind, w1, w2, b)

  const cells = useMemo(() => {
    const out: { x: number; y: number; fill: string }[] = []
    const step = (HI - LO) / CELLS
    for (let i = 0; i < CELLS; i++) {
      for (let j = 0; j < CELLS; j++) {
        const cx = LO + (i + 0.5) * step
        const cy = LO + (j + 0.5) * step
        const t = heatLevel(kind, activate(kind, preActivation(w1, w2, b, cx, cy)))
        out.push({ x: px(LO + i * step), y: py(LO + (j + 1) * step), fill: heatFill(t) })
      }
    }
    return out
  }, [kind, w1, w2, b])

  const line = decisionLine(w1, w2, b)

  function setPoint(clientX: number, clientY: number, svg: SVGSVGElement) {
    const rect = svg.getBoundingClientRect()
    if (rect.width === 0) return
    const vx = ((clientX - rect.left) / rect.width) * SIZE
    const vy = ((clientY - rect.top) / rect.height) * SIZE
    setX1(r2(clamp(LO + ((vx - PAD) / INNER) * (HI - LO), LO, HI)))
    setX2(r2(clamp(LO + ((SIZE - PAD - vy) / INNER) * (HI - LO), LO, HI)))
  }

  function onKey(e: React.KeyboardEvent) {
    const s = e.shiftKey ? 0.5 : 0.1
    let dx = 0
    let dy = 0
    if (e.key === 'ArrowLeft') dx = -s
    else if (e.key === 'ArrowRight') dx = s
    else if (e.key === 'ArrowUp') dy = s
    else if (e.key === 'ArrowDown') dy = -s
    else return
    e.preventDefault()
    setX1((v) => r2(clamp(v + dx, LO, HI)))
    setX2((v) => r2(clamp(v + dy, LO, HI)))
  }

  /* activation curve */
  const [ylo, yhi] = yRange(kind)
  const cx = (zz: number) => PAD + ((zz + ZMAX) / (2 * ZMAX)) * INNER
  const cy = (yy: number) => SIZE - PAD - ((yy - ylo) / (yhi - ylo)) * INNER
  const curve = useMemo(() => {
    if (kind === 'step') return [[-ZMAX, 0], [0, 0], [0, 1], [ZMAX, 1]].map(([zz, yy]) => `${cx(zz)},${cy(yy)}`).join(' ')
    const pts: string[] = []
    const N = 240
    for (let i = 0; i <= N; i++) {
      const zz = -ZMAX + (2 * ZMAX * i) / N
      pts.push(`${cx(zz)},${cy(activate(kind, zz))}`)
    }
    return pts.join(' ')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])
  const zc = clamp(z, -ZMAX, ZMAX)
  const offScale = zc !== z
  const mx = cx(zc)
  const my = cy(clamp(activate(kind, zc), ylo, yhi))

  const ticks = [-1, 0, 1, 2]
  const planeLabel =
    `Input plane heat-map for a ${kind} neuron with w1 ${f2(w1)}, w2 ${f2(w2)}, bias ${f2(b)}. ` +
    `Test point at x1 ${f2(x1)}, x2 ${f2(x2)} gives z ${f2(z)} and output ${f2(a)}. ` +
    `${correct} of 4 corners match ${task}.`
  const curveLabel = `Curve of the ${kind} activation. The current z is ${f2(z)}${offScale ? ' (off the drawn scale)' : ''}, output ${f2(a)}.`

  function preset(p: (typeof PRESETS)[number]) {
    setTask(p.task)
    setW1(p.w1)
    setW2(p.w2)
    setB(p.b)
    if (kind === 'relu' || kind === 'leaky') setKind('step')
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Presets</span>
        {PRESETS.map((p) => (
          <ActionButton key={p.id} onClick={() => preset(p)}>
            {p.label}
          </ActionButton>
        ))}
        <span className="text-xs text-subtle">
          Task shown on the plane: <span className="font-mono text-fg">{task}</span>
        </span>
      </div>

      <Choice label="Activation" value={kind} options={ACTIVATIONS} onChange={setKind} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={planeLabel}
            className="mx-auto block w-full max-h-[560px] touch-none select-none"
            onPointerDown={(e) => {
              dragging.current = true
              e.currentTarget.setPointerCapture(e.pointerId)
              setPoint(e.clientX, e.clientY, e.currentTarget)
            }}
            onPointerMove={(e) => {
              if (dragging.current) setPoint(e.clientX, e.clientY, e.currentTarget)
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={PAD} y={PAD} width={INNER} height={INNER} />
              </clipPath>
            </defs>
            {cells.map((c, i) => (
              <rect key={i} x={c.x} y={c.y} width={INNER / CELLS + 0.4} height={INNER / CELLS + 0.4} fill={c.fill} />
            ))}
            <rect x={PAD} y={PAD} width={INNER} height={INNER} fill="none" stroke={C.strong} />
            {ticks.map((t) => (
              <g key={t} fontSize="10" fill={C.muted}>
                <text x={px(t)} y={SIZE - PAD + 13} textAnchor="middle">{t}</text>
                <text x={PAD - 6} y={py(t) + 3} textAnchor="end">{t}</text>
              </g>
            ))}
            <text x={SIZE / 2} y={SIZE - 4} textAnchor="middle" fontSize="11" fill={C.fg}>x1</text>
            <text x={9} y={SIZE / 2} textAnchor="middle" fontSize="11" fill={C.fg} transform={`rotate(-90 9 ${SIZE / 2})`}>x2</text>

            {line && (
              <line
                clipPath={`url(#${clipId})`}
                x1={px(line[0][0])}
                y1={py(line[0][1])}
                x2={px(line[1][0])}
                y2={py(line[1][1])}
                stroke={C.fg}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}

            {CORNERS.map(([cx1, cx2]) => {
              const t = target(task, cx1, cx2)
              const ok = (fires(kind, preActivation(w1, w2, b, cx1, cx2)) ? 1 : 0) === t
              return (
                <g key={`${cx1}${cx2}`}>
                  <circle
                    cx={px(cx1)}
                    cy={py(cx2)}
                    r="8"
                    fill={t ? C.accent : C.surface}
                    stroke={ok ? C.fg : C.danger}
                    strokeWidth={ok ? 1.5 : 3}
                  />
                  {!ok && (
                    <text x={px(cx1)} y={py(cx2) + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" fill={t ? C.surface : C.danger}>
                      ×
                    </text>
                  )}
                </g>
              )
            })}

            <g
              tabIndex={0}
              aria-label={`Test point, x1 ${f2(x1)}, x2 ${f2(x2)}. Use the arrow keys to move it.`}
              onKeyDown={onKey}
              className="cursor-grab outline-none focus-visible:[&>circle:first-child]:stroke-[3]"
            >
              <circle cx={px(x1)} cy={py(x2)} r="11" fill="none" stroke={C.fg} strokeWidth="1" opacity="0.6" />
              <path
                d={`M${px(x1)},${py(x2) - 7} L${px(x1) + 7},${py(x2)} L${px(x1)},${py(x2) + 7} L${px(x1) - 7},${py(x2)} Z`}
                fill={C.fg}
                stroke={C.surface}
                strokeWidth="1.5"
              />
            </g>
          </svg>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Bright is a high output, the other colour is low. Dashed line: z = 0. Filled corner: target 1.
            Red cross: the neuron gets that corner wrong ({correct} of 4 right). Drag the diamond, or focus it
            and use the arrow keys.
          </p>
        </div>

        <div>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={curveLabel}
            className="mx-auto block w-full max-h-[560px]"
          >
            <rect x={PAD} y={PAD} width={INNER} height={INNER} fill="none" stroke={C.strong} />
            {ylo < 0 && yhi > 0 && <line x1={PAD} x2={PAD + INNER} y1={cy(0)} y2={cy(0)} stroke={C.line} />}
            <line x1={cx(0)} x2={cx(0)} y1={PAD} y2={PAD + INNER} stroke={C.line} />
            {[-6, -3, 0, 3, 6].map((t) => (
              <text key={t} x={cx(t)} y={SIZE - PAD + 13} textAnchor="middle" fontSize="10" fill={C.muted}>{t}</text>
            ))}
            {(kind === 'step' || kind === 'sigmoid' ? [0, 1] : kind === 'tanh' ? [-1, 0, 1] : [0, 3, 6]).map((t) => (
              <text key={t} x={PAD - 6} y={cy(t) + 3} textAnchor="end" fontSize="10" fill={C.muted}>{t}</text>
            ))}
            <text x={SIZE / 2} y={SIZE - 4} textAnchor="middle" fontSize="11" fill={C.fg}>z</text>
            <text x={9} y={SIZE / 2} textAnchor="middle" fontSize="11" fill={C.fg} transform={`rotate(-90 9 ${SIZE / 2})`}>a = f(z)</text>
            <polyline points={curve} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" />
            <line x1={mx} x2={mx} y1={cy(Math.max(ylo, 0))} y2={my} stroke={C.fg} strokeDasharray="3 3" />
            <line x1={PAD} x2={mx} y1={my} y2={my} stroke={C.fg} strokeDasharray="3 3" />
            <circle cx={mx} cy={my} r="6" fill={C.fg} stroke={C.surface} strokeWidth="1.5" />
            <text x={Math.min(mx + 9, SIZE - PAD - 40)} y={Math.max(my - 9, PAD + 12)} fontSize="11" fill={C.fg}>
              z = {f2(z)}
            </text>
          </svg>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            The activation curve. The dot is the current z{offScale ? ' (clamped to the edge, the real value is off the scale)' : ''}.
            The slope at the dot is the local derivative.
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-fg">{EXPLAIN[task]}</p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Readout label="z = w1x1 + w2x2 + b" value={`${f2(w1)}×${f2(x1)} + ${f2(w2)}×${f2(x2)} + ${f2(b)} = ${f2(z)}`} />
        <Readout label="Output a = f(z)" value={f2(a)} />
        <Readout
          label="Local derivative da/dz"
          value={showDeriv ? f2(dz) : kind === 'step' ? '0 (flat)' : f2(dz)}
          hint={
            kind === 'sigmoid' ? 'a(1 - a)' : kind === 'tanh' ? '1 - a²' : kind === 'step' ? 'zero almost everywhere, so no gradient' : kind === 'relu' ? '1 if z > 0, else 0' : `1 if z > 0, else ${LEAKY_SLOPE}`
          }
        />
        <Readout label={`Corners right (${task})`} value={`${correct} / 4`} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Slider label="Weight w1" value={w1} min={-3} max={3} step={0.1} onChange={setW1} format={f2} />
        <Slider label="Weight w2" value={w2} min={-3} max={3} step={0.1} onChange={setW2} format={f2} />
        <Slider label="Bias b" value={b} min={-3} max={3} step={0.1} onChange={setB} format={f2} />
        <div className="grid gap-3">
          <Slider label="Test input x1" value={x1} min={LO} max={HI} step={0.05} onChange={setX1} format={f2} />
          <Slider label="Test input x2" value={x2} min={LO} max={HI} step={0.05} onChange={setX2} format={f2} />
        </div>
      </div>
    </Panel>
  )
}
