import Link from 'next/link'
import { BookOpen, Hammer } from 'lucide-react'
import { ItemLockBadge } from '@/components/premium/item-lock-badge'
import type { RelatedItem } from '@/lib/topic-map'

function Row({ item }: { item: RelatedItem }) {
  const Icon = item.area === 'learn' ? BookOpen : Hammer
  return (
    <li>
      <Link
        href={item.href}
        className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2"
      >
        <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
        <span className="min-w-0">
          <span className="block font-medium leading-snug text-fg group-hover:text-accent">
            {item.title}
            <ItemLockBadge area={item.area} slug={item.slug} className="ml-2" />
          </span>
          <span className="mt-0.5 block font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
            {item.kicker}
          </span>
        </span>
      </Link>
    </li>
  )
}

/**
 * A short list of related pages from the other half of the site — the Learn
 * topics to read before a tutorial, or the tutorials that put a Learn topic
 * into practice. Long lists fold after `limit` so a topic with twenty
 * tutorials doesn't push the page's own content away.
 */
export function RelatedTopics({
  heading,
  intro,
  items,
  limit = 5,
  className,
}: {
  heading: string
  intro: string
  items: RelatedItem[]
  limit?: number
  className?: string
}) {
  if (items.length === 0) return null
  const shown = items.slice(0, limit)
  const more = items.slice(limit)
  return (
    <section aria-label={heading} className={className ?? 'not-prose my-8 rounded-xl border border-line bg-surface p-5'}>
      <h2 className="font-display text-base font-semibold tracking-tight">{heading}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{intro}</p>
      <ul className="-mx-3 mt-3">
        {shown.map((item) => (
          <Row key={item.slug} item={item} />
        ))}
      </ul>
      {more.length > 0 && (
        <details className="group mt-1">
          <summary className="cursor-pointer list-none px-0 py-1 text-sm font-medium text-accent link-underline">
            Show {more.length} more
          </summary>
          <ul className="-mx-3 mt-2">
            {more.map((item) => (
              <Row key={item.slug} item={item} />
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
