import { Lightbulb, MessageSquareQuote, Route, Sparkles } from 'lucide-react'

/**
 * "In plain terms" — a jargon-free restatement, placed immediately after a
 * technical paragraph so a reader who did not follow it gets a second chance.
 */
export function Plain({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="not-prose my-7 overflow-hidden rounded-xl border border-sky-600/40 bg-sky-500/[0.06] dark:border-sky-400/30">
      <p className="flex items-center gap-2 border-b border-sky-600/25 px-4 py-2.5 font-display text-[0.82rem] font-semibold text-sky-800 dark:border-sky-400/20 dark:text-sky-300">
        <Sparkles aria-hidden className="size-4" />
        {title ?? 'In plain terms'}
      </p>
      <div className="prose-bm px-4 py-3.5 text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}

/** An everyday comparison. Use where the abstraction is genuinely unfamiliar. */
export function Analogy({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="not-prose my-7 overflow-hidden rounded-xl border border-violet-600/40 bg-violet-500/[0.06] dark:border-violet-400/30">
      <p className="flex items-center gap-2 border-b border-violet-600/25 px-4 py-2.5 font-display text-[0.82rem] font-semibold text-violet-800 dark:border-violet-400/20 dark:text-violet-300">
        <MessageSquareQuote aria-hidden className="size-4" />
        {title ?? 'A way to picture it'}
      </p>
      <div className="prose-bm px-4 py-3.5 text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}

/**
 * A concrete situation from a real programme. Abstract rules become memorable
 * when they are attached to a Tuesday afternoon and a specific bug.
 */
export function Scenario({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="not-prose my-8 overflow-hidden rounded-xl border border-line bg-surface-2">
      <p className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-display text-[0.82rem] font-semibold text-fg">
        <Route aria-hidden className="size-4 text-accent" />
        {title ?? 'On a real programme'}
      </p>
      <div className="prose-bm px-4 py-4 text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}

/** The three or four things worth remembering, at the end of a long section. */
export function Recap({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="not-prose my-8 rounded-xl border border-accent/45 bg-accent-soft p-5">
      <p className="flex items-center gap-2 font-display text-[0.82rem] font-semibold text-fg">
        <Lightbulb aria-hidden className="size-4 text-accent" />
        {title ?? 'What to remember'}
      </p>
      <div className="prose-bm mt-3 text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
