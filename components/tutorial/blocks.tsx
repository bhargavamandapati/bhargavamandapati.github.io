import { CircleCheck, FolderTree, TriangleAlert } from 'lucide-react'

/**
 * "Prove it worked before moving on." Every step that changes the build should
 * end with one of these, so a reader never carries a silent failure forward.
 */
export function Verify({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="not-prose my-7 overflow-hidden rounded-xl border border-emerald-600/40 bg-emerald-500/[0.06] dark:border-emerald-400/30">
      <p className="flex items-center gap-2 border-b border-emerald-600/25 px-4 py-2.5 font-display text-[0.82rem] font-semibold text-emerald-800 dark:border-emerald-400/20 dark:text-emerald-300">
        <CircleCheck aria-hidden className="size-4" />
        {title ?? 'Verify'}
      </p>
      <div className="prose-bm px-4 py-3 text-[0.92rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

/** A gotcha that will cost an hour if it is not called out at this exact point. */
export function Gotcha({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="not-prose my-7 overflow-hidden rounded-xl border border-amber-600/45 bg-amber-500/[0.07] dark:border-amber-400/30">
      <p className="flex items-center gap-2 border-b border-amber-600/25 px-4 py-2.5 font-display text-[0.82rem] font-semibold text-amber-800 dark:border-amber-400/20 dark:text-amber-300">
        <TriangleAlert aria-hidden className="size-4" />
        {title ?? 'Gotcha'}
      </p>
      <div className="prose-bm px-4 py-3 text-[0.92rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

/** The files this tutorial creates, shown as a plain tree. */
export function FileTree({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <figure className="not-prose my-7 overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5 font-mono text-[0.72rem] text-muted">
        <FolderTree aria-hidden className="size-3.5 text-accent" />
        {title ?? 'Files you will create'}
      </figcaption>
      <pre
        tabIndex={0}
        className="overflow-x-auto px-4 py-3.5 font-mono text-[0.8rem] leading-relaxed text-muted"
      >
        {children}
      </pre>
    </figure>
  )
}
