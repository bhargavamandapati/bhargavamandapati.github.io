import { Arrow, Box, DiagramDefs, Label } from './primitives'

const svgProps = { className: 'w-full', role: 'img' as const }

/* ------------------------------------------------- E/E architecture eras -- */

export function EeArchitectureEvolution() {
  const eras = [
    { label: 'Distributed', sub: 'one ECU per function', count: 14, note: '~1990s–2010s' },
    { label: 'Domain', sub: 'grouped by function', count: 5, note: '~2015+' },
    { label: 'Zonal', sub: 'grouped by location', count: 4, note: 'SDV era' },
    { label: 'Central', sub: 'one computer, zonal I/O', count: 1, note: 'emerging' },
  ]
  const W = 158
  const gap = 22
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Vehicle electronics moving from many small computers to few powerful ones">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Fewer, more powerful computers — the physical change behind SDV</Label>

      {eras.map((era, i) => {
        const x = 22 + i * (W + gap)
        const cols = Math.min(4, Math.ceil(Math.sqrt(era.count)))
        return (
          <g key={era.label}>
            <rect x={x} y={44} width={W} height={168} rx={10}
                  fill={i === 3 ? 'var(--accent-soft)' : 'var(--surface-2)'}
                  stroke={i >= 2 ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={1.2} />
            {Array.from({ length: era.count }).map((_, n) => {
              const size = era.count === 1 ? 74 : era.count <= 5 ? 34 : 20
              const perRow = era.count === 1 ? 1 : cols
              const cx = x + W / 2 + ((n % perRow) - (perRow - 1) / 2) * (size + 8)
              const cy = 128 + (Math.floor(n / perRow) - (Math.ceil(era.count / perRow) - 1) / 2) * (size + 8)
              return (
                <rect key={n} x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={4}
                      fill={i === 3 ? 'var(--accent)' : 'var(--border-strong)'}
                      opacity={i === 3 ? 0.9 : 0.65} />
              )
            })}
            <text x={x + W / 2} y={236} textAnchor="middle" fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">{era.label}</text>
            <text x={x + W / 2} y={254} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">{era.sub}</text>
            <text x={x + W / 2} y={272} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">{era.note}</text>
            {i < eras.length - 1 && <Arrow x1={x + W + 4} y1={128} x2={x + W + gap - 4} y2={128} accent={i >= 1} />}
          </g>
        )
      })}
      <Label x={360} y={292} tone="accent">wiring shrinks · compute concentrates · functions become software</Label>
    </svg>
  )
}

/* ----------------------------------------------------- zonal architecture -- */

export function ZonalArchitecture() {
  const zones = [
    { x: 40, y: 60, label: 'Front-left zone', sub: 'lights · door · mirror' },
    { x: 470, y: 60, label: 'Front-right zone', sub: 'lights · door · sensors' },
    { x: 40, y: 232, label: 'Rear-left zone', sub: 'door · seat · boot' },
    { x: 470, y: 232, label: 'Rear-right zone', sub: 'door · seat · lamps' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 330" aria-label="Zonal architecture: local gateways wired to nearby components, connected to a central computer by Ethernet">
      <DiagramDefs />
      <Label x={22} y={24} anchor="start" tone="muted" size={12}>Zones own the wiring near them; the centre owns the software</Label>

      {/* central compute */}
      <rect x={252} y={128} width={216} height={110} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={360} y={162} textAnchor="middle" fill="var(--fg)" fontSize={14} fontWeight={600} fontFamily="var(--font-display)">Central compute</text>
      <text x={360} y={183} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">cockpit · ADAS · vehicle</text>
      <text x={360} y={200} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">functions run here</text>
      <text x={360} y={220} textAnchor="middle" fill="var(--accent)" fontSize={10.5} fontFamily="var(--font-mono)">updatable over the air</text>

      {zones.map((z) => (
        <g key={z.label}>
          <Box x={z.x} y={z.y} w={210} h={56} label={z.label} sub={z.sub} />
        </g>
      ))}

      {/* ethernet backbone */}
      <Arrow x1={250} y1={116} x2={296} y2={140} accent both />
      <Arrow x1={470} y1={116} x2={424} y2={140} accent both />
      <Arrow x1={250} y1={250} x2={296} y2={226} accent both />
      <Arrow x1={470} y1={250} x2={424} y2={226} accent both />
      <Label x={360} y={122} tone="accent">Automotive Ethernet</Label>

      <rect x={40} y={296} width={640} height={22} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={308} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        short local wiring to sensors and actuators · one high-speed link back to the centre
      </text>
    </svg>
  )
}

/* --------------------------------------------- signal vs service oriented -- */

export function SignalVsService() {
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Broadcast signals compared with callable services">
      <DiagramDefs />

      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Signal-oriented — everyone shouts, everyone listens</Label>
      <Box x={22} y={40} w={120} h={44} label="ECU A" tone="muted" />
      <Box x={22} y={94} w={120} h={44} label="ECU B" tone="muted" />
      <rect x={176} y={40} width={16} height={98} rx={4} fill="var(--border-strong)" />
      <g transform="translate(184, 89) rotate(-90)"><Label x={0} y={0} tone="subtle">CAN bus</Label></g>
      <Box x={226} y={40} w={120} h={44} label="ECU C" tone="muted" />
      <Box x={226} y={94} w={120} h={44} label="Head unit" tone="muted" />
      <Arrow x1={146} y1={62} x2={172} y2={62} />
      <Arrow x1={146} y1={116} x2={172} y2={116} />
      <Arrow x1={196} y1={62} x2={222} y2={62} />
      <Arrow x1={196} y1={116} x2={222} y2={116} />
      <Label x={186} y={158} tone="subtle">no addressing · no replies · fixed at build time</Label>

      <line x1={378} y1={30} x2={378} y2={280} stroke="var(--border)" strokeDasharray="4 4" />

      <Label x={400} y={22} anchor="start" tone="accent" size={12}>Service-oriented — offer and call</Label>
      <Box x={400} y={40} w={140} h={50} label="Seat service" sub="offers: setPosition()" tone="accent" />
      <Box x={400} y={104} w={140} h={50} label="Light service" sub="offers: setBeam()" tone="accent" />
      <Box x={572} y={72} w={126} h={50} label="Cockpit app" sub="discovers · calls" />
      <Arrow x1={544} y1={65} x2={568} y2={88} accent both />
      <Arrow x1={544} y1={129} x2={568} y2={106} accent both />
      <Label x={696} y={172} anchor="end" tone="accent">discovered at runtime · request/response · versioned</Label>

      <rect x={22} y={244} width={676} height={44} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={262} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        signals: add a consumer and you re-wire · services: add a consumer and nothing changes
      </text>
      <text x={360} y={278} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">
        that difference is what makes features addable after the car ships
      </text>
    </svg>
  )
}

/* --------------------------------------------------------- SOME/IP basics -- */

