'use client'

import { useState } from 'react'
import { ActionButton, C, Choice, Panel, Readout, Slider } from './ui'

/* ------------------------------------------------------------------ */
/* Pure math (exported for testing)                                    */
/* ------------------------------------------------------------------ */

/** softmax(z / T), with the max subtracted for numerical stability. */
export function softmax(logits: number[], temperature = 1): number[] {
  const t = Math.max(temperature, 1e-9)
  const scaled = logits.map((v) => v / t)
  const m = Math.max(...scaled)
  const e = scaled.map((v) => Math.exp(v - m))
  const s = e.reduce((p, v) => p + v, 0)
  return e.map((v) => v / s)
}

/** Shannon entropy in bits (0 log 0 = 0). */
export function entropyBits(p: number[]): number {
  return p.reduce((h, v) => (v > 0 ? h - v * Math.log2(v) : h), 0)
}

/** Indices sorted by probability, highest first; ties keep the lower index first. */
export function rankOrder(p: number[]): number[] {
  return p.map((_, i) => i).sort((i, j) => p[j] - p[i] || i - j)
}

/** Keep only the k most likely entries, then renormalise. */
export function topK(p: number[], k: number): number[] {
  const keep = new Set(rankOrder(p).slice(0, Math.max(1, Math.floor(k))))
  return renorm(p.map((v, i) => (keep.has(i) ? v : 0)))
}

/**
 * Nucleus (top-p): keep the smallest set of most likely entries whose total
 * probability reaches p (always at least one), then renormalise.
 */
export function topP(p: number[], pCut: number): number[] {
  const keep = new Set<number>()
  let cum = 0
  for (const i of rankOrder(p)) {
    keep.add(i)
    cum += p[i]
    if (cum >= pCut - 1e-12) break
  }
  return renorm(p.map((v, i) => (keep.has(i) ? v : 0)))
}

export function renorm(p: number[]): number[] {
  const s = p.reduce((a, v) => a + v, 0)
  return s > 0 ? p.map((v) => v / s) : p
}

/** Seeded PRNG (mulberry32), returns floats in [0, 1). */
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

/** Draw n samples from p by inverse CDF and return the counts. */
export function sampleCounts(p: number[], n: number, seed: number): number[] {
  const rand = mulberry32(seed)
  const counts = p.map(() => 0)
  const last = p.reduce((l, v, i) => (v > 0 ? i : l), 0)
  for (let s = 0; s < n; s++) {
    const u = rand()
    let cum = 0
    let pick = last
    for (let i = 0; i < p.length; i++) {
      cum += p[i]
      if (u < cum) {
        pick = i
        break
      }
    }
    counts[pick]++
  }
  return counts
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const N = 5
const DRAWS = 1000
const BASE_SEED = 2024
const DEFAULT_LABELS = ['the', 'a', 'cat', 'dog', 'xylophone']
const DEFAULT_LOGITS = [2.5, 1.5, 1, 0, -1.5]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const f2 = (v: number) => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2)
const f3 = (v: number) => v.toFixed(3)

