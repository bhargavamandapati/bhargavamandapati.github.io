import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Gauge } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { SimulatorTrial } from '@/components/premium/simulator-trial'
import { controls, controlGroups } from '@/data/simulator'
import { site } from '@/data/site'

// Three.js is ~600KB. Loading it only on this route keeps it off every other page.

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
        description="Reading that HVAC_FAN_DIRECTION is a bit field tells you less than watching the airflow split between the vents. Two views — the driver's seat and a plan view of the car — respond to the same property writes, and the log shows what each one did."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Gauge aria-hidden className="size-4 text-accent" />
            {propertyCount} properties wired · {controlGroups.length} groups
          </span>
          <span>inside and outside views</span>
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
        <SimulatorTrial />

        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            What this is and is not
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            It is a teaching model, not an emulator. The {propertyCount} properties driving the 3D
            views are the ones with a consequence you can see. Static identity properties —{' '}
            <code className="font-mono text-[0.9em] text-fg">INFO_VIN</code>,{' '}
            <code className="font-mono text-[0.9em] text-fg">INFO_EV_BATTERY_CAPACITY</code> and the
            rest — have nothing to animate, so they sit in the panel beside the views instead. The
            physics is approximate, the car is built from primitives rather than a scanned model,
            and the values are illustrative.
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
