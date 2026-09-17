import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Binary } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { VhalIdDecoder } from '@/components/tools/vhal-id-decoder'
import { vehicleProperties } from '@/lib/vehicle-properties'
import { site } from '@/data/site'

const total = vehicleProperties.length

export const metadata: Metadata = {
  title: 'VHAL property ID decoder',
  description:
    'Decode any Android Automotive vehicle property ID into its group, area, type and ordinal — or build one from scratch. Verified against all 280 properties in VehicleProperty.aidl.',
  alternates: { canonical: '/learn/vhal-id-decoder/' },
  openGraph: {
    type: 'website',
    title: `VHAL property ID decoder · ${site.name}`,
    description: 'Decode or build a 32-bit VHAL property ID — group, area, type and ordinal.',
    url: `${site.url}/learn/vhal-id-decoder/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'VHAL property ID decoder' }],
  },
}

export default function VhalIdDecoderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS · Reference"
        title="VHAL property ID decoder"
        description="A property ID is a 32-bit int packing four fields into one number — group, area, type and a 16-bit ordinal. Paste one to see the breakdown, or build one from scratch."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Binary aria-hidden className="size-4 text-accent" />
            verified against {total} real properties
          </span>
          <span>decode and encode</span>
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

      <div className="container-page py-10 md:py-14">
        <div className="max-w-3xl">
          <VhalIdDecoder />
        </div>
      </div>
    </>
  )
}
