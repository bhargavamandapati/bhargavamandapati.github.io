import Link from 'next/link'
import { ArrowRight, PenLine } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'
import { Reveal } from '@/components/reveal'
import { PostCard } from '@/components/post-card'
import { getAllPosts } from '@/lib/blog'
import { site } from '@/data/site'

export function Writing() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <Section id="writing" className="border-b border-line">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Writing"
          title="Notes from the platform layer"
          description="Deep dives on AOSP, vehicle HALs and the parts of Android Automotive that are not in the docs."
        />
        <Link
          href="/blog/"
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent"
        >
          All posts
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 60} className="h-full">
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card mt-12 flex flex-col items-center gap-4 p-12 text-center">
          <PenLine aria-hidden className="size-6 text-accent" />
          <p className="text-sm text-muted">
            First posts are on the way. In the meantime, my earlier writing lives on{' '}
            <a
              href={site.socials.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent link-underline"
            >
              Medium
            </a>
            .
          </p>
        </div>
      )}
    </Section>
  )
}