export function SomeIpFlow() {
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="The four things SOME/IP provides: discovery, methods, events and fields">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Four mechanisms, one protocol</Label>

      <Box x={22} y={44} w={150} h={200} label="" sub="" tone="muted" />
      <text x={97} y={78} textAnchor="middle" fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">Client</text>
      <text x={97} y={98} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">e.g. cockpit</text>

      <Box x={548} y={44} w={150} h={200} label="" sub="" tone="accent" />
      <text x={623} y={78} textAnchor="middle" fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-display)">Service</text>
      <text x={623} y={98} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">e.g. seat ECU</text>

      {[
        { y: 128, label: 'discovery', note: '“who offers SeatService v1?”', dir: 'both' },
        { y: 164, label: 'method', note: 'setPosition(3) → ok', dir: 'both' },
        { y: 200, label: 'event', note: 'positionChanged', dir: 'left' },
        { y: 232, label: 'field', note: 'get · set · notify', dir: 'both' },
      ].map((r) => (
        <g key={r.label}>
          {r.dir === 'both'
            ? <Arrow x1={178} y1={r.y} x2={542} y2={r.y} accent both />
            : <Arrow x1={542} y1={r.y} x2={178} y2={r.y} accent />}
          <text x={360} y={r.y - 8} textAnchor="middle" fill="var(--accent)" fontSize={11} fontWeight={600} fontFamily="var(--font-mono)">{r.label}</text>
          <text x={360} y={r.y + 14} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10} fontFamily="var(--font-mono)">{r.note}</text>
        </g>
      ))}

      <rect x={22} y={264} width={676} height={24} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={277} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        interfaces described in Franca IDL or ARXML · code generated for both ends
      </text>
    </svg>
  )
}

/* ------------------------------------------------------- mixed criticality -- */

export function MixedCriticality() {
  const guests = [
    { x: 30, label: 'Safety RTOS', sub: 'cluster, telltales', asil: 'ASIL B/D', tone: 'accent' as const },
    { x: 208, label: 'ADAS stack', sub: 'perception, control', asil: 'ASIL D', tone: 'accent' as const },
    { x: 386, label: 'Android', sub: 'infotainment, apps', asil: 'QM', tone: 'default' as const },
    { x: 564, label: 'Vehicle Linux', sub: 'services, gateway', asil: 'QM/ASIL A', tone: 'default' as const },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Several operating systems of different safety levels sharing one chip under a hypervisor">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>One chip, four operating systems, four different safety obligations</Label>

      {guests.map((g) => (
        <g key={g.label}>
          <Box x={g.x} y={44} w={126} h={92} label={g.label} sub={g.sub} tone={g.tone} />
          <text x={g.x + 63} y={152} textAnchor="middle"
                fill={g.asil === 'QM' ? 'var(--fg-subtle)' : 'var(--accent)'}
                fontSize={10.5} fontWeight={600} fontFamily="var(--font-mono)">{g.asil}</text>
        </g>
      ))}

      <rect x={30} y={172} width={660} height={52} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={360} y={194} textAnchor="middle" fill="var(--fg)" fontSize={13.5} fontWeight={600} fontFamily="var(--font-display)">Hypervisor</text>
      <text x={360} y={213} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">partitions CPU, memory and devices · enforces freedom from interference</text>

      <Box x={30} y={240} w={660} h={44} label="System-on-chip" sub="cores · GPU · memory · peripherals" tone="muted" />
      {guests.map((g) => <Arrow key={g.x} x1={g.x + 63} y1={162} x2={g.x + 63} y2={170} />)}
      <Arrow x1={360} y1={226} x2={360} y2={236} />
    </svg>
  )
}

/* ---------------------------------------------------------------- VSS tree -- */

export function VssTree() {
  const rows = [
    { d: 0, label: 'Vehicle', sub: 'branch', tone: 'accent' as const },
    { d: 1, label: 'Vehicle.Speed', sub: 'sensor · float · km/h', tone: 'default' as const },
    { d: 1, label: 'Vehicle.Cabin', sub: 'branch', tone: 'muted' as const },
    { d: 2, label: 'Vehicle.Cabin.HVAC', sub: 'branch', tone: 'muted' as const },
    { d: 3, label: 'Vehicle.Cabin.HVAC.AmbientAirTemperature', sub: 'sensor · float · celsius', tone: 'default' as const },
    { d: 2, label: 'Vehicle.Cabin.Seat.Row1.DriverSide.Heating', sub: 'actuator · int8 · percent', tone: 'default' as const },
  ]
  const H = 38
  return (
    <svg {...svgProps} viewBox="0 0 720 332" aria-label="The Vehicle Signal Specification is a tree of named signals with types and units">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>One shared vocabulary, agreed across ECU, platform and HMI teams</Label>
      {rows.map((r, i) => {
        const x = 30 + r.d * 40
        const y = 44 + i * (H + 6)
        return (
          <g key={r.label}>
            <Box x={x} y={y} w={660 - r.d * 40} h={H} label={r.label} sub={r.sub} tone={r.tone} />
            {r.d > 0 && (
              <path d={`M${x - 20} ${y - 10} L ${x - 20} ${y + H / 2} L ${x - 4} ${y + H / 2}`}
                    fill="none" stroke="var(--border-strong)" strokeWidth={1.2} />
            )}
          </g>
        )
      })}
      <Label x={360} y={318} tone="subtle">every node carries a datatype, a unit and whether it can be written</Label>
    </svg>
  )
}

/* ------------------------------------------------------------- data broker -- */

export function DataBrokerFlow() {
  const h = 52
  return (
    <svg {...svgProps} viewBox="0 0 720 268" aria-label="A data broker sitting between signal producers and the applications that consume them">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Producers publish. Consumers subscribe. Neither knows the other.</Label>

      <Box x={22} y={44} w={160} h={h} label="CAN feeder" sub="bus → VSS" tone="muted" />
      <Box x={22} y={108} w={160} h={h} label="SOME/IP feeder" sub="services → VSS" tone="muted" />
      <Box x={22} y={172} w={160} h={h} label="Simulator" sub="test values" tone="vendor" dashed />

      <rect x={252} y={80} width={196} height={112} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={350} y={116} textAnchor="middle" fill="var(--fg)" fontSize={14} fontWeight={600} fontFamily="var(--font-display)">Data broker</text>
      <text x={350} y={138} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">holds current VSS values</text>
      <text x={350} y={156} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">access control per signal</text>
      <text x={350} y={176} textAnchor="middle" fill="var(--accent)" fontSize={10.5} fontFamily="var(--font-mono)">gRPC</text>

      <Box x={518} y={44} w={180} h={h} label="Cluster app" sub="subscribes" />
      <Box x={518} y={108} w={180} h={h} label="Infotainment" sub="subscribes + writes" />
      <Box x={518} y={172} w={180} h={h} label="Cloud uploader" sub="subscribes" />

      {[70, 134, 198].map((y) => <Arrow key={y} x1={186} y1={y} x2={248} y2={Math.min(180, Math.max(96, y))} accent />)}
      {[70, 134, 198].map((y) => <Arrow key={`o${y}`} x1={452} y1={Math.min(180, Math.max(96, y))} x2={514} y2={y} accent />)}

      <Label x={360} y={238} tone="subtle">swap the feeder for a simulator and every consumer above works unchanged</Label>
    </svg>
  )
}

/* ------------------------------------------------------- virtual ECU stages -- */

