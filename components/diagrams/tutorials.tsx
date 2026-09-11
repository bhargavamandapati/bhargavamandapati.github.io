import { Arrow, Box, DiagramDefs, Label } from './primitives'

const svgProps = { className: 'w-full', role: 'img' as const }

/* -------------------------------------------------------------- CAN HAL -- */

export function CanHalFlow() {
  const y = 74
  const h = 58
  const stops = [
    { x: 24, w: 118, label: 'Kernel', sub: 'SocketCAN driver' },
    { x: 170, w: 108, label: 'can0 / vcan0', sub: 'network socket' },
    { x: 306, w: 132, label: 'CAN HAL', sub: 'per-bus daemon' },
    { x: 466, w: 128, label: 'Vendor VHAL', sub: 'decode + scale' },
    { x: 622, w: 96, label: 'Car Service', sub: 'property' },
  ]
  return (
    <svg
      {...svgProps}
      viewBox="0 0 742 200"
      aria-label="A CAN frame travelling from the kernel's SocketCAN driver through the CAN HAL and vendor VHAL to a vehicle property"
    >
      <DiagramDefs />
      <Label x={24} y={30} anchor="start" tone="muted" size={12}>
        A frame becomes a property, three processes later
      </Label>
      {stops.map((s, i) => (
        <g key={s.label}>
          <Box x={s.x} y={y} w={s.w} h={h} label={s.label} sub={s.sub} tone={i === 2 ? 'accent' : 'default'} />
          {i < stops.length - 1 && (
            <Arrow x1={s.x + s.w + 4} y1={y + h / 2} x2={stops[i + 1].x - 6} y2={y + h / 2} accent={i >= 1} />
          )}
        </g>
      ))}
      <Label x={224} y={158}>read() on a raw socket</Label>
      <Label x={527} y={158} tone="accent">VehiclePropValue</Label>
      <Label x={24} y={182} anchor="start">
        Two independent sockets can open the same bus — one to send, one to receive its own traffic back.
      </Label>
    </svg>
  )
}

/* ---------------------------------------------------------- rotary path -- */

