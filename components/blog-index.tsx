'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { PostCard } from '@/components/post-card'
import type { PostMeta } from '@/lib/blog'
import { cn, slugify } from '@/lib/utils'

const ALL = 'All'

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState(ALL)

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [posts])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      const matchesTag = tag === ALL || p.tags.includes(tag)
      if (!matchesTag) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [posts, query, tag])

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="relative max-w-md">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts by title, description or tag"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-subtle hover:text-fg"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
            {[[ALL, posts.length] as const, ...tags].map(([name, count]) => {
              const isActive = name === tag
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTag(name)}
                  aria-pressed={isActive}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors',
                    isActive
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg'
                  )}
                >
                  {name}
                  <span className="ml-1.5 text-subtle">{count}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <p aria-live="polite" className="mt-8 font-mono text-xs text-subtle">
        {visible.length} {visible.length === 1 ? 'post' : 'posts'}
        {tag !== ALL && ` tagged “${tag}”`}
        {query && ` matching “${query}”`}
      </p>

      {visible.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="card mt-5 p-12 text-center">
          <p className="text-sm text-muted">
            No posts match that filter yet. Try clearing the search or picking another tag.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setTag(ALL)
            }}
            className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Reset filters
          </button>
        </div>
      )}
      {/* Tag pages under /tags/<slug>/ stay statically rendered for SEO. */}
      <span className="sr-only">{tags.map(([t]) => slugify(t)).join(' ')}</span>
    </>
  )
}