export function VirtualEcuPipeline() {
  const stages = [
    { label: 'MIL', sub: 'model in the loop', note: 'seconds', tone: 'muted' as const },
    { label: 'SIL', sub: 'software in the loop', note: 'minutes · no hardware', tone: 'accent' as const },
    { label: 'HIL', sub: 'hardware in the loop', note: 'hours · real ECU', tone: 'default' as const },
    { label: 'Vehicle', sub: 'the real thing', note: 'days · scarce', tone: 'default' as const },
  ]
  const W = 156
  return (
    <svg {...svgProps} viewBox="0 0 720 250" aria-label="Testing stages from pure simulation to a real vehicle, with cost rising at each step">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Push testing left — each step right costs more and there is less of it</Label>
      {stages.map((s, i) => {
        const x = 22 + i * (W + 14)
        return (
          <g key={s.label}>
            <Box x={x} y={48} w={W} h={72} label={s.label} sub={s.sub} tone={s.tone} />
            <text x={x + W / 2} y={140} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">{s.note}</text>
            {i < stages.length - 1 && <Arrow x1={x + W + 2} y1={84} x2={x + W + 12} y2={84} />}
          </g>
        )
      })}

      {/* cost gradient */}
      <rect x={22} y={166} width={676} height={18} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <Label x={30} y={175} anchor="start" tone="accent">cheap · fast · unlimited</Label>
      <Label x={690} y={175} anchor="end" tone="subtle">expensive · slow · queued</Label>

      <rect x={22} y={200} width={676} height={38} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={360} y={216} textAnchor="middle" fill="var(--fg)" fontSize={11} fontFamily="var(--font-mono)">a defect found in SIL costs minutes</text>
      <text x={360} y={231} textAnchor="middle" fill="var(--fg-muted)" fontSize={11} fontFamily="var(--font-mono)">the same defect found in a vehicle costs a test slot, a driver and a week</text>
    </svg>
  )
}

/* ------------------------------------------------------ cockpit convergence -- */

export function CockpitConvergence() {
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="Cluster and infotainment converging onto one cockpit domain controller driving several displays">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>One computer, several screens, different safety obligations per screen</Label>

      {/* the single SoC */}
      <rect x={200} y={44} width={320} height={140} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={360} y={70} textAnchor="middle" fill="var(--fg)" fontSize={14} fontWeight={600} fontFamily="var(--font-display)">Cockpit domain controller</text>
      <Box x={216} y={84} w={140} h={44} label="Safety guest" sub="cluster content" tone="accent" />
      <Box x={364} y={84} w={140} h={44} label="Android guest" sub="infotainment" tone="default" />
      <text x={360} y={152} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">hypervisor · shared GPU · partitioned memory</text>
      <text x={360} y={170} textAnchor="middle" fill="var(--accent)" fontSize={10.5} fontFamily="var(--font-mono)">one bill of materials, one thermal budget</text>

      {/* displays */}
      <Box x={22} y={228} w={150} h={58} label="Cluster" sub="ASIL-rated content" tone="accent" />
      <Box x={192} y={228} w={150} h={58} label="Centre stack" sub="infotainment" />
      <Box x={362} y={228} w={150} h={58} label="Passenger" sub="infotainment" />
      <Box x={532} y={228} w={166} h={58} label="Head-up display" sub="minimal, critical" tone="accent" />

      <Arrow x1={286} y1={190} x2={110} y2={222} accent />
      <Arrow x1={330} y1={190} x2={267} y2={222} />
      <Arrow x1={390} y1={190} x2={437} y2={222} />
      <Arrow x1={434} y1={190} x2={600} y2={222} accent />

      <rect x={22} y={298} width={676} height={20} rx={5} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={310} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">
        the hard part is not the pixels — it is proving infotainment cannot disturb the cluster
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------- SDV CI/CD -- */

export function SdvCiPipeline() {
  const stages = [
    { label: 'Commit', sub: 'static checks', t: 'minutes' },
    { label: 'Build', sub: 'per-domain images', t: '10–60 min' },
    { label: 'SIL', sub: 'virtual ECUs, scenarios', t: 'minutes' },
    { label: 'HIL', sub: 'real hardware bench', t: 'nightly' },
    { label: 'Fleet', sub: 'staged rollout', t: 'days' },
  ]
  const W = 124
  const g = 14
  return (
    <svg {...svgProps} viewBox="0 0 720 250" aria-label="A continuous delivery pipeline for vehicle software, from commit to a staged fleet rollout">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Same idea as web CI, plus hardware in the loop and a rollout you cannot undo</Label>
      {stages.map((s, i) => {
        const x = 22 + i * (W + g)
        return (
          <g key={s.label}>
            <Box x={x} y={52} w={W} h={68} label={s.label} sub={s.sub} tone={i < 3 ? 'accent' : 'default'} />
            <text x={x + W / 2} y={138} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">{s.t}</text>
            {i < stages.length - 1 && <Arrow x1={x + W + 1} y1={86} x2={x + W + g - 1} y2={86} accent={i < 2} />}
          </g>
        )
      })}
      <line x1={22} y1={158} x2={434} y2={158} stroke="var(--accent)" strokeWidth={1.2} strokeDasharray="4 3" />
      <Label x={228} y={172} tone="accent">no vehicle needed — run on every commit</Label>
      <line x1={448} y1={158} x2={698} y2={158} stroke="var(--border-strong)" strokeWidth={1.2} />
      <Label x={573} y={172} tone="subtle">scarce, scheduled, queued</Label>

      <rect x={22} y={196} width={676} height={42} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={214} textAnchor="middle" fill="var(--fg-muted)" fontSize={11} fontFamily="var(--font-mono)">a released update reaches vehicles you cannot recall</text>
      <text x={360} y={230} textAnchor="middle" fill="var(--fg-subtle)" fontSize={11} fontFamily="var(--font-mono)">so the rollout is staged, monitored, and reversible by slot</text>
    </svg>
  )
}

/* ------------------------------------------------------- feature on demand -- */

export function FeatureOnDemand() {
  const h = 48
  return (
    <svg {...svgProps} viewBox="0 0 720 262" aria-label="How a feature already present in the vehicle is activated after purchase">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The software already shipped — what changes is an entitlement, not the code</Label>

      <Box x={22} y={44} w={150} h={h} label="Customer buys" sub="app or portal" tone="muted" />
      <Box x={196} y={44} w={150} h={h} label="Backend" sub="issues entitlement" tone="muted" />
      <Box x={370} y={44} w={150} h={h} label="Vehicle" sub="verifies signature" tone="accent" />
      <Box x={544} y={44} w={154} h={h} label="Feature enabled" sub="no reflash" tone="accent" />
      <Arrow x1={176} y1={68} x2={192} y2={68} />
      <Arrow x1={350} y1={68} x2={366} y2={68} accent />
      <Arrow x1={524} y1={68} x2={540} y2={68} accent />

      <rect x={22} y={124} width={676} height={62} rx={10} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={146} textAnchor="middle" fill="var(--fg)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">What must be true for this to be safe</text>
      <text x={360} y={166} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">entitlement is signed · verified locally · works offline · expiry evaluated on the vehicle</text>
      <text x={360} y={180} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">hardware is present and validated whether or not the feature is bought</text>

      <rect x={22} y={200} width={676} height={48} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={360} y={220} textAnchor="middle" fill="var(--fg)" fontSize={11} fontFamily="var(--font-mono)">the honest tension: customers dislike paying for hardware they already own</text>
      <text x={360} y={238} textAnchor="middle" fill="var(--fg-muted)" fontSize={11} fontFamily="var(--font-mono)">features that were never physically installed avoid that objection entirely</text>
    </svg>
  )
}

/* ---------------------------------------------------------- data pipeline -- */

export function VehicleDataPipeline() {
  const h = 54
  return (
    <svg {...svgProps} viewBox="0 0 720 268" aria-label="Vehicle data reduced at each stage before it leaves the car">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Every stage should reduce the data — the cheapest byte is the one never sent</Label>

      <Box x={22} y={44} w={150} h={h} label="Sensors" sub="continuous, raw" tone="muted" />
      <Box x={196} y={44} w={150} h={h} label="On-vehicle" sub="filter · aggregate" tone="accent" />
      <Box x={370} y={44} w={150} h={h} label="Uplink" sub="metered, intermittent" tone="default" />
      <Box x={544} y={44} w={154} h={h} label="Cloud" sub="fleet analysis" tone="muted" />
      <Arrow x1={176} y1={71} x2={192} y2={71} />
      <Arrow x1={350} y1={71} x2={366} y2={71} accent />
      <Arrow x1={524} y1={71} x2={540} y2={71} />

      {/* volume funnel */}
      {[
        { x: 22, w: 150, v: 'gigabytes/hour' },
        { x: 196, w: 150, v: 'megabytes/hour' },
        { x: 370, w: 150, v: 'kilobytes/hour' },
        { x: 544, w: 154, v: 'aggregates only' },
      ].map((s) => (
        <text key={s.x} x={s.x + s.w / 2} y={122} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">{s.v}</text>
      ))}

      <rect x={22} y={144} width={676} height={52} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={360} y={165} textAnchor="middle" fill="var(--fg)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">The decision that matters is at stage 2</text>
      <text x={360} y={185} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">what you compute on the vehicle never becomes a privacy or bandwidth problem</text>

      <rect x={22} y={210} width={676} height={40} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={226} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">somebody pays for the uplink · somebody is accountable for the personal data</text>
      <text x={360} y={242} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">both are usually the OEM, and both have regulatory consequences</text>
    </svg>
  )
}

/* ------------------------------------------------------------- SDV stack -- */

export function SdvStack() {
  const layers = [
    { label: 'Vehicle applications', sub: 'cockpit UI · comfort · charging · fleet', tone: 'default' as const },
    { label: 'Application frameworks', sub: 'Android Automotive · AUTOSAR Adaptive · Linux', tone: 'accent' as const },
    { label: 'Vehicle abstraction', sub: 'VSS · data broker · vehicle API', tone: 'accent' as const },
    { label: 'Communication middleware', sub: 'SOME/IP · DDS · gRPC over Automotive Ethernet', tone: 'accent' as const },
    { label: 'Operating systems', sub: 'Android · Linux · QNX · safety RTOS', tone: 'default' as const },
    { label: 'Hypervisor', sub: 'partitioning · freedom from interference', tone: 'default' as const },
    { label: 'Hardware', sub: 'central compute · zone controllers · sensors', tone: 'muted' as const },
  ]
  const H = 44
  const G = 8
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${44 + layers.length * (H + G) + 24}`} aria-label="The layered software stack of a software-defined vehicle">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The accent layers are what &ldquo;software-defined&rdquo; actually adds</Label>
      {layers.map((l, i) => (
        <Box key={l.label} x={100} y={40 + i * (H + G)} w={520} h={H} label={l.label} sub={l.sub} tone={l.tone} />
      ))}
      <Arrow x1={78} y1={48} x2={78} y2={40 + layers.length * (H + G) - 12} />
      <g transform={`translate(64, ${(40 + layers.length * (H + G)) / 2}) rotate(-90)`}>
        <Label x={0} y={0} tone="subtle">closer to hardware</Label>
      </g>
      <Label x={644} y={40 + 2 * (H + G) + H / 2} anchor="start" tone="accent">portable</Label>
      <Label x={644} y={40 + 6 * (H + G) + H / 2} anchor="start" tone="subtle">per-vehicle</Label>
    </svg>
  )
}

/* --------------------------------------------- vulnerability response flow -- */

export function VulnerabilityResponsePipeline() {
  const stages = [
    { label: 'Report arrives', sub: 'researcher · supplier · CVE feed · bug bounty' },
    { label: 'Triage: are we affected?', sub: 'SBOM makes this minutes, not weeks' },
    { label: 'Assess: exploitable here?', sub: 'reachable? behind the gateway? · impact if exploited' },
    { label: 'Fix + verify', sub: 'including a regression test' },
    { label: 'Safety impact analysis', sub: 'does this touch the safety case?' },
    { label: 'Release + staged rollout', sub: 'R156 evidence produced here' },
    { label: 'Confirm fleet coverage', sub: 'who has not updated, and why?' },
  ]
  const W = 420
  const H = 56
  const G = 22
  const x = 150
  const top = 44
  const bottom = top + stages.length * (H + G) - G
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${bottom + 66}`} aria-label="The path a security vulnerability takes from first report to confirmed fleet coverage">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Seven stages — an SBOM only speeds up the second one</Label>
      {stages.map((s, i) => {
        const y = top + i * (H + G)
        return (
          <g key={s.label}>
            <Box x={x} y={y} w={W} h={H} label={s.label} sub={s.sub} tone={i === 4 ? 'accent' : 'default'} />
            {i < stages.length - 1 && <Arrow x1={360} y1={y + H} x2={360} y2={y + H + G} accent={i === 4} />}
          </g>
        )
      })}
      <rect x={22} y={bottom + 14} width={676} height={40} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={360} y={bottom + 30} textAnchor="middle" fill="var(--fg)" fontSize={11} fontFamily="var(--font-mono)">the safety impact step is what turns a routine patch into a recall decision</text>
      <text x={360} y={bottom + 46} textAnchor="middle" fill="var(--fg-muted)" fontSize={11} fontFamily="var(--font-mono)">and coverage is never assumed — it is confirmed, vehicle by vehicle</text>
    </svg>
  )
}

