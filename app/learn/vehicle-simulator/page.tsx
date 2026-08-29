import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Gauge } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { controls, controlGroups } from '@/data/simulator'
import { site } from '@/data/site'

// Three.js is ~600KB. Loading it only on this route keeps it off every other page.
const CarSimulator = dynamic(
  () => import('@/components/simulator/car-simulator').then((m) => m.CarSimulator),
  {
    loading: () => (
      <div className="grid aspect-[16/10] w-full place-items-center rounded-xl border border-line bg-bg-subtle font-mono text-xs text-muted">
        Loading the simulator…
      </div>
    ),
  },
)

const propertyCount = new Set(controls.map((c) => c.property)).size

export const metadata: Metadata = {
  title: 'Vehicle property simulator',
  description: `Change a vehicle property and watch what it does to the car. An interactive 3D simulator wired to ${propertyCount} real Android Automotive properties — speed, gear, HVAC, lights, doors, tyres and driver assistance.`,
  alternates: { canonical: '/learn/vehicle-simulator/' },
  openGraph: {
    type: 'website',
    title: `Vehicle property simulator · ${site.name}`,
    description: `Change a vehicle property and watch what it does to the car — ${propertyCount} real AAOS properties, in 3D.`,
    url: `${site.url}/learn/vehicle-simulator/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Vehicle property simulator' }],
  },
}

export default function VehicleSimulatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS · Interactive"
        title="Vehicle property simulator"
        description="Reading that HVAC_FAN_DIRECTION is a bit field tells you less than watching the airflow change. Move a control and the car responds the way a real one would — and the log shows the property write that did it."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Gauge aria-hidden className="size-4 text-accent" />
            {propertyCount} properties wired · {controlGroups.length} groups
          </span>
          <span>every control links to its reference page</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/vehicle-properties/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Property reference
          </Link>
        </div>
      </PageHeader>

      <div className="container-wide py-10 md:py-12">
        <CarSimulator />

        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Things worth trying
          </h2>
          <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-muted">
            <li>
              <strong className="font-medium text-fg">Turn the fan up with HVAC power off.</strong>{' '}
              The control moves, the write is logged, and nothing happens — which is exactly what a
              gated property does on a real vehicle, and why a dependency is worth knowing about
              before you ship.
            </li>
            <li>
              <strong className="font-medium text-fg">Set the gear to PARK and raise the speed.</strong>{' '}
              The wheels stay still. Speed is a report from the vehicle, not a command to it.
            </li>
            <li>
              <strong className="font-medium text-fg">Switch the fan direction to DEFROST_AND_FLOOR.</strong>{' '}
              Air goes to both places at once, because the value is <code className="font-mono text-[0.9em] text-fg">DEFROST | FLOOR</code> —
              a bit field, not a choice from a list.
            </li>
            <li>
              <strong className="font-medium text-fg">Drop one tyre below 180 kPa.</strong> The
              wheel is flagged individually. Pressure is a per-area property, so three wheels being
              fine tells you nothing about the fourth.
            </li>
            <li>
              <strong className="font-medium text-fg">Turn the ignition off.</strong> Almost
              everything stops responding — a good reminder that property availability is a runtime
              condition, not a fixed fact about the vehicle.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold tracking-tight">
            What this is and is not
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            It is a teaching model, not an emulator. The {propertyCount} properties here are the
            ones with a consequence you can see — a simulator cannot usefully show you{' '}
            <code className="font-mono text-[0.9em] text-fg">INFO_VIN</code>. The physics is
            approximate, the car is built from primitives rather than a scanned model, and the
            values are illustrative.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            What is exact is the vocabulary: every control names a real property from{' '}
            <code className="font-mono text-[0.9em] text-fg">VehicleProperty.aidl</code>, uses its
            real enum values and units, and links to its full reference page. For a real vehicle,
            drive the same properties through a{' '}
            <Link href="/learn/vehicle-data/vhal-testing/" className="link-underline text-accent">
              reference VHAL
            </Link>{' '}
            or a{' '}
            <Link href="/sdv/communication/data-brokers/" className="link-underline text-accent">
              data broker
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
