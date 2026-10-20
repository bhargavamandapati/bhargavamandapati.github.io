'use client'

import { useMemo, useState } from 'react'
import { ActionButton, C, Choice, Panel, Readout, Slider } from './ui'

/* ------------------------------ pure math ------------------------------ */

export type DistKey = 'normal' | 'binomial' | 'poisson' | 'exponential'

/** erf(x): Taylor series for |x| < 2.5, continued fraction for erfc beyond. Accurate to ~1e-12. */
export function erf(x: number): number {
  const ax = Math.abs(x)
  let r: number
  if (ax < 2.5) {
    let term = ax
    let sum = ax
    for (let n = 1; n < 80; n++) {
      term *= (-ax * ax) / n
      const add = term / (2 * n + 1)
      sum += add
      if (Math.abs(add) < 1e-17) break
    }
    r = (2 / Math.sqrt(Math.PI)) * sum
  } else {
    // erfc(x) = exp(-x^2)/sqrt(pi) * 1/(x + (1/2)/(x + 1/(x + (3/2)/(x + ...))))
    let f = ax
    for (let k = 80; k >= 1; k--) f = ax + k / 2 / f
    r = 1 - Math.exp(-ax * ax) / (Math.sqrt(Math.PI) * f)
  }
  return x < 0 ? -r : r
}

export function normalCdf(x: number, mu: number, sigma: number): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)))
}

export function normalPdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

/** ln(k!) by direct summation (k is small here). */
export function logFact(k: number): number {
  let s = 0
  for (let i = 2; i <= k; i++) s += Math.log(i)
  return s
}

export function binomPmf(k: number, n: number, p: number): number {
  if (!Number.isInteger(k) || k < 0 || k > n) return 0
  const lc = logFact(n) - logFact(k) - logFact(n - k)
  return Math.exp(lc + k * Math.log(p) + (n - k) * Math.log(1 - p))
}

export function poissonPmf(k: number, lambda: number): number {
  if (!Number.isInteger(k) || k < 0) return 0
  return Math.exp(k * Math.log(lambda) - lambda - logFact(k))
}

export function expPdf(x: number, lambda: number): number {
  return x < 0 ? 0 : lambda * Math.exp(-lambda * x)
}

export function expCdf(x: number, lambda: number): number {
  return x <= 0 ? 0 : 1 - Math.exp(-lambda * x)
}

export interface Params {
  mu: number
  sigma: number
  n: number
  p: number
  pl: number // poisson lambda
  el: number // exponential rate
}

export const DEFAULTS: Params = { mu: 0, sigma: 1, n: 20, p: 0.4, pl: 4, el: 1 }

export function isDiscrete(d: DistKey) {
  return d === 'binomial' || d === 'poisson'
}

export function moments(d: DistKey, q: Params): { mean: number; variance: number } {
  switch (d) {
    case 'normal':
      return { mean: q.mu, variance: q.sigma * q.sigma }
    case 'binomial':
      return { mean: q.n * q.p, variance: q.n * q.p * (1 - q.p) }
    case 'poisson':
      return { mean: q.pl, variance: q.pl }
    default:
      return { mean: 1 / q.el, variance: 1 / (q.el * q.el) }
  }
}

/** Density (continuous) or mass (discrete, x integer). */
export function density(d: DistKey, q: Params, x: number): number {
  switch (d) {
    case 'normal':
      return normalPdf(x, q.mu, q.sigma)
    case 'binomial':
      return binomPmf(x, q.n, q.p)
    case 'poisson':
      return poissonPmf(x, q.pl)
    default:
      return expPdf(x, q.el)
  }
}

/** P(a <= X <= b). Discrete: sum of the mass at integers in [a, b]. */
export function intervalProb(d: DistKey, q: Params, a: number, b: number): number {
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  if (isDiscrete(d)) {
    let s = 0
    const top = d === 'binomial' ? q.n : Infinity
    const kmax = Math.min(Math.floor(hi), top === Infinity ? Math.floor(hi) : top)
    for (let k = Math.max(0, Math.ceil(lo)); k <= kmax; k++) s += density(d, q, k)
    return Math.min(1, s)
  }
  if (d === 'normal') return normalCdf(hi, q.mu, q.sigma) - normalCdf(lo, q.mu, q.sigma)
  return expCdf(hi, q.el) - expCdf(lo, q.el)
}

/** Display range of x. */
export function xRange(d: DistKey, q: Params): [number, number] {
  switch (d) {
    case 'normal':
      return [q.mu - 4.5 * q.sigma, q.mu + 4.5 * q.sigma]
    case 'binomial':
      return [0, q.n]
    case 'poisson':
      return [0, Math.ceil(q.pl + 5 * Math.sqrt(q.pl) + 3)]
    default:
      return [0, 7 / q.el]
  }
}

