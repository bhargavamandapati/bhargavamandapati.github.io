import { DiagramDefs } from './primitives'

export type FlowStep = { label: string; sub: string }

export type FlowRow = {
  /** Shown once, centred above both columns. */
  layer: string
  /** Right-aligned beside the layer name — which process this hop runs in. */
  process?: string
  /** Omitted for a property this row's direction does not apply to (write-only, read-only). */
  write?: FlowStep
  read?: FlowStep
  /** OEM code with no AOSP source to point at — drawn dashed, muted. */
  vendor?: boolean
  /** A Binder process crossing sits above this row. */
  boundaryAbove?: string
}

const W = 720
const MARGIN_X = 20
const COL_GAP = 20
const COL_W = (W - MARGIN_X * 2 - COL_GAP) / 2
const WRITE_X = MARGIN_X
const READ_X = WRITE_X + COL_W + COL_GAP
const ROW_H = 46
const ROW_GAP = 14
const LAYER_CAP_H = 20
const BOUNDARY_H = 30
const TOP_MARGIN = 34

function fitBadgeChar(s: string) {
  return s.length > 2 ? s.slice(0, 2) : s
}

/** A small filled circle carrying a step number or letter, pinned to a box's corner. */
function StepBadge({ x, y, char, accent }: { x: number; y: number; char: string; accent: boolean }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={10}
        fill={accent ? 'var(--accent)' : 'var(--fg-subtle)'}
        stroke="var(--surface)"
        strokeWidth={2}
      />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={accent ? 'var(--accent-fg)' : 'var(--surface)'}
        fontSize={10}
        fontWeight={700}
        fontFamily="var(--font-mono)"
      >
        {fitBadgeChar(char)}
      </text>
    </g>
  )
}

/** One flow-column box, coloured by whether the hop is OEM code rather than AOSP. */
function FlowBox({ x, y, step, vendor }: { x: number; y: number; step: FlowStep; vendor?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={COL_W}
        height={ROW_H}
        rx={8}
        fill={vendor ? 'transparent' : 'var(--surface-2)'}
        stroke="var(--border-strong)"
        strokeWidth={1.25}
        strokeDasharray={vendor ? '5 4' : undefined}
      />
      <text x={x + 12} y={y + ROW_H / 2 - 7} fill="var(--fg)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">
        {step.label}
      </text>
      <text x={x + 12} y={y + ROW_H / 2 + 10} fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">
        {step.sub}
      </text>
    </g>
  )
}

/**
 * The full get/set path for one vehicle property, app to hardware and back.
 *
 * Two independently-numbered columns share the same row grid: the left one is
 * the write request an app makes (numbered, solid, top to bottom — the order
 * a `setProperty()` call actually travels), the right is the change event
 * that a write, or a sensor changing on its own, produces coming back
 * (lettered, dashed, bottom to top — the order the callback actually fires).
 * A row missing one direction simply leaves that column empty; nothing else
 * about the layout changes for a read-only or write-only property.
 */
export function PropertyFlowDiagram({ rows }: { rows: FlowRow[] }) {
  let y = TOP_MARGIN
  const laid = rows.map((row) => {
    if (row.boundaryAbove) y += BOUNDARY_H
    y += LAYER_CAP_H
    const top = y
    y += ROW_H + ROW_GAP
    return { row, top }
  })
  const height = laid[laid.length - 1].top + ROW_H + 54

  const withWrite = laid.filter((r) => r.row.write)
  const withRead = laid.filter((r) => r.row.read)
  const writeNumber = new Map(withWrite.map((r, i) => [r.top, String(i + 1)]))
  const readLetter = new Map(
    withRead.map((r, i) => [r.top, String.fromCharCode(97 + (withRead.length - 1 - i))]),
  )

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      role="img"
      aria-label="The get and set path for this property, from the app down to the hardware and back"
      className="w-full"
    >
      <DiagramDefs />

      <circle cx={WRITE_X + 6} cy={16} r={6} fill="var(--accent)" />
      <text x={WRITE_X + 18} y={16.5} dominantBaseline="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        set() request — app to hardware
      </text>
      <circle cx={READ_X + 6} cy={16} r={6} fill="var(--fg-subtle)" />
      <text x={READ_X + 18} y={16.5} dominantBaseline="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        change event — hardware to app
      </text>

      {laid.map(({ row, top }) => (
        <g key={row.layer}>
          {row.boundaryAbove && (
            <>
              <line
                x1={MARGIN_X}
                y1={top - LAYER_CAP_H - BOUNDARY_H / 2}
                x2={W - MARGIN_X}
                y2={top - LAYER_CAP_H - BOUNDARY_H / 2}
                stroke="var(--accent)"
                strokeDasharray="3 4"
                opacity={0.6}
              />
              <text
                x={W / 2}
                y={top - LAYER_CAP_H - BOUNDARY_H / 2 - 8}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize={10}
                fontFamily="var(--font-mono)"
              >
                {row.boundaryAbove}
              </text>
            </>
          )}

          <text x={WRITE_X} y={top - 7} fill="var(--fg)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-display)">
            {row.layer}
          </text>
          {row.process && (
            <text x={W - MARGIN_X} y={top - 7} textAnchor="end" fill="var(--fg-subtle)" fontSize={9.5} fontFamily="var(--font-mono)">
              {row.process}
            </text>
          )}

          {row.write && (
            <>
              <FlowBox x={WRITE_X} y={top} step={row.write} vendor={row.vendor} />
              <StepBadge x={WRITE_X + 2} y={top + 2} char={writeNumber.get(top) ?? ''} accent />
            </>
          )}
          {row.read && (
            <>
              <FlowBox x={READ_X} y={top} step={row.read} vendor={row.vendor} />
              <StepBadge x={READ_X + 2} y={top + 2} char={readLetter.get(top) ?? ''} accent={false} />
            </>
          )}
        </g>
      ))}

      {withWrite.slice(0, -1).map((r, i) => {
        const next = withWrite[i + 1]
        const cx = WRITE_X + COL_W / 2
        return (
          <line
            key={`warrow-${r.top}`}
            x1={cx}
            y1={r.top + ROW_H}
            x2={cx}
            y2={next.top - 2}
            stroke="var(--accent)"
            strokeWidth={1.4}
            markerEnd="url(#d-arrow-accent)"
          />
        )
      })}

      {withRead.slice(0, -1).map((r, i) => {
        const next = withRead[i + 1]
        const cx = READ_X + COL_W / 2
        // Drawn from the lower row up to this one — the event travels hardware to app.
        return (
          <line
            key={`rarrow-${r.top}`}
            x1={cx}
            y1={next.top - 2}
            x2={cx}
            y2={r.top + ROW_H}
            stroke="var(--fg-subtle)"
            strokeWidth={1.4}
            strokeDasharray="4 4"
            markerEnd="url(#d-arrow)"
          />
        )
      })}

      <rect x={MARGIN_X} y={height - 40} width={W - MARGIN_X * 2} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={W / 2} y={height - 25} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">
        two Binder crossings drive this trace — app process to system_server, system_server to the VHAL process
      </text>
    </svg>
  )
}
