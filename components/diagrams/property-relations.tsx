import { Arrow, Box, DiagramDefs, Label } from './primitives'
import type { RelationKind } from '@/data/vehicle-properties'

/** Shortens a long property name so it fits inside a diagram box. */
function fit(name: string, max = 28): string {
  return name.length <= max ? name : name.slice(0, max - 1) + '…'
}

type Node = { name: string; kind: RelationKind; label: string }

/**
 * The relationship map on a property page.
 *
 * The property sits in the middle; things it depends on are drawn above it and
 * things that depend on it below, so the direction of the arrow always means
 * the same thing — "needs the one it points away from".
 */
export function PropertyRelationMap({
  name,
  incoming,
  outgoing,
}: {
  name: string
  /** Relations this property depends on, drawn above. */
  incoming: Node[]
  /** Relations that depend on this property, drawn below. */
  outgoing: Node[]
}) {
  const W = 720
  const colWidth = 216
  // Collapse the unused half so a one-sided map is not mostly empty space.
  const hasAbove = incoming.length > 0
  const hasBelow = outgoing.length > 0
  const topBand = hasAbove ? 116 : 26
  const centreY = topBand
  const bottomBand = hasBelow ? 100 : 24
  const height = centreY + 52 + bottomBand

  const row = (nodes: Node[], y: number) =>
    nodes.map((node, i) => {
      const total = nodes.length
      const spacing = Math.min(colWidth + 20, (W - 40) / Math.max(total, 1))
      const startX = W / 2 - (spacing * (total - 1)) / 2
      return { ...node, x: startX + i * spacing - colWidth / 2, y }
    })

  const above = row(incoming, 34)
  const below = row(outgoing, centreY + 100)

  return (
    <svg
      className="w-full"
      role="img"
      viewBox={`0 0 ${W} ${height}`}
      aria-label={`Properties related to ${name}`}
    >
      <DiagramDefs />

      {above.length > 0 && (
        <Label x={20} y={18} anchor="start" tone="subtle" size={11}>
          {`${name} depends on these`}
        </Label>
      )}

      {above.map((n) => (
        <g key={`in-${n.name}-${n.kind}`}>
          <Box x={n.x} y={n.y} w={colWidth} h={48} label={fit(n.name)} sub={n.label} tone="muted" />
          <Arrow x1={n.x + colWidth / 2} y1={n.y + 48} x2={W / 2} y2={centreY - 4} />
        </g>
      ))}

      <Box
        x={W / 2 - colWidth / 2}
        y={centreY}
        w={colWidth}
        h={52}
        label={fit(name)}
        sub="this property"
        tone="accent"
      />

      {below.map((n) => (
        <g key={`out-${n.name}-${n.kind}`}>
          <Arrow x1={n.x + colWidth / 2} y1={n.y} x2={W / 2} y2={centreY + 56} accent />
          <Box x={n.x} y={n.y} w={colWidth} h={48} label={fit(n.name)} sub={n.label} tone="default" />
        </g>
      ))}

      {below.length > 0 && (
        <Label x={20} y={height - 12} anchor="start" tone="subtle" size={11}>
          {`these depend on ${name}`}
        </Label>
      )}
    </svg>
  )
}

/** The HVAC power gate — the clearest example of a dependency in the VHAL. */
export function HvacPowerGate() {
  const boxes = [
    { x: 40, label: 'HVAC_AC_ON' },
    { x: 265, label: 'HVAC_FAN_SPEED' },
    { x: 490, label: 'HVAC_TEMPERATURE_SET' },
  ]
  const busY = 132
  return (
    <svg className="w-full" role="img" viewBox="0 0 720 262"
      aria-label="HVAC_POWER_ON gating the seat-area HVAC properties">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>
        Set the gate first, or every write below it is accepted and ignored
      </Label>

      <Box x={260} y={44} w={200} h={52} label="HVAC_POWER_ON" sub="must be true" tone="accent" />

      {/* Down from the gate to a distribution bus, then down into each property. */}
      <path d={`M360 96 L360 ${busY}`} stroke="var(--accent)" strokeWidth="1.5" fill="none" />
      <path d={`M135 ${busY} L585 ${busY}`} stroke="var(--accent)" strokeWidth="1.5" fill="none" />
      <Label x={372} y={busY - 8} anchor="start" tone="accent" size={11}>gates</Label>

      {boxes.map((b) => (
        <g key={b.label}>
          <Arrow x1={b.x + 95} y1={busY} x2={b.x + 95} y2={158} accent />
          <Box x={b.x} y={158} w={190} h={46} label={b.label} tone="default" />
        </g>
      ))}

      <Label x={360} y={236} tone="muted" size={11}>
        With power off these may report UNAVAILABLE
      </Label>
      <Label x={360} y={252} tone="subtle" size={11}>
        which properties are gated is per-vehicle, from the configArray
      </Label>
    </svg>
  )
}

/** The value-and-units pattern: two properties that must be read together. */
export function ValueAndUnits() {
  return (
    <svg className="w-full" role="img" viewBox="0 0 720 240"
      aria-label="A measured value paired with the property that selects its display unit">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>
        The value never changes unit — only the way you render it does
      </Label>

      <Box x={40} y={48} w={250} h={62} label="PERF_VEHICLE_SPEED" sub="always metres per second" tone="accent" />
      <Box x={430} y={48} w={250} h={62} label="VEHICLE_SPEED_DISPLAY_UNITS" sub="m/s · km/h · mph" tone="default" />

      <Label x={360} y={86} tone="subtle" size={11}>read both</Label>

      <Box x={230} y={150} w={260} h={54} label="What the driver sees" sub="convert, then render" tone="muted" />
      <Arrow x1={165} y1={110} x2={320} y2={150} />
      <Arrow x1={555} y1={110} x2={400} y2={150} />

      <Label x={360} y={228} tone="muted" size={11}>
        Read the value alone and you will show m/s to someone expecting mph
      </Label>
    </svg>
  )
}
