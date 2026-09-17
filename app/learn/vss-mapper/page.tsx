import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, GitCompareArrows } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { VssMapper } from '@/components/tools/vss-mapper'
import { vssMappings } from '@/data/vss-mapping'
import { site } from '@/data/site'

const total = vssMappings.length

export const metadata: Metadata = {
  title: 'VSS to VehicleProperty mapper',
  description:
    'Vehicle Signal Specification paths matched to their closest AAOS VehicleProperty equivalent — with the unit, encoding or granularity mismatch each pair actually has, verified against real AOSP and COVESA sources.',
  alternates: { canonical: '/learn/vss-mapper/' },
  openGraph: {
    type: 'website',
    title: `VSS to VehicleProperty mapper · ${site.name}`,
    description: 'VSS paths matched to AAOS properties, with the real mismatch each pair has.',
    url: `${site.url}/learn/vss-mapper/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'VSS to VehicleProperty mapper' }],
  },
}

export default function VssMapperPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS · Reference"
        title="VSS ↔ VehicleProperty mapper"
        description="Every pair here is verified against the real AOSP property and the real COVESA VSS spec, and most of them need an actual conversion — a unit, an encoding, or an addressing scheme that doesn't line up."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <GitCompareArrows aria-hidden className="size-4 text-accent" />
            {total} verified pairs
          </span>
          <span>every mismatch stated, not assumed away</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/sdv/vss-and-kuksa/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            VSS and Kuksa
          </Link>
        </div>
      </PageHeader>

      <div className="container-page py-10 md:py-14">
        <div className="max-w-3xl">
          <VssMapper />
        </div>
      </div>
    </>
  )
}