/* ------------------------------------------------------- ARXML to VSS gen -- */

export function ArxmlToVssGeneration() {
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="ARXML and a reviewed overlay generate the VSS tree, which in turn generates several downstream artefacts">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>One generated tree feeds every downstream artefact — nothing here is hand-edited</Label>

      <Box x={60} y={44} w={260} h={56} label="ARXML" sub="from the ECU team" tone="muted" />
      <Box x={400} y={44} w={260} h={56} label="Reviewed overlay" sub="rates · permissions · area mappings" tone="vendor" dashed />

      <Arrow x1={210} y1={100} x2={300} y2={150} accent />
      <Arrow x1={550} y1={100} x2={420} y2={150} accent />
      <Label x={360} y={122} tone="accent">generate</Label>

      <rect x={250} y={154} width={220} height={60} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={360} y={180} textAnchor="middle" fill="var(--fg)" fontSize={13.5} fontWeight={600} fontFamily="var(--font-display)">VSS tree</text>
      <text x={360} y={199} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">generated definitions</text>

      {[
        { x: 22, label: 'Vehicle HAL', sub: 'property configuration' },
        { x: 194, label: 'Service interfaces', sub: 'definitions' },
        { x: 366, label: 'Data broker', sub: 'configuration' },
        { x: 538, label: 'Client libraries', sub: 'for app teams' },
      ].map((o) => (
        <g key={o.label}>
          <Box x={o.x} y={252} w={160} h={52} label={o.label} sub={o.sub} />
          <Arrow x1={360} y1={214} x2={o.x + 80} y2={248} />
        </g>
      ))}

      <Label x={360} y={230} tone="subtle">generate</Label>
    </svg>
  )
}

/* ------------------------------------------------------------ entitlement -- */

