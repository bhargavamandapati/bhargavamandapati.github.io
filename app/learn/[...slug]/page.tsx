import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { LearnSidebar } from '@/components/learn/sidebar'
import { CategoryIcon } from '@/components/learn/category-icon'
import { MarkRead } from '@/components/paths/mark-read'
import { SourceList } from '@/components/learn/source'
import { TableOfContents } from '@/components/table-of-contents'
import { ReadAloud } from '@/components/read-aloud'
import { mdxComponents } from '@/components/mdx-components'
import { mdxOptions } from '@/lib/mdx'
import {
  extractTopicHeadings,
  getAdjacentTopics,
  getAllTopics,
  getCurriculum,
  getTopic,
} from '@/lib/learn'
import { categoryBySlug } from '@/data/curriculum'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

type Params = { slug: string[] }

export function generateStaticParams(): Params[] {
  return getAllTopics().map((t) => ({ slug: t.slug.split('/') }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const topic = getTopic(slug.join('/'))
  if (!topic) return {}

  const category = categoryBySlug.get(topic.categorySlug)
  return {
    title: topic.title,
    description: topic.description,
    keywords: [...topic.tags, 'Android Automotive', 'AAOS', 'AOSP'],
    alternates: { canonical: `/learn/${topic.slug}/` },
    openGraph: {
      type: 'article',
      title: `${topic.title} — ${category?.name ?? 'Learn AAOS'}`,
      description: topic.description,
      url: `${site.url}/learn/${topic.slug}/`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: topic.title }],
    },
  }
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced: 'diff-advanced',
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const topic = getTopic(slug.join('/'))
  if (!topic) notFound()

  const category = categoryBySlug.get(topic.categorySlug)
  const curriculum = getCurriculum()
  const headings = extractTopicHeadings(topic.content)
  const { previous, next } = getAdjacentTopics(topic.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: topic.title,
    description: topic.description,
    articleSection: category?.name,
    keywords: topic.tags.join(', '),
    wordCount: topic.words,
    proficiencyLevel: topic.difficulty,
    author: { '@type': 'Person', name: site.name, url: site.url },
    publisher: { '@type': 'Person', name: site.name, url: site.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/learn/${topic.slug}/` },
    ...(topic.updated ? { dateModified: topic.updated } : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Learn', item: `${site.url}/learn/` },
      ...(category
        ? [{ '@type': 'ListItem', position: 2, name: category.name, item: `${site.url}/learn/` }]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 3 : 2,
        name: topic.title,
        item: `${site.url}/learn/${topic.slug}/`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container-wide grid gap-10 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[16rem_minmax(0,1fr)_15rem]">
        <LearnSidebar curriculum={curriculum} currentSlug={topic.slug} />

        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/learn/"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              Learn
            </Link>
          </nav>

          <header className="border-b border-line pb-8">
            {category && (
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                <CategoryIcon name={category.icon} className="size-3.5" />
                {category.name}
              </p>
            )}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {topic.title}
            </h1>
            {topic.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted">{topic.description}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-subtle">
              <span className={cn('uppercase tracking-wider', DIFFICULTY_STYLES[topic.difficulty])}>
                {topic.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-3.5" />
                {topic.readingMinutes} min
              </span>
              {topic.tags.length > 0 && <span>{topic.tags.join(' · ')}</span>}
            </div>
          </header>

          <article id="topic-body" data-copy-guard className="prose-bm mt-10">
            <ReadAloud targetId="topic-body" className="mb-8" />
            <MDXRemote source={topic.content} components={mdxComponents} options={mdxOptions} />
          </article>

          <SourceList sources={topic.sources} />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MarkRead href={`/learn/${topic.slug}/`} />
            <span className="text-xs text-subtle">
              Kept on this device, to drive the{' '}
              <Link href="/learn/start/" className="link-underline text-accent">
                learning paths
              </Link>
              .
            </span>
          </div>

          {(previous || next) && (
            <nav aria-label="Curriculum navigation" className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/learn/${previous.slug}/`}
                  className="card group p-5 transition-colors hover:border-accent/50"
                >
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
                  href={`/learn/${next.slug}/`}
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
