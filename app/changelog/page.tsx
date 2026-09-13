import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { changelog, type ChangeType } from '@/data/changelog'
import { site } from '@/data/site'
import { cn, formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Every release to this site, newest first — new content, fixes, and anything that changed about how the site works.',
  alternates: { canonical: '/changelog/' },
  openGraph: {
    type: 'website',
    title: `Changelog · ${site.name}`,
    description: 'Every release to this site, newest first.',
    url: `${site.url}/changelog/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Changelog' }],
  },
}

const TYPE_STYLES: Record<ChangeType, string> = {
  added: 'change-added',
  changed: 'text-accent',
  fixed: 'change-fixed',
  security: 'change-security',
}

const TYPE_LABELS: Record<ChangeType, string> = {
  added: 'Added',
  changed: 'Changed',
  fixed: 'Fixed',
  security: 'Security',
}

export default function ChangelogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Changelog',
    description: metadata.description,
    url: `${site.url}/changelog/`,
    itemListElement: changelog.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${entry.version} — ${entry.title}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader
        eyebrow="Changelog"
        title="What's changed"
        description="Every release to this site, newest first — new content, fixes, and anything that changed about how the site works. Updated every time something ships."
      />

      <div className="container-page max-w-3xl py-14 md:py-16">
        <ol className="space-y-14">
          {changelog.map((entry) => (
            <li key={entry.version} className="border-b border-line pb-14 last:border-b-0 last:pb-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-semibold text-accent">{entry.version}</span>
                <time dateTime={entry.date} className="font-mono text-xs text-subtle">
                  {formatDate(entry.date)}
                </time>
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight md:text-2xl">
                {entry.title}
              </h2>

              <ul className="mt-6 space-y-3">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={cn(
                        'shrink-0 font-mono text-[0.7rem] font-semibold uppercase tracking-wider',
                        TYPE_STYLES[change.type],
                      )}
                    >
                      {TYPE_LABELS[change.type]}
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-relaxed text-muted">
                      {change.text}
                      {change.links && change.links.length > 0 && (
                        <span className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                          {change.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="group inline-flex items-center gap-1 text-[0.8rem] font-medium text-accent link-underline"
                            >
                              {link.label}
                              <ArrowRight
                                aria-hidden
                                className="size-3 transition-transform group-hover:translate-x-0.5"
                              />
                            </Link>
                          ))}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
