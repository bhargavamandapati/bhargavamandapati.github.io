import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Database, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { PropertyBrowser } from '@/components/properties/property-browser'
import { propertyRows, vehicleProperties, groupedProperties } from '@/lib/vehicle-properties'
import { AIDL_PATH, JAVA_PATH } from '@/data/vehicle-properties'
import { csFile } from '@/lib/aosp'
import { site } from '@/data/site'

const total = vehicleProperties.length
const inCarApi = vehicleProperties.filter((p) => p.javaLine !== undefined).length

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
        <PropertyBrowser rows={rows} />
      </div>
    </>
  )
}
