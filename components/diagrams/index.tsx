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

/* ------------------------------------------------------ audio config layering -- */

export function AudioConfigLayering() {
  const w = 380
  const x = (720 - w) / 2
  const h = 64
  const y1 = 54
  const y2 = 190
  return (
    <svg {...svgProps} viewBox="0 0 720 360" aria-label="audio_policy_configuration.xml declaring output devices, feeding into car_audio_configuration.xml which groups them into zones">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Two files, two owners, joined by one address string</Label>

      <Box x={x} y={y1} w={w} h={h} label="audio_policy_configuration.xml" sub="audio HAL — declares output devices (Android's view)" tone="accent" />
      <Arrow x1={x + w / 2} y1={y1 + h + 4} x2={x + w / 2} y2={y2 - 4} accent />
      <Label x={x + w / 2 + 20} y={(y1 + h + y2) / 2 - 9} anchor="start">declares addresses:</Label>
      <Label x={x + w / 2 + 20} y={(y1 + h + y2) / 2 + 9} anchor="start" tone="accent">bus0_media_out, bus1_navigation_out, …</Label>

      <Box x={x} y={y2} w={w} h={h} label="car_audio_configuration.xml" sub="CarAudioService — groups devices into zones (car's view)" />

      <rect x={24} y={284} width={672} height={48} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={302} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        car_audio_configuration.xml references those SAME address strings
      </text>
      <text x={360} y={318} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        one character off in either file → silence, no exception, no log
      </text>
    </svg>
  )
}

/* -------------------------------------------------- echo cancellation pipeline -- */

export function EchoCancellationPipeline() {
  const speaker = { x: 60, y: 40, w: 220, h: 54 }
  const mic = { x: 440, y: 40, w: 220, h: 54 }
  const aec = { x: 210, y: 150, w: 300, h: 60 }
  const ns = { x: 210, y: 250, w: 300, h: 54 }
  const out = { x: 170, y: 340, w: 380, h: 54 }
  return (
    <svg {...svgProps} viewBox="0 0 720 420" aria-label="Speaker output and microphone capture both feeding acoustic echo cancellation, then noise suppression, then the processed signal reaching the modem stack">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>The mic&rsquo;s capture and a copy of what the speaker is playing, both go into AEC</Label>

      <Box x={speaker.x} y={speaker.y} w={speaker.w} h={speaker.h} label="Speaker output" sub="call / media playback" />
      <Box x={mic.x} y={mic.y} w={mic.w} h={mic.h} label="Microphone" sub="raw capture" />
      <Box x={aec.x} y={aec.y} w={aec.w} h={aec.h} label="AEC" sub="subtract predicted echo" tone="accent" />

      <Arrow x1={mic.x + mic.w / 2 - 30} y1={mic.y + mic.h} x2={aec.x + aec.w - 30} y2={aec.y} />
      <Label x={mic.x - 6} y={mic.y + mic.h + 20} anchor="end">raw capture</Label>

      <Arrow x1={speaker.x + speaker.w / 2 + 30} y1={speaker.y + speaker.h} x2={aec.x + 30} y2={aec.y} dashed accent />
      <Label x={speaker.x + 6} y={speaker.y + speaker.h + 20} anchor="start" tone="accent">reference copy — acoustic path,</Label>
      <Label x={speaker.x + 6} y={speaker.y + speaker.h + 36} anchor="start" tone="accent">bounces around the cabin</Label>

      <Arrow x1={aec.x + aec.w / 2} y1={aec.y + aec.h + 4} x2={ns.x + ns.w / 2} y2={ns.y - 4} accent />
      <Box x={ns.x} y={ns.y} w={ns.w} h={ns.h} label="NS" sub="suppress road / wind / HVAC noise" />

      <Arrow x1={ns.x + ns.w / 2} y1={ns.y + ns.h + 4} x2={out.x + out.w / 2} y2={out.y - 4} accent />
      <Box x={out.x} y={out.y} w={out.w} h={out.h} label="Processed signal" sub="→ modem stack / voice pipeline" tone="accent" />
    </svg>
  )
}

/* ---------------------------------------------------------- surround view pipeline -- */

export function SurroundViewPipeline() {
  const camW = 170
  const camH = 40
  const cams = [
    { y: 40, label: 'Front camera' },
    { y: 88, label: 'Rear camera' },
    { y: 136, label: 'Left camera' },
    { y: 184, label: 'Right camera' },
  ]
  const stage = { x: 250, w: 250, h: 64 }
  const undist = { ...stage, y: 110 }
  const warp = { x: 250, y: 210, w: 250, h: 54 }
  const blend = { x: 250, y: 294, w: 250, h: 54 }
  const comp = { x: 250, y: 378, w: 250, h: 54 }
  const cx = undist.x + undist.w / 2
  return (
    <svg {...svgProps} viewBox="0 0 720 460" aria-label="Four camera feeds converging on lens undistortion, then perspective warp, blend and a composite top-down display">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Four wide-angle feeds, stitched into one image no camera ever captured</Label>

      {cams.map((c) => (
        <g key={c.label}>
          <Box x={24} y={c.y} w={camW} h={camH} label={c.label} />
          <Arrow x1={24 + camW + 4} y1={c.y + camH / 2} x2={undist.x - 4} y2={undist.y + undist.h / 2} />
        </g>
      ))}

      <Box x={undist.x} y={undist.y} w={undist.w} h={undist.h} label="Lens undistortion" sub="fisheye correction, per camera" tone="accent" />
      <Arrow x1={cx} y1={undist.y + undist.h + 4} x2={cx} y2={warp.y - 4} accent />

      <Box x={warp.x} y={warp.y} w={warp.w} h={warp.h} label="Perspective warp" sub="shared ground-plane mesh — calibrated per vehicle" />
      <Arrow x1={cx} y1={warp.y + warp.h + 4} x2={cx} y2={blend.y - 4} accent />

      <Box x={blend.x} y={blend.y} w={blend.w} h={blend.h} label="Blend overlaps" sub="two cameras, same patch of ground, different angles" />
      <Arrow x1={cx} y1={blend.y + blend.h + 4} x2={cx} y2={comp.y - 4} accent />

      <Box x={comp.x} y={comp.y} w={comp.w} h={comp.h} label="Composite top-down image" sub="displayed — same EVS boot & handover rules" tone="accent" />
    </svg>
  )
}

