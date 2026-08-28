import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { BlogIndex } from '@/components/blog-index'
import { getAllPosts, toMeta } from '@/lib/blog'
import { asset } from '@/lib/asset'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Engineering notes on Android Automotive, AOSP internals, vehicle HALs, VSS and software-defined vehicles by Bhargava Mandapati.',
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': `${site.url}/feed.xml` } },
}

export default function BlogPage() {
  // Strip MDX bodies before handing data to the client filter component.
  const posts = getAllPosts().map(toMeta)

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Notes from the platform layer"
        description="Long-form engineering writing on AOSP, Android Automotive, vehicle signal plumbing and the parts of the stack that are not in the documentation."
      >
        <p className="mt-6 text-sm text-muted">
          Cross-posted to{' '}
          <a
            href={site.socials.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent link-underline"
          >
            Medium
          </a>{' '}
          ·{' '}
          <a href={asset('/feed.xml')} className="font-medium text-accent link-underline">
            RSS feed
          </a>
        </p>
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        <BlogIndex posts={posts} />
      </div>
    </>
  )
}
