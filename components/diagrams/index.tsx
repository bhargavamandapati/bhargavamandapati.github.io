import { Arrow, Box, DiagramDefs, Label } from './primitives'

// Re-exported so MDX can wrap a diagram in a captioned frame.
export { DiagramFrame } from './primitives'

const svgProps = { className: 'w-full', role: 'img' as const }

/* ------------------------------------------------------------------ stack -- */

export function AaosStack() {
  const L = 150 // left edge of the stack
  const W = 420 // stack width
  const H = 46 // box height
  const G = 12 // gap
  const rows = [
    { label: 'Automotive apps', sub: 'media · navigation · OEM · third-party', tone: 'default' as const },
    { label: 'Car API', sub: 'android.car — CarPropertyManager, CarAudioManager…', tone: 'accent' as const },
    { label: 'Android framework', sub: 'system_server, ActivityManager, WindowManager', tone: 'default' as const },
    { label: 'Car Service', sub: 'com.android.car — CarPropertyService, CarAudioService', tone: 'accent' as const },
    { label: 'Vehicle HAL (AIDL)', sub: 'IVehicle — get / set / subscribe', tone: 'accent' as const },
    { label: 'Vendor vehicle network service', sub: 'proprietary — CAN, SOME/IP, MCU link', tone: 'vendor' as const },
    { label: 'Vehicle buses & ECUs', sub: 'CAN · LIN · FlexRay · Automotive Ethernet', tone: 'muted' as const },
  ]
  // Extra breathing room below row 4 so the Treble boundary label has a lane.
  const y = (i: number) => 26 + i * (H + G) + (i >= 5 ? 26 : 0)
  const bottom = y(rows.length - 1) + H

  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 34}`} aria-label="The Android Automotive OS stack from apps down to vehicle ECUs">
      <DiagramDefs />
      {rows.map((r, i) => (
        <Box key={r.label} x={L} y={y(i)} w={W} h={H} label={r.label} sub={r.sub} tone={r.tone} dashed={r.tone === 'vendor'} />
      ))}

      {/* domain brackets */}
      <line x1={L - 26} y1={y(0)} x2={L - 26} y2={y(4) + H} stroke="var(--border-strong)" strokeWidth={1.25} />
      <line x1={L - 26} y1={y(5)} x2={L - 26} y2={bottom} stroke="var(--border-strong)" strokeWidth={1.25} strokeDasharray="5 4" />
      <g transform={`translate(${L - 36}, ${(y(0) + y(4) + H) / 2}) rotate(-90)`}>
        <Label x={0} y={0} tone="muted">AOSP / Google-maintained</Label>
      </g>
      <g transform={`translate(${L - 36}, ${(y(5) + bottom) / 2}) rotate(-90)`}>
        <Label x={0} y={0}>OEM / supplier</Label>
      </g>

      {/* signal direction */}
      <Arrow x1={L + W + 40} y1={bottom - 8} x2={L + W + 40} y2={y(0) + 10} accent />
      <g transform={`translate(${L + W + 54}, ${(y(0) + bottom) / 2}) rotate(90)`}>
        <Label x={0} y={0} tone="accent">vehicle state flows up</Label>
      </g>
      <Arrow x1={L - 6} y1={y(1) + H / 2} x2={L - 6} y2={y(1) + H / 2} />

      {/* Treble boundary */}
      <line x1={L - 14} y1={y(5) - 16} x2={L + W + 14} y2={y(5) - 16} stroke="var(--accent)" strokeWidth={1} strokeDasharray="3 4" opacity={0.75} />
      <Label x={L + W + 14} y={y(5) - 28} anchor="end" tone="accent">Treble / vendor boundary</Label>
    </svg>
  )
}

/* ------------------------------------------------------- property id bits -- */

export function PropertyIdBits() {
  const X = 40
  const W = 640
  const Y = 62
  const H = 54
  // Masks per hardware/interfaces/automotive/vehicle AIDL enums:
  //   VehiclePropertyGroup.MASK 0xf0000000 · VehicleArea.MASK 0x0f000000
  //   VehiclePropertyType.MASK  0x00ff0000 · remaining 16 bits are the id
  const fields = [
    { bits: 4, name: 'Group', hex: '0xf000_0000', note: 'SYSTEM · VENDOR · BACKPORTED' },
    { bits: 4, name: 'Area', hex: '0x0f00_0000', note: 'GLOBAL, SEAT, DOOR…' },
    { bits: 8, name: 'Type', hex: '0x00ff_0000', note: 'INT32, FLOAT, MIXED…' },
    { bits: 16, name: 'Unique id', hex: '0x0000_ffff', note: 'you allocate this' },
  ]
  const total = fields.reduce((n, f) => n + f.bits, 0)
  let cursor = X

  return (
    <svg {...svgProps} viewBox="0 0 720 210" aria-label="How a 32-bit Android vehicle property ID is split into group, type, area and unique ID">
      <DiagramDefs />
      <Label x={X} y={26} anchor="start" tone="muted" size={12}>A vehicle property ID is a packed bitfield, not an arbitrary integer</Label>
      <Label x={X} y={46} anchor="start">bit 31</Label>
      <Label x={X + W} y={46} anchor="end">bit 0</Label>

      {fields.map((f) => {
        const w = (f.bits / total) * W
        const x = cursor
        cursor += w
        return (
          <g key={f.name}>
            <rect x={x} y={Y} width={w - 3} height={H} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.25} />
            <text x={x + (w - 3) / 2} y={Y + 21} textAnchor="middle" fill="var(--fg)" fontSize={12.5} fontWeight={600} fontFamily="var(--font-display)">
              {f.name}
            </text>
            <text x={x + (w - 3) / 2} y={Y + 39} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">
              {f.bits} bits
            </text>
            <text x={x + (w - 3) / 2} y={Y + H + 20} textAnchor="middle" fill="var(--fg-muted)" fontSize={10} fontFamily="var(--font-mono)">
              {f.hex}
            </text>
            <text x={x + (w - 3) / 2} y={Y + H + 38} textAnchor="middle" fill="var(--fg-subtle)" fontSize={9.5} fontFamily="var(--font-sans)">
              {f.note}
            </text>
          </g>
        )
      })}

      <rect x={X} y={172} width={W} height={26} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={X + W / 2} y={186} textAnchor="middle" fill="var(--fg-muted)" fontSize={11} fontFamily="var(--font-mono)">
        0x2540_0501  =  VENDOR | SEAT | INT32 | 0x0501
      </text>
    </svg>
  )
}

/* --------------------------------------------------------- signal journey -- */

export function VhalDataFlow() {
  const y = 74
  const h = 58
  const stops = [
    { x: 24, w: 108, label: 'ECU', sub: 'body control' },
    { x: 160, w: 118, label: 'CAN bus', sub: 'raw frame' },
    { x: 306, w: 128, label: 'Vendor VHAL', sub: 'scale + map' },
    { x: 462, w: 118, label: 'Car Service', sub: 'permission check' },
    { x: 608, w: 96, label: 'App UI', sub: 'Compose' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 210" aria-label="A vehicle signal travelling from an ECU through the CAN bus, VHAL and Car Service to the app UI">
      <DiagramDefs />
      <Label x={24} y={30} anchor="start" tone="muted" size={12}>One signal, five translations</Label>
      {stops.map((s, i) => (
        <g key={s.label}>
          <Box x={s.x} y={y} w={s.w} h={h} label={s.label} sub={s.sub} tone={i === 2 ? 'accent' : 'default'} />
          {i < stops.length - 1 && (
            <Arrow x1={s.x + s.w + 4} y1={y + h / 2} x2={stops[i + 1].x - 6} y2={y + h / 2} accent={i >= 1} />
          )}
        </g>
      ))}
      <Label x={214} y={158} tone="subtle">0x1A4 · 2 bytes</Label>
      <Label x={370} y={158} tone="accent">21.5 °C float</Label>
      <Label x={521} y={158} tone="subtle">PERMISSION_READ…</Label>
      <Label x={656} y={158} tone="subtle">&quot;21.5°&quot;</Label>
      <Label x={24} y={186} anchor="start">Latency budget for a driver-visible change is typically under 200 ms end to end.</Label>
    </svg>
  )
}

/* ------------------------------------------------------------ audio zones -- */

export function AudioZones() {
  return (
    <svg {...svgProps} viewBox="0 0 720 290" aria-label="Car audio zones mapping audio contexts onto output buses">
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Contexts are routed to buses, buses belong to a zone</Label>

      <Box x={24} y={48} w={150} h={40} label="MUSIC" tone="default" />
      <Box x={24} y={98} w={150} h={40} label="NAVIGATION" tone="default" />
      <Box x={24} y={148} w={150} h={40} label="VOICE_COMMAND" tone="default" />
      <Box x={24} y={198} w={150} h={40} label="CALL / RING" tone="default" />
      <Label x={99} y={262} tone="muted">audio contexts</Label>

      <Box x={286} y={48} w={150} h={40} label="bus0_media" sub="" tone="accent" />
      <Box x={286} y={98} w={150} h={40} label="bus1_nav" tone="accent" />
      <Box x={286} y={148} w={150} h={40} label="bus2_voice" tone="accent" />
      <Box x={286} y={198} w={150} h={40} label="bus3_call" tone="accent" />
      <Label x={361} y={262} tone="muted">output devices (buses)</Label>

      <DiagramDefs />
      {[68, 118, 168, 218].map((cy) => (
        <Arrow key={cy} x1={178} y1={cy} x2={280} y2={cy} accent />
      ))}

      <rect x={520} y={48} width={176} height={90} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.25} />
      <text x={608} y={78} textAnchor="middle" fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">Zone 0</text>
      <text x={608} y={98} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">cabin / driver</text>
      <text x={608} y={116} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">bus0–bus3</text>

      <rect x={520} y={158} width={176} height={80} rx={10} fill="var(--surface-2)" stroke="var(--border-strong)" strokeDasharray="5 4" />
      <text x={608} y={186} textAnchor="middle" fill="var(--fg-muted)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">Zone 1</text>
      <text x={608} y={206} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">rear seat</text>
      <text x={608} y={224} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">independent focus</text>

      <Arrow x1={440} y1={118} x2={514} y2={92} />
      <Arrow x1={440} y1={200} x2={514} y2={192} dashed />
      <Label x={608} y={262} tone="muted">zones</Label>
    </svg>
  )
}

/* ----------------------------------------------------------- power states -- */

export function PowerStates() {
  const h = 52
  const nodes = [
    { x: 20, y: 60, w: 118, label: 'OFF', sub: 'no power' },
    { x: 172, y: 60, w: 138, label: 'WAIT_FOR_VHAL', sub: 'boot handshake' },
    { x: 344, y: 60, w: 118, label: 'ON', sub: 'driving' },
    { x: 496, y: 60, w: 200, label: 'SHUTDOWN_PREPARE', sub: 'Garage Mode runs here' },
    { x: 258, y: 178, w: 168, label: 'SUSPEND_TO_RAM', sub: 'S2R — fast resume' },
    { x: 460, y: 178, w: 168, label: 'SUSPEND_TO_DISK', sub: 'S2D — hibernate' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 268" aria-label="The Car Power Management Service state machine">
      <DiagramDefs />
      <Label x={20} y={28} anchor="start" tone="muted" size={12}>A head unit is never simply off — it is parked in a state</Label>
      {nodes.map((n, i) => (
        <Box key={n.label} x={n.x} y={n.y} w={n.w} h={h} label={n.label} sub={n.sub} tone={i === 3 ? 'accent' : 'default'} />
      ))}
      <Arrow x1={142} y1={86} x2={168} y2={86} />
      <Arrow x1={314} y1={86} x2={340} y2={86} />
      <Arrow x1={466} y1={86} x2={492} y2={86} accent />
      <Arrow x1={560} y1={116} x2={560} y2={172} accent />
      <Arrow x1={520} y1={116} x2={360} y2={172} accent />
      {/* resume paths back to ON */}
      <path d="M342 204 C 300 232, 200 214, 200 120 L 200 96" fill="none" stroke="var(--fg-subtle)" strokeWidth={1.4} strokeDasharray="4 4" markerEnd="url(#d-arrow)" />
      <Label x={214} y={150} anchor="start">resume</Label>
      <Label x={596} y={148} tone="accent">OTA · logs · sync</Label>
    </svg>
  )
}

/* ------------------------------------------------------------- user model -- */

export function UserModel() {
  return (
    <svg {...svgProps} viewBox="0 0 720 250" aria-label="The headless system user running system services beneath switchable driver profiles">
      <DiagramDefs />
      <Label x={24} y={26} anchor="start" tone="muted" size={12}>User 0 never reaches the screen — it exists to hold the platform up</Label>

      <rect x={24} y={44} width={672} height={70} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.25} />
      <text x={360} y={70} textAnchor="middle" fill="var(--fg)" fontSize={13.5} fontWeight={600} fontFamily="var(--font-display)">User 0 — headless system user</text>
      <text x={360} y={92} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">CarService · VHAL clients · audio routing · connectivity — always running</text>

      <Box x={24} y={146} w={200} h={64} label="User 10 — Driver A" sub="profile, apps, accounts" />
      <Box x={260} y={146} w={200} h={64} label="User 11 — Driver B" sub="separate app data" />
      <Box x={496} y={146} w={200} h={64} label="Guest" sub="wiped on exit" tone="muted" dashed />

      <Arrow x1={124} y1={120} x2={124} y2={140} />
      <Arrow x1={360} y1={120} x2={360} y2={140} />
      <Arrow x1={596} y1={120} x2={596} y2={140} dashed />
      <Label x={360} y={232} tone="muted">exactly one foreground user at a time · switching never restarts user 0</Label>
    </svg>
  )
}

/* ------------------------------------------------------------- SDV bridge -- */

export function SdvBridge() {
  const h = 56
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Bridging AUTOSAR signals through VSS into the Android vehicle HAL">
      <DiagramDefs />
      <Label x={24} y={26} anchor="start" tone="muted" size={12}>Two conversions turn a vehicle network into an Android API</Label>

      <Box x={24} y={48} w={172} h={h} label="AUTOSAR ECU" sub="ARXML system signals" />
      <Box x={24} y={148} w={172} h={h} label="SOME/IP" sub="service discovery" tone="muted" />

      <Box x={264} y={98} w={192} h={h} label="VSS tree" sub="Vehicle.Speed · units · types" tone="accent" />
      <Box x={264} y={198} w={192} h={h} label="Kuksa databroker" sub="gRPC — test without hardware" tone="muted" dashed />

      <Box x={524} y={48} w={172} h={h} label="VSS → VHAL codegen" sub="property id, area, access" tone="accent" />
      <Box x={524} y={148} w={172} h={h} label="Vehicle HAL" sub="IVehicle AIDL" />
      <Box x={524} y={228} w={172} h={h - 10} label="CarPropertyManager" sub="app-facing" />

      <Arrow x1={200} y1={76} x2={258} y2={116} accent />
      <Arrow x1={200} y1={176} x2={258} y2={216} />
      <Arrow x1={460} y1={126} x2={518} y2={86} accent />
      <Arrow x1={360} y1={158} x2={360} y2={192} both dashed />
      <Arrow x1={610} y1={108} x2={610} y2={142} accent />
      <Arrow x1={610} y1={208} x2={610} y2={222} accent />

      <Label x={228} y={98} tone="accent">arxml → vss</Label>
      <Label x={492} y={106} tone="accent">vss → vhal</Label>
    </svg>
  )
}

/* --------------------------------------------------------- system UI zones -- */

export function SystemUiLayout() {
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="The regions CarSystemUI owns on a head unit display">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>CarSystemUI owns the frame; apps only get the middle</Label>

      <rect x={120} y={44} width={480} height={252} rx={12} fill="var(--bg-subtle)" stroke="var(--border-strong)" strokeWidth={1.5} />

      <rect x={120} y={44} width={480} height={38} rx={0} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1} />
      <text x={360} y={63} textAnchor="middle" fill="var(--fg)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-display)">Status bar — clock, user switcher, HVAC handle</text>

      <rect x={120} y={252} width={480} height={44} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1} />
      <text x={360} y={276} textAnchor="middle" fill="var(--fg)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-display)">Nav bar — home, apps, media, climate</text>

      <rect x={140} y={98} width={440} height={138} rx={8} fill="var(--surface-2)" stroke="var(--border)" strokeDasharray="5 4" />
      <text x={360} y={158} textAnchor="middle" fill="var(--fg-muted)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">Activity region</text>
      <text x={360} y={178} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">your app lives here</text>

      <Label x={104} y={63} anchor="end" tone="accent">CarSystemUI</Label>
      <Label x={104} y={274} anchor="end" tone="accent">CarSystemUI</Label>
      <Label x={616} y={167} anchor="start" tone="muted">RRO-themable</Label>
      <Arrow x1={610} y1={150} x2={586} y2={150} />
    </svg>
  )
}

/* ------------------------------------------------------------- EVS path -- */

export function EvsBootPath() {
  const h = 50
  return (
    <svg {...svgProps} viewBox="0 0 720 260" aria-label="The rear-view camera path, which bypasses the Android framework to meet its deadline">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Two paths to the same display — only one of them meets the deadline</Label>

      <Box x={24} y={54} w={128} h={h} label="Reverse gear" sub="hardware signal" />
      <Box x={196} y={54} w={150} h={h} label="EVS HAL" sub="camera + display" tone="accent" />
      <Box x={390} y={54} w={140} h={h} label="EVS Manager" sub="native, no Java" tone="accent" />
      <Box x={574} y={54} w={122} h={h} label="Display" sub="&lt; 2 s" tone="accent" />
      <Arrow x1={156} y1={79} x2={192} y2={79} accent />
      <Arrow x1={350} y1={79} x2={386} y2={79} accent />
      <Arrow x1={534} y1={79} x2={570} y2={79} accent />
      <Label x={300} y={128} tone="accent">fast path — running before Android is up</Label>

      <Box x={196} y={160} w={150} h={h} label="Android framework" sub="boots in ~15 s" tone="muted" dashed />
      <Box x={390} y={160} w={140} h={h} label="CarEvsService" sub="hands over later" tone="muted" dashed />
      <Arrow x1={350} y1={185} x2={386} y2={185} dashed />
      <Arrow x1={460} y1={156} x2={460} y2={110} dashed />
      <Label x={330} y={232} tone="subtle">slow path — takes over once the framework is ready</Label>
    </svg>
  )
}

/* ------------------------------------------------------ cluster topology -- */

export function ClusterArchitecture() {
  const h = 48
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Two ways to drive an instrument cluster from Android Automotive">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Option A — cluster is a second display on the same Android</Label>
      <Box x={24} y={44} w={160} h={h} label="AAOS" sub="one SoC" tone="accent" />
      <Box x={232} y={44} w={170} h={h} label="ClusterHomeService" sub="cluster activity" tone="accent" />
      <Box x={450} y={44} w={150} h={h} label="Display 1" sub="cluster panel" />
      <Arrow x1={188} y1={68} x2={228} y2={68} accent />
      <Arrow x1={406} y1={68} x2={446} y2={68} accent />
      <Label x={648} y={68} anchor="start" tone="subtle">simple</Label>

      <line x1={24} y1={124} x2={696} y2={124} stroke="var(--border)" strokeDasharray="4 4" />

      <Label x={24} y={152} anchor="start" tone="muted" size={12}>Option B — cluster is a separate, safety-rated system</Label>
      <Box x={24} y={172} w={160} h={h} label="AAOS" sub="infotainment guest" />
      <Box x={232} y={172} w={170} h={h} label="Cluster service" sub="protobuf over TCP/IP" tone="accent" />
      <Box x={450} y={172} w={150} h={h} label="Cluster OS" sub="RTOS · ASIL-rated" tone="vendor" dashed />
      <Box x={450} y={238} w={150} h={h - 8} label="Display 1" sub="telltales, gauges" />
      <Arrow x1={188} y1={196} x2={228} y2={196} />
      <Arrow x1={406} y1={196} x2={446} y2={196} accent />
      <Arrow x1={525} y1={224} x2={525} y2={234} />
      <Label x={648} y={196} anchor="start" tone="subtle">certifiable</Label>
      <Label x={318} y={224} tone="accent">serialise · send · render</Label>
    </svg>
  )
}

/* ------------------------------------------------------------ boot timeline -- */

export function BootTimeline() {
  const X = 60
  const W = 620
  const Y = 96
  // Milestones in seconds, drawn on a log-ish linear scale to 20 s.
  const marks = [
    { t: 0.0, label: 'Power on', tone: 'muted' as const },
    { t: 1.8, label: 'Rear camera', tone: 'accent' as const },
    { t: 2.0, label: 'Telltales', tone: 'accent' as const },
    { t: 6.0, label: 'Android boot', tone: 'muted' as const },
    { t: 12.0, label: 'Car Service', tone: 'muted' as const },
    { t: 18.0, label: 'Interactive', tone: 'muted' as const },
  ]
  const x = (t: number) => X + (t / 20) * W
  return (
    <svg {...svgProps} viewBox="0 0 720 200" aria-label="Boot milestones and their typical automotive deadlines">
      <DiagramDefs />
      <Label x={X} y={30} anchor="start" tone="muted" size={12}>The first two milestones are usually legal requirements, not preferences</Label>

      {/* legal deadline band */}
      <rect x={x(0)} y={Y - 26} width={x(2) - x(0)} height={52} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" strokeDasharray="3 3" />
      <Label x={x(1)} y={Y - 38} tone="accent">regulated window</Label>

      <line x1={X} y1={Y} x2={X + W} y2={Y} stroke="var(--fg-subtle)" strokeWidth={1.4} markerEnd="url(#d-arrow)" />
      {marks.map((m, i) => (
        <g key={m.label}>
          <circle cx={x(m.t)} cy={Y} r={4.5} fill={m.tone === 'accent' ? 'var(--accent)' : 'var(--surface)'} stroke={m.tone === 'accent' ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={1.5} />
          <text x={x(m.t)} y={i % 2 === 0 ? Y + 26 : Y + 44} textAnchor="middle" fill="var(--fg)" fontSize={11} fontWeight={600} fontFamily="var(--font-display)">{m.label}</text>
          <text x={x(m.t)} y={i % 2 === 0 ? Y + 40 : Y + 58} textAnchor="middle" fill="var(--fg-subtle)" fontSize={9.5} fontFamily="var(--font-mono)">{m.t}s</text>
        </g>
      ))}
      <Label x={X + W} y={Y - 16} anchor="end" tone="subtle">20 s</Label>
    </svg>
  )
}

/* ---------------------------------------------------------- A/B partitions -- */

export function AbPartitions() {
  const h = 44
  return (
    <svg {...svgProps} viewBox="0 0 720 258" aria-label="An A/B seamless update writing to the inactive slot while the vehicle runs from the active one">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>The vehicle keeps running from slot A while slot B is written</Label>

      <Label x={24} y={64} anchor="start" tone="accent">slot A — active</Label>
      <Box x={150} y={46} w={120} h={h} label="boot_a" tone="accent" />
      <Box x={286} y={46} w={120} h={h} label="system_a" tone="accent" />
      <Box x={422} y={46} w={120} h={h} label="vendor_a" tone="accent" />
      <Box x={558} y={46} w={138} h={h} label="product_a" tone="accent" />

      <Label x={24} y={140} anchor="start" tone="subtle">slot B — staging</Label>
      <Box x={150} y={122} w={120} h={h} label="boot_b" tone="muted" dashed />
      <Box x={286} y={122} w={120} h={h} label="system_b" tone="muted" dashed />
      <Box x={422} y={122} w={120} h={h} label="vendor_b" tone="muted" dashed />
      <Box x={558} y={122} w={138} h={h} label="product_b" tone="muted" dashed />

      <Box x={150} y={198} w={240} h={h - 6} label="/data — shared, never duplicated" tone="default" />
      <Box x={422} y={198} w={274} h={h - 6} label="Reboot swaps the active slot" tone="accent" />
      <Arrow x1={410} y1={218} x2={418} y2={218} accent />
      <Label x={696} y={172} anchor="end" tone="subtle">failed boot rolls back automatically</Label>
    </svg>
  )
}

/* --------------------------------------------------------- memory pressure -- */

export function MemoryPressure() {
  const bands = [
    { label: 'Cached / empty apps', note: 'killed first, invisible to the driver', tone: 'muted' as const },
    { label: 'Background services', note: 'killed next — your sync job dies here', tone: 'muted' as const },
    { label: 'Perceptible / foreground apps', note: 'the driver notices', tone: 'default' as const },
    { label: 'Persistent & system apps', note: 'CarService, SystemUI — must not die', tone: 'accent' as const },
  ]
  const h = 46
  return (
    <svg {...svgProps} viewBox="0 0 720 268" aria-label="Low-memory kill order, from cached apps down to persistent system processes">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>lmkd kills from the top down as pressure rises</Label>
      {bands.map((b, i) => (
        <g key={b.label}>
          <Box x={150} y={46 + i * (h + 12)} w={420} h={h} label={b.label} sub={b.note} tone={b.tone} />
        </g>
      ))}
      <Arrow x1={110} y1={54} x2={110} y2={222} />
      <g transform="translate(96, 138) rotate(-90)"><Label x={0} y={0} tone="subtle">rising memory pressure</Label></g>
      <Label x={596} y={54} anchor="start" tone="subtle">oom_adj high</Label>
      <Label x={596} y={222} anchor="start" tone="accent">oom_adj low</Label>
    </svg>
  )
}

/* -------------------------------------------------------- Bluetooth stack -- */

export function BluetoothProfiles() {
  const h = 46
  const profiles = [
    { x: 24, w: 150, label: 'HFP', sub: 'hands-free calling' },
    { x: 196, w: 150, label: 'A2DP', sub: 'media streaming' },
    { x: 368, w: 150, label: 'AVRCP', sub: 'transport control' },
    { x: 540, w: 156, label: 'PBAP / MAP', sub: 'contacts, messages' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 232" aria-label="The Bluetooth profiles a head unit must implement and where each one lands">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>A phone pairs once and expects four profiles to work at the same time</Label>
      {profiles.map((p) => (
        <Box key={p.label} x={p.x} y={44} w={p.w} h={h} label={p.label} sub={p.sub} tone="accent" />
      ))}
      {profiles.map((p) => (
        <Arrow key={p.label} x1={p.x + p.w / 2} y1={94} x2={p.x + p.w / 2} y2={128} />
      ))}
      <Box x={24} y={130} w={322} h={h} label="Telephony / audio routing" sub="call audio to bus3_call" />
      <Box x={368} y={130} w={328} h={h} label="Media session & contacts" sub="browse tree, dialer" />
      <Label x={360} y={210} tone="subtle">one paired device, four concurrent profiles, one confused driver when any of them drops</Label>
    </svg>
  )
}

/* ------------------------------------------------------ compliance suites -- */

export function ComplianceSuites() {
  const h = 56
  return (
    <svg {...svgProps} viewBox="0 0 720 268" aria-label="How the CDD, CTS, VTS and automotive-specific suites relate">
      <DiagramDefs />
      <Box x={190} y={26} w={340} h={h} label="CDD — Compatibility Definition Document" sub="the written requirements" tone="accent" />
      <Arrow x1={280} y1={86} x2={190} y2={118} accent />
      <Arrow x1={440} y1={86} x2={530} y2={118} accent />

      <Box x={24} y={120} w={300} h={h} label="CTS" sub="framework behaves as documented" />
      <Box x={396} y={120} w={300} h={h} label="VTS" sub="HALs honour their interfaces" />

      <Box x={24} y={212} w={300} h={h - 12} label="CTS Verifier + automotive modules" sub="manual & hardware-dependent" tone="muted" dashed />
      <Box x={396} y={212} w={300} h={h - 12} label="OEM acceptance suite" sub="not Google's — theirs" tone="muted" dashed />
      <Arrow x1={174} y1={180} x2={174} y2={206} />
      <Arrow x1={546} y1={180} x2={546} y2={206} />
    </svg>
  )
}

/* ----------------------------------------------------------- media browse -- */

export function MediaBrowseTree() {
  const h = 44
  return (
    <svg {...svgProps} viewBox="0 0 720 262" aria-label="How a media app's browse tree is served to the car's media UI">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Your app never draws the media UI — it serves a tree the car renders</Label>

      <Box x={24} y={46} w={190} h={h} label="Your MediaBrowserService" sub="onLoadChildren()" tone="accent" />
      <Box x={24} y={112} w={190} h={h} label="Your MediaSession" sub="play, pause, skip" tone="accent" />
      <Box x={24} y={178} w={190} h={h} label="Your player" sub="ExoPlayer, etc." />

      <Box x={300} y={112} w={150} h={h} label="Car media app" sub="the OEM's UI" />
      <Box x={536} y={46} w={160} h={h} label="Browse UI" sub="lists, grids, tabs" />
      <Box x={536} y={112} w={160} h={h} label="Playback UI" sub="transport controls" />
      <Box x={536} y={178} w={160} h={h} label="Steering controls" sub="hardware buttons" />

      <Arrow x1={218} y1={68} x2={296} y2={126} accent />
      <Arrow x1={218} y1={134} x2={296} y2={134} accent both />
      <Arrow x1={454} y1={126} x2={532} y2={68} />
      <Arrow x1={454} y1={134} x2={532} y2={134} />
      <Arrow x1={454} y1={142} x2={532} y2={196} />
      <Label x={360} y={228} tone="subtle">distraction rules, theming and hardware input are the car&rsquo;s job, not yours</Label>
    </svg>
  )
}

/* --------------------------------------------------------- area id bitmask -- */

export function AreaIdBitmask() {
  const seats = [
    { label: 'ROW_1_LEFT', hex: '0x0001', bit: 0, note: 'driver' },
    { label: 'ROW_1_CENTER', hex: '0x0002', bit: 1, note: '' },
    { label: 'ROW_1_RIGHT', hex: '0x0004', bit: 2, note: 'front passenger' },
    { label: 'ROW_2_LEFT', hex: '0x0010', bit: 4, note: '' },
    { label: 'ROW_2_CENTER', hex: '0x0020', bit: 5, note: '' },
    { label: 'ROW_2_RIGHT', hex: '0x0040', bit: 6, note: '' },
  ]
  const H = 34
  return (
    <svg {...svgProps} viewBox="0 0 720 330" aria-label="Seat area IDs are individual bits, not counting numbers">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Each seat is one bit — not a position in a list</Label>

      {seats.map((s, i) => {
        const y = 46 + i * (H + 6)
        return (
          <g key={s.label}>
            <text x={24} y={y + H / 2} dominantBaseline="middle" fill="var(--fg)" fontSize={11.5} fontFamily="var(--font-mono)">{s.label}</text>
            <text x={186} y={y + H / 2} dominantBaseline="middle" fill="var(--accent)" fontSize={11.5} fontFamily="var(--font-mono)">{s.hex}</text>
            {/* 8 bit cells, LSB on the right */}
            {Array.from({ length: 8 }).map((_, b) => {
              const bit = 7 - b
              const on = bit === s.bit
              return (
                <g key={b}>
                  <rect x={262 + b * 30} y={y} width={26} height={H} rx={4}
                        fill={on ? 'var(--accent-soft)' : 'var(--surface-2)'}
                        stroke={on ? 'var(--accent)' : 'var(--border)'} strokeWidth={1.1} />
                  <text x={262 + b * 30 + 13} y={y + H / 2} textAnchor="middle" dominantBaseline="middle"
                        fill={on ? 'var(--accent)' : 'var(--fg-subtle)'} fontSize={11} fontWeight={on ? 700 : 400}
                        fontFamily="var(--font-mono)">{on ? '1' : '0'}</text>
                </g>
              )
            })}
            {s.note && (
              <text x={516} y={y + H / 2} dominantBaseline="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-sans)">← {s.note}</text>
            )}
          </g>
        )
      })}

      <Label x={262} y={296} anchor="start" tone="subtle">bit 7</Label>
      <Label x={472} y={296} anchor="end" tone="subtle">bit 0</Label>
      <rect x={24} y={306} width={672} height={20} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={317} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        both front seats = ROW_1_LEFT | ROW_1_RIGHT = 0x0005 — NOT 0x0002
      </text>
    </svg>
  )
}

/* ------------------------------------------------------ subscription fanout -- */

export function SubscriptionFanout() {
  const h = 44
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Car Service opens one HAL subscription and delivers events to every subscribed app">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Three apps subscribe. The HAL is asked once — at the fastest rate any of them wanted.</Label>

      <Box x={24} y={48} w={180} h={h} label="App A" sub="wants 5 Hz" />
      <Box x={24} y={110} w={180} h={h} label="App B" sub="wants 1 Hz" />
      <Box x={24} y={172} w={180} h={h} label="App C" sub="wants 10 Hz" tone="accent" />

      <Box x={272} y={110} w={176} h={h} label="Car Service" sub="merges the requests" tone="accent" />
      <Box x={516} y={110} w={180} h={h} label="Vehicle HAL" sub="publishes at 10 Hz" />

      <Arrow x1={208} y1={70} x2={268} y2={122} />
      <Arrow x1={208} y1={132} x2={268} y2={132} />
      <Arrow x1={208} y1={194} x2={268} y2={142} accent />
      <Arrow x1={452} y1={132} x2={512} y2={132} accent />

      {/* events coming back */}
      <path d="M600 154 C 600 250, 120 250, 114 96" fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="4 4" markerEnd="url(#d-arrow-accent)" />
      <Label x={360} y={252} tone="accent">every event is delivered to all three</Label>

      <rect x={24} y={272} width={672} height={22} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={284} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        one careless app asking for 100 Hz raises the cost for the whole system
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------ boot sequence -- */

export function BootSequence() {
  const stages = [
    { label: 'Power / ignition', sub: 'hardware signal — Android does not exist yet', tone: 'muted' as const },
    { label: 'Boot ROM → bootloader', sub: 'verifies the image before running it (AVB)', tone: 'muted' as const },
    { label: 'Kernel', sub: 'drivers, mounts partitions, dm-verity', tone: 'default' as const },
    { label: 'init  (PID 1)', sub: 'reads *.rc, starts services by class', tone: 'accent' as const },
    { label: 'Early services', sub: 'ueventd · logd · servicemanager · EVS camera', tone: 'accent' as const },
    { label: 'Vendor HALs', sub: 'class hal — including the Vehicle HAL', tone: 'accent' as const },
    { label: 'Zygote → system_server', sub: 'framework services start', tone: 'default' as const },
    { label: 'Car Service', sub: 'BLOCKS until the Vehicle HAL answers', tone: 'accent' as const },
    { label: 'Launcher · boot_completed', sub: 'home screen; Garage Mode now possible', tone: 'default' as const },
  ]
  const H = 42
  const G = 9
  const y = (i: number) => 42 + i * (H + G)
  const bottom = y(stages.length - 1) + H

  return (
    <svg {...svgProps} viewBox={`0 0 820 ${bottom + 30}`} aria-label="What starts, in what order, from ignition to home screen">
      <DiagramDefs />
      <Label x={150} y={24} anchor="start" tone="muted" size={12}>Each stage can only start once the one above it is ready</Label>

      {stages.map((s, i) => (
        <Box key={s.label} x={150} y={y(i)} w={430} h={H} label={s.label} sub={s.sub} tone={s.tone} />
      ))}

      {/* the sequential arrow */}
      <Arrow x1={124} y1={y(0) + 8} x2={124} y2={bottom - 6} accent />
      <g transform={`translate(110, ${(y(0) + bottom) / 2}) rotate(-90)`}>
        <Label x={0} y={0} tone="accent">time</Label>
      </g>

      {/* EVS shortcut */}
      <path d={`M596 ${y(4) + H / 2} C 656 ${y(4) + H / 2}, 656 ${y(8) + H / 2}, 600 ${y(8) + H / 2}`}
            fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="4 4" markerEnd="url(#d-arrow-accent)" />
      <Label x={672} y={(y(4) + y(8)) / 2} anchor="start" tone="accent">camera on screen here</Label>

      {/* the blocking dependency */}
      <path d={`M146 ${y(5) + H / 2} C 90 ${y(5) + H / 2}, 90 ${y(7) + H / 2}, 146 ${y(7) + H / 2}`}
            fill="none" stroke="var(--fg-subtle)" strokeWidth={1.3} markerEnd="url(#d-arrow)" />
      <Label x={70} y={(y(5) + y(7)) / 2} anchor="end" tone="subtle">waits for</Label>
    </svg>
  )
}

/* -------------------------------------------------------- binder transaction -- */

export function BinderTransaction() {
  const h = 46
  return (
    <svg {...svgProps} viewBox="0 0 720 330" aria-label="How one AIDL call crosses from a client process to a server process through the kernel">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>One method call, two processes, one copy through the kernel</Label>

      {/* client process */}
      <rect x={20} y={40} width={200} height={168} rx={10} fill="none" stroke="var(--border-strong)" strokeDasharray="5 4" />
      <Label x={120} y={56} tone="muted">your app process</Label>
      <Box x={34} y={70} w={172} h={h} label="Your code" sub="manager.getProperty()" />
      <Box x={34} y={132} w={172} h={h} label="Proxy (generated)" sub="writes args into a Parcel" tone="accent" />

      {/* kernel */}
      <rect x={264} y={70} width={172} height={108} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={350} y={100} textAnchor="middle" fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">binder driver</text>
      <text x={350} y={120} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">/dev/binder</text>
      <text x={350} y={140} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">single copy into</text>
      <text x={350} y={156} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">the target&rsquo;s buffer</text>

      {/* server process */}
      <rect x={480} y={40} width={216} height={168} rx={10} fill="none" stroke="var(--border-strong)" strokeDasharray="5 4" />
      <Label x={588} y={56} tone="muted">Car Service process</Label>
      <Box x={494} y={70} w={188} h={h} label="Binder thread pool" sub="a free thread picks it up" tone="accent" />
      <Box x={494} y={132} w={188} h={h} label="Stub → onTransact()" sub="unpacks, calls the real method" />

      <Arrow x1={120} y1={120} x2={120} y2={128} />
      <Arrow x1={210} y1={155} x2={260} y2={124} accent />
      <Arrow x1={440} y1={124} x2={490} y2={93} accent />
      <Arrow x1={588} y1={120} x2={588} y2={128} />

      {/* return path */}
      <path d="M588 182 C 588 250, 120 250, 120 194" fill="none" stroke="var(--fg-subtle)" strokeWidth={1.3} strokeDasharray="4 4" markerEnd="url(#d-arrow)" />
      <Label x={354} y={252} tone="subtle">reply travels back the same way — your thread was blocked the whole time</Label>

      <rect x={20} y={276} width={676} height={44} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={358} y={294} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        pool is finite (~15 threads) · one transaction buffer per process (~1 MB)
      </text>
      <text x={358} y={310} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        exhaust either and unrelated callers stall — which looks like UI jank
      </text>
    </svg>
  )
}

/* ------------------------------------------------------- full signal journey -- */

export function SignalPathFull() {
  const rows = [
    { label: 'Physical sensor', sub: 'a thermistor in the cabin', mech: 'voltage', tone: 'muted' as const },
    { label: 'ECU', sub: 'reads it, scales it, broadcasts', mech: 'CAN frame, 8 bytes', tone: 'muted' as const },
    { label: 'CAN controller + driver', sub: 'kernel receives the frame', mech: 'interrupt → SocketCAN', tone: 'default' as const },
    { label: 'Vendor vehicle service', sub: 'applies factor/offset, maps to a property', mech: 'read() on a socket', tone: 'vendor' as const },
    { label: 'Vehicle HAL', sub: 'caches it, publishes a VehiclePropValue', mech: 'in-process call', tone: 'accent' as const },
    { label: 'Car Service', sub: 'permission check, fan-out to subscribers', mech: 'binder transaction', tone: 'accent' as const },
    { label: 'Your app', sub: 'onChangeEvent on a binder thread', mech: 'binder transaction', tone: 'default' as const },
    { label: 'UI thread → SurfaceFlinger', sub: 'the number is finally drawn', mech: 'post() then composition', tone: 'default' as const },
  ]
  const H = 42
  const G = 8
  const y = (i: number) => 40 + i * (H + G)
  const bottom = y(rows.length - 1) + H

  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 26}`} aria-label="Every hop a cabin temperature reading makes, from the sensor to the pixel">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>Eight hops. The mechanism changes at every one.</Label>

      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={24} y={y(i)} w={400} h={H} label={r.label} sub={r.sub} tone={r.tone} dashed={r.tone === 'vendor'} />
          <text x={444} y={y(i) + H / 2} dominantBaseline="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
            {r.mech}
          </text>
          {i < rows.length - 1 && <Arrow x1={224} y1={y(i) + H} x2={224} y2={y(i + 1) - 2} accent={i >= 3} />}
        </g>
      ))}

      <line x1={430} y1={y(3) - G / 2} x2={696} y2={y(3) - G / 2} stroke="var(--accent)" strokeDasharray="3 4" opacity={0.7} />
      <Label x={696} y={y(3) - G / 2 - 11} anchor="end" tone="accent">Treble boundary</Label>
    </svg>
  )
}