/* ------------------------------------------------------------- eCall trigger flow -- */

export function ECallTriggerFlow() {
  const crash = { x: 250, y: 30, w: 220, h: 50 }
  const ecallModule = { x: 210, y: 120, w: 300, h: 66 }
  const voice = { x: 70, y: 246, w: 280, h: 54 }
  const data = { x: 390, y: 246, w: 280, h: 54 }
  const headunit = { x: 390, y: 336, w: 280, h: 54 }
  return (
    <svg {...svgProps} viewBox="0 0 720 420" aria-label="Crash sensors triggering the independent eCall module, which opens a voice channel and a data channel, with Android's status display as an optional, best-effort extra">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>One hardwired trigger, one independent module, one optional readout</Label>

      <Box x={crash.x} y={crash.y} w={crash.w} h={crash.h} label="Crash sensors / airbag ECU" />
      <Arrow x1={crash.x + crash.w / 2} y1={crash.y + crash.h + 4} x2={ecallModule.x + ecallModule.w / 2} y2={ecallModule.y - 4} accent />
      <Label x={crash.x + crash.w / 2 + 16} y={(crash.y + crash.h + ecallModule.y) / 2} anchor="start">hardwired trigger</Label>

      <Box x={ecallModule.x} y={ecallModule.y} w={ecallModule.w} h={ecallModule.h} label="eCall module" sub="own backup battery · own modem · own antenna" tone="accent" />

      <Arrow x1={ecallModule.x + 70} y1={ecallModule.y + ecallModule.h} x2={voice.x + voice.w - 40} y2={voice.y} accent />
      <Arrow x1={ecallModule.x + ecallModule.w - 70} y1={ecallModule.y + ecallModule.h} x2={data.x + 40} y2={data.y} accent />

      <Box x={voice.x} y={voice.y} w={voice.w} h={voice.h} label="Voice channel" sub="to emergency services" tone="accent" />
      <Box x={data.x} y={data.y} w={data.w} h={data.h} label="Minimum data set" sub="position, VIN, time, occupants — same channel" tone="accent" />

      <Arrow x1={data.x + data.w / 2} y1={data.y + data.h + 4} x2={headunit.x + headunit.w / 2} y2={headunit.y - 4} dashed />
      <Box x={headunit.x} y={headunit.y} w={headunit.w} h={headunit.h} label="Android head unit" sub="displays status only — optional, best-effort" tone="muted" dashed />
    </svg>
  )
}

/* ------------------------------------------------------------- verified boot chain -- */

