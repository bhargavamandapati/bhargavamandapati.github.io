import { BookMarked, Brain, CircleHelp, LifeBuoy, Map as MapIcon, MessageSquareText, NotebookPen, Target, Telescope, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
 * The reusable parts of the rewritten page anatomy (docs/content-standards.md
 * in the private content repo): orientation at the top, signposts through the
 * middle, and revision at the end. They are plain server components so they
 * render the same whether the page is open or encrypted-then-unlocked.
 */

const body = 'prose-bm text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0'

function Panel({
  icon: Icon,
  title,
  children,
  tone = 'accent',
  className,
}: {
  icon: typeof Zap
  title: string
  children: React.ReactNode
  tone?: 'accent' | 'neutral'
  className?: string
}) {
  return (
    <aside
      className={cn(
        'not-prose my-7 overflow-hidden rounded-xl border',
        tone === 'accent' ? 'border-accent/45 bg-accent-soft' : 'border-line bg-surface-2',
        className
      )}
    >
      <p className="flex items-center gap-2 border-b border-line/70 px-4 py-2.5 font-display text-[0.82rem] font-semibold text-fg">
        <Icon aria-hidden className="size-4 text-accent" />
        {title}
      </p>
      <div className={cn(body, 'px-4 py-3.5')}>{children}</div>
    </aside>
  )
}

/** Terms taught before the page uses them. Children: bold term, dash, one-line meaning. */
export function KeyTerms({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Panel icon={BookMarked} title={title ?? 'Key terms, before you start'} tone="neutral">
      {children}
    </Panel>
  )
}

/** The sections of the page in one line each, so the reader always knows where they are. */
export function PageMap({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Panel icon={MapIcon} title={title ?? 'The map of this page'} tone="neutral">
      {children}
    </Panel>
  )
}

/** One line that closes a section: the single thing to carry forward. */
export function InShort({ children }: { children: React.ReactNode }) {
  return (
    <p className="not-prose my-5 flex items-start gap-2.5 rounded-lg border-l-[3px] border-accent bg-accent-soft px-3.5 py-2.5 text-[0.95rem] leading-relaxed text-fg">
      <Zap aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
      <span>
        <strong className="font-display font-semibold">In short: </strong>
        {children}
      </span>
    </p>
  )
}

/** The whole page on one screen. Bullets, a key-terms line and the single picture to remember. */
export function RevisionCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Panel icon={NotebookPen} title={title ?? 'Revision card — the whole page on one screen'} className="border-2">
      {children}
    </Panel>
  )
}

/** Questions with hidden answers. Native details elements: no script, keyboard friendly. */
export function SelfTest({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Panel icon={CircleHelp} title={title ?? 'Test yourself — answer first, then open the answer'} tone="neutral">
      <div className="space-y-2">{children}</div>
    </Panel>
  )
}

export function Q({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-lg border border-line bg-surface px-3.5 py-2.5">
      <summary className="cursor-pointer list-none font-medium text-fg marker:hidden [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="mr-2 inline-block text-accent transition-transform group-open:rotate-90">
          ›
        </span>
        {question}
      </summary>
      <div className={cn(body, 'mt-2 border-t border-line pt-2.5')}>{children}</div>
    </details>
  )
}

/** A prompt to say it back in your own words — the strongest memory aid on the page. */
export function ExplainBack({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Panel icon={MessageSquareText} title={title ?? 'Explain it back'}>
      {children}
    </Panel>
  )
}

/** The analogy and the one picture to remember, repeated once more at the very end. */
export function MemoryHooks({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Panel icon={Brain} title={title ?? 'Hooks to remember it by'}>
      {children}
    </Panel>
  )
}

/**
 * Advanced detail kept out of the main flow: traces, internals, long flag
 * lists. Collapsed by default so a first read stays simple; open it when you
 * want the detail.
 */
