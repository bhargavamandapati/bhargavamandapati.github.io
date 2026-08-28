'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ListTree, X } from 'lucide-react'
import { CategoryIcon } from '@/components/learn/category-icon'
import type { CategoryWithTopics } from '@/lib/learn'
import { cn } from '@/lib/utils'

function Tree({ curriculum, currentSlug }: { curriculum: CategoryWithTopics[]; currentSlug?: string }) {
  let index = 0
  return (
    <nav aria-label="Curriculum">
      {curriculum.map((category) => (
        <div key={category.slug} className="mb-6 last:mb-0">
          <p className="flex items-center gap-2 px-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-subtle">
            <CategoryIcon name={category.icon} className="size-3.5 text-accent" />
            {category.name}
          </p>
          <ul className="mt-2 border-l border-line">
            {category.topics.map((topic) => {
              index += 1
              const active = topic.slug === currentSlug
              return (
                <li key={topic.slug}>
                  <Link
                    href={`/learn/${topic.slug}/`}
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
                    <span className="min-w-0">{topic.title}</span>
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

export function LearnSidebar({
  curriculum,
  currentSlug,
}: {
  curriculum: CategoryWithTopics[]
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

  const total = curriculum.reduce((n, c) => n + c.topics.length, 0)

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-3">
          <p className="mb-5 px-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
            {total} topics
          </p>
          <Tree curriculum={curriculum} currentSlug={currentSlug} />
        </div>
      </aside>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-fg lg:hidden"
      >
        <ListTree className="size-4" />
        Curriculum
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
            aria-label="Curriculum"
            className="absolute inset-y-0 left-0 w-[min(21rem,88vw)] overflow-y-auto border-r border-line bg-bg p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-sm font-semibold">Curriculum</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close curriculum"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>
            <Tree curriculum={curriculum} currentSlug={currentSlug} />
          </div>
        </div>
      )}
    </>
  )
}
