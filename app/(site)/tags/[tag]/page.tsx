import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { PostCard } from '@/components/post-card'
import { getAllTags, getPostsByTag } from '@/lib/blog'

type Params = { tag: string }

export function generateStaticParams(): Params[] {
  return getAllTags().map((t) => ({ tag: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { tag } = await params
  const match = getAllTags().find((t) => t.slug === tag)
  if (!match) return {}

  return {
    title: `${match.tag} posts`,
    description: `Engineering writing tagged “${match.tag}” by Bhargava Mandapati.`,
    alternates: { canonical: `/tags/${match.slug}/` },
  }
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params
  const match = getAllTags().find((t) => t.slug === tag)
  if (!match) notFound()

  const posts = getPostsByTag(tag)

  return (
    <>
      <PageHeader
        eyebrow="Tag"
        title={match.tag}
        description={`${match.count} ${match.count === 1 ? 'post' : 'posts'} tagged “${match.tag}”.`}
      >
        <Link
          href="/blog/"
          className="group mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          All posts
        </Link>
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
