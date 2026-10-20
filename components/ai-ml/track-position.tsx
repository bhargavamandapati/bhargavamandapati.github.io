import { aiMlModules } from '@/data/ai-ml-curriculum'
import { cn } from '@/lib/utils'

/**
 * "You are here" for the AI & ML track: the whole track as a numbered map of
 * its modules, with the one this topic belongs to lit up. The AAOS pages show
 * a layer stack; a learning track has no layers, so the honest map is the
 * order of the modules. `at` is a module slug (see data/ai-ml-curriculum.ts);
 * `note` says in one line where the reader is in that module.
 */
export function TrackPosition({ at, note }: { at: string; note?: string }) {
  const current = aiMlModules.find((m) => m.slug === at)
  return (
    <figure className="not-prose my-7">
      <div
        role="img"
        aria-label={`Where this topic sits in the AI and ML track: module ${
          current ? aiMlModules.indexOf(current) + 1 : '?'
        }, ${current?.name ?? 'unknown'}`}
        className="rounded-xl border border-line bg-surface p-4"
      >
        <p className="mb-2.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-subtle">You are here</p>
        <ol className="grid gap-1.5 sm:grid-cols-2">
          {aiMlModules.map((m, i) => {
            const on = m.slug === at
            return (
              <li
                key={m.slug}
                className={cn(
                  'flex items-baseline gap-2 rounded-lg border px-3 py-1.5 text-[0.82rem]',
                  on
                    ? 'border-accent bg-accent-soft font-semibold text-fg'
                    : 'border-line bg-bg-subtle text-muted',
                )}
              >
                <span className="font-mono text-[0.68rem] text-subtle tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  {on && (
                    <span aria-hidden className="mr-1.5 text-accent">
                      ▶
                    </span>
                  )}
                  {m.name}
                </span>
              </li>
            )
          })}
        </ol>
        {note && <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">{note}</p>}
      </div>
    </figure>
  )
}
