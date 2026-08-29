import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from 'lucide-react'
import { TableOfContents } from '@/components/table-of-contents'
import { ReadAloud } from '@/components/read-aloud'
import { mdxComponents } from '@/components/mdx-components'
import { mdxOptions } from '@/lib/mdx'
import {
  extractHeadings,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from '@/lib/blog'
import { formatDate, slugify } from '@/lib/utils'
import { site } from '@/data/site'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${site.url}/blog/${post.slug}/`
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    // A canonical pointing at Medium tells search engines which copy is primary.
    alternates: { canonical: post.canonical ?? `/blog/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.name],
      tags: post.tags,
      images: [{ url: post.cover ?? '/og.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.cover ?? '/og.png'],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const headings = extractHeadings(post.content)
  const { previous, next } = getAdjacentPosts(post.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags.join(', '),
    wordCount: post.words,
    image: `${site.url}${post.cover ?? '/og.png'}`,
    author: { '@type': 'Person', name: site.name, url: site.url },
    publisher: { '@type': 'Person', name: site.name, url: site.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/blog/${post.slug}/` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="grid-bg absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-40 size-[28rem] rounded-full blur-[120px]"
          style={{ background: 'var(--glow-a)' }}
        />
        <div className="container-page relative py-14 md:py-16">
          <Link
            href="/blog/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            All posts
          </Link>

          <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{post.description}</p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-subtle">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {post.readingMinutes} min read
            </span>
            {post.updated && (
              <>
                <span aria-hidden>·</span>
                <span>Updated {formatDate(post.updated)}</span>
              </>
            )}
          </div>

          {post.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${slugify(tag)}/`}
                    className="chip transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 md:py-14 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <article id="topic-body" data-copy-guard className="prose-bm min-w-0">
          <ReadAloud targetId="topic-body" className="mb-8" />
          {post.canonical && (
            <p className="not-prose mb-8 flex items-start gap-2 rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted">
              <ExternalLink aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                Originally published on{' '}
                <a href={post.canonical} target="_blank" rel="noopener noreferrer">
                  Medium
                </a>
                .
              </span>
            </p>
          )}
          <MDXRemote source={post.content} components={mdxComponents} options={mdxOptions} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>

      {(previous || next) && (
        <nav aria-label="More posts" className="container-page pb-8">
          <div className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {next ? (
              <Link
                href={`/blog/${next.slug}/`}
                className="card group p-5 transition-colors hover:border-accent/50"
              >
                <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-subtle">
                  <ArrowLeft aria-hidden className="size-3.5" />
                  Newer
                </p>
                <p className="mt-2 font-display text-sm font-semibold leading-snug text-fg group-hover:text-accent">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {previous && (
              <Link
                href={`/blog/${previous.slug}/`}
                className="card group p-5 text-right transition-colors hover:border-accent/50 sm:col-start-2"
              >
                <p className="flex items-center justify-end gap-1.5 font-mono text-xs uppercase tracking-wider text-subtle">
                  Older
                  <ArrowRight aria-hidden className="size-3.5" />
                </p>
                <p className="mt-2 font-display text-sm font-semibold leading-snug text-fg group-hover:text-accent">
                  {previous.title}
                </p>
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  )
}
