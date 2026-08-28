'use client'

import { useEffect, useState } from 'react'
import type { Heading } from '@/lib/blog'
import { cn } from '@/lib/utils'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the heading nearest the top of the reading area.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: [0, 1] }
    )

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => n !== null)
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">On this page</p>
      <ul className="mt-4 space-y-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l py-1.5 leading-snug transition-colors',
                h.level === 3 ? 'pl-7 text-[0.82rem]' : 'pl-4',
                activeId === h.id
                  ? 'border-accent font-medium text-accent'
                  : 'border-transparent text-muted hover:border-line-strong hover:text-fg'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
