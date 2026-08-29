import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { PathList, type ResolvedPath } from '@/components/paths/path-list'
import { paths } from '@/data/paths'
import { getTopic } from '@/lib/learn'
import { getSdvTopic } from '@/lib/sdv'
import { getTutorial } from '@/lib/tutorials'
import { site } from '@/data/site'

const stepCount = paths.reduce((n, p) => n + p.steps.length, 0)

export const metadata: Metadata = {
  title: 'Start here',
  description: `Guided routes through the Android Automotive and SDV material — ${paths.length} paths, ${stepCount} steps, ordered for where you are starting from rather than left as a list of topics.`,
  alternates: { canonical: '/learn/start/' },
  openGraph: {
    type: 'website',
    title: `Start here · ${site.name}`,
    description: 'Guided routes through the AAOS and SDV curriculum, ordered for where you are starting from.',
    url: `${site.url}/learn/start/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Start here' }],
  },
}

/** Resolves each step's real title from whichever section it belongs to. */
function resolve(): ResolvedPath[] {
  return paths.map((path) => ({
    ...path,
    steps: path.steps.map((step) => {
      const topic =
        step.section === 'learn'
          ? getTopic(step.slug)
          : step.section === 'sdv'
            ? getSdvTopic(step.slug)
            : getTutorial(step.slug)
      return { ...step, title: topic?.title ?? step.slug }
    }),
  }))
}

export default function StartHerePage() {
  const resolved = resolve()

  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS"
        title="Start here"
        description="There are 128 topics across the curriculum, which is a reference rather than a course. These are four routes through the same material, ordered for where you are starting from — each step says why it follows the last."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Compass aria-hidden className="size-4 text-accent" />
            {paths.length} paths · {stepCount} steps
          </span>
          <span>progress is kept on this device only</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Full curriculum
          </Link>
        </div>
      </PageHeader>

      <div className="container-page py-10 md:py-14">
        <PathList paths={resolved} />

        <section className="mt-14 max-w-3xl border-t border-line pt-8">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            None of these quite fit?
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            The paths are a suggested order, not a gate — every topic stands on its own, and the{' '}
            <Link href="/learn/" className="link-underline text-accent">
              full curriculum
            </Link>{' '}
            is organised by subject if you would rather go straight to a module. Press{' '}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> to
            search all {stepCount > 0 ? '500+' : ''} indexed pages.
          </p>
        </section>
      </div>
    </>
  )
}
