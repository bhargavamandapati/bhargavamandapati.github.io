'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ListTree, X } from 'lucide-react'
import { TrackIcon } from '@/components/tutorial/track-icon'
import type { TrackWithTutorials } from '@/lib/tutorials'
import { cn } from '@/lib/utils'

function Tree({ tracks, currentSlug }: { tracks: TrackWithTutorials[]; currentSlug?: string }) {
  let index = 0
  return (
    <nav aria-label="Tutorials">
      {tracks.map((track) => (
        <div key={track.slug} className="mb-6 last:mb-0">
          <p className="flex items-center gap-2 px-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-subtle">
            <TrackIcon name={track.icon} className="size-3.5 text-accent" />
            {track.name}
          </p>
          <ul className="mt-2 border-l border-line">
            {track.tutorials.map((t) => {
              index += 1
              const active = t.slug === currentSlug
              return (
                <li key={t.slug}>
                  <Link
                    href={`/tutorials/${t.slug}/`}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      '-ml-px flex items-baseline gap-2 border-l py-1.5 pl-3 pr-2 text-[0.84rem] leading-snug transition-colors',
                      active
                        ? 'border-accent font-medium text-accent'
                        : 'border-transparent text-muted hover:border-line-strong hover:text-fg'
                    )}
                  >
                    <span className="font-mono text-[0.68rem] text-subtle tabular-nums">
                      {String(index).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">{t.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function TutorialSidebar({
  tracks,
  currentSlug,
}: {
  tracks: TrackWithTutorials[]
  currentSlug?: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const total = tracks.reduce((n, t) => n + t.tutorials.length, 0)

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-3">
          <p className="mb-5 px-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
            {total} tutorials
          </p>
          <Tree tracks={tracks} currentSlug={currentSlug} />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-fg lg:hidden"
      >
        <ListTree className="size-4" />
        All tutorials
        <span className="font-mono text-xs text-subtle">{total}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tutorials"
            className="absolute inset-y-0 left-0 w-[min(21rem,88vw)] overflow-y-auto border-r border-line bg-bg p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-sm font-semibold">Tutorials</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close tutorial list"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>
            <Tree tracks={tracks} currentSlug={currentSlug} />
          </div>
        </div>
      )}
    </>
  )
}
