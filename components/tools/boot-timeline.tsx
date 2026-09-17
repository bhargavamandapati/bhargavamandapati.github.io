'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Terminal } from 'lucide-react'
import { bootStages, debugOrder } from '@/data/boot-sequence'
import { cn } from '@/lib/utils'

export function BootTimeline() {
  const [open, setOpen] = useState<number>(1)

  return (
    <div>
      <ol className="relative">
        <div aria-hidden className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line" />
        {bootStages.map((stage) => {
          const expanded = open === stage.number
          return (
            <li key={stage.number} className="relative pb-3 pl-12">
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-0 flex size-[2.3rem] items-center justify-center rounded-full border font-mono text-xs font-semibold',
                  expanded ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-muted',
                )}
              >
                {stage.number}
              </span>
              <button
                type="button"
                onClick={() => setOpen(expanded ? -1 : stage.number)}
                aria-expanded={expanded}
                className={cn(
                  'card flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors',
                  expanded && 'border-accent/50',
                )}
              >
                <span className="min-w-0">
                  <span className="block font-medium text-fg">{stage.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">{stage.summary}</span>
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn('size-4 shrink-0 text-subtle transition-transform', expanded && 'rotate-180 text-accent')}
                />
              </button>

              {expanded && (
                <div className="mt-2 rounded-lg border border-line bg-surface-2 p-4">
                  <p className="text-sm leading-relaxed text-fg">{stage.detail}</p>
                  {stage.aaosNote && (
                    <p className="mt-3 text-xs leading-relaxed text-accent">
                      <strong className="font-medium">Automotive-specific:</strong> {stage.aaosNote}
                    </p>
                  )}
                  {stage.commands && stage.commands.length > 0 && (
                    <div className="mt-3 rounded-md border border-line bg-bg p-3">
                      <p className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                        <Terminal aria-hidden className="size-3" />
                        Confirm it
                      </p>
                      <pre className="mt-1.5 overflow-x-auto font-mono text-xs text-muted">
                        {stage.commands.join('\n')}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="card mt-8 p-5">
        <h2 className="text-sm font-medium text-fg">A debugging order for &ldquo;it did not boot&rdquo;</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Work down. The first of these that fails tells you where to look — stages 6 and 8 are the
          ones specific to automotive, and stage 6 is the one that is most often the answer.
        </p>
        <ol className="mt-4 space-y-2.5">
          {debugOrder.map((step, i) => (
            <li key={step.command} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
              <span className="font-mono text-xs text-subtle">{i + 1}.</span>
              <button
                type="button"
                onClick={() => setOpen(step.stage)}
                className="text-fg underline decoration-line-strong decoration-dotted underline-offset-2 hover:text-accent"
              >
                {step.check}
              </button>
              <code className="w-full font-mono text-xs text-muted [overflow-wrap:anywhere] sm:w-auto">
                {step.command}
              </code>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-subtle">
        The full reasoning behind each stage — with the scenarios that make it stick — is in{' '}
        <Link href="/learn/foundations/boot-sequence/" className="text-accent hover:underline">
          What happens when you turn the car on
        </Link>
        .
      </p>
    </div>
  )
}
