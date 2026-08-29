'use client'

import Link from 'next/link'
import { Check, RotateCcw } from 'lucide-react'
import { stepHref, type LearningPath } from '@/data/paths'
import { useProgress } from './progress'
import { cn } from '@/lib/utils'

/** Real topic titles, resolved on the server so the list does not show slugs. */
export type ResolvedStep = LearningPath['steps'][number] & { title: string }
export type ResolvedPath = Omit<LearningPath, 'steps'> & { steps: ResolvedStep[] }

const SECTION_LABEL: Record<string, string> = {
  learn: 'Learn AAOS',
  sdv: 'SDV',
  tutorials: 'Tutorial',
}

export function PathList({ paths }: { paths: ResolvedPath[] }) {
  const { isRead, ready, clear, read } = useProgress()

  return (
    <div>
      {ready && read.size > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs text-muted">
            {read.size} topic{read.size === 1 ? '' : 's'} marked as read on this device
          </p>
          <button
            type="button"
            onClick={clear}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Reset
          </button>
        </div>
      )}

      <div className="space-y-10">
        {paths.map((path) => {
          const done = ready ? path.steps.filter((s) => isRead(stepHref(s))).length : 0
          const pct = Math.round((done / path.steps.length) * 100)
          return (
            <section key={path.slug} aria-labelledby={`path-${path.slug}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2
                  id={`path-${path.slug}`}
                  className="font-display text-xl font-semibold tracking-tight"
                >
                  {path.name}
                </h2>
                <span className="font-mono text-xs text-muted" aria-live="polite">
                  {ready ? `${done} of ${path.steps.length}` : `${path.steps.length} steps`}
                </span>
              </div>
              <p className="mt-1 text-sm text-subtle">{path.audience}</p>
              <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
                {path.blurb}
              </p>

              {ready && (
                <div
                  className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${path.name} progress`}
                >
                  <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                </div>
              )}

              <ol className="mt-5 space-y-2">
                {path.steps.map((step, i) => {
                  const href = stepHref(step)
                  const complete = ready && isRead(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          'card group flex gap-3 px-4 py-3 transition-colors hover:border-accent/40',
                          complete && 'border-accent/35',
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[0.6rem]',
                            complete
                              ? 'border-accent bg-accent text-accent-fg'
                              : 'border-line text-subtle',
                          )}
                        >
                          {complete ? <Check className="size-3" /> : i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-sm font-medium text-fg group-hover:text-accent">
                              {step.title}
                            </span>
                            <span className="chip">{SECTION_LABEL[step.section]}</span>
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted">
                            {step.why}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>
    </div>
  )
}
