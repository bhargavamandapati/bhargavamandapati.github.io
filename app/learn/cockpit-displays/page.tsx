import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, LayoutGrid } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { CockpitSimulator } from '@/components/cockpit/cockpit-simulator'
import { displays, zones } from '@/data/cockpit'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Cockpit zones and displays',
  description:
    'An interactive model of occupant zones, multi-display cockpits and UX restrictions in Android Automotive — which user owns which screen, what driving state blocks, and where an Activity actually lands.',
  alternates: { canonical: '/learn/cockpit-displays/' },
  openGraph: {
    type: 'website',
    title: `Cockpit zones and displays · ${site.name}`,
    description:
      'Occupant zones, multi-display, users and UX restrictions — the assumptions that break, made visible.',
    url: `${site.url}/learn/cockpit-displays/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cockpit zones and displays' }],
  },
}

export default function CockpitDisplaysPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS · Interactive"
        title="Cockpit zones and displays"
        description="Almost every multi-display bug in automotive comes from code that says “the display”, “the user” or “the current Activity” as though there were one of each. Here there are five displays, four zones and four users, and you can watch the assumption break."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <LayoutGrid aria-hidden className="size-4 text-accent" />
            {displays.length} displays · {zones.length} occupant zones
          </span>
          <span>UX restrictions applied live</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/vehicle-simulator/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Property simulator
          </Link>
        </div>
      </PageHeader>

      <div className="container-wide py-10 md:py-12">
        <CockpitSimulator />

        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-xl font-semibold tracking-tight">Things worth trying</h2>
          <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-muted">
            <li>
              <strong className="font-medium text-fg">Put a video on the centre screen, then drive.</strong>{' '}
              It is blocked. Put the same video on a rear display and drive — it keeps playing.
              Restrictions police the driver, not the vehicle.
            </li>
            <li>
              <strong className="font-medium text-fg">Turn off “name a launch display”.</strong>{' '}
              Every Activity lands on display 0, in front of the driver, whoever you meant it for.
              This is the single most common multi-display bug.
            </li>
            <li>
              <strong className="font-medium text-fg">Give each zone a different user.</strong>{' '}
              “The current user” now has four different answers depending on which screen you are
              asking about — which is why storage, preferences and accounts all differ per display.
            </li>
            <li>
              <strong className="font-medium text-fg">Switch the foreground user.</strong> The
              driver&rsquo;s screens change; user 0 keeps running headless underneath, holding the
              vehicle services. It does not restart.
            </li>
            <li>
              <strong className="font-medium text-fg">Set Settings running on the cluster and drive.</strong>{' '}
              Blocked — because it is not marked{' '}
              <code className="font-mono text-[0.9em] text-fg">distractionOptimized</code>, not
              because of anything about Settings itself.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold tracking-tight">
            What this models, and what it does not
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            The zone-to-seat-to-display-to-user mapping, the driver-facing distinction, and the way
            UX restrictions follow driving state are all real, and they are the parts people get
            wrong. Display ids follow the usual convention, with 0 as the default; on a real product
            they come from the occupant zone configuration rather than a constant.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            The full detail lives in{' '}
            <Link href="/learn/car-framework/occupant-zones/" className="link-underline text-accent">
              occupant zones and multi-display
            </Link>
            ,{' '}
            <Link href="/learn/car-framework/multi-user/" className="link-underline text-accent">
              the headless system user model
            </Link>{' '}
            and{' '}
            <Link href="/learn/hmi/ux-restrictions/" className="link-underline text-accent">
              UX restrictions
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