export function VerifiedBootChain() {
  const w = 480
  const x = (720 - w) / 2
  const h = 50
  const stages = [
    { label: 'Hardware root of trust', sub: 'fused key, immutable', tone: 'muted' as const },
    { label: 'Bootloader', sub: undefined, tone: 'default' as const },
    { label: 'boot / init_boot', sub: 'kernel, ramdisk', tone: 'default' as const },
    { label: 'system / vendor / product', sub: 'read-only partitions', tone: 'default' as const },
    { label: 'Android', sub: undefined, tone: 'accent' as const },
  ]
  const y = (i: number) => 50 + i * 90
  const links = ['verifies', 'verifies — AVB (signature over vbmeta)', 'verifies — dm-verity (hash tree)', '']
  return (
    <svg {...svgProps} viewBox="0 0 720 550" aria-label="The verified boot chain from the hardware root of trust through the bootloader, kernel and read-only partitions to Android">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Each stage verifies the next before handing over control</Label>

      {stages.map((s, i) => (
        <Box key={s.label} x={x} y={y(i)} w={w} h={h} label={s.label} sub={s.sub} tone={s.tone} />
      ))}

      {stages.slice(0, -1).map((s, i) => (
        <g key={s.label}>
          <Arrow x1={360} y1={y(i) + h + 4} x2={360} y2={y(i + 1) - 4} accent={i >= 1} />
          {links[i] && (
            <Label x={380} y={(y(i) + h + y(i + 1)) / 2} anchor="start" tone={i === 0 ? 'subtle' : 'accent'}>
              {links[i]}
            </Label>
          )}
        </g>
      ))}

      <rect x={24} y={480} width={672} height={44} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={498} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        break any link and the device halts, or drops into a degraded / recovery state
      </text>
      <text x={360} y={514} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        the goal is not to stop tampering — it is to make it detectable
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------- dual boot chains -- */

export function DualBootChains() {
  const leftX = 40
  const rightX = 420
  const colW = 260
  const bh = 46
  const gap = 70
  const ly = (i: number) => 56 + i * gap
  const leftStages = [
    { label: 'SoC boot ROM', sub: 'immutable, OTP key', tone: 'muted' as const },
    { label: 'Bootloader', sub: undefined, tone: 'default' as const },
    { label: 'System image', sub: 'verified by AVB at boot', tone: 'default' as const },
    { label: 'dm-verity runtime checks', sub: 'keeps verifying while running', tone: 'accent' as const },
  ]
  const leftLinks = ['verifies', 'verifies (AVB / vbmeta)', 'checked continually']
  const rightTop = { y: ly(0), h: bh }
  const rightBottom = { y: ly(3), h: bh }
  return (
    <svg {...svgProps} viewBox="0 0 720 400" aria-label="Two independently rooted boot chains side by side: the AP's SoC chain and a peripheral ECU's HSM-rooted chain, neither trusting the other by default">
      <DiagramDefs />
      <Label x={24} y={24} anchor="start" tone="muted" size={12}>Two roots of trust, two chains — one per ECU</Label>

      <Label x={leftX + colW / 2} y={44} tone="muted" size={12}>AP (SoC)</Label>
      <Label x={rightX + colW / 2} y={44} tone="muted" size={12}>Peripheral ECU (e.g. gateway)</Label>

      <line x1={360} y1={50} x2={360} y2={316} stroke="var(--border-strong)" strokeDasharray="5 4" />

      {leftStages.map((s, i) => (
        <Box key={s.label} x={leftX} y={ly(i)} w={colW} h={bh} label={s.label} sub={s.sub} tone={s.tone} />
      ))}
      {leftStages.slice(0, -1).map((s, i) => (
        <g key={s.label}>
          <Arrow x1={leftX + colW / 2} y1={ly(i) + bh + 4} x2={leftX + colW / 2} y2={ly(i + 1) - 4} accent={i >= 1} />
          <Label x={leftX + colW / 2 + 16} y={(ly(i) + bh + ly(i + 1)) / 2} anchor="start" tone={i === 0 ? 'subtle' : 'accent'}>
            {leftLinks[i]}
          </Label>
        </g>
      ))}

      <Box x={rightX} y={rightTop.y} w={colW} h={rightTop.h} label="HSM/SHE boot ROM" sub="immutable, own key" tone="muted" />
      <Arrow x1={rightX + colW / 2} y1={rightTop.y + rightTop.h + 4} x2={rightX + colW / 2} y2={rightBottom.y - 4} accent dashed />
      <Label x={rightX + colW / 2 - 16} y={(rightTop.y + rightTop.h + rightBottom.y) / 2 - 8} anchor="end" tone="accent">unlocks / attests</Label>
      <Label x={rightX + colW / 2 - 16} y={(rightTop.y + rightTop.h + rightBottom.y) / 2 + 8} anchor="end" tone="accent">to main core</Label>
      <Box x={rightX} y={rightBottom.y} w={colW} h={rightBottom.h} label="ECU firmware" sub="trusts the HSM's attestation, not its own judgement" tone="accent" />

      <rect x={24} y={332} width={672} height={44} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={350} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        neither chain trusts the other by default
      </text>
      <text x={360} y={366} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        the vehicle architecture must explicitly decide how much the AP trusts a signal from another ECU
      </text>
    </svg>
  )
}

/* ----------------------------------------------------- parked-only reachability -- */

export function ParkedOnlyReachability() {
  const top = { x: 260, y: 20, w: 200, h: 50 }
  const colW = 300
  const leftX = 40
  const rightX = 380
  const rowH = 56
  const r1y = 108
  const r2y = 188
  const r3y = 268
  return (
    <svg {...svgProps} viewBox="0 0 720 350" aria-label="Two branches of one driving-state change: parked makes a parked-only activity reachable, moving makes it simply not the destination">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>The activity itself never changes — only whether anything can reach it</Label>

      <Box x={top.x} y={top.y} w={top.w} h={top.h} label="Driving state changes" tone="accent" />
      <Arrow x1={top.x + 50} y1={top.y + top.h + 2} x2={leftX + colW / 2} y2={r1y - 4} accent />
      <Arrow x1={top.x + top.w - 50} y1={top.y + top.h + 2} x2={rightX + colW / 2} y2={r1y - 4} />

      <Box x={leftX} y={r1y} w={colW} h={rowH} label="Parked" sub="CarDrivingState reports stationary" tone="accent" />
      <Box x={rightX} y={r1y} w={colW} h={rowH} label="Moving" sub="CarDrivingState reports in motion" tone="muted" />

      <Arrow x1={leftX + colW / 2} y1={r1y + rowH + 4} x2={leftX + colW / 2} y2={r2y - 4} accent />
      <Arrow x1={rightX + colW / 2} y1={r1y + rowH + 4} x2={rightX + colW / 2} y2={r2y - 4} dashed />

      <Box x={leftX} y={r2y} w={colW} h={rowH} label="Intent filter becomes resolvable" tone="accent" />
      <Box x={rightX} y={r2y} w={colW} h={rowH} label="No distraction-optimised fallback shown" sub="there is no reduced layout to fall back to" tone="muted" dashed />

      <Arrow x1={leftX + colW / 2} y1={r2y + rowH + 4} x2={leftX + colW / 2} y2={r3y - 4} accent />
      <Arrow x1={rightX + colW / 2} y1={r2y + rowH + 4} x2={rightX + colW / 2} y2={r3y - 4} dashed />

      <Box x={leftX} y={r3y} w={colW} h={rowH} label="Launcher can navigate to it" tone="accent" />
      <Box x={rightX} y={r3y} w={colW} h={rowH} label="Not the destination any navigation reaches" sub="not a restricted layout — simply unreachable" tone="muted" dashed />
    </svg>
  )
}

/* ---------------------------------------------------------------- ANC latency budget -- */

export function AncLatencyPipeline() {
  const w = 460
  const x = (720 - w) / 2
  const h = 46
  const gap = 14
  const stages = [
    { label: 'Noise generated at its source', sub: 'tyre · road surface · engine', tone: 'muted' as const },
    { label: 'Reaches the reference microphone', sub: 'the only measurement of it that exists', tone: 'default' as const },
    { label: 'DSP predicts the sound at the ear', sub: 'must model travel time to the driver', tone: 'accent' as const },
    { label: 'Inverse waveform generated', sub: 'the anti-noise signal', tone: 'accent' as const },
    { label: 'Played through the cabin speakers', sub: 'same output buses as any other audio', tone: 'accent' as const },
  ]
  const y = (i: number) => 44 + i * (h + gap)
  const bottom = y(stages.length - 1) + h
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 96}`} aria-label="The latency budget active noise cancellation has to beat, from noise generated at its source to an inverse waveform arriving at the driver's ear">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>Every stage below eats into a budget measured in milliseconds</Label>

      {stages.map((s, i) => (
        <g key={s.label}>
          <Box x={x} y={y(i)} w={w} h={h} label={s.label} sub={s.sub} tone={s.tone} />
          {i < stages.length - 1 && <Arrow x1={x + w / 2} y1={y(i) + h + 4} x2={x + w / 2} y2={y(i + 1) - 4} accent={i >= 1} />}
        </g>
      ))}

      <rect x={24} y={bottom + 26} width={672} height={54} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.25} />
      <text x={360} y={bottom + 46} textAnchor="middle" fill="var(--fg)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-display)">
        must arrive within a few milliseconds of the real noise
      </text>
      <text x={360} y={bottom + 64} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        late, and it stops cancelling the noise — it adds to it
      </text>
    </svg>
  )
}

/* -------------------------------------------------------- car service boot tree -- */

export function CarServiceBootTree() {
  const leafW = 138
  const leafH = 64
  const leafGap = 6
  const leafY = 260
  const total = 5 * leafW + 4 * leafGap
  const leafX0 = (720 - total) / 2
  const leaves = [
    { label: 'Connect to VHAL', sub: 'waits for the HAL', tone: 'accent' as const },
    { label: 'Cache prop configs', sub: 'getAllPropConfigs()', tone: 'default' as const },
    { label: 'Construct subservices', sub: 'dependency order', tone: 'default' as const },
    { label: 'Init in order', sub: 'one after another', tone: 'default' as const },
    { label: 'Register itself', sub: 'as "car_service"', tone: 'default' as const },
  ]
  const carX = 230, carY = 168, carW = 260, carH = 52
  return (
    <svg {...svgProps} viewBox="0 0 720 400" aria-label="The init tree from init through system_server to Car Service, which then connects to the Vehicle HAL, caches the property contract, constructs and initialises its subservices, and registers itself">
      <DiagramDefs />
      <Label x={24} y={20} anchor="start" tone="muted" size={12}>Each level exists because the one below it is not up yet</Label>

      <Box x={300} y={30} w={120} h={44} label="init" tone="muted" />
      <Arrow x1={360} y1={74} x2={360} y2={92} />
      <Box x={280} y={96} w={160} h={44} label="system_server" tone="default" />
      <Arrow x1={360} y1={140} x2={360} y2={164} accent />
      <Box x={carX} y={carY} w={carW} h={carH} label="com.android.car" sub="Car Service" tone="accent" />

      {leaves.map((l, i) => {
        const lx = leafX0 + i * (leafW + leafGap)
        return (
          <g key={l.label}>
            <Arrow x1={carX + carW / 2} y1={carY + carH + 2} x2={lx + leafW / 2} y2={leafY - 4} accent={i === 0} />
            <Box x={lx} y={leafY} w={leafW} h={leafH} label={l.label} sub={l.sub} tone={l.tone} />
          </g>
        )
      })}

      <rect x={24} y={352} width={672} height={34} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={373} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        a HAL that never registers stalls this whole tree — the symptom is a black screen, not an error
      </text>
    </svg>
  )
}

/* ---------------------------------------------------------------- occupant zone tree -- */

export function OccupantZoneTree() {
  const colW = 210
  const cols = [24, 255, 486]
  const zoneY = 56
  const zoneH = 50
  const childH = 42
  const childGap = 10
  const childY = (i: number) => zoneY + zoneH + 20 + i * (childH + childGap)
  const zones = [
    {
      label: 'DRIVER',
      sub: 'seat ROW_1_LEFT',
      children: [
        { label: 'DISPLAY_TYPE_MAIN', sub: 'centre stack' },
        { label: 'INSTRUMENT_CLUSTER', sub: 'display' },
        { label: 'user 10', sub: '' },
      ],
    },
    {
      label: 'FRONT_PASSENGER',
      sub: 'seat ROW_1_RIGHT',
      children: [
        { label: 'DISPLAY_TYPE_MAIN', sub: 'passenger screen' },
        { label: 'user 11', sub: '' },
      ],
    },
    {
      label: 'REAR_PASSENGER_LEFT',
      sub: 'seat ROW_2_LEFT',
      children: [
        { label: 'DISPLAY_TYPE_MAIN', sub: 'rear entertainment' },
        { label: 'user 12', sub: '' },
      ],
    },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 340" aria-label="Three occupant zones, each tying together a seat, one or more displays and a user">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>A zone is a seat that can have a user and one or more displays</Label>

      {zones.map((z, zi) => (
        <g key={z.label}>
          <Box x={cols[zi]} y={zoneY} w={colW} h={zoneH} label={z.label} sub={z.sub} tone="accent" />
          {z.children.map((c, ci) => (
            <g key={c.label}>
              <Arrow x1={cols[zi] + colW / 2} y1={ci === 0 ? zoneY + zoneH + 4 : childY(ci - 1) + childH + 4} x2={cols[zi] + colW / 2} y2={childY(ci) - 4} />
              <Box x={cols[zi]} y={childY(ci)} w={colW} h={childH} label={c.label} sub={c.sub || undefined} />
            </g>
          ))}
        </g>
      ))}

      <rect x={24} y={300} width={672} height={26} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={317} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        three zones, five displays, three simultaneous users — none of them numbered the same
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------------- projection tree -- */

export function ProjectionAppTree() {
  const rootX = 190, rootY = 20, rootW = 340, rootH = 46
  const childY = 116, childH = 50
  const children = [
    { x: 24, w: 156, label: 'Native media app' },
    { x: 196, w: 156, label: 'Native navigation' },
    { x: 368, w: 110, label: 'Settings' },
    { x: 494, w: 202, label: 'Projection app', sub: 'hosts the phone session', tone: 'accent' as const },
  ]
  const grandY = 216
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Native AAOS apps sit alongside a projection app, which is just another app to the vehicle's own Android and hosts the phone's UI streamed in as pixels">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>The projected session is just another app in this tree, nothing more privileged</Label>

      <Box x={rootX} y={rootY} w={rootW} h={rootH} label="AAOS" sub="the vehicle&rsquo;s own Android" tone="muted" />
      {children.map((c) => (
        <g key={c.label}>
          <Arrow x1={rootX + rootW / 2} y1={rootY + rootH + 2} x2={c.x + c.w / 2} y2={childY - 4} accent={c.label === 'Projection app'} />
          <Box x={c.x} y={childY} w={c.w} h={childH} label={c.label} sub={c.sub} tone={c.tone ?? 'default'} />
        </g>
      ))}

      <Arrow x1={595} y1={childY + childH + 2} x2={595} y2={grandY - 4} accent />
      <Box x={475} y={grandY} w={240} h={54} label="Phone&rsquo;s UI" sub="pixels in, touch events back" tone="vendor" dashed />

      <rect x={24} y={264} width={672} height={26} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={281} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        everything outside that window — status bar, climate panel — is still the car&rsquo;s own Android
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ V2X direct broadcast -- */

export function V2xDirectBroadcast() {
  const y = 90
  const h = 58
  const stops = [
    { x: 24, w: 130, label: 'Vehicle B', sub: 'hard braking event' },
    { x: 178, w: 150, label: 'V2X radio', sub: 'broadcasts a BSM' },
    { x: 352, w: 150, label: 'PC5 / sidelink', sub: 'direct radio link', tone: 'accent' as const },
    { x: 526, w: 170, label: 'Vehicle A', sub: 'receives, same range' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 280" aria-label="A hard-braking safety message broadcast directly between two vehicles over PC5 sidelink, with no cell tower and no server round trip">
      <DiagramDefs />
      <Label x={24} y={26} anchor="start" tone="muted" size={12}>No cell tower, no server — one radio hop, in the same instant</Label>

      {stops.map((s, i) => (
        <g key={s.label}>
          <Box x={s.x} y={y} w={s.w} h={h} label={s.label} sub={s.sub} tone={s.tone ?? 'default'} />
          {i < stops.length - 1 && <Arrow x1={s.x + s.w + 4} y1={y + h / 2} x2={stops[i + 1].x - 6} y2={y + h / 2} accent />}
        </g>
      ))}

      <Box x={200} y={220} w={320} h={44} label="Safety-relevant application" sub="typically not a general Android app" tone="muted" />
      <Arrow x1={526 + 85} y1={y + h + 4} x2={200 + 260} y2={216} />

      <rect x={454} y={20} width={220} height={44} rx={6} fill="none" stroke="var(--border)" strokeDasharray="4 4" />
      <text x={564} y={38} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">cell tower → server</text>
      <text x={564} y={54} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">never involved at all</text>
      <line x1={462} y1={28} x2={666} y2={56} stroke="var(--fg-subtle)" strokeWidth={1.25} opacity={0.7} />
    </svg>
  )
}

/* --------------------------------------------------------- driving-state restriction chain -- */

export function DrivingStateRestrictionPipeline() {
  const rows = [
    { label: 'VHAL properties', sub: 'PERF_VEHICLE_SPEED · GEAR_SELECTION · PARKING_BRAKE_ON', out: undefined, tone: 'muted' as const },
    { label: 'CarDrivingStateService', sub: 'derives one driving state', out: ['PARKED · IDLING', 'MOVING · UNKNOWN'], tone: 'accent' as const },
    { label: 'CarUxRestrictionsManagerService', sub: 'maps state to restrictions', out: 'restriction flags', tone: 'accent' as const },
    { label: 'CarPackageManager', sub: 'enforces the allowlist', out: 'blocks non-DO', tone: 'default' as const },
  ]
  const H = 54
  const G = 30
  const y = (i: number) => 40 + i * (H + G)
  return (
    <svg {...svgProps} viewBox="0 0 720 356" aria-label="VHAL speed, gear and parking-brake properties deriving a driving state, which produces restriction flags, which CarPackageManager enforces by blocking non-distraction-optimised activities">
      <DiagramDefs />
      <Label x={24} y={20} anchor="start" tone="muted" size={12}>A fault three layers down shows up as a symptom at the top</Label>

      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={130} y={y(i)} w={460} h={H} label={r.label} sub={r.sub} tone={r.tone} />
          {Array.isArray(r.out) ? (
            r.out.map((line, li) => (
              <text key={line} x={114} y={y(i) + H / 2 + (li === 0 ? -7 : 7)} textAnchor="end" dominantBaseline="middle" fill="var(--fg-subtle)" fontSize={9.5} fontFamily="var(--font-mono)">
                {line}
              </text>
            ))
          ) : r.out ? (
            <text x={114} y={y(i) + H / 2} textAnchor="end" dominantBaseline="middle" fill="var(--fg-subtle)" fontSize={9.5} fontFamily="var(--font-mono)">
              {r.out}
            </text>
          ) : null}
          {i < rows.length - 1 && <Arrow x1={360} y1={y(i) + H + 4} x2={360} y2={y(i + 1) - 4} accent />}
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ binder pool fan-in -- */

export function BinderPoolFanIn() {
  const srcH = 44
  const sources = [
    { y: 44, label: 'App A', sub: 'subscribes PERF_VEHICLE_SPEED' },
    { y: 100, label: 'App B', sub: 'subscribes HVAC_TEMPERATURE_SET' },
    { y: 156, label: 'Cluster', sub: 'subscribes ENGINE_RPM', tone: 'accent' as const },
  ]
  const pool = { x: 300, y: 90, w: 220, h: 66 }
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="App A, App B and the cluster all subscribing at once, fanning into the same bounded, shared CarService Binder thread pool">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>Every one of these calls is individually fast and well-behaved</Label>

      {sources.map((s) => (
        <g key={s.label}>
          <Box x={24} y={s.y} w={220} h={srcH} label={s.label} sub={s.sub} tone={s.tone ?? 'default'} />
          <Arrow x1={248} y1={s.y + srcH / 2} x2={pool.x - 4} y2={pool.y + pool.h / 2} accent={s.label === 'Cluster'} />
        </g>
      ))}
      <Box x={576} y={100} w={120} h={44} label="+5 more apps" sub="same boot window" tone="muted" dashed />
      <Arrow x1={576} y1={122} x2={pool.x + pool.w + 4} y2={pool.y + pool.h / 2} dashed />

      <Box x={pool.x} y={pool.y} w={pool.w} h={pool.h} label="CarService Binder pool" sub="bounded · shared by every app" tone="accent" />

      <rect x={24} y={196} width={672} height={70} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={216} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        the pool is not idle waiting for a slow outlier — it is simply full
      </text>
      <text x={360} y={234} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        the sixth arriving call queues because the previous five have not finished yet
      </text>
      <text x={360} y={252} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        none of the apps above did anything wrong
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------- binder pool exhausted trace -- */

export function BinderPoolExhaustedTrace() {
  const rowH = 38
  const gap = 10
  const y = (i: number) => 56 + i * (rowH + gap)
  const threads = ['Binder:1234_1', 'Binder:1234_2', 'Binder:1234_3', 'Binder:1234_4']
  const bottom = y(threads.length - 1) + rowH
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="A Perfetto trace showing all four of com.android.car's Binder threads blocked in getProperty, with the pool exhausted and every other caller now waiting">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>com.android.car — every Binder thread in the same state at once</Label>

      {threads.map((t, i) => (
        <Box key={t} x={140} y={y(i)} w={460} h={rowH} label={t} sub="blocked in getProperty" tone="muted" dashed />
      ))}

      <Arrow x1={370} y1={bottom + 34} x2={370} y2={bottom + 4} accent />
      <text x={370} y={bottom + 52} textAnchor="middle" fill="var(--accent)" fontSize={11} fontWeight={600} fontFamily="var(--font-display)">
        pool exhausted
      </text>
      <text x={370} y={bottom + 68} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        every other caller now waits
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------------- boot health gate -- */

export function BootHealthGate() {
  const colW = 420
  const x = (720 - colW) / 2
  const h = 42
  const gap = 14
  const stages = [
    { label: 'Boot completes', tone: 'muted' as const },
    { label: 'Car Service reachable?', tone: 'default' as const },
    { label: 'Vehicle HAL registered?', tone: 'default' as const },
    { label: 'Display composing frames?', tone: 'default' as const },
    { label: 'Critical services responding?', tone: 'accent' as const },
  ]
  const y = (i: number) => 30 + i * (h + gap)
  const gateBottom = y(stages.length - 1) + h
  const branchY = gateBottom + 54
  return (
    <svg {...svgProps} viewBox="0 0 720 430" aria-label="A post-update boot health gate: if Car Service, the Vehicle HAL, the display and critical services all check out, the boot is marked successful, otherwise it is left unmarked so the bootloader reverts">
      <DiagramDefs />
      <Label x={24} y={20} anchor="start" tone="muted" size={12}>Every check has to pass — one failure is enough to withhold the mark</Label>

      {stages.map((s, i) => (
        <g key={s.label}>
          <Box x={x} y={y(i)} w={colW} h={h} label={s.label} tone={s.tone} />
          {i < stages.length - 1 && <Arrow x1={360} y1={y(i) + h + 4} x2={360} y2={y(i + 1) - 4} accent={i >= 1} />}
        </g>
      ))}

      <Arrow x1={x + 100} y1={gateBottom + 2} x2={170} y2={branchY - 4} accent />
      <Label x={210} y={(gateBottom + branchY) / 2 + 4} anchor="start" tone="accent">yes</Label>

      <Arrow x1={x + colW - 100} y1={gateBottom + 2} x2={550} y2={branchY - 4} dashed />
      <Label x={510} y={(gateBottom + branchY) / 2 + 4} anchor="end" tone="subtle">no</Label>

      <Box x={40} y={branchY} w={260} h={54} label="mark-boot-successful" sub="this slot is now trusted" tone="accent" />
      <Box x={420} y={branchY} w={260} h={54} label="do not mark" sub="bootloader reverts to the other slot" tone="muted" dashed />
    </svg>
  )
}

/* --------------------------------------------------------------------- wake-on-CAN path -- */

export function CanWakePipeline() {
  const w = 460
  const x = (720 - w) / 2
  const h = 46
  const gap = 12
  const stages = [
    { label: 'Door handle touched', tone: 'muted' as const },
    { label: 'BCM transmits a CAN frame', sub: 'e.g. door unlock request', tone: 'default' as const },
    { label: 'CAN transceiver interrupt asserts', sub: 'a registered wakeup source', tone: 'accent' as const },
    { label: 'SoC PMIC exits low-power rail state', tone: 'accent' as const },
    { label: 'Kernel resume', sub: 'drivers re-init, clocks re-gate on', tone: 'default' as const },
    { label: 'CarPowerManagementService moves ON', sub: 'CarService resumes', tone: 'accent' as const },
  ]
  const y = (i: number) => 40 + i * (h + gap)
  const bottom = y(stages.length - 1) + h
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 60}`} aria-label="A representative wake path from a door handle touch through a CAN frame, the transceiver's registered wakeup interrupt, PMIC and kernel resume, to CarPowerManagementService moving the state to ON">
      <DiagramDefs />
      <Label x={24} y={20} anchor="start" tone="muted" size={12}>The wake decision is made on the vehicle network, before Android&rsquo;s own resume path ever runs</Label>

      {stages.map((s, i) => (
        <g key={s.label}>
          <Box x={x} y={y(i)} w={w} h={h} label={s.label} sub={s.sub} tone={s.tone} />
          {i < stages.length - 1 && <Arrow x1={x + w / 2} y1={y(i) + h + 2} x2={x + w / 2} y2={y(i + 1) - 4} accent={i >= 1} />}
        </g>
      ))}

      <rect x={24} y={bottom + 24} width={672} height={26} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={bottom + 41} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        surfaces come back — cluster and infotainment race the same boot budget as a cold start
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ no-display power policy -- */

export function NoDisplayPolicyFlow() {
  const w = 480
  const x = (720 - w) / 2
  const h = 48
  const gap = 14
  const stages = [
    { label: 'Ignition off, door sensor still armed', tone: 'muted' as const },
    { label: 'VHAL reports a low-power wake reason', sub: 'to CarPowerManagementService', tone: 'default' as const },
    { label: 'CPMS applies policy_id_no_display', sub: 'DISPLAY off · AUDIO off · WIFI on', tone: 'accent' as const },
    { label: 'AP is awake, shows and plays nothing', sub: 'watches only for the next relevant CAN frame', tone: 'muted' as const },
    { label: 'A real unlock event arrives', tone: 'default' as const },
    { label: 'CPMS applies policy_id_all_on', sub: 'display and audio power back up together', tone: 'accent' as const },
  ]
  const y = (i: number) => 40 + i * (h + gap)
  const bottom = y(stages.length - 1) + h
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 32}`} aria-label="A wake-with-no-display flow: the AP stays awake under a power policy that leaves display and audio off, watching only for the CAN frame that justifies fully waking up">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>The AP is technically on for most of this — the policy decides what that is allowed to mean</Label>

      {stages.map((s, i) => (
        <g key={s.label}>
          <Box x={x} y={y(i)} w={w} h={h} label={s.label} sub={s.sub} tone={s.tone} />
          {i < stages.length - 1 && <Arrow x1={x + w / 2} y1={y(i) + h + 2} x2={x + w / 2} y2={y(i + 1) - 4} accent={i >= 1} />}
        </g>
      ))}
    </svg>
  )
}

/* --------------------------------------------------------------------- CAN to VHAL bridge -- */

export function CanToVhalBridge() {
  const y = 90
  const h = 60
  const stops = [
    { x: 20, w: 130, label: 'CAN frame', sub: 'ID 0x123 · 8 bytes' },
    { x: 166, w: 150, label: 'Gateway / SocketCAN', sub: 'decodes using the DBC' },
    { x: 332, w: 160, label: 'Databroker', sub: 'Vehicle.Speed = 87.3', tone: 'accent' as const },
    { x: 508, w: 190, label: 'Mapping layer', sub: 'VSS path → AIDL property', tone: 'accent' as const },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 220" aria-label="A CAN frame decoded by a gateway using its DBC, published on a databroker as a VSS path, then mapped by a translation layer to the AIDL vehicle property PERF_VEHICLE_SPEED">
      <DiagramDefs />
      <Label x={24} y={26} anchor="start" tone="muted" size={12}>Three independent translations sit between the wire and your app</Label>

      {stops.map((s, i) => (
        <g key={s.label}>
          <Box x={s.x} y={y} w={s.w} h={h} label={s.label} sub={s.sub} tone={s.tone ?? 'default'} />
          {i < stops.length - 1 && <Arrow x1={s.x + s.w + 4} y1={y + h / 2} x2={stops[i + 1].x - 6} y2={y + h / 2} accent />}
        </g>
      ))}

      <rect x={220} y={178} width={280} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={198} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        → PERF_VEHICLE_SPEED, delivered by CarPropertyManager
      </text>
    </svg>
  )
}

/* --------------------------------------------------------------------- zonal round trip -- */

export function ZonalRoundTrip() {
  const h = 54
  const stops = [
    { x: 20, w: 168, label: 'Seat motor sensor', sub: 'position' },
    { x: 208, w: 168, label: 'Zone controller', sub: 'front-left, local bus' },
    { x: 396, w: 150, label: 'Central compute', sub: 'over Ethernet backbone', tone: 'accent' as const },
    { x: 566, w: 134, label: 'Seat service', sub: 'applies logic — software', tone: 'accent' as const },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 260" aria-label="A seat-position signal travelling out to a central compute service and a command travelling back down the same path to the seat motor driver">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>The signal travels out to central compute; the command travels back the same way</Label>

      {stops.map((s, i) => (
        <g key={s.label}>
          <Box x={s.x} y={70} w={s.w} h={h} label={s.label} sub={s.sub} tone={s.tone ?? 'default'} />
          {i < stops.length - 1 && <Arrow x1={s.x + s.w + 4} y1={70 + h / 2} x2={stops[i + 1].x - 6} y2={70 + h / 2} accent />}
        </g>
      ))}

      <path d="M633 124 C 633 210, 104 210, 104 128" fill="none" stroke="var(--fg-subtle)" strokeWidth={1.4} strokeDasharray="4 4" markerEnd="url(#d-arrow)" />
      <Label x={368} y={228} tone="subtle">command sent back down the same path</Label>

      <Box x={20} y={158} w={168} h={44} label="Seat motor driver" tone="muted" dashed />
    </svg>
  )
}

/* --------------------------------------------------------------------- CAN gateway filtering -- */

export function CanGatewayFiltering() {
  const srcY = 40, srcH = 50
  const gwY = 140, gwH = 56
  const dstY = 240, dstH = 54
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="A gateway ECU filtering what crosses from infotainment CAN to body CAN, with almost nothing allowed through to powertrain CAN">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>Segmentation limits reach — a forged frame still needs a wire to travel on</Label>

      <Box x={260} y={srcY} w={200} h={srcH} label="Infotainment CAN" tone="muted" />
      <Arrow x1={360} y1={srcY + srcH + 4} x2={360} y2={gwY - 4} accent />

      <Box x={260} y={gwY} w={200} h={gwH} label="Gateway ECU" sub="filter by ID · rate-limit · direction" tone="accent" />

      <Label x={225} y={gwY - 10} anchor="middle" tone="accent">filtered, limited traffic</Label>
      <Arrow x1={310} y1={gwY + gwH + 4} x2={140} y2={dstY - 4} accent />
      <Box x={20} y={dstY} w={240} h={dstH} label="Body CAN" sub="some messages allowed through" tone="default" />

      <Label x={495} y={gwY - 10} anchor="middle" tone="subtle">usually nothing allowed through</Label>
      <Arrow x1={410} y1={gwY + gwH + 4} x2={560} y2={dstY - 4} dashed />
      <Box x={460} y={dstY} w={240} h={dstH} label="Powertrain CAN" sub="steering, braking — kept isolated" tone="muted" dashed />
    </svg>
  )
}

/* ----------------------------------------------------------- subscription rate arbitration -- */

export function SubscriptionRateArbitration() {
  const h = 46
  const apps = [
    { y: 48, label: 'App A', sub: 'SENSOR_RATE_UI (5 Hz)' },
    { y: 110, label: 'App B', sub: 'SENSOR_RATE_NORMAL (1 Hz)' },
    { y: 172, label: 'App C', sub: 'SENSOR_RATE_FAST (10 Hz)', tone: 'accent' as const },
  ]
  const hub = { x: 272, y: 110, w: 200, h }
  const hal = { x: 528, y: 110, w: 168, h }
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Three apps requesting different sample rates for the same property, with CarPropertyService opening one HAL subscription at the fastest rate and delivering every event to all three">
      <DiagramDefs />
      <Label x={24} y={22} anchor="start" tone="muted" size={12}>One property, three requested rates, one subscription actually opened</Label>

      {apps.map((a) => (
        <g key={a.label}>
          <Box x={24} y={a.y} w={200} h={h} label={a.label} sub={a.sub} tone={a.tone ?? 'default'} />
          <Arrow x1={228} y1={a.y + h / 2} x2={hub.x - 4} y2={hub.y + hub.h / 2} accent={a.label === 'App C'} />
        </g>
      ))}

      <Box x={hub.x} y={hub.y} w={hub.w} h={hub.h} label="CarPropertyService" sub="subscribes to the HAL ONCE, at 10 Hz" tone="accent" />
      <Arrow x1={hub.x + hub.w + 4} y1={hub.y + hub.h / 2} x2={hal.x - 4} y2={hal.y + hal.h / 2} accent />
      <Box x={hal.x} y={hal.y} w={hal.w} h={hal.h} label="Vehicle HAL" sub="publishes at 10 Hz" />

      <path d="M600 156 C 600 250, 120 250, 114 96" fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="4 4" markerEnd="url(#d-arrow-accent)" />
      <Label x={360} y={252} tone="accent">every event is delivered to A, B and C</Label>

      <rect x={24} y={272} width={672} height={22} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={284} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        the slower subscribers now receive events faster than they asked for
      </text>
    </svg>
  )
}

/* ------------------------------------------------------- AAOS release timeline -- */

export function AaosReleaseTimeline() {
  const releases = [
    { label: '9', tag: 'AAOS enters AOSP', tone: 'muted' as const },
    { label: '10', tag: 'Model settles', tone: 'muted' as const },
    { label: '11', tag: 'Car UI Library', tone: 'accent' as const },
    { label: '12', tag: 'Occupant zones', tone: 'accent' as const },
    { label: '13', tag: 'HIDL → AIDL VHAL', tone: 'accent' as const, big: true },
    { label: '14–16', tag: 'Steady widening', tone: 'muted' as const },
  ]
  const X0 = 60, XEnd = 660, Y = 110
  const x = (i: number) => X0 + (i * (XEnd - X0)) / (releases.length - 1)
  return (
    <svg {...svgProps} viewBox="0 0 720 234" aria-label="A timeline of Android Automotive releases from 9 to 16, marking Car UI Library, occupant zones and the HIDL to AIDL VHAL migration as the releases that actually changed what you build against">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Three releases changed what you can build on; the rest widened what was already there</Label>

      <line x1={X0} y1={Y} x2={XEnd + 12} y2={Y} stroke="var(--fg-subtle)" strokeWidth={1.4} markerEnd="url(#d-arrow)" />

      {releases.map((r, i) => {
        const cx = x(i)
        const accent = r.tone === 'accent'
        return (
          <g key={r.label}>
            {r.big && <circle cx={cx} cy={Y} r={11} fill="none" stroke="var(--accent)" strokeWidth={1.2} opacity={0.45} />}
            <circle cx={cx} cy={Y} r={r.big ? 7 : 4.5} fill={accent ? 'var(--accent)' : 'var(--surface)'} stroke={accent ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={1.5} />
            <text x={cx} y={Y + 26} textAnchor="middle" fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">{r.label}</text>
            <text x={cx} y={Y + 44} textAnchor="middle" fill={accent ? 'var(--accent)' : 'var(--fg-subtle)'} fontSize={10} fontFamily="var(--font-mono)">{r.tag}</text>
          </g>
        )
      })}

      <rect x={20} y={178} width={680} height={40} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={360} y={195} textAnchor="middle" fill="var(--fg)" fontSize={10.5} fontFamily="var(--font-mono)">the single biggest interface change in the platform&rsquo;s history is Android 13&rsquo;s AIDL VHAL</text>
      <text x={360} y={211} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">if you inherit a HIDL VHAL, budget for a migration, not a refactor</text>
    </svg>
  )
}

/* --------------------------------------------------------- HIDL to AIDL VHAL -- */

export function HidlToAidlVhal() {
  const leftX = 40, rightX = 400, boxW = 280, boxY = 44, boxH = 128
  const leftLines = ['Interface: HIDL (.hal)', 'Calls: per-property, one at a time', 'Codegen: hidl-gen', 'Status: long-tail maintenance']
  const rightLines = ['Interface: AIDL (.aidl)', 'Calls: batched get/set requests', 'Codegen: the AIDL compiler', 'Status: the current standard']
  return (
    <svg {...svgProps} viewBox="0 0 720 232" aria-label="HIDL VHAL on Android 12 and earlier compared with AIDL VHAL from Android 13 onward — same conceptual model, a different interface, and batched rather than per-call requests">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Same conceptual model — properties, areas, three operations — the wire format changes</Label>

      <text x={leftX + boxW / 2} y={38} textAnchor="middle" fill="var(--fg-muted)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-display)">HIDL VHAL &mdash; Android ≤ 12</text>
      <rect x={leftX} y={boxY} width={boxW} height={boxH} rx={10} fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth={1.25} />
      {leftLines.map((l, i) => (
        <text key={l} x={leftX + 18} y={boxY + 30 + i * 24} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">{l}</text>
      ))}

      <text x={rightX + boxW / 2} y={38} textAnchor="middle" fill="var(--accent)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-display)">AIDL VHAL &mdash; Android 13+</text>
      <rect x={rightX} y={boxY} width={boxW} height={boxH} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.25} />
      {rightLines.map((l, i) => (
        <text key={l} x={rightX + 18} y={boxY + 30 + i * 24} fill="var(--fg)" fontSize={10.5} fontFamily="var(--font-mono)">{l}</text>
      ))}

      <Arrow x1={leftX + boxW + 6} y1={boxY + boxH / 2} x2={rightX - 6} y2={boxY + boxH / 2} accent />
      <Label x={360} y={boxY + boxH / 2 + 22} tone="accent">the migration</Label>

      <rect x={20} y={190} width={680} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={209} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">scheduled work, not a weekend refactor &mdash; every property call site is touched</text>
    </svg>
  )
}
