import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BrainCircuit } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RequestAccessButton } from '@/components/premium/request-access'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'AI & ML for Automotive',
  description:
    'A new track on AI and machine learning in the vehicle, coming soon — the same source-linked, no-hand-waving treatment as the rest of this site, sold as its own separate subscription.',
  alternates: { canonical: '/ai-ml/' },
  openGraph: {
    type: 'website',
    title: `AI & ML for Automotive · ${site.name}`,
    description: 'A new track on AI and machine learning in the vehicle. Coming soon.',
    url: `${site.url}/ai-ml/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AI & ML for Automotive' }],
  },
}

export default function AiMlPage() {
  return (
    <>
      <PageHeader
        eyebrow="Coming soon"
        title="AI & ML for Automotive"
        description="A third track, alongside Learn AAOS and SDV — AI and machine learning as they actually show up in the vehicle, not a generic ML course with a car in the title. Still being written."
      />

      <div className="container-page py-14 md:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-surface-2">
            <BrainCircuit aria-hidden className="size-5 text-accent" />
          </span>

          <h2 className="mt-6 font-display text-xl font-semibold tracking-tight md:text-2xl">
            Same standard, new subject
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Everything else on this site is written a specific way: plain explanations, real
            source rather than paraphrased docs, and nothing asserted that hasn&rsquo;t been
            checked. This track applies that to AI and machine learning in the automotive
            stack — where inference actually runs, what changes when it has to happen
            on-device, and how it connects to the platform work the rest of this site already
            covers.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            It isn&rsquo;t published yet, and there&rsquo;s nothing to unlock here today.
          </p>

          <div className="mt-8 rounded-xl border border-line bg-bg-subtle p-6">
            <h3 className="font-display text-base font-semibold tracking-tight">
              Its own subscription, separate from Learn AAOS and SDV
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Learn AAOS and SDV already work this way — an access key per track, so holding
              one says nothing about the other. AI &amp; ML for Automotive will follow the
              same pattern once it launches: a separate track, on its own key, so you only
              ever pay for what you actually want. Reach out for details and cost, or to be
              told when it&rsquo;s ready.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <RequestAccessButton defaultTopics={['ai-ml']} context="AI & ML for Automotive — early access" />
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
          >
            Back to the rest of the site
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </>
  )
}
