import { Arrow, Box, DiagramDefs, Label } from './primitives'

/*
 * Diagram kit: whole-diagram layouts that size themselves.
 *
 * primitives.tsx draws single shapes at hand-placed coordinates, and almost
 * every overflow bug in the earlier diagrams came from guessing those numbers.
 * Here an author passes data (nodes, actors, messages, states, values) and the
 * layout is computed, with conservative text-width estimates, so text fits its
 * box by construction. A browser measurement is still the final check.
 */

type Tone = 'default' | 'accent' | 'muted' | 'vendor'
const svgProps = { className: 'w-full', role: 'img' as const }

const W = 740 // viewBox width for every kit diagram
const M = 24 // outer margin
const LABEL_PX = 7.6 // per character, 13px semi-bold label (conservative)
const SUB_PX = 6.6 // per character, 10.5px mono sub-label
const SMALL_PX = 6.5 // per character, 10.5px mono Label text

export function boxWidth(label: string, sub?: string): number {
  return Math.ceil(Math.max(label.length * LABEL_PX, (sub?.length ?? 0) * SUB_PX) + 32)
}

/** Greedy word wrap by character count. */
export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if (line && (line + ' ' + w).length > maxChars) {
      lines.push(line)
      line = w
    } else line = line ? line + ' ' + w : w
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

/* ============================================================== flow ====== */

export type FlowNode = { label: string; sub?: string; tone?: Tone; dashed?: boolean }

/**
 * Boxes joined by arrows, in reading order. Rows wrap in a serpentine so the
 * connector between rows is always a short vertical arrow.
 * `arrowLabels[i]` labels the arrow between node i and node i + 1.
 */