export function EntitlementFlow() {
  const w = 220
  return (
    <svg {...svgProps} viewBox="0 0 720 380" aria-label="How a purchase becomes a signed entitlement token that unlocks a feature on the vehicle">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The token is the product — everything after it is verification</Label>

      <Box x={250} y={40} w={w} h={54} label="Purchase" sub="app, web, in-car store" tone="muted" />
      <Arrow x1={360} y1={94} x2={360} y2={128} />
      <Label x={378} y={112} anchor="start" tone="subtle">authority: which VIN owns what, until when</Label>

      <Box x={250} y={132} w={w} h={54} label="Entitlement service (cloud)" sub="issues the token" tone="accent" />
      <Arrow x1={360} y1={186} x2={360} y2={220} accent />
      <Label x={378} y={204} anchor="start" tone="accent">signed token, bound to VIN, with expiry</Label>

      <Box x={250} y={224} w={w} h={54} label="Vehicle entitlement mgr" sub="verifies signature, stores securely" tone="accent" />

      <Arrow x1={300} y1={278} x2={140} y2={316} />
      <Arrow x1={360} y1={278} x2={360} y2={316} />
      <Arrow x1={420} y1={278} x2={580} y2={316} />

      <Box x={40} y={320} w={200} h={50} label="Feature flag" sub="in the ECU · performs the function" />
      <Box x={260} y={320} w={200} h={50} label="Capability" sub="in the VHAL · permits the write" />
      <Box x={480} y={320} w={200} h={50} label="UI visibility" sub="in the app · presents the control" />
    </svg>
  )
}

/* ------------------------------------------------------------- SIL rig arch -- */