export function RotaryInputPath() {
  const rows = [
    { label: 'CAN frame', sub: 'rotary knob turns one detent', mech: '8 bytes on the bus', tone: 'muted' as const },
    { label: 'Vehicle HAL', sub: 'decodes it into a property change', mech: 'setValues()', tone: 'vendor' as const },
    { label: 'VHAL property store', sub: 'holds the new value, notes the area ID', mech: 'onPropertyEvent()', tone: 'accent' as const },
    { label: 'Subscription filter', sub: 'matches property + area ID against subscribers', mech: 'in-process lookup', tone: 'accent' as const },
    { label: 'CarInputService', sub: 'converts to a KeyEvent for the focused input area', mech: 'binder callback', tone: 'default' as const },
    { label: 'SystemUI / app', sub: 'the KeyEvent is finally dispatched', mech: 'InputEvent dispatch', tone: 'default' as const },
  ]
  const H = 40
  const G = 8
  const y = (i: number) => 38 + i * (H + G)
  const bottom = y(rows.length - 1) + H
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 34}`} aria-label="A rotary controller turn travelling from a CAN frame to a dispatched KeyEvent">
      <DiagramDefs />
      <Label x={24} y={20} anchor="start" tone="muted" size={12}>
        The area ID has to match at every hop, or the event is silently dropped
      </Label>
      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={24} y={y(i)} w={400} h={H} label={r.label} sub={r.sub} tone={r.tone} dashed={r.tone === 'vendor'} />
          <text
            x={444}
            y={y(i) + H / 2}
            dominantBaseline="middle"
            fill="var(--fg-subtle)"
            fontSize={10.5}
            fontFamily="var(--font-mono)"
          >
            {r.mech}
          </text>
          {i < rows.length - 1 && <Arrow x1={224} y1={y(i) + H} x2={224} y2={y(i + 1) - 2} accent={i >= 2} />}
        </g>
      ))}
      <Label x={24} y={bottom + 24} anchor="start">
        A property published for the wrong area ID reaches step 3 and stops — nothing downstream ever sees it.
      </Label>
    </svg>
  )
}

/* -------------------------------------------------- native daemon lanes -- */

export function NativeDaemonPatterns() {
  const lanes = [
    {
      x: 24,
      title: 'Java service',
      rows: ['Lives in: system_server', 'Domain: system_server', 'Registered: ServiceManager.addService (Java)'],
    },
    {
      x: 264,
      title: 'Native daemon',
      rows: ['Lives in: own process', 'Domain: its own .te type', 'Registered: AServiceManager_addService'],
    },
    {
      x: 504,
      title: 'Vendor HAL (Treble)',
      rows: ['Lives in: vendor partition', 'Domain: its own vendor .te type', 'Registered: + a VINTF manifest entry'],
    },
  ]
  const laneW = 214
  const rowH = 30
  return (
    <svg {...svgProps} viewBox="0 0 742 220" aria-label="Three ways to add a service: inside system_server, a plain native daemon, or a Treble vendor HAL">
      <DiagramDefs />
      <Label x={24} y={20} anchor="start" tone="muted" size={12}>
        Same job, three homes — the difference is the boundary each one crosses
      </Label>
      {lanes.map((lane, li) => (
        <g key={lane.title}>
          <Box x={lane.x} y={38} w={laneW} h={40} label={lane.title} tone={li === 1 ? 'accent' : 'default'} />
          {lane.rows.map((r, ri) => (
            <g key={r}>
              <rect
                x={lane.x}
                y={92 + ri * (rowH + 6)}
                width={laneW}
                height={rowH}
                rx={6}
                fill="var(--bg-subtle)"
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={lane.x + 10}
                y={92 + ri * (rowH + 6) + rowH / 2}
                dominantBaseline="middle"
                fill="var(--fg-muted)"
                fontSize={10}
                fontFamily="var(--font-mono)"
              >
                {r}
              </text>
            </g>
          ))}
          <Arrow x1={lane.x + laneW / 2} y1={78} x2={lane.x + laneW / 2} y2={90} />
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------- TaskView boxes -- */

export function TaskViewEmbedding() {
  return (
    <svg {...svgProps} viewBox="0 0 620 260" aria-label="One app's window embedding another app's task inside a TaskView surface">
      <DiagramDefs />
      <rect x={24} y={30} width={572} height={210} rx={12} fill="var(--bg-subtle)" stroke="var(--border)" strokeWidth={1.25} />
      <Label x={44} y={54} anchor="start" tone="muted" size={11}>
        Host app&apos;s window (e.g. the launcher)
      </Label>

      <rect x={64} y={74} width={492} height={140} rx={10} fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth={1.25} strokeDasharray="5 4" />
      <Label x={84} y={96} anchor="start" tone="subtle" size={10.5}>
        ControlledRemoteCarTaskView (a SurfaceControl the host owns)
      </Label>

      <Box x={104} y={112} w={412} h={80} label="Embedded app's task" sub="its own process, its own Activity stack" tone="accent" />

      <Arrow x1={310} y1={214} x2={310} y2={232} accent />
      <Label x={310} y={244} tone="accent">
        Host process never touches the embedded app&apos;s code
      </Label>
    </svg>
  )
}

/* ------------------------------------------------------------- VMS pub/sub -- */

export function VmsPubSub() {
  const y = 90
  const h = 60
  return (
    <svg {...svgProps} viewBox="0 0 700 220" aria-label="A VMS provider publishing a layer through the broker to a subscriber">
      <DiagramDefs />
      <Label x={24} y={26} anchor="start" tone="muted" size={12}>
        The broker routes by layer id — it never inspects the payload
      </Label>

      <Box x={24} y={y} w={160} h={h} label="Provider" sub="offers a layer" />
      <Box x={270} y={y} w={160} h={h} label="VmsBrokerService" sub="tracks who offers what" tone="accent" />
      <Box x={516} y={y} w={160} h={h} label="Subscriber" sub="subscribed to that layer id" />

      <Arrow x1={184} y1={y + h / 2 - 12} x2={266} y2={y + h / 2 - 12} accent />
      <Label x={225} y={y - 12}>1. offer(layer)</Label>

      <Arrow x1={430} y1={y + h / 2 - 12} x2={512} y2={y + h / 2 - 12} accent />
      <Label x={471} y={y - 12}>3. onLayersAvailable</Label>

      <Arrow x1={512} y1={y + h / 2 + 12} x2={430} y2={y + h / 2 + 12} dashed />
      <Label x={471} y={y + h + 22}>2. subscribe(layer)</Label>

      <Arrow x1={266} y1={y + h / 2 + 12} x2={184} y2={y + h / 2 + 12} dashed />

      <Label x={24} y={190} anchor="start">
        A provider needs no subscribers to exist, and a subscriber needs no provider — the broker outlives both.
      </Label>
    </svg>
  )
}

/* --------------------------------------------------- remote access cycle -- */

export function RemoteAccessLifecycle() {
  const rows = [
    { label: 'Vehicle asleep', sub: 'AP powered down, HAL still listening', tone: 'muted' as const },
    { label: 'External wakeup signal', sub: 'a server, or the HAL debug hook, requests a wake', tone: 'vendor' as const },
    { label: 'Remote access HAL', sub: 'wakes the AP, hands off a task id', tone: 'accent' as const },
    { label: 'CarRemoteAccessService', sub: 'resolves which app owns the task', tone: 'accent' as const },
    { label: 'App’s RemoteTaskService', sub: 'does the work — e.g. precondition the cabin', tone: 'default' as const },
    { label: 'Power-down decision', sub: 'app reports done, or a timeout forces it', tone: 'default' as const },
  ]
  const H = 40
  const G = 8
  const y = (i: number) => 34 + i * (H + G)
  const bottom = y(rows.length - 1) + H
  return (
    <svg {...svgProps} viewBox={`0 0 700 ${bottom + 20}`} aria-label="The lifecycle of a remote-access wakeup, from an external signal to a power-down decision">
      <DiagramDefs />
      <Label x={24} y={18} anchor="start" tone="muted" size={12}>
        The vehicle only stays awake as long as the task takes
      </Label>
      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={24} y={y(i)} w={420} h={H} label={r.label} sub={r.sub} tone={r.tone} dashed={r.tone === 'vendor'} />
          {i < rows.length - 1 && <Arrow x1={234} y1={y(i) + H} x2={234} y2={y(i + 1) - 2} accent={i >= 1} />}
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------ occupant-awareness gates -- */

export function OccupantAwarenessGates() {
  const rows = [
    { label: 'Build config', sub: 'init_rc + vintf_fragments declare the HAL', tone: 'default' as const },
    { label: 'VINTF / overlayable policy', sub: 'the fragment must be allowed to exist', tone: 'default' as const },
    { label: 'SELinux type attribute', sub: 'client domain granted hal_occupant_awareness_client', tone: 'default' as const },
    { label: 'HAL connects', sub: '"Connected to HAL service" — all three gates passed', tone: 'accent' as const },
  ]
  const H = 42
  const G = 10
  const y = (i: number) => 34 + i * (H + G)
  const bottom = y(rows.length - 1) + H
  return (
    <svg {...svgProps} viewBox={`0 0 640 ${bottom + 16}`} aria-label="Three independent gates that must all pass before a new HAL connects">
      <DiagramDefs />
      <Label x={24} y={18} anchor="start" tone="muted" size={12}>
        Missing any one gate looks identical from the client: it just never connects
      </Label>
      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={24} y={y(i)} w={480} h={H} label={r.label} sub={r.sub} tone={r.tone} />
          {i < rows.length - 1 && <Arrow x1={264} y1={y(i) + H} x2={264} y2={y(i + 1) - 2} />}
        </g>
      ))}
    </svg>
  )
}

/* -------------------------------------------------------- zygote sequence -- */

export function ZygoteForkSequence() {
  const rows = [
    { label: 'Zygote, warmed up', sub: 'preloaded classes and resources already loaded', tone: 'muted' as const },
    { label: 'Fork request arrives', sub: 'ActivityManager sends args over a local socket', tone: 'default' as const },
    { label: 'fork()', sub: 'copy-on-write — the child shares pages until it writes', tone: 'accent' as const },
    { label: 'SELinux domain transition', sub: 'dyntransition into the app’s own domain, no exec', tone: 'accent' as const },
    { label: 'Specialize', sub: 'drop capabilities, setuid, apply seccomp — in that order', tone: 'default' as const },
    { label: 'App process runs', sub: 'its own PID, its own domain, a warm heap', tone: 'default' as const },
  ]
  const H = 40
  const G = 8
  const y = (i: number) => 34 + i * (H + G)
  const bottom = y(rows.length - 1) + H
  return (
    <svg {...svgProps} viewBox={`0 0 700 ${bottom + 20}`} aria-label="Zygote forking and specializing into a new app process">
      <DiagramDefs />
      <Label x={24} y={18} anchor="start" tone="muted" size={12}>
        Seccomp is applied before setuid on purpose — root is more dangerous with a wide syscall table
      </Label>
      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={24} y={y(i)} w={420} h={H} label={r.label} sub={r.sub} tone={r.tone} />
          {i < rows.length - 1 && <Arrow x1={234} y1={y(i) + H} x2={234} y2={y(i + 1) - 2} accent={i >= 2 && i <= 3} />}
        </g>
      ))}
    </svg>
  )
}

/* --------------------------------------------------------- dexopt pipeline -- */

export function DexoptPipeline() {
  const y = 78
  const h = 58
  const stops = [
    { x: 24, w: 110, label: 'App .dex', sub: 'as installed' },
    { x: 168, w: 150, label: 'Compiler filter', sub: 'requested vs. actually used' },
    { x: 352, w: 108, label: 'dex2oat', sub: 'ahead-of-time' },
    { x: 494, w: 108, label: '.oat / .vdex', sub: 'on disk' },
    { x: 636, w: 82, label: 'App runs', sub: 'reads it' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 742 200" aria-label="An app's dex file compiled ahead of time into an oat file, then read back at launch">
      <DiagramDefs />
      <Label x={24} y={26} anchor="start" tone="muted" size={12}>
        An unset filter falls back silently — check what actually ran, not what was asked for
      </Label>
      {stops.map((s, i) => (
        <g key={s.label}>
          <Box x={s.x} y={y} w={s.w} h={h} label={s.label} sub={s.sub} tone={i === 1 ? 'accent' : 'default'} />
          {i < stops.length - 1 && (
            <Arrow x1={s.x + s.w + 4} y1={y + h / 2} x2={stops[i + 1].x - 6} y2={y + h / 2} accent={i >= 1} />
          )}
        </g>
      ))}
      <Label x={24} y={182} anchor="start">
        &quot;verify&quot; and &quot;speed&quot; produce very different file sizes and cold-launch times for the same app.
      </Label>
    </svg>
  )
}
