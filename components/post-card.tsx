import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'
import { formatDate, slugify } from '@/lib/utils'

export function PostCard({ post, compact = false }: { post: PostMeta; compact?: boolean }) {
  return (
    <article className="card group relative flex h-full flex-col p-6 transition-all hover:border-accent/50 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-mono text-xs text-subtle">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3" />
            {post.readingMinutes} min
          </span>
        </div>
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>

      <h3
        className={`mt-4 font-display font-semibold leading-snug tracking-tight text-fg ${
          compact ? 'text-base' : 'text-lg'
        }`}
      >
        <Link href={`/blog/${post.slug}/`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>

      {post.description && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
      )}

      {post.tags.length > 0 && (
        <ul className="relative z-10 mt-5 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <li key={tag}>
              {/* Sits above the stretched title link so tag navigation still works. */}
              <Link
                href={`/tags/${slugify(tag)}/`}
                className="block rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[0.68rem] text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
