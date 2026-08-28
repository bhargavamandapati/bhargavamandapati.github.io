import Link from 'next/link'
import { ArrowRight, Clock, ListChecks, Target } from 'lucide-react'
import type { Prerequisite } from '@/lib/tutorials'

/** The header block on every tutorial: outcome, cost, and what to read first. */
export function OutcomeCard({
  outcome,
  time,
  steps,
  prerequisites,
}: {
  outcome: string
  time: string
  steps: number
  prerequisites: Prerequisite[]
}) {
  return (
    <section
      aria-label="Tutorial summary"
      className="card mt-8 divide-y divide-line overflow-hidden p-0"
    >
      <div className="p-6">
        <h2 className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
          <Target aria-hidden className="size-3.5" />
          What you will build
        </h2>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-fg">{outcome}</p>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-subtle">
          {time && (
            <div className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              <dt className="sr-only">Estimated time</dt>
              <dd>{time}</dd>
            </div>
          )}
          {steps > 0 && (
            <div className="flex items-center gap-1.5">
              <ListChecks aria-hidden className="size-3.5" />
              <dt className="sr-only">Steps</dt>
              <dd>
                {steps} step{steps === 1 ? '' : 's'}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {prerequisites.length > 0 && (
        <div className="bg-surface-2 p-6">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
            Before you start
          </h2>
          <ul className="mt-3 space-y-2">
            {prerequisites.map((p) => (
              <li key={p.label} className="text-sm leading-snug">
                {p.href ? (
                  <Link
                    href={p.href}
                    className="group inline-flex items-baseline gap-1.5 text-muted transition-colors hover:text-accent"
                  >
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 shrink-0 self-center text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                    <span className="underline decoration-line underline-offset-2 group-hover:decoration-accent">
                      {p.label}
                    </span>
                  </Link>
                ) : (
                  <span className="inline-flex items-baseline gap-1.5 text-muted">
                    <span aria-hidden className="self-center text-subtle">
                      ·
                    </span>
                    {p.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