export function GoDeeper({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <details className="group not-prose my-6 rounded-xl border border-line bg-surface-2">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-display text-[0.85rem] font-semibold text-fg marker:hidden [&::-webkit-details-marker]:hidden">
        <Telescope aria-hidden className="size-4 text-accent" />
        {title ?? 'Go deeper (optional)'}
        <span aria-hidden className="ml-auto text-subtle transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className={cn(body, 'border-t border-line px-4 py-3.5')}>{children}</div>
    </details>
  )
}

/** Tutorial step header: what this step achieves and why it is needed. */
export function StepGoal({ goal, children }: { goal: string; children: React.ReactNode }) {
  return (
    <aside className="not-prose my-5 rounded-lg border border-accent/40 bg-accent-soft px-4 py-3">
      <p className="flex items-start gap-2 font-display text-[0.9rem] font-semibold text-fg">
        <Target aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
        <span>
          Goal: <span className="font-normal">{goal}</span>
        </span>
      </p>
      <div className={cn(body, 'mt-2 pl-6 text-[0.9rem] text-muted')}>{children}</div>
    </aside>
  )
}

/** Tutorial step footer: the recovery path if the expected result did not appear. */
export function IfNot({ children }: { children: React.ReactNode }) {
  return (
    <p className="not-prose my-5 flex items-start gap-2.5 rounded-lg border border-amber-600/40 bg-amber-500/[0.07] px-3.5 py-2.5 text-[0.92rem] leading-relaxed dark:border-amber-400/30">
      <LifeBuoy aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
      <span>
        <strong className="font-display font-semibold">If it did not work: </strong>
        {children}
      </span>
    </p>
  )
}

/* ------------------------------------------------------------ you are here -- */

const LAYERS = [
  { id: 'apps', label: 'Apps', hint: 'media, navigation, third-party' },
  { id: 'car-apps', label: 'Car apps and system UI', hint: 'launcher, settings, system bars' },
  { id: 'car-service', label: 'Car Service and android.car', hint: 'car APIs for apps' },
  { id: 'framework', label: 'Android framework', hint: 'system_server, activity and window management' },
  { id: 'hal', label: 'Vehicle HAL and other HALs', hint: 'the stable boundary to the hardware' },
  { id: 'kernel', label: 'Kernel and drivers', hint: 'Linux, device drivers' },
  { id: 'vehicle', label: 'Vehicle network and ECUs', hint: 'CAN, Ethernet, the rest of the car' },
] as const

/**
 * A mini-map of the AAOS stack with the layer(s) this topic lives in lit up.
 * `at` is a comma-separated list of layer ids (apps, car-apps, car-service,
 * framework, hal, kernel, vehicle) because MDX attribute arrays would need
 * braces. An unknown id renders nothing highlighted rather than failing.
 */
export function YouAreHere({ at, note }: { at: string; note?: string }) {
  const lit = new Set(at.split(',').map((s) => s.trim()))
  return (
    <figure className="not-prose my-7">
      <div
        role="img"
        aria-label={`Where this topic sits in the AAOS stack: ${
          LAYERS.filter((l) => lit.has(l.id))
            .map((l) => l.label)
            .join(', ') || 'across the whole stack'
        }`}
        className="rounded-xl border border-line bg-surface p-4"
      >
        <p className="mb-2.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-subtle">You are here</p>
        <ol className="space-y-1.5">
          {LAYERS.map((l) => {
            const on = lit.has(l.id)
            return (
              <li
                key={l.id}
                className={cn(
                  'flex items-baseline justify-between gap-3 rounded-lg border px-3 py-1.5 text-[0.85rem]',
                  on
                    ? 'border-accent bg-accent-soft font-semibold text-fg'
                    : 'border-line bg-bg-subtle text-muted'
                )}
              >
                <span>
                  {on && (
                    <span aria-hidden className="mr-1.5 text-accent">
                      ▶
                    </span>
                  )}
                  {l.label}
                </span>
                <span className="hidden font-mono text-[0.68rem] font-normal text-subtle sm:inline">{l.hint}</span>
              </li>
            )
          })}
        </ol>
      </div>
      {note && <figcaption className="mt-2 text-sm leading-relaxed text-muted">{note}</figcaption>}
    </figure>
  )
}
