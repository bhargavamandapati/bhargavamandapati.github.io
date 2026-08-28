import { BookOpen, Code2, ExternalLink, FileCode2, Search } from 'lucide-react'
import { androidDocs, csFile, csSearch, csSymbol, shortenPath } from '@/lib/aosp'
import type { SourceLink } from '@/lib/learn'
import { cn } from '@/lib/utils'

const linkClass =
  'inline-flex items-baseline gap-1 rounded font-mono text-[0.85em] text-accent underline decoration-accent/35 underline-offset-2 transition-colors hover:decoration-accent'

/**
 * Inline link to a file in AOSP Code Search.
 *
 *   <Src path="packages/services/Car/car-lib/src/android/car/VehiclePropertyIds.java" />
 *   <Src path="..." line={120} label="VehiclePropertyIds" />
 */
export function Src({
  path,
  line,
  label,
  full = false,
}: {
  path: string
  line?: number | [number, number]
  label?: string
  /** Show the whole repo path instead of the elided tail. */
  full?: boolean
}) {
  return (
    <a href={csFile(path, line)} target="_blank" rel="noopener noreferrer" className={linkClass}>
      <FileCode2 aria-hidden className="size-3.5 shrink-0 self-center" />
      {label ?? (full ? path : shortenPath(path))}
      {line !== undefined && (
        <span className="text-subtle">:{Array.isArray(line) ? line.join('-') : line}</span>
      )}
    </a>
  )
}

/** Inline link to Code Search's symbol index — survives file moves. */
export function Sym({ name, label }: { name: string; label?: string }) {
  return (
    <a href={csSymbol(name)} target="_blank" rel="noopener noreferrer" className={linkClass}>
      <Code2 aria-hidden className="size-3.5 shrink-0 self-center" />
      {label ?? name}
    </a>
  )
}

/** Inline free-text Code Search link. */
export function Find({ q, label }: { q: string; label?: string }) {
  return (
    <a href={csSearch(q)} target="_blank" rel="noopener noreferrer" className={linkClass}>
      <Search aria-hidden className="size-3.5 shrink-0 self-center" />
      {label ?? q}
    </a>
  )
}

/** Inline link into source.android.com. */
export function Doc({ p, children }: { p: string; children: React.ReactNode }) {
  return (
    <a
      href={androidDocs(p)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/35 underline-offset-2 hover:decoration-accent"
    >
      {children}
    </a>
  )
}

/** The reference block rendered at the foot of every topic, from frontmatter. */
export function SourceList({ sources, className }: { sources: SourceLink[]; className?: string }) {
  if (sources.length === 0) return null
  return (
    <section className={cn('not-prose mt-14 rounded-xl border border-line bg-surface p-6', className)}>
      <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-fg">
        <BookOpen aria-hidden className="size-4 text-accent" />
        References &amp; further reading
      </h2>
      <ul className="mt-4 space-y-2.5">
        {sources.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-baseline gap-1.5 text-sm text-muted transition-colors hover:text-accent"
            >
              <ExternalLink aria-hidden className="size-3.5 shrink-0 self-center text-subtle group-hover:text-accent" />
              <span className="underline decoration-line underline-offset-2 group-hover:decoration-accent">
                {s.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-line pt-4 font-mono text-[0.7rem] leading-relaxed text-subtle">
        Code links target the <code>main</code> branch on cs.android.com. AOSP moves — if a path
        404s, search the symbol instead.
      </p>
    </section>
  )
}