/** Seeded PRNG (mulberry32): same seed, same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function drawSamples(d: DistKey, q: Params, count: number, seed: number): number[] {
  const rnd = mulberry32(seed)
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    if (d === 'normal') {
      const u1 = 1 - rnd() // (0, 1]
      const u2 = rnd()
      out.push(q.mu + q.sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2))
    } else if (d === 'binomial') {
      let c = 0
      for (let j = 0; j < q.n; j++) if (rnd() < q.p) c++
      out.push(c)
    } else if (d === 'poisson') {
      const L = Math.exp(-q.pl)
      let k = 0
      let prod = rnd()
      while (prod > L) {
        k++
        prod *= rnd()
      }
      out.push(k)
    } else {
      out.push(-Math.log(1 - rnd()) / q.el)
    }
  }
  return out
}

/* -------------------------------- widget -------------------------------- */

const W = 600
const H = 320
const M = { l: 44, r: 16, t: 14, b: 30 }
const SAMPLES = 200
const BINS = 30
const NAMES: Record<DistKey, string> = {
  normal: 'Normal',
  binomial: 'Binomial',
  poisson: 'Poisson',
  exponential: 'Exponential',
}

function f(v: number, d = 3) {
  return v.toFixed(d).replace('-', '−')
}

export default function DistributionLab({ dist = 'normal' }: { dist?: DistKey }) {
  const [d, setD] = useState<DistKey>(dist in NAMES ? dist : 'normal')
  const [q, setQ] = useState<Params>(DEFAULTS)
  const [interval, setInterval_] = useState(false)
  const [ta, setTa] = useState(0.35)
  const [tb, setTb] = useState(0.65)
  const [seed, setSeed] = useState<number | null>(null)
  const set = (patch: Partial<Params>) => {
    setQ((o) => ({ ...o, ...patch }))
    setSeed(null)
  }

  const discrete = isDiscrete(d)
  const { mean, variance } = moments(d, q)
  const sd = Math.sqrt(variance)
  const [x0, x1] = xRange(d, q)

  const samples = useMemo(() => (seed === null ? null : drawSamples(d, q, SAMPLES, seed)), [d, q, seed])

  const sx = (x: number) => M.l + ((x - x0) / (x1 - x0)) * (W - M.l - M.r)

  // curve / bars
  const ks: number[] = []
  if (discrete) for (let k = Math.ceil(x0); k <= x1; k++) ks.push(k)
  const curveX = Array.from({ length: 241 }, (_, i) => x0 + ((x1 - x0) * i) / 240)
  const heights = discrete ? ks.map((k) => density(d, q, k)) : curveX.map((x) => density(d, q, x))

  // histogram
  let histBars: { x: number; w: number; h: number }[] = []
  if (samples) {
    if (discrete) {
      const counts = new Map<number, number>()
      samples.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1))
      histBars = [...counts].map(([k, c]) => ({ x: k - 0.5, w: 1, h: c / SAMPLES }))
    } else {
      const bw = (x1 - x0) / BINS
      const counts = new Array<number>(BINS).fill(0)
      samples.forEach((s) => {
        const i = Math.floor((s - x0) / bw)
        if (i >= 0 && i < BINS) counts[i]++
      })
      histBars = counts.map((c, i) => ({ x: x0 + i * bw, w: bw, h: c / SAMPLES / bw }))
    }
  }

  const ymax = Math.max(...heights, ...histBars.map((b) => b.h), 1e-9) * 1.1
  const sy = (y: number) => H - M.b - (y / ymax) * (H - M.t - M.b)
  const baseY = sy(0)

  // interval
  const step = discrete ? 1 : (x1 - x0) / 200
  const valAt = (t: number) => {
    const v = x0 + t * (x1 - x0)
    return discrete ? Math.round(v) : v
  }
  const a = valAt(ta)
  const b = valAt(tb)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  const prob = intervalProb(d, q, lo, hi)

  // shaded ±1 sigma region and curve path
  const sLo = Math.max(x0, mean - sd)
  const sHi = Math.min(x1, mean + sd)
  const curvePath = curveX.map((x, i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(heights[i]).toFixed(1)}`).join(' ')
  const areaPath = (from: number, to: number) => {
    const pts = curveX.filter((x) => x >= from && x <= to)
    if (pts.length < 2) return ''
    const body = pts.map((x) => `L${sx(x).toFixed(1)} ${sy(density(d, q, x)).toFixed(1)}`).join(' ')
    return `M${sx(pts[0]).toFixed(1)} ${baseY} ${body} L${sx(pts[pts.length - 1]).toFixed(1)} ${baseY} Z`
  }
  const barW = Math.max(1, (sx(1) - sx(0)) * 0.8)

  const sampleMean = samples ? samples.reduce((s, v) => s + v, 0) / samples.length : null
  const sampleSd =
    samples && sampleMean !== null
      ? Math.sqrt(samples.reduce((s, v) => s + (v - sampleMean) ** 2, 0) / (samples.length - 1))
      : null

  const paramText =
    d === 'normal'
      ? `Normal(μ=${f(q.mu, 2)}, σ=${f(q.sigma, 2)})`
      : d === 'binomial'
        ? `Binomial(n=${q.n}, p=${f(q.p, 2)})`
        : d === 'poisson'
          ? `Poisson(λ=${f(q.pl, 1)})`
          : `Exponential(λ=${f(q.el, 2)})`
  const label =
    `${paramText}: mean ${f(mean)}, variance ${f(variance)}, standard deviation ${f(sd)}.` +
    (interval ? ` P(${f(lo, discrete ? 0 : 2)} ≤ X ≤ ${f(hi, discrete ? 0 : 2)}) = ${f(prob, 4)}.` : '') +
    (samples ? ` Histogram of ${SAMPLES} samples shown, sample mean ${f(sampleMean ?? 0)}.` : '')

  const xticks = Array.from({ length: 7 }, (_, i) => x0 + ((x1 - x0) * i) / 6)

  return (
    <Panel>
      <Choice
        label="Distribution"
        value={d}
        options={(Object.keys(NAMES) as DistKey[]).map((k) => ({ value: k, label: NAMES[k] }))}
        onChange={(k) => {
          setD(k)
          setSeed(null)
        }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        className="h-auto max-h-[560px] w-full rounded-lg border border-line bg-surface"
      >
        <line x1={M.l} x2={W - M.r} y1={baseY} y2={baseY} stroke={C.strong} />
        {xticks.map((t, i) => (
          <text key={i} x={sx(t)} y={H - M.b + 14} textAnchor="middle" fontSize={10} fill={C.subtle}>
            {discrete ? Math.round(t) : t.toFixed(1).replace('-', '−')}
          </text>
        ))}
        <text x={M.l - 6} y={M.t + 8} textAnchor="end" fontSize={10} fill={C.subtle}>
          {ymax.toFixed(2)}
        </text>
        <text x={M.l - 6} y={baseY} textAnchor="end" fontSize={10} fill={C.subtle}>
          0
        </text>
        <text x={W - M.r} y={H - 4} textAnchor="end" fontSize={10} fill={C.subtle}>
          x · {discrete ? 'probability' : 'density'}
        </text>

        {/* interval region */}
        {interval &&
          (discrete ? (
            ks
              .filter((k) => k >= lo && k <= hi)
              .map((k) => (
                <rect
                  key={k}
                  x={sx(k) - barW / 2 - 1}
                  y={M.t}
                  width={barW + 2}
                  height={baseY - M.t}
                  fill={C.info}
                  opacity={0.18}
                />
              ))
          ) : (
            <rect
              x={sx(Math.max(lo, x0))}
              y={M.t}
              width={Math.max(0, sx(Math.min(hi, x1)) - sx(Math.max(lo, x0)))}
              height={baseY - M.t}
              fill={C.info}
              opacity={0.18}
            />
          ))}

        {/* histogram */}
        {histBars.map((hb, i) => (
          <rect
            key={i}
            x={sx(hb.x) + 0.5}
            y={sy(hb.h)}
            width={Math.max(0.5, sx(hb.x + hb.w) - sx(hb.x) - 1)}
            height={baseY - sy(hb.h)}
            fill={C.muted}
            opacity={0.35}
          />
        ))}

        {/* PDF / PMF with ±1σ shading */}
        {discrete ? (
          ks.map((k, i) => (
            <rect
              key={k}
              x={sx(k) - barW / 2}
              y={sy(heights[i])}
              width={barW}
              height={baseY - sy(heights[i])}
              fill={C.accent}
              opacity={Math.abs(k - mean) <= sd ? 0.85 : 0.35}
            />
          ))
        ) : (
          <>
            <path d={areaPath(sLo, sHi)} fill={C.accent} opacity={0.3} />
            <path d={curvePath} fill="none" stroke={C.accent} strokeWidth={2} />
          </>
        )}

        {/* mean marker */}
        {mean >= x0 && mean <= x1 && (
          <g>
            <line x1={sx(mean)} x2={sx(mean)} y1={M.t} y2={baseY} stroke={C.fg} strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={sx(mean) + 4} y={M.t + 10} fontSize={10} fill={C.fg}>
              mean {f(mean, 2)}
            </text>
          </g>
        )}
        <g fontSize={10} fill={C.muted}>
          <rect x={W - M.r - 150} y={M.t + 2} width={10} height={10} fill={C.accent} opacity={0.5} />
          <text x={W - M.r - 135} y={M.t + 11}>
            mean ± 1σ (σ = {f(sd, 2)})
          </text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Readout label="mean" value={f(mean)} hint={meanFormula(d)} />
        <Readout label="variance" value={f(variance)} hint={varFormula(d)} />
        <Readout label="std dev σ" value={f(sd)} hint="√variance" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {d === 'normal' && (
          <>
            <Slider label="Mean μ" value={q.mu} min={-3} max={3} step={0.1} onChange={(v) => set({ mu: v })} format={(v) => f(v, 1)} />
            <Slider label="Std dev σ" value={q.sigma} min={0.3} max={3} step={0.1} onChange={(v) => set({ sigma: v })} format={(v) => f(v, 1)} />
          </>
        )}
        {d === 'binomial' && (
          <>
            <Slider label="Trials n" value={q.n} min={1} max={50} step={1} onChange={(v) => set({ n: v })} />
            <Slider label="Success probability p" value={q.p} min={0.01} max={0.99} step={0.01} onChange={(v) => set({ p: v })} format={(v) => f(v, 2)} />
          </>
        )}
        {d === 'poisson' && (
          <Slider label="Rate λ" value={q.pl} min={0.5} max={20} step={0.5} onChange={(v) => set({ pl: v })} format={(v) => f(v, 1)} />
        )}
        {d === 'exponential' && (
          <Slider label="Rate λ" value={q.el} min={0.2} max={3} step={0.1} onChange={(v) => set({ el: v })} format={(v) => f(v, 1)} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton onClick={() => setInterval_((v) => !v)}>
          {interval ? 'Hide interval probability' : 'Show interval probability'}
        </ActionButton>
        <ActionButton onClick={() => setSeed((s) => (s === null ? 1 : s + 1))}>
          Draw {SAMPLES} samples
        </ActionButton>
        {samples && <ActionButton onClick={() => setSeed(null)}>Clear samples</ActionButton>}
      </div>

      {interval && (
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Slider
            label="Lower bound a"
            value={a}
            min={discrete ? Math.ceil(x0) : x0}
            max={x1}
            step={step}
            onChange={(v) => setTa((v - x0) / (x1 - x0))}
            format={(v) => f(v, discrete ? 0 : 2)}
          />
          <Slider
            label="Upper bound b"
            value={b}
            min={discrete ? Math.ceil(x0) : x0}
            max={x1}
            step={step}
            onChange={(v) => setTb((v - x0) / (x1 - x0))}
            format={(v) => f(v, discrete ? 0 : 2)}
          />
          <Readout
            label={`P(${f(lo, discrete ? 0 : 2)} ≤ X ≤ ${f(hi, discrete ? 0 : 2)})`}
            value={`${f(prob, 4)}  (${f(prob * 100, 1)}%)`}
            hint={discrete ? 'sum of probabilities' : d === 'normal' ? 'CDF(b) − CDF(a)' : 'area under the curve'}
          />
        </div>
      )}

      {samples && sampleMean !== null && sampleSd !== null && (
        <div className="grid grid-cols-2 gap-2">
          <Readout label={`sample mean (${SAMPLES})`} value={f(sampleMean)} hint={`true mean ${f(mean)}`} />
          <Readout label="sample std dev" value={f(sampleSd)} hint={`true σ ${f(sd)}`} />
        </div>
      )}
      {samples && (
        <p className="text-xs text-subtle">
          Grey bars: histogram of {SAMPLES} random draws (fixed seed, so the same click gives the same draws). Press again for a
          new batch; with more samples the grey bars hug the coloured shape ever closer.
        </p>
      )}
    </Panel>
  )
}

function meanFormula(d: DistKey) {
  return d === 'normal' ? 'μ' : d === 'binomial' ? 'n·p' : d === 'poisson' ? 'λ' : '1/λ'
}
function varFormula(d: DistKey) {
  return d === 'normal' ? 'σ²' : d === 'binomial' ? 'n·p·(1−p)' : d === 'poisson' ? 'λ' : '1/λ²'
}