export default function SoftmaxLab({
  labels,
  logits,
  temperature,
  topK: topKProp,
  topP: topPProp,
}: {
  labels?: string[]
  logits?: number[]
  temperature?: number
  topK?: number
  topP?: number
}) {
  const names = Array.from({ length: N }, (_, i) =>
    Array.isArray(labels) && typeof labels[i] === 'string' && labels[i] ? labels[i] : DEFAULT_LABELS[i],
  )
  const [z, setZ] = useState<number[]>(
    Array.from({ length: N }, (_, i) => {
      const v = logits?.[i]
      return typeof v === 'number' && Number.isFinite(v) ? clamp(v, -5, 5) : DEFAULT_LOGITS[i]
    }),
  )
  const [T, setT] = useState(
    typeof temperature === 'number' && Number.isFinite(temperature) ? clamp(temperature, 0.1, 5) : 1,
  )
  const [filterOn, setFilterOn] = useState(topKProp !== undefined || topPProp !== undefined)
  const [k, setK] = useState(
    typeof topKProp === 'number' && Number.isFinite(topKProp) ? clamp(Math.round(topKProp), 1, N) : 3,
  )
  const [pCut, setPCut] = useState(
    typeof topPProp === 'number' && Number.isFinite(topPProp) ? clamp(topPProp, 0.05, 1) : 0.9,
  )
  const [sample, setSample] = useState<{ sig: string; counts: number[]; draw: number } | null>(null)
  const [draws, setDraws] = useState(0)

  const probs = softmax(z, T)
  const final = filterOn ? topP(topK(probs, k), pCut) : probs
  const kept = final.map((v) => v > 0)
  const keptMass = probs.reduce((s, v, i) => (kept[i] ? s + v : s), 0)

  const sig = JSON.stringify([z, T, filterOn, k, pCut])
  const live = sample && sample.sig === sig ? sample : null
  const empirical = live ? live.counts.map((c) => c / DRAWS) : null

  const H = entropyBits(probs)
  const top = Math.max(...probs)
  const topName = names[probs.indexOf(top)]

  function draw() {
    const d = draws + 1
    setDraws(d)
    setSample({ sig, counts: sampleCounts(final, DRAWS, BASE_SEED + d), draw: d })
  }

  const ROW = 48
  const W = 560
  const X0 = 112
  const BW = 330
  const height = N * ROW + 34

  const label =
    `Bar chart of softmax probabilities at temperature ${f2(T)}: ` +
    names.map((n, i) => `${n} ${f3(probs[i])}`).join(', ') +
    `. Entropy ${f2(H)} bits.` +
    (filterOn
      ? ` After filtering, the surviving tokens are ${names.filter((_, i) => kept[i]).join(', ')}.`
      : '') +
    (empirical ? ` Sampled ${DRAWS} draws are shown as tick marks.` : '')

  function setLogit(i: number, v: number) {
    setZ((prev) => prev.map((x, j) => (j === i ? v : x)))
  }

  return (
    <Panel>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={label}
        className="block w-full max-h-[560px]"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={X0 + t * BW} x2={X0 + t * BW} y1={4} y2={N * ROW + 4} stroke={C.line} />
            <text x={X0 + t * BW} y={N * ROW + 18} textAnchor="middle" fontSize="10" fill={C.muted}>{t}</text>
          </g>
        ))}
        {names.map((name, i) => {
          const y0 = i * ROW + 8
          const hasFilter = filterOn
          return (
            <g key={i} data-no-fit>
              <text x={X0 - 8} y={y0 + (hasFilter ? 20 : 15)} textAnchor="end" fontSize="12" fill={kept[i] ? C.fg : C.subtle}>
                {name.length > 12 ? name.slice(0, 11) + '…' : name}
              </text>
              <rect x={X0} y={y0 + 3} width={Math.max(probs[i] * BW, 0.5)} height={14} fill={hasFilter ? C.strong : C.accent} opacity={hasFilter ? 0.8 : 1} rx="2" />
              {hasFilter && kept[i] && (
                <rect x={X0} y={y0 + 20} width={Math.max(final[i] * BW, 0.5)} height={14} fill={C.accent} rx="2" />
              )}
              {hasFilter && !kept[i] && (
                <text x={X0 + 4} y={y0 + 31} fontSize="10" fill={C.danger}>cut</text>
              )}
              {empirical && (
                <line
                  x1={X0 + empirical[i] * BW}
                  x2={X0 + empirical[i] * BW}
                  y1={y0 - 1}
                  y2={y0 + (hasFilter ? 37 : 20)}
                  stroke={C.fg}
                  strokeWidth="3"
                />
              )}
              <text x={X0 + BW + 10} y={y0 + 13} fontSize="11" fill={C.fg} className="font-mono">
                softmax {f3(probs[i])}
              </text>
              {hasFilter && (
                <text x={X0 + BW + 10} y={y0 + 29} fontSize="11" fill={kept[i] ? C.accent : C.subtle} className="font-mono">
                  kept {f3(final[i])}
                </text>
              )}
              {empirical && (
                <text x={X0 + BW + 10} y={y0 + (hasFilter ? 43 : 29)} fontSize="11" fill={C.muted} className="font-mono">
                  drawn {f3(empirical[i])}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <p className="text-xs leading-relaxed text-muted">
        {filterOn ? 'Grey bar: softmax(z / T). Accent bar: probability after filtering and renormalising. ' : 'Bar: softmax(z / T). '}
        {empirical ? `Black tick: how often the token was drawn in ${DRAWS} samples (draw set ${live?.draw}), against the exact bar.` : `Press the sample button to draw ${DRAWS} tokens.`}
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Readout label="Temperature T" value={f2(T)} hint={T < 1 ? 'sharper' : T > 1 ? 'flatter' : 'plain softmax'} />
        <Readout label="Entropy H" value={`${f2(H)} bits`} hint={`max for 5 tokens is ${f2(Math.log2(N))}`} />
        <Readout label="Top class" value={`${topName} ${f3(top)}`} />
        <Readout
          label={filterOn ? 'Tokens kept' : 'Sum of probabilities'}
          value={filterOn ? `${kept.filter(Boolean).length} of ${N} (mass ${f3(keptMass)})` : f3(probs.reduce((s, v) => s + v, 0))}
          hint={filterOn ? `entropy after filter ${f2(entropyBits(final))} bits` : undefined}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {names.map((n, i) => (
          <Slider key={i} label={`Logit for "${n}"`} value={z[i]} min={-5} max={5} step={0.1} onChange={(v) => setLogit(i, v)} format={f2} />
        ))}
        <Slider label="Temperature T" value={T} min={0.1} max={5} step={0.1} onChange={setT} format={f2} />
      </div>

      <Choice
        label="Filtering"
        value={filterOn ? 'on' : 'off'}
        options={[
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'Top-k and top-p' },
        ]}
        onChange={(v) => setFilterOn(v === 'on')}
      />
      {filterOn && (
        <div className="grid gap-3 md:grid-cols-2">
          <Slider label="Top-k (keep the k most likely)" value={k} min={1} max={N} step={1} onChange={setK} format={(v) => String(v)} />
          <Slider label="Top-p (keep until the total reaches p)" value={pCut} min={0.05} max={1} step={0.05} onChange={setPCut} format={f2} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton onClick={draw}>Draw {DRAWS} samples</ActionButton>
        <span className="text-xs text-subtle">
          {filterOn ? 'Samples come from the filtered distribution. ' : ''}
          Seeded random numbers, so the same press gives the same result.
        </span>
      </div>
    </Panel>
  )
}