export function FlowDiagram({
  nodes,
  label,
  perRow,
  arrowLabels = [],
}: {
  nodes: FlowNode[]
  label: string
  perRow?: number
  arrowLabels?: (string | undefined)[]
}) {
  const hasLabels = arrowLabels.some(Boolean)
  const gap = hasLabels ? 92 : 48
  const need = Math.max(...nodes.map((n) => boxWidth(n.label, n.sub)), 112)
  // never ask for more columns than fit at full text width: shrinking boxes would clip their text
  const fits = Math.max(1, Math.floor((W - 2 * M + gap) / (need + gap)))
  const cols = Math.min(perRow ?? fits, fits, nodes.length)
  const nodeW = Math.min(need, Math.floor((W - 2 * M - (cols - 1) * gap) / cols))
  const h = nodes.some((n) => n.sub) ? 58 : 44
  const rowGap = 60
  const rows = Math.ceil(nodes.length / cols)
  const total = cols * nodeW + (cols - 1) * gap
  const x0 = Math.round((W - total) / 2)
  const pos = nodes.map((_, i) => {
    const r = Math.floor(i / cols)
    const c = i % cols
    const slot = r % 2 === 0 ? c : cols - 1 - c
    return { x: x0 + slot * (nodeW + gap), y: M + r * (h + rowGap), r }
  })
  const height = M * 2 + rows * h + (rows - 1) * rowGap
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${height}`} aria-label={label}>
      <DiagramDefs />
      {nodes.map((n, i) => (
        <Box key={i} x={pos[i].x} y={pos[i].y} w={nodeW} h={h} label={n.label} sub={n.sub} tone={n.tone} dashed={n.dashed} />
      ))}
      {nodes.slice(0, -1).map((_, i) => {
        const a = pos[i]
        const b = pos[i + 1]
        const lbl = arrowLabels[i]
        if (a.r === b.r) {
          const rightward = b.x > a.x
          const x1 = rightward ? a.x + nodeW + 4 : a.x - 4
          const x2 = rightward ? b.x - 6 : b.x + nodeW + 6
          return (
            <g key={i}>
              <Arrow x1={x1} y1={a.y + h / 2} x2={x2} y2={b.y + h / 2} accent />
              {lbl && (
                <Label x={(x1 + x2) / 2} y={a.y + h / 2 - 10} tone="accent">
                  {lbl}
                </Label>
              )}
            </g>
          )
        }
        const cx = a.x + nodeW / 2
        return (
          <g key={i}>
            <Arrow x1={cx} y1={a.y + h + 4} x2={cx} y2={b.y - 6} accent />
            {lbl && (
              <Label x={cx + 10} y={(a.y + h + b.y) / 2} anchor="start" tone="accent">
                {lbl}
              </Label>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* =========================================================== layer stack == */

export type Layer = { label: string; sub?: string; tone?: Tone; side?: string }

/** Horizontal bands, top to bottom, with optional notes down the right-hand side. */
export function LayerStack({
  layers,
  label,
  highlight = [],
}: {
  layers: Layer[]
  label: string
  highlight?: number[]
}) {
  const hasSide = layers.some((l) => l.side)
  const boxW = hasSide ? 420 : W - 2 * M
  const h = layers.some((l) => l.sub) ? 54 : 42
  const gap = 10
  const sideChars = Math.floor((W - M - (M + boxW + 24)) / SMALL_PX)
  const height = M * 2 + layers.length * h + (layers.length - 1) * gap
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${height}`} aria-label={label}>
      <DiagramDefs />
      {layers.map((l, i) => {
        const y = M + i * (h + gap)
        const tone: Tone = highlight.includes(i) ? 'accent' : l.tone ?? 'default'
        const lines = l.side ? wrapText(l.side, sideChars).slice(0, 3) : []
        return (
          <g key={i}>
            <Box x={M} y={y} w={boxW} h={h} label={l.label} sub={l.sub} tone={tone} />
            {lines.map((t, k) => (
              <Label key={k} x={M + boxW + 24} y={y + h / 2 + (k - (lines.length - 1) / 2) * 14} anchor="start" tone="muted">
                {t}
              </Label>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

/* ============================================================ sequence ==== */

export type SeqMessage = { from: string; to: string; label: string; dashed?: boolean; accent?: boolean }

/**
 * Who calls whom, in order. Actors are columns with lifelines; messages are
 * numbered arrows. Dashed arrows are replies. A message from an actor to
 * itself draws a small loop.
 */
export function SequenceDiagram({
  actors,
  messages,
  label,
}: {
  actors: string[]
  messages: SeqMessage[]
  label: string
}) {
  const n = actors.length
  const actorW = Math.min(150, Math.floor((W - 2 * M) / n) - 14)
  const span = n > 1 ? (W - 2 * M - actorW) / (n - 1) : 0
  const cx = actors.map((_, i) => M + actorW / 2 + i * span)
  const idx = (name: string) => {
    const i = actors.indexOf(name)
    if (i < 0) throw new Error(`SequenceDiagram: unknown actor "${name}"`)
    return i
  }
  const headerH = 40
  let y = headerH + 44
  const rows = messages.map((m, k) => {
    const a = idx(m.from)
    const b = idx(m.to)
    const self = a === b
    // a self-call draws its loop and label on whichever side of the lifeline has more room
    const roomRight = W - M - (cx[a] + 42)
    const roomLeft = cx[a] - 42 - M
    const side: 'right' | 'left' = roomRight >= roomLeft ? 'right' : 'left'
    const width = self ? Math.min(260, Math.max(roomRight, roomLeft)) : Math.abs(cx[b] - cx[a]) - 14
    const lines = wrapText(`${k + 1}. ${m.label}`, Math.max(10, Math.floor(width / SMALL_PX)))
    const top = y
    y += 26 + (lines.length - 1) * 13 + (self ? 22 : 0)
    return { m, a, b, self, side, lines, top }
  })
  const height = y + 12
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${height}`} aria-label={label}>
      <DiagramDefs />
      {actors.map((name, i) => (
        <g key={name}>
          <Box x={cx[i] - actorW / 2} y={M - 6} w={actorW} h={headerH} label={name} tone={i === 0 ? 'accent' : 'default'} />
          <line x1={cx[i]} y1={M - 6 + headerH} x2={cx[i]} y2={height - 8} stroke="var(--border-strong)" strokeDasharray="3 4" />
        </g>
      ))}
      {rows.map((r, k) => {
        const lineY = r.top + (r.lines.length - 1) * 13 + 6
        if (r.self) {
          const x = cx[r.a]
          const left = r.side === 'left'
          return (
            <g key={k}>
              <path
                d={left ? `M ${x - 3} ${lineY} h -30 v 16 h 30` : `M ${x + 3} ${lineY} h 30 v 16 h -30`}
                fill="none"
                stroke={r.m.accent ? 'var(--accent)' : 'var(--fg-subtle)'}
                strokeWidth={1.4}
                markerEnd={r.m.accent ? 'url(#d-arrow-accent)' : 'url(#d-arrow)'}
              />
              {r.lines.map((t, j) => (
                <Label key={j} x={left ? x - 42 : x + 42} y={lineY + 2 + j * 13} anchor={left ? 'end' : 'start'} tone={r.m.accent ? 'accent' : 'muted'}>
                  {t}
                </Label>
              ))}
            </g>
          )
        }
        const dir = cx[r.b] > cx[r.a] ? 1 : -1
        const x1 = cx[r.a] + dir * 4
        const x2 = cx[r.b] - dir * 6
        const mid = (cx[r.a] + cx[r.b]) / 2
        return (
          <g key={k}>
            <Arrow x1={x1} y1={lineY} x2={x2} y2={lineY} accent={r.m.accent} dashed={r.m.dashed} />
            {r.lines.map((t, j) => (
              <Label key={j} x={mid} y={lineY - 8 - (r.lines.length - 1 - j) * 13} tone={r.m.accent ? 'accent' : 'muted'}>
                {t}
              </Label>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

/* ============================================================ state ======= */

export type StateNode = { id: string; label: string; sub?: string; tone?: Tone }
export type StateEdge = { from: string; to: string; label?: string; dashed?: boolean }

/**
 * States in a grid with labelled transitions. Neighbouring states are joined
 * by straight arrows (a pair in both directions is drawn as two parallel
 * lines); non-neighbours by a curve; a self-transition by a small loop.
 * Keep transitions mostly between neighbours for the clearest result.
 */
export function StateDiagram({
  states,
  transitions,
  label,
  perRow,
  initial,
}: {
  states: StateNode[]
  transitions: StateEdge[]
  label: string
  perRow?: number
  initial?: string
}) {
  const colGap = 96
  const need = Math.max(...states.map((s) => boxWidth(s.label, s.sub)), 120)
  const fits = Math.max(1, Math.floor((W - 2 * M + colGap) / (need + colGap)))
  const cols = Math.min(perRow ?? 3, fits, states.length)
  const nodeW = Math.min(need, Math.floor((W - 2 * M - (cols - 1) * colGap) / cols))
  const h = states.some((s) => s.sub) ? 56 : 44
  const rowGap = 92
  const rows = Math.ceil(states.length / cols)
  const total = cols * nodeW + (cols - 1) * colGap
  const x0 = Math.round((W - total) / 2)
  const top = M + 30
  const at = new Map(
    states.map((s, i) => {
      const c = i % cols
      const r = Math.floor(i / cols)
      return [s.id, { x: x0 + c * (nodeW + colGap), y: top + r * (h + rowGap), c, r, s }] as const
    })
  )
  const height = top + rows * h + (rows - 1) * rowGap + M + 8
  const pairKey = (a: string, b: string) => [a, b].sort().join('|')
  const seen = new Map<string, number>()
  const count = new Map<string, number>()
  transitions.forEach((t) => count.set(pairKey(t.from, t.to), (count.get(pairKey(t.from, t.to)) ?? 0) + 1))
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${height}`} aria-label={label}>
      <DiagramDefs />
      {states.map((s) => {
        const p = at.get(s.id)!
        return <Box key={s.id} x={p.x} y={p.y} w={nodeW} h={h} label={s.label} sub={s.sub} tone={s.tone} />
      })}
      {initial && at.get(initial) && (
        <g>
          <circle cx={at.get(initial)!.x - 36} cy={at.get(initial)!.y + h / 2} r={5} fill="var(--fg-subtle)" />
          <Arrow x1={at.get(initial)!.x - 30} y1={at.get(initial)!.y + h / 2} x2={at.get(initial)!.x - 4} y2={at.get(initial)!.y + h / 2} />
        </g>
      )}
      {transitions.map((t, i) => {
        const a = at.get(t.from)
        const b = at.get(t.to)
        if (!a || !b) throw new Error(`StateDiagram: unknown state in ${t.from} -> ${t.to}`)
        const key = pairKey(t.from, t.to)
        const k = seen.get(key) ?? 0
        seen.set(key, k + 1)
        const both = (count.get(key) ?? 1) > 1
        const off = both ? (k === 0 ? -9 : 9) : 0
        if (a === b) {
          const cxm = a.x + nodeW / 2
          return (
            <g key={i}>
              <path
                d={`M ${cxm - 18} ${a.y - 2} C ${cxm - 18} ${a.y - 34}, ${cxm + 18} ${a.y - 34}, ${cxm + 18} ${a.y - 2}`}
                fill="none"
                stroke="var(--fg-subtle)"
                strokeWidth={1.4}
                markerEnd="url(#d-arrow)"
              />
              {t.label && (
                <Label x={cxm} y={a.y - 40}>
                  {t.label}
                </Label>
              )}
            </g>
          )
        }
        const dc = b.c - a.c
        const dr = b.r - a.r
        if (dr === 0 && Math.abs(dc) === 1) {
          const right = dc > 0
          const y = a.y + h / 2 + off
          const x1 = right ? a.x + nodeW + 4 : a.x - 4
          const x2 = right ? b.x - 6 : b.x + nodeW + 6
          return (
            <g key={i}>
              <Arrow x1={x1} y1={y} x2={x2} y2={y} dashed={t.dashed} />
              {t.label && (
                <Label x={(x1 + x2) / 2} y={y + (off > 0 ? 13 : -9)}>
                  {t.label}
                </Label>
              )}
            </g>
          )
        }
        if (dc === 0 && Math.abs(dr) === 1) {
          const down = dr > 0
          const x = a.x + nodeW / 2 + off
          const y1 = down ? a.y + h + 4 : a.y - 4
          const y2 = down ? b.y - 6 : b.y + h + 6
          return (
            <g key={i}>
              <Arrow x1={x} y1={y1} x2={x} y2={y2} dashed={t.dashed} />
              {t.label && (
                <Label x={x + 8} y={(y1 + y2) / 2} anchor="start">
                  {t.label}
                </Label>
              )}
            </g>
          )
        }
        // non-neighbours: a curve bulging away from the straight line
        // same-row pairs arc BELOW the row so they never cross the boxes between them
        const sameRow = dr === 0
        const dir = dc > 0 ? 1 : -1
        const ax = a.x + nodeW / 2 + (sameRow ? dir * 20 : 0)
        const ay = a.y + (sameRow || dr > 0 ? h : 0)
        const bx = b.x + nodeW / 2 - (sameRow ? dir * 20 : 0)
        const by = b.y + (sameRow ? h : dr > 0 ? 0 : h)
        const mx = (ax + bx) / 2
        const my = (ay + by) / 2
        const qx = sameRow ? mx : mx + 56 + off
        const qy = sameRow ? ay + 70 + off : my
        return (
          <g key={i}>
            <path
              d={`M ${ax} ${ay} Q ${qx} ${qy} ${bx} ${by}`}
              fill="none"
              stroke="var(--fg-subtle)"
              strokeWidth={1.4}
              strokeDasharray={t.dashed ? '4 4' : undefined}
              markerEnd="url(#d-arrow)"
            />
            {t.label && (
              <Label
                x={0.25 * ax + 0.5 * qx + 0.25 * bx + (sameRow ? 0 : 12)}
                y={0.25 * ay + 0.5 * qy + 0.25 * by + (sameRow ? 14 : -4)}
                anchor={sameRow ? 'middle' : 'start'}
              >
                {t.label}
              </Label>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ============================================================ charts ====== */

const FILLS = [
  'var(--accent)',
  'color-mix(in srgb, var(--accent) 50%, var(--surface-2))',
  'var(--fg-subtle)',
  'color-mix(in srgb, var(--fg-subtle) 45%, var(--surface-2))',
  'var(--border-strong)',
]

export type BarItem = { label: string; value: number; accent?: boolean }

/** Horizontal bars, one per item, with the value at the end of each bar. */
export function BarChart({
  items,
  label,
  unit = '',
  max,
}: {
  items: BarItem[]
  label: string
  unit?: string
  max?: number
}) {
  const labelW = Math.min(230, Math.ceil(Math.max(...items.map((i) => i.label.length)) * 6.8) + 12)
  const valueW = Math.ceil(Math.max(...items.map((i) => `${i.value}${unit}`.length)) * 7) + 10
  const x0 = M + labelW + 8
  const barMax = W - M - valueW - x0
  const top = Math.max(max ?? 0, ...items.map((i) => i.value))
  const rowH = 36
  const height = M * 2 + items.length * rowH - 10
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${height}`} aria-label={label}>
      <DiagramDefs />
      <line x1={x0} y1={M - 8} x2={x0} y2={height - M + 8} stroke="var(--border-strong)" />
      {items.map((it, i) => {
        const y = M + i * rowH
        const w = Math.max(2, (it.value / top) * barMax)
        return (
          <g key={i} data-no-fit="true">
            <text x={x0 - 8} y={y + 11} textAnchor="end" dominantBaseline="middle" fill="var(--fg-muted)" fontSize={11.5} fontFamily="var(--font-mono)">
              {it.label}
            </text>
            <rect x={x0} y={y} width={w} height={22} rx={4} fill={it.accent ? FILLS[0] : FILLS[2]} opacity={it.accent ? 1 : 0.55} />
            <text x={x0 + w + 8} y={y + 11} dominantBaseline="middle" fill="var(--fg)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-mono)">
              {it.value}
              {unit}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export type Segment = { label: string; value: number }

/** One bar split into proportional segments (a budget), with a legend underneath. */
export function StackedBar({
  segments,
  label,
  unit = '',
}: {
  segments: Segment[]
  label: string
  unit?: string
}) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  const barW = W - 2 * M
  const barY = M + 6
  const barH = 44
  let x = M
  const bars = segments.map((s, i) => {
    const w = (s.value / total) * barW
    const out = { s, i, x, w }
    x += w
    return out
  })
  const perRow = 2
  const legendTop = barY + barH + 34
  const rows = Math.ceil(segments.length / perRow)
  const height = legendTop + rows * 24 + M - 6
  const colW = (W - 2 * M) / perRow
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${height}`} aria-label={label}>
      <DiagramDefs />
      {bars.map(({ s, i, x: bx, w }) => (
        <g key={i}>
          <rect x={bx} y={barY} width={Math.max(w - 2, 1)} height={barH} rx={4} fill={FILLS[i % FILLS.length]} />
          {w > `${s.value}${unit}`.length * 7 + 14 && (
            <text
              x={bx + w / 2 - 1}
              y={barY + barH / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={i % FILLS.length === 0 || i % FILLS.length === 2 ? 'var(--accent-fg)' : 'var(--fg)'}
              fontSize={11.5}
              fontWeight={600}
              fontFamily="var(--font-mono)"
            >
              {s.value}
              {unit}
            </text>
          )}
        </g>
      ))}
      {segments.map((s, i) => {
        const col = i % perRow
        const row = Math.floor(i / perRow)
        const lx = M + col * colW
        const ly = legendTop + row * 24
        return (
          <g key={i} data-no-fit="true">
            <rect x={lx} y={ly - 9} width={12} height={12} rx={3} fill={FILLS[i % FILLS.length]} />
            <text x={lx + 20} y={ly - 3} dominantBaseline="middle" fill="var(--fg-muted)" fontSize={11.5} fontFamily="var(--font-mono)">
              {s.label} — {s.value}
              {unit}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
