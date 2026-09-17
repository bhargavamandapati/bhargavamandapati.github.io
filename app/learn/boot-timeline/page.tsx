import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ListOrdered } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { BootTimeline } from '@/components/tools/boot-timeline'
import { bootStages } from '@/data/boot-sequence'
import { site } from '@/data/site'

const total = bootStages.length

export const metadata: Metadata = {
  title: 'Boot sequence timeline',
  description:
    'The nine stages from ignition to home screen, click-through — what starts, what it waits for, and the adb command to confirm each one happened.',
  alternates: { canonical: '/learn/boot-timeline/' },
  openGraph: {
    type: 'website',
    title: `Boot sequence timeline · ${site.name}`,
    description: 'Nine boot stages, click-through, each with a command to confirm it happened.',
    url: `${site.url}/learn/boot-timeline/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Boot sequence timeline' }],
  },
}

export default function BootTimelinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS · Reference"
        title="Boot sequence timeline"
        description="Click a stage to see what it does, what it waits for, and the command that confirms it happened. Something not appearing almost always means it is waiting, not broken."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <ListOrdered aria-hidden className="size-4 text-accent" />
            {total} stages, ignition to home screen
          </span>
          <span>a debugging order included</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/foundations/boot-sequence/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            The full article
          </Link>
        </div>
      </PageHeader>

      <div className="container-page py-10 md:py-14">
        <div className="max-w-3xl">
          <BootTimeline />
        </div>
      </div>
    </>
  )
}
