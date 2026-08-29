'use client'

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

/** One row of the generated index. Keys are short because there are 500+ of them. */
type Entry = {
  t: string
  d: string
  u: string
  k: string
  x: string
  g: string
}

type Scored = Entry & { score: number }

const KIND_ORDER = ['Page', 'Learn AAOS', 'Tutorial', 'SDV', 'Property', 'Glossary', 'Writing']

/**
 * Ranks an entry against the query.
 *
 * Deliberately simple: an exact title match should always win, and a body
 * mention should never outrank a title. A fuzzy-matching library would add
 * more weight to the bundle than it adds usefulness at this size.
 */
function score(entry: Entry, needle: string, words: string[]): number {
  const title = entry.t.toLowerCase()
  const desc = entry.d.toLowerCase()
  const keys = entry.g.toLowerCase()
  const body = entry.x.toLowerCase()
  // The slug is close to a second title — "sepolicy" should find
  // /learn/security/sepolicy-automotive even though its title says SELinux.
  const slug = entry.u.toLowerCase().replace(/[-/]/g, ' ')

  if (title === needle) return 1000
  let s = 0
  if (title.startsWith(needle)) s += 400
  else if (title.includes(needle)) s += 250
  if (slug.includes(needle)) s += 220
  if (keys.includes(needle)) s += 180
  if (desc.includes(needle)) s += 90
  if (body.includes(needle)) s += 30

  // Every word must appear somewhere, so multi-word queries narrow rather than widen.
  if (words.length > 1) {
    const haystack = `${title} ${desc} ${keys} ${body} ${slug}`
    if (!words.every((w) => haystack.includes(w))) return 0
    s += 60
  }
  if (s === 0) return 0
  // Nudge shorter titles up: "VHAL" should beat "VHAL testing" for "vhal".
  return s + Math.max(0, 40 - entry.t.length)
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<Entry[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const labelId = useId()
  const deferred = useDeferredValue(query)

  // Fetch the index once, on first open — it is 60 KB gzipped and most
  // visitors never search.
  useEffect(() => {
    if (!open || index || loading) return
    setLoading(true)
    fetch(asset('/search-index.json'))
      .then((r) => r.json())
      .then((data: Entry[]) => setIndex(data))
      .catch(() => setIndex([]))
      .finally(() => setLoading(false))
  }, [open, index, loading])

  const show = useCallback(() => {
    openerRef.current = document.activeElement as HTMLElement
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
    openerRef.current?.focus()
  }, [])

  // Cmd/Ctrl+K anywhere, and "/" when not already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => (o ? o : (show(), true)))
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, show])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      inputRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const results = useMemo(() => {
    const needle = deferred.trim().toLowerCase()
    if (!index || needle.length < 2) return []
    const words = needle.split(/\s+/).filter(Boolean)
    const scored: Scored[] = []
    for (const entry of index) {
      const s = score(entry, needle, words)
      if (s > 0) scored.push({ ...entry, score: s })
    }
    scored.sort(
      (a, b) =>
        b.score - a.score ||
        KIND_ORDER.indexOf(a.k) - KIND_ORDER.indexOf(b.k) ||
        a.t.localeCompare(b.t),
    )
    return scored.slice(0, 30)
  }, [index, deferred])

  useEffect(() => setActive(0), [deferred])

  // Keep the highlighted row in view when arrowing through.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      block: 'nearest',
    })
  }, [active])

  const go = useCallback(
    (url: string) => {
      hide()
      router.push(url)
    },
    [hide, router],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      hide()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active].u)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-muted transition-colors hover:text-fg"
        aria-label="Search the site"
      >
        <Search aria-hidden className="size-[18px]" />
        <span className="hidden font-mono text-[0.68rem] text-subtle lg:inline">⌘K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh]"
          onKeyDown={onKeyDown}
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={hide}
            className="absolute inset-0 cursor-default bg-bg/80 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            className="card relative z-10 flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden shadow-2xl"
          >
            <h2 id={labelId} className="sr-only">
              Search the site
            </h2>
            <div className="flex items-center gap-2 border-b border-line px-4">
              <Search aria-hidden className="size-4 shrink-0 text-subtle" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls={`${labelId}-results`}
                aria-autocomplete="list"
                aria-activedescendant={
                  results[active] ? `${labelId}-opt-${active}` : undefined
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, properties, tutorials, glossary…"
                className="w-full bg-transparent py-3.5 text-sm text-fg outline-none placeholder:text-subtle"
              />
              <button
                type="button"
                onClick={hide}
                aria-label="Close search"
                className="shrink-0 rounded-md p-1 text-subtle transition-colors hover:text-fg"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && (
                <p className="px-4 py-6 text-center font-mono text-xs text-muted">Loading…</p>
              )}
              {!loading && query.trim().length > 0 && query.trim().length < 2 && (
                <p className="px-4 py-6 text-center text-sm text-muted">Keep typing…</p>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  Nothing matches “{query.trim()}”.
                </p>
              )}
              <ul id={`${labelId}-results`} ref={listRef} role="listbox" aria-label="Results">
                {results.map((r, i) => (
                  <li key={`${r.u}-${i}`} role="none">
                    <button
                      type="button"
                      id={`${labelId}-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.u)}
                      className={cn(
                        'flex w-full cursor-pointer flex-col items-start gap-0.5 border-b border-line px-4 py-2.5 text-left transition-colors last:border-b-0',
                        i === active && 'bg-bg-subtle',
                      )}
                    >
                      <span className="flex w-full flex-wrap items-baseline gap-x-2">
                        <span
                          className={cn(
                            'text-sm font-medium [overflow-wrap:anywhere]',
                            r.k === 'Property' ? 'font-mono text-fg' : 'text-fg',
                          )}
                        >
                          {r.t}
                        </span>
                        <span className="chip ml-auto shrink-0">{r.k}</span>
                      </span>
                      {r.d && (
                        <span className="line-clamp-2 text-xs leading-relaxed text-muted">
                          {r.d}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {results.length > 0 && (
              <p className="border-t border-line px-4 py-2 font-mono text-[0.68rem] text-subtle">
                ↑↓ move · ↵ open · esc close · {results.length} of {index?.length ?? 0} indexed
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