export function SilRigArchitecture() {
  const boxes = [
    { x: 40, label: 'Android emulator', sub: 'AAOS', tag: 'VHAL' },
    { x: 264, label: 'Cluster renderer', sub: '', tag: 'subscribe' },
    { x: 488, label: 'Test scripts', sub: 'pytest', tag: 'set' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 380" aria-label="A software-in-the-loop rig on a laptop: three clients feeding a data broker backed by a vehicle simulation">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Everything below runs on a laptop — no ECU, no vehicle</Label>

      <rect x={20} y={38} width={680} height={302} rx={14} fill="none" stroke="var(--border-strong)" strokeWidth={1.4} strokeDasharray="6 5" />
      <text x={40} y={58} fill="var(--fg-muted)" fontSize={11} fontWeight={600} fontFamily="var(--font-display)">your laptop</text>

      {boxes.map((b) => (
        <g key={b.label}>
          <Box x={b.x} y={72} w={192} h={60} label={b.label} sub={b.sub || undefined} tone="muted" />
          <Arrow x1={b.x + 96} y1={132} x2={310 + (b.x - 264) * 0.18} y2={190} />
          <Label x={b.x + 96} y={148} tone="subtle">{b.tag}</Label>
        </g>
      ))}

      <Box x={260} y={196} w={200} h={58} label="Data broker (VSS)" sub="holds current values" tone="accent" />
      <Arrow x1={360} y1={254} x2={360} y2={288} accent />

      <Box x={220} y={292} w={280} h={64} label="Vehicle simulation" sub="or recorded traces" tone="accent" />
      <Label x={520} y={316} anchor="start" tone="subtle">drive cycles, faults,</Label>
      <Label x={520} y={330} anchor="start" tone="subtle">battery models</Label>
    </svg>
  )
}

/* ------------------------------------------ consolidated cockpit hypervisor -- */

export function ConsolidatedCockpitHypervisor() {
  const guests = [
    { x: 40, label: 'Guest: RTOS', sub: 'vehicle net · safety fns', note: 'early boot' },
    { x: 264, label: 'Guest: AAOS', sub: 'infotainment apps · media', note: '' },
    { x: 488, label: 'Guest: cluster/safety', sub: 'telltales, ADAS view', note: 'ASIL-rated' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="Three guest operating systems on one hypervisor, joined by shared memory and virtio">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>A typical consolidated cockpit — one SoC, three very different guests</Label>

      {guests.map((g) => (
        <g key={g.label}>
          <Box x={g.x} y={44} w={192} h={92} label={g.label} sub={g.sub} tone={g.note ? 'accent' : 'default'} />
          {g.note && (
            <text x={g.x + 96} y={152} textAnchor="middle" fill="var(--accent)" fontSize={10.5} fontWeight={600} fontFamily="var(--font-mono)">{g.note}</text>
          )}
        </g>
      ))}

      <rect x={30} y={172} width={660} height={52} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={360} y={194} textAnchor="middle" fill="var(--fg)" fontSize={13.5} fontWeight={600} fontFamily="var(--font-display)">Hypervisor</text>
      <text x={360} y={213} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">partitions CPU, memory and devices per guest</text>

      <Box x={30} y={240} w={660} h={44} label="Shared memory / virtio" sub="the only path between guests" tone="muted" />
      {guests.map((g) => <Arrow key={g.x} x1={g.x + 96} y1={136} x2={g.x + 96} y2={170} />)}
      <Arrow x1={360} y1={224} x2={360} y2={236} />
    </svg>
  )
}

/* --------------------------------------------------- A/B update decision -- */

export function AbUpdateDecisionFlow() {
  return (
    <svg {...svgProps} viewBox="0 0 720 340" aria-label="Slot B is written and booted, then either becomes active or the vehicle falls back to slot A automatically">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The running slot is never touched — that is what makes the fallback safe</Label>

      <Box x={60} y={44} w={280} h={60} label="Slot A (running)" sub="system, vendor, product · untouched" tone="muted" />
      <Box x={380} y={44} w={280} h={60} label="Slot B (idle)" sub="new image written while driving" tone="accent" />

      <Arrow x1={200} y1={104} x2={330} y2={150} />
      <Arrow x1={520} y1={104} x2={390} y2={150} accent />
      <Label x={360} y={128} tone="subtle">reboot into B</Label>

      <Box x={250} y={154} w={220} h={56} label="Boots and marks good?" tone="default" />

      <Arrow x1={300} y1={210} x2={190} y2={254} accent />
      <Arrow x1={420} y1={210} x2={550} y2={254} />
      <Label x={230} y={230} tone="accent">yes</Label>
      <Label x={492} y={230} tone="subtle">no</Label>

      <Box x={70} y={258} w={240} h={56} label="B becomes active" tone="accent" />
      <Box x={410} y={258} w={260} h={56} label="Fall back to A automatically" tone="muted" />
    </svg>
  )
}

/* ------------------------------------------- Classic/Adaptive topology -- */

export function ClassicAdaptiveTopology() {
  const zones = [
    { x: 40, label: 'Zone (front) — Classic', bus: 'CAN, LIN', endpoint: 'sensors' },
    { x: 268, label: 'Zone (rear) — Classic', bus: 'CAN', endpoint: 'actuators' },
    { x: 496, label: 'Powertrain — Classic', bus: 'CAN, FlexRay', endpoint: 'inverter, motors' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="Adaptive and Android share a central compute, connected over Ethernet to Classic zone and powertrain controllers">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Classic at the edges, fast and deterministic; Adaptive and Android in the centre</Label>

      <rect x={140} y={44} width={440} height={92} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <text x={360} y={66} textAnchor="middle" fill="var(--fg)" fontSize={13.5} fontWeight={600} fontFamily="var(--font-display)">Central compute</text>
      <text x={360} y={86} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">Adaptive: ADAS stack, sensor fusion, gateway</text>
      <text x={360} y={103} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">Android: cluster + infotainment</text>
      <text x={360} y={120} textAnchor="middle" fill="var(--accent)" fontSize={10.5} fontFamily="var(--font-mono)">both on a hypervisor, plus a safety island</text>

      <Arrow x1={360} y1={136} x2={360} y2={158} accent />
      <Label x={360} y={150} tone="accent">Automotive Ethernet, SOME/IP</Label>

      {zones.map((z) => (
        <g key={z.label}>
          <Arrow x1={360} y1={162} x2={z.x + 92} y2={200} accent={z.x === 268} />
          <Box x={z.x} y={204} w={184} h={54} label={z.label} tone="default" />
          <text x={z.x + 92} y={276} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">{z.bus}</text>
          <text x={z.x + 92} y={294} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">{z.endpoint}</text>
          <Arrow x1={z.x + 92} y1={258} x2={z.x + 92} y2={266} />
        </g>
      ))}
    </svg>
  )
}

/* -------------------------------------------- monolithic vs microkernel -- */

export function MonolithicVsMicrokernel() {
  return (
    <svg {...svgProps} viewBox="0 0 720 300" aria-label="A monolithic kernel where a bad driver panics the whole system, compared with a microkernel where a bad driver is a restartable process">
      <DiagramDefs />

      <Label x={22} y={22} anchor="start" tone="muted" size={12}>MONOLITHIC (Linux, Android)</Label>
      <Box x={30} y={44} w={300} h={44} label="Applications" tone="default" />
      <Box x={30} y={88} w={300} h={68} label="Kernel space" sub="drivers · fs · net · mm — one address space" tone="muted" />
      <Label x={180} y={182} tone="subtle">a bad driver panics</Label>
      <Label x={180} y={196} tone="subtle">the whole system</Label>

      <line x1={365} y1={30} x2={365} y2={260} stroke="var(--border)" strokeDasharray="4 4" />

      <Label x={398} y={22} anchor="start" tone="accent">MICROKERNEL (QNX)</Label>
      <Box x={398} y={44} w={140} h={48} label="Apps" sub="user space" />
      <Box x={558} y={44} w={140} h={48} label="Drivers" sub="user space" />
      <Arrow x1={438} y1={92} x2={470} y2={124} accent />
      <Arrow x1={618} y1={92} x2={586} y2={124} accent />
      <Label x={556} y={104} tone="accent">message</Label>

      <Box x={398} y={128} w={300} h={54} label="Microkernel" sub="scheduling · IPC · memory protection" tone="accent" />
      <Label x={548} y={198} tone="accent">a bad driver is a process</Label>
      <Label x={548} y={212} tone="accent">that can be restarted</Label>

      <rect x={22} y={238} width={676} height={40} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={254} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">same silicon, same drivers — the difference is what a crash takes down with it</text>
      <text x={360} y={270} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">that is the whole argument for putting safety functions on a microkernel</text>
    </svg>
  )
}

/* ------------------------------------------------------ zero trust zones -- */

export function ZeroTrustSegmentation() {
  return (
    <svg {...svgProps} viewBox="0 0 720 320" aria-label="Three trust tiers: untrusted apps and connectivity, the cockpit platform, and the vehicle domain, separated by a narrow interface and a gateway">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Trust decreases toward the edge; the gateway is the only door inward</Label>

      <Box x={100} y={44} w={520} h={64} label="Untrusted" sub="apps, browser, Bluetooth, USB, media, connected services" tone="muted" />
      <Arrow x1={360} y1={108} x2={360} y2={148} />
      <Label x={378} y={128} anchor="start" tone="subtle">narrow, validated interface</Label>

      <Box x={140} y={152} w={440} h={56} label="Cockpit platform (Android, IVI)" tone="default" />
      <Arrow x1={360} y1={208} x2={360} y2={248} accent />
      <Label x={378} y={228} anchor="start" tone="accent">gateway: filters, rate-limits, authenticates</Label>

      <Box x={100} y={252} w={520} h={64} label="Vehicle domain" sub="powertrain · chassis · body · ADAS" tone="accent" />
    </svg>
  )
}

/* -------------------------------------------------- Ethernet + TSN topology -- */

export function EthernetTsnTopology() {
  return (
    <svg {...svgProps} viewBox="0 0 720 210" aria-label="Sensors and actuators on CAN and LIN feed a zone controller, which bridges onto an Automotive Ethernet and TSN backbone to central compute">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>CAN survives at the edges — Ethernet + TSN is the backbone between them</Label>

      <Box x={20} y={60} w={170} h={64} label="Sensors / actuators" sub="simple, cheap, robust" tone="muted" />
      <Arrow x1={190} y1={92} x2={275} y2={92} />
      <Label x={232} y={78} tone="subtle">CAN / LIN</Label>

      <Box x={275} y={60} w={170} h={64} label="Zone controller" sub="bridges CAN ↔ Ethernet" />
      <Arrow x1={445} y1={92} x2={530} y2={92} accent />
      <Label x={487} y={72} tone="accent">Automotive</Label>
      <Label x={487} y={84} tone="accent">Ethernet (+ TSN)</Label>

      <Box x={530} y={60} w={170} h={64} label="Central compute" sub="ADAS, cockpit, gateway" tone="accent" />

      <rect x={20} y={152} width={680} height={40} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={168} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">CAN does not disappear — it stays at the edges where cost and robustness win</text>
      <text x={360} y={184} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">the zone controller and its gateway are significant, ongoing work</text>
    </svg>
  )
}

/* --------------------------------------------------------- DDS / SOME-IP bridge -- */

export function DdsSomeIpBridge() {
  return (
    <svg {...svgProps} viewBox="0 0 720 296" aria-label="DDS carries perception data from cameras and radar through ADAS on one side, SOME/IP carries body signals through the cockpit on the other, joined by a bridge that forwards derived state rather than raw data">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Most real vehicles run both, with a bridge where the domains meet</Label>

      <Box x={20} y={50} w={170} h={56} label="Cameras, radar" sub="raw sensor data" tone="muted" />
      <Arrow x1={190} y1={78} x2={275} y2={78} />
      <Label x={232} y={66} tone="subtle">DDS</Label>
      <Box x={275} y={50} w={170} h={56} label="ADAS perception" />
      <Arrow x1={445} y1={78} x2={530} y2={78} />
      <Label x={487} y={66} tone="subtle">DDS</Label>
      <Box x={530} y={50} w={170} h={56} label="ADAS control" />

      <Arrow x1={360} y1={106} x2={360} y2={136} accent />
      <Box x={275} y={136} w={170} h={54} label="Bridge" sub="state only, not raw data" tone="accent" />
      <Arrow x1={360} y1={190} x2={360} y2={220} accent />

      <Box x={20} y={220} w={170} h={56} label="Seat, lights, doors" sub="body signals" tone="muted" />
      <Arrow x1={190} y1={248} x2={275} y2={248} />
      <Label x={232} y={236} tone="subtle">SOME/IP</Label>
      <Box x={275} y={220} w={170} h={56} label="Cockpit" />
      <Arrow x1={445} y1={248} x2={530} y2={248} />
      <Label x={487} y={236} tone="subtle">SOME/IP</Label>
      <Box x={530} y={220} w={170} h={56} label="Cluster & IVI" />
    </svg>
  )
}

/* ------------------------------------------------------- per-signal access -- */

export function PerSignalAccessControl() {
  const clients = [
    { name: 'telemetry-uploader', read: 'Vehicle.Speed, Vehicle.Powertrain.*', write: '(none)' },
    { name: 'cockpit-app', read: 'Vehicle.**', write: 'Vehicle.Cabin.**' },
    { name: 'charging-service', read: 'Vehicle.Powertrain.TractionBattery.**', write: 'Vehicle.Powertrain.TractionBattery.Charging.**' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 340" aria-label="The data broker granting each client a different read and write scope over the vehicle signal tree">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Same broker, different permissions per client</Label>

      <Box x={20} y={132} w={180} h={100} label="Data broker" sub="access control per signal" tone="accent" />

      {clients.map((c, i) => {
        const y = 44 + i * 98
        const cy = y + 40
        return (
          <g key={c.name}>
            <Arrow x1={200} y1={182} x2={296} y2={cy} accent />
            <rect x={300} y={y} width={400} height={80} rx={8} fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth={1.25} />
            <text x={316} y={y + 22} fill="var(--fg)" fontSize={12.5} fontWeight={600} fontFamily="var(--font-display)">{c.name}</text>
            <text x={316} y={y + 44} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">read: {c.read}</text>
            <text x={316} y={y + 62} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">write: {c.write}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------- cluster rendering paths -- */

export function ClusterRenderNativeFlow() {
  return (
    <svg {...svgProps} viewBox="0 0 720 170" aria-label="Android sends structured content to the safety guest, which draws every pixel itself before it reaches the display">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>One system draws everything — the safety guest owns every pixel</Label>

      <Box x={20} y={46} w={180} h={60} label="Android" sub="structured content" tone="muted" />
      <Arrow x1={200} y1={76} x2={276} y2={76} />
      <Label x={238} y={62} tone="subtle">structured message</Label>

      <Box x={276} y={46} w={200} h={60} label="Safety guest" sub="renders in its own style" tone="accent" />
      <Arrow x1={476} y1={76} x2={552} y2={76} accent />

      <Box x={552} y={46} w={148} h={60} label="Display" tone="default" />

      <rect x={20} y={128} width={680} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={147} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">cleanest safety argument — but every visual change means a change to certified software</text>
    </svg>
  )
}

export function ClusterRenderStreamedFlow() {
  return (
    <svg {...svgProps} viewBox="0 0 720 170" aria-label="Android renders its own region into a pixel buffer and streams it to the safety guest, which composites it under its rated layer before the display">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Android renders; the safety guest only composites what arrives</Label>

      <Box x={20} y={46} w={180} h={60} label="Android" sub="renders its region" tone="accent" />
      <Arrow x1={200} y1={76} x2={276} y2={76} accent />
      <Label x={238} y={62} tone="accent">pixel buffer</Label>

      <Box x={276} y={46} w={200} h={60} label="Safety guest" sub="composites under rated layer" tone="muted" />
      <Arrow x1={476} y1={76} x2={552} y2={76} />
      <Label x={514} y={62} tone="subtle">composites</Label>

      <Box x={552} y={46} w={148} h={60} label="Display" tone="default" />

      <rect x={20} y={128} width={680} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={147} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">no renderer to build twice — but what happens on screen when the stream simply stops?</text>
    </svg>
  )
}

export function ClusterRenderHardwareComposite() {
  return (
    <svg {...svgProps} viewBox="0 0 720 280" aria-label="Safety guest and Android each render into their own layer; a display controller composites both in hardware, with the rated layer always on top, before the display">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Two layers, composited in silicon — Android cannot touch the rated one</Label>

      <Box x={20} y={44} w={150} h={56} label="Safety guest" tone="accent" />
      <Box x={20} y={140} w={150} h={56} label="Android" tone="muted" />

      <Arrow x1={170} y1={72} x2={220} y2={72} accent />
      <Arrow x1={170} y1={168} x2={220} y2={168} />

      <Box x={220} y={44} w={150} h={56} label="Layer 0" sub="rated" tone="accent" />
      <Box x={220} y={140} w={150} h={56} label="Layer 1" sub="info" tone="muted" />

      <Arrow x1={370} y1={72} x2={428} y2={104} accent />
      <Arrow x1={370} y1={168} x2={428} y2={136} />

      <Box x={430} y={80} w={150} h={80} label="Display controller" sub="hardware compositing" tone="default" />
      <Arrow x1={580} y1={120} x2={628} y2={120} accent />

      <Box x={628} y={92} w={72} h={56} label="Display" tone="default" />

      <rect x={20} y={210} width={680} height={44} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={228} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">if Android stops, its layer goes stale or empty — the rated layer is untouched</text>
      <text x={360} y={244} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">provably, because the compositing happens in hardware Android cannot influence</text>
    </svg>
  )
}

/* --------------------------------------------------- SOME/IP sequence detail -- */

export function SomeIpDiscoverySequence() {
  const clientX = 110
  const serverX = 610
  return (
    <svg {...svgProps} viewBox="0 0 720 270" aria-label="Sequence diagram: a client multicasts a query for a service, the server replies by unicast with its address, then the client subscribes or calls">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The client does not know where the service lives — it asks, and the reply comes straight back</Label>

      <Box x={40} y={38} w={140} h={44} label="Client" tone="muted" />
      <Box x={540} y={38} w={140} h={44} label="Server" tone="muted" />
      <line x1={clientX} y1={82} x2={clientX} y2={216} stroke="var(--border)" strokeDasharray="3 4" />
      <line x1={serverX} y1={82} x2={serverX} y2={216} stroke="var(--border)" strokeDasharray="3 4" />

      <Label x={360} y={110} tone="subtle" size={10}>multicast — who offers SeatService (0x1234, v1.x)?</Label>
      <Arrow x1={clientX} y1={124} x2={serverX} y2={124} dashed />

      <Label x={360} y={154} tone="accent" size={10}>unicast — I do, at 192.168.1.20:30501 (v1.2)</Label>
      <Arrow x1={serverX} y1={166} x2={clientX} y2={166} accent />

      <Label x={360} y={196} tone="subtle">subscribe / call</Label>
      <Arrow x1={clientX} y1={208} x2={serverX} y2={208} />

      <rect x={20} y={232} width={680} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={251} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">the server also offers periodically, unasked — a client that starts late still finds it</text>
    </svg>
  )
}

export function SomeIpMethodCallSequence() {
  const clientX = 110
  const serverX = 610
  return (
    <svg {...svgProps} viewBox="0 0 720 270" aria-label="Sequence diagram: a client calls setPosition on the server, which replies either ok or an error such as BLOCKED">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>A method can answer back, with a reason — a broadcast signal never could</Label>

      <Box x={40} y={38} w={140} h={44} label="Client" tone="muted" />
      <Box x={540} y={38} w={140} h={44} label="Server" tone="muted" />
      <line x1={clientX} y1={82} x2={clientX} y2={216} stroke="var(--border)" strokeDasharray="3 4" />
      <line x1={serverX} y1={82} x2={serverX} y2={216} stroke="var(--border)" strokeDasharray="3 4" />

      <Label x={360} y={110} tone="subtle" size={10}>setPosition(seat = ROW1_LEFT, position = 42)</Label>
      <Arrow x1={clientX} y1={124} x2={serverX} y2={124} />

      <Label x={360} y={152} tone="accent">ok</Label>
      <Arrow x1={serverX} y1={164} x2={clientX} y2={164} accent />

      <Label x={360} y={182} tone="subtle" size={9.5}>or</Label>

      <Label x={360} y={198} tone="muted">error: BLOCKED</Label>
      <Arrow x1={serverX} y1={210} x2={clientX} y2={210} dashed />

      <rect x={20} y={232} width={680} height={30} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={251} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">a meaningful error is the gain a broadcast signal could never give you</text>
    </svg>
  )
}

/* --------------------------------------------------- vehicle-to-cloud (MQTT) -- */

export function MqttBridgePipeline() {
  const targets = [
    { y: 140, label: 'Fleet analytics' },
    { y: 190, label: 'Billing' },
    { y: 240, label: 'Diagnostics' },
  ]
  return (
    <svg {...svgProps} viewBox="0 0 720 360" aria-label="A signal moves from the vehicle data broker through a bridge process onto an MQTT topic, then a broker fans it out to whichever backend services subscribed">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Left of the broker is in-vehicle; right of it is a subscriber that may not exist yet</Label>

      <Box x={20} y={50} w={130} h={60} label="Databroker" sub="VSS values" tone="muted" />
      <Arrow x1={150} y1={80} x2={196} y2={80} />

      <Box x={196} y={50} w={150} h={60} label="Bridge" sub="subscribes to exported signals" tone="accent" />
      <Arrow x1={346} y1={80} x2={392} y2={80} accent />

      <Box x={392} y={50} w={150} h={60} label="MQTT broker" sub="cloud or regional edge" tone="default" />

      <Label x={369} y={132} tone="accent" size={10}>{`topic: vehicle/{vin}/telemetry/speed`}</Label>

      {targets.map((t) => (
        <g key={t.label}>
          <Arrow x1={542} y1={80} x2={588} y2={t.y + 20} accent />
          <Box x={588} y={t.y} w={112} h={40} label={t.label} tone="default" />
        </g>
      ))}

      <rect x={20} y={300} width={680} height={40} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={317} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">the bridge decides what is worth exporting</text>
      <text x={360} y={333} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">nothing downstream can see a signal it never publishes</text>
    </svg>
  )
}

/* --------------------------------------------------------- OTA campaign flow -- */

export function OtaPackageGeneration() {
  return (
    <svg {...svgProps} viewBox="0 0 720 250" aria-label="A signed v4.2.1 target-files archive produces both a full OTA package that works from any prior build and an incremental package diffed against v4.2.0 only" >
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>One signed build, two packages — one general, one only valid for a specific starting point</Label>

      <Box x={260} y={40} w={200} h={56} label="v4.2.1 target-files" sub="signed" tone="accent" />

      <Arrow x1={330} y1={96} x2={205} y2={132} />
      <Arrow x1={390} y1={96} x2={515} y2={132} accent />

      <Box x={20} y={136} w={330} h={60} label="Full OTA package" sub="works from any prior build" tone="default" />
      <Box x={370} y={136} w={330} h={60} label="Incremental OTA package" sub="diffed against v4.2.0 only" tone="accent" />

      <text x={185} y={214} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">valid for a vehicle on any prior build</text>
      <text x={535} y={214} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">smaller — but only valid if already on</text>
      <text x={535} y={230} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">exactly v4.2.0</text>
    </svg>
  )
}

export function OtaCanaryHalt() {
  const stages = [
    { label: 'Stage 1: 1% of fleet', sub: '4,200 vehicles updated', tone: 'default' as const },
    { label: '31 crash-loop reports', sub: '0.74% error rate, 6 hrs', tone: 'muted' as const },
    { label: '0.74% > 0.5%', sub: 'haltOnErrorRateAbove exceeded', tone: 'muted' as const },
    { label: 'Campaign paused', sub: 'no further vehicles receive it', tone: 'accent' as const },
  ]
  const W = 156
  return (
    <svg {...svgProps} viewBox="0 0 720 190" aria-label="A canary rollout stage crosses its configured error-rate threshold and the campaign automatically pauses before any further vehicles receive the package">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The halt is automatic — it fires on the numbers, not on someone noticing</Label>
      {stages.map((s, i) => {
        const x = 22 + i * (W + 14)
        return (
          <g key={s.label}>
            <Box x={x} y={48} w={W} h={72} label={s.label} sub={s.sub} tone={s.tone} />
            {i < stages.length - 1 && <Arrow x1={x + W + 2} y1={84} x2={x + W + 12} y2={84} />}
          </g>
        )
      })}
      <rect x={22} y={140} width={676} height={36} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={162} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">31 vehicles caught in a 48-hour hold is contained — the same defect fleet-wide is a headline</text>
    </svg>
  )
}

/* -------------------------------------------------- AUTOSAR Classic build -- */

export function AutosarBuildPipeline() {
  return (
    <svg {...svgProps} viewBox="0 0 720 290" aria-label="Function code and ARXML configuration both feed a build-time generator, which emits C that is compiled into the ECU binary">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>The generator, not a settings file, is what turns ARXML into a running ECU</Label>

      <Box x={20} y={44} w={170} h={56} label="Your function code" sub="the SWC" tone="muted" />
      <Box x={20} y={148} w={170} h={72} label="ARXML configuration" sub="signals, timing, bus, ECU" tone="muted" />

      <Arrow x1={190} y1={72} x2={206} y2={118} accent />
      <Arrow x1={190} y1={184} x2={206} y2={154} accent />

      <Box x={210} y={92} w={150} h={88} label="Generator" sub="runs at build time" tone="accent" />

      <Arrow x1={362} y1={136} x2={398} y2={136} />
      <Box x={400} y={108} w={140} h={56} label="Generated C" tone="default" />

      <Arrow x1={542} y1={136} x2={576} y2={136} accent />
      <Box x={580} y={100} w={120} h={72} label="Compiled binary" sub="flashed to the ECU" tone="accent" />

      <rect x={20} y={232} width={680} height={40} rx={6} fill="var(--surface-2)" stroke="var(--border)" />
      <text x={360} y={249} textAnchor="middle" fill="var(--fg-muted)" fontSize={10.5} fontFamily="var(--font-mono)">one new signal means the generator re-runs on every ECU sharing that message</text>
      <text x={360} y={265} textAnchor="middle" fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-mono)">there is no settings file to hot-reload — this whole pipeline is the configuration</text>
    </svg>
  )
}

/* --------------------------------------------------------- Yocto meta-layers -- */

export function YoctoLayerStack() {
  const layers = [
    { label: 'meta', sub: 'Yocto core recipes' },
    { label: 'meta-poky', sub: 'reference distro policy' },
    { label: 'meta-openembedded', sub: 'community recipes' },
    { label: 'meta-<soc-vendor>', sub: 'kernel, bootloader, GPU drivers' },
    { label: 'meta-agl', sub: 'automotive services and profiles', tone: 'accent' as const },
    { label: 'meta-<oem>', sub: 'your apps, your branding, your policy', tone: 'accent' as const },
  ]
  const H = 42
  const G = 8
  const top = 44
  const stackBottom = top + layers.length * (H + G) - G
  const bitbakeY = stackBottom + 30
  const outputY = bitbakeY + 40 + 30
  const total = outputY + 64 + 20
  return (
    <svg {...svgProps} viewBox={`0 0 720 ${total}`} aria-label="Yocto layers stacked from generic core recipes to OEM-specific applications, built by bitbake into an image, SDK, licence manifest and SBOM">
      <DiagramDefs />
      <Label x={22} y={22} anchor="start" tone="muted" size={12}>Generic at the bottom, yours at the top — bitbake resolves the whole stack</Label>
      {layers.map((l, i) => (
        <Box key={l.label} x={140} y={top + i * (H + G)} w={440} h={H} label={l.label} sub={l.sub} tone={l.tone ?? 'default'} />
      ))}
      <Arrow x1={360} y1={stackBottom + 4} x2={360} y2={bitbakeY - 4} accent />
      <Box x={280} y={bitbakeY} w={160} h={40} label="bitbake" tone="accent" />
      <Arrow x1={360} y1={bitbakeY + 44} x2={360} y2={outputY - 4} accent />
      <Box x={160} y={outputY} w={400} h={64} label="Output" sub="image · SDK · licence manifest · SBOM" tone="default" />
    </svg>
  )
}
