import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Database, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { PropertyBrowser } from '@/components/properties/property-browser'
import { DiagramFrame } from '@/components/diagrams/primitives'
import { HvacPowerGate, ValueAndUnits } from '@/components/diagrams/property-relations'
import { propertyRows, vehicleProperties, groupedProperties, hasDependency } from '@/lib/vehicle-properties'
import { AIDL_PATH, JAVA_PATH } from '@/data/vehicle-properties'
import { csFile } from '@/lib/aosp'
import { site } from '@/data/site'

const total = vehicleProperties.length
const inCarApi = vehicleProperties.filter((p) => p.javaLine !== undefined).length
const withDependency = vehicleProperties.filter(hasDependency).length
const linkCount = vehicleProperties.reduce((n, p) => n + p.related.length, 0)

export const metadata: Metadata = {
  title: 'Vehicle property reference',
  description: `Every one of the ${total} Android Automotive vehicle properties defined in VehicleProperty.aidl — ID, area type, value type, access, change mode, required permissions and a link to the AOSP source for each.`,
  alternates: { canonical: '/learn/vehicle-properties/' },
  openGraph: {
    type: 'website',
    title: `Vehicle property reference · ${site.name}`,
    description: `A searchable reference for all ${total} AAOS vehicle properties, linked to AOSP source.`,
    url: `${site.url}/learn/vehicle-properties/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Vehicle property reference' }],
  },
}

export default function VehiclePropertiesPage() {
  const rows = propertyRows()
  const categories = groupedProperties()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name: 'Android Automotive vehicle property reference',
    description: metadata.description,
    url: `${site.url}/learn/vehicle-properties/`,
    creator: { '@type': 'Person', name: site.name, url: site.url },
    isBasedOn: 'https://cs.android.com/android/platform/superproject/main/+/main:hardware/interfaces/automotive/vehicle/',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Learn AAOS · Reference"
        title="Vehicle property reference"
        description={`Every vehicle property Android Automotive defines — all ${total} of them, straight from VehicleProperty.aidl. Search by name, hex ID or description, filter by area and access, and jump to the AOSP source for any of them.`}
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Database aria-hidden className="size-4 text-accent" />
            {total} properties · {categories.length} categories
          </span>
          <span>{inCarApi} in the public Car API</span>
          <span>{total - inCarApi} platform only</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to the curriculum
          </Link>
          <a
            href={csFile(`hardware/interfaces/${AIDL_PATH}`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            VehicleProperty.aidl
            <ExternalLink aria-hidden className="size-3.5" />
          </a>
          <a
            href={csFile(`packages/services/Car/${JAVA_PATH}`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            VehiclePropertyIds.java
            <ExternalLink aria-hidden className="size-3.5" />
          </a>
        </div>
      </PageHeader>

      <div className="container-page py-10 md:py-14">
        <section aria-labelledby="patterns" className="mb-14 max-w-3xl">
          <h2 id="patterns" className="font-display text-2xl font-semibold tracking-tight">
            Properties rarely work alone
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            The single most common way to lose an afternoon here is to treat a property as
            self-contained. {withDependency} of the {total} have a relationship that changes how
            you must use them, and the failure is nearly always silent — the call returns
            successfully and nothing happens.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            Every property page below lists its relationships, derived from the AIDL rather than
            hand-curated: {linkCount} links in total. Four patterns account for most of them.
          </p>

          <h3 className="mt-9 font-display text-lg font-semibold tracking-tight">
            1. A gate you must open first
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Some properties do nothing until another one is set. HVAC is the clearest case: on many
            vehicles the air conditioning, fan and temperature properties are inert until{' '}
            <code className="font-mono text-[0.85em] text-fg">HVAC_POWER_ON</code> is true.
          </p>
          <DiagramFrame
            title="HVAC_POWER_ON gates the seat-area climate properties"
            caption="Which properties are gated is per-vehicle, declared in the HVAC_POWER_ON configArray. The AIDL restricts the list to SEAT-area HVAC properties, so HVAC_DEFROSTER is never gated."
          >
            <HvacPowerGate />
          </DiagramFrame>
          <p className="text-[0.95rem] leading-relaxed text-muted">
            The symptom: you set the fan speed, get no error, and nothing moves. Read the gate
            before writing, and handle it becoming <code className="font-mono text-[0.85em] text-fg">
            UNAVAILABLE</code> while your screen is open.
          </p>

          <h3 className="mt-9 font-display text-lg font-semibold tracking-tight">
            2. A value and the unit it is shown in
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Measured values are always reported in one fixed unit. A separate property says which
            unit the driver expects to see. Reading one without the other is how a cluster ends up
            showing metres per second to someone who set their car to mph.
          </p>
          <DiagramFrame
            title="The value never changes unit — only the rendering does"
            caption="Six of these units properties exist: speed, distance, fuel volume, EV battery, temperature and tyre pressure. Each pairs with every property measured in that family."
          >
            <ValueAndUnits />
          </DiagramFrame>
          <p className="text-[0.95rem] leading-relaxed text-muted">
            Drive display units from the property, not from a setting inside your app. Two surfaces
            disagreeing about units is a homologation failure in several markets, not a cosmetic
            bug.
          </p>

          <h3 className="mt-9 font-display text-lg font-semibold tracking-tight">
            3. A switch, a state, and sometimes a warning
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Most driver-assistance features are three properties, not one.{' '}
            <code className="font-mono text-[0.85em] text-fg">*_ENABLED</code> is the setting,{' '}
            <code className="font-mono text-[0.85em] text-fg">*_STATE</code> is what the system is
            doing right now, and some add a{' '}
            <code className="font-mono text-[0.85em] text-fg">*_WARNING</code> for what it is
            telling the driver.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            The state property reports nothing meaningful while the feature is disabled, and it also
            carries error states rather than throwing — so a value you do not recognise is far more
            likely to be an <code className="font-mono text-[0.85em] text-fg">ErrorState</code> than
            a bug. A few features add a{' '}
            <code className="font-mono text-[0.85em] text-fg">*_COMMAND</code> property: write the
            command, then read the state to find out what actually happened.
          </p>

          <h3 className="mt-9 font-display text-lg font-semibold tracking-tight">
            4. Properties that only make sense together
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Some pairs are not dependencies but are useless apart —{' '}
            <code className="font-mono text-[0.85em] text-fg">EV_CHARGE_PORT_OPEN</code> and{' '}
            <code className="font-mono text-[0.85em] text-fg">EV_CHARGE_PORT_CONNECTED</code>,{' '}
            <code className="font-mono text-[0.85em] text-fg">TIRE_PRESSURE</code> and{' '}
            <code className="font-mono text-[0.85em] text-fg">CRITICALLY_LOW_TIRE_PRESSURE</code>,
            a current value and the config that says what range it can take. Where the AIDL names
            one property in another&rsquo;s documentation, that cross-reference is captured on both
            pages.
          </p>

          <div className="card mt-9 border-l-2 border-l-accent/60 p-5">
            <p className="text-sm font-semibold text-fg">Before you ship a property integration</p>
            <ul className="mt-3 space-y-2 text-[0.9rem] leading-relaxed text-muted">
              <li>
                Does it have a <strong className="font-medium text-fg">gate</strong>? Read it first,
                and react when it changes.
              </li>
              <li>
                Is it a measured value? Pair it with its{' '}
                <strong className="font-medium text-fg">display units</strong> property.
              </li>
              <li>
                Is there an <strong className="font-medium text-fg">_ENABLED</strong> sibling? The
                state means nothing until it is on.
              </li>
              <li>
                Can it go <strong className="font-medium text-fg">UNAVAILABLE</strong> mid-session?
                Decide what the UI shows then — an explicit unknown, never a plausible default.
              </li>
              <li>
                Is availability <strong className="font-medium text-fg">per area</strong>? One seat
                supporting a feature does not mean the others do.
              </li>
            </ul>
          </div>
        </section>

        <PropertyBrowser rows={rows} />
      </div>
    </>
  )
}
