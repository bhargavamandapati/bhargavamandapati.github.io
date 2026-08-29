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

      <Label x={400} y={22} anchor="start" tone="accent" size={12}>Service-oriented — components offer and call</Label>
      <Box x={400} y={40} w={140} h={50} label="Seat service" sub="offers: setPosition()" tone="accent" />
      <Box x={400} y={104} w={140} h={50} label="Light service" sub="offers: setBeam()" tone="accent" />
      <Box x={572} y={72} w={126} h={50} label="Cockpit app" sub="discovers · calls" />
      <Arrow x1={544} y1={65} x2={568} y2={88} accent both />
      <Arrow x1={544} y1={129} x2={568} y2={106} accent both />
      <Label x={556} y={172} tone="accent">discovered at runtime · request/response · versioned</Label>

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
    <svg {...svgProps} viewBox="0 0 720 292" aria-label="The Vehicle Signal Specification is a tree of named signals with types and units">
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
      <Label x={360} y={282} tone="subtle">every node carries a datatype, a unit and whether it can be written</Label>
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
