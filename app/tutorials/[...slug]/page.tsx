import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { TutorialSidebar } from '@/components/tutorial/sidebar'
import { TrackIcon } from '@/components/tutorial/track-icon'
import { OutcomeCard } from '@/components/tutorial/outcome-card'
import { SourceList } from '@/components/learn/source'
import { TableOfContents } from '@/components/table-of-contents'
import { mdxComponents } from '@/components/mdx-components'
import { mdxOptions } from '@/lib/mdx'
import {
  countSteps,
  extractTutorialHeadings,
  getAdjacentTutorials,
  getAllTutorials,
  getTracks,
  getTutorial,
} from '@/lib/tutorials'
import { trackBySlug } from '@/data/tutorials'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

type Params = { slug: string[] }

export function generateStaticParams(): Params[] {
  return getAllTutorials().map((t) => ({ slug: t.slug.split('/') }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const tutorial = getTutorial(slug.join('/'))
  if (!tutorial) return {}

  const track = trackBySlug.get(tutorial.trackSlug)
  return {
    title: tutorial.title,
    description: tutorial.description,
    keywords: [...tutorial.tags, 'Android Automotive', 'AAOS', 'tutorial'],
    alternates: { canonical: `/tutorials/${tutorial.slug}/` },
    openGraph: {
      type: 'article',
      title: `${tutorial.title} — ${track?.name ?? 'AAOS tutorial'}`,
      description: tutorial.description,
      url: `${site.url}/tutorials/${tutorial.slug}/`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: tutorial.title }],
    },
  }
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced: 'diff-advanced',
}

export default async function TutorialPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const tutorial = getTutorial(slug.join('/'))
  if (!tutorial) notFound()

  const track = trackBySlug.get(tutorial.trackSlug)
  const tracks = getTracks()
  const headings = extractTutorialHeadings(tutorial.content)
  const steps = countSteps(tutorial.content)
  const { previous, next } = getAdjacentTutorials(tutorial.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: tutorial.title,
    description: tutorial.description,
    totalTime: tutorial.time || undefined,
    step: headings
      .filter((h) => h.level === 2 && /^Step\s+\d+/.test(h.text))
      .map((h, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: h.text.replace(/^Step\s+\d+\s*[—–-]\s*/, ''),
        url: `${site.url}/tutorials/${tutorial.slug}/#${h.id}`,
      })),
    author: { '@type': 'Person', name: site.name, url: site.url },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tutorials', item: `${site.url}/tutorials/` },
      ...(track
        ? [{ '@type': 'ListItem', position: 2, name: track.name, item: `${site.url}/tutorials/` }]
        : []),
      {
        '@type': 'ListItem',
        position: track ? 3 : 2,
        name: tutorial.title,
        item: `${site.url}/tutorials/${tutorial.slug}/`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container-wide grid gap-10 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[16rem_minmax(0,1fr)_15rem]">
        <TutorialSidebar tracks={tracks} currentSlug={tutorial.slug} />

        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/tutorials/"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              Tutorials
            </Link>
          </nav>

          <header>
            {track && (
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                <TrackIcon name={track.icon} className="size-3.5" />
                {track.name}
              </p>
            )}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {tutorial.title}
            </h1>
            {tutorial.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted">{tutorial.description}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-subtle">
              <span className={cn('uppercase tracking-wider', DIFFICULTY_STYLES[tutorial.difficulty])}>
                {tutorial.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-3.5" />
                {tutorial.readingMinutes} min read
              </span>
              {tutorial.tags.length > 0 && <span>{tutorial.tags.join(' · ')}</span>}
            </div>
          </header>

          <OutcomeCard
            outcome={tutorial.outcome}
            time={tutorial.time}
            steps={steps}
            prerequisites={tutorial.prerequisites}
          />

          <article className="prose-bm mt-10">
            <MDXRemote source={tutorial.content} components={mdxComponents} options={mdxOptions} />
          </article>

          <SourceList sources={tutorial.sources} />

          {(previous || next) && (
            <nav aria-label="Tutorial navigation" className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {previous ? (
                <Link href={`/tutorials/${previous.slug}/`} className="card group p-5 transition-colors hover:border-accent/50">
                  <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-subtle">
                    <ArrowLeft aria-hidden className="size-3.5" />
                    Previous
                  </p>
                  <p className="mt-2 font-display text-sm font-semibold leading-snug text-fg group-hover:text-accent">
                    {previous.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/tutorials/${next.slug}/`}
                  className="card group p-5 text-right transition-colors hover:border-accent/50 sm:col-start-2"
                >
                  <p className="flex items-center justify-end gap-1.5 font-mono text-xs uppercase tracking-wider text-subtle">
                    Next
                    <ArrowRight aria-hidden className="size-3.5" />
                  </p>
                  <p className="mt-2 font-display text-sm font-semibold leading-snug text-fg group-hover:text-accent">
                    {next.title}
                  </p>
                </Link>
              )}
            </nav>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </>
  )
}
