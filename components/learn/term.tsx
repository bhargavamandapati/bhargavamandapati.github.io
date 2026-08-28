'use client'

import Link from 'next/link'
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { lookupTerm } from '@/data/glossary'
import { slugify } from '@/lib/utils'

/**
 * Inline glossary term: `<T>VHAL</T>`.
 *
 * Shows a plain-English definition on hover, on keyboard focus, and on click.
 * If the word is not in the glossary it renders as ordinary text, so wrapping
 * something in <T> can never break a page.
 */
export function T({ children, id }: { children: React.ReactNode; id?: string }) {
  const label = typeof children === 'string' ? children : String(children ?? '')
  const entry = lookupTerm(id ?? label)

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const popRef = useRef<HTMLSpanElement>(null)
  const popoverId = useId()

  /**
   * Position with `fixed` coordinates clamped to the viewport.
   *
   * An absolutely positioned popover near the right edge either overflows the
   * page or gets clipped by an ancestor. Fixed positioning takes it out of flow
   * entirely — it can never widen the page — and clamping keeps it on screen at
   * any width, including 320px.
   */
  useLayoutEffect(() => {
    if (!open || !popRef.current || !wrapRef.current) return
    const trigger = wrapRef.current.getBoundingClientRect()
    const pop = popRef.current.getBoundingClientRect()
    const M = 12 // viewport margin

    const left = Math.min(
      Math.max(M, trigger.left),
      Math.max(M, window.innerWidth - pop.width - M)
    )
    // Flip above the term if there is no room below.
    const below = trigger.bottom + 10
    const fitsBelow = below + pop.height < window.innerHeight - M
    const top = fitsBelow ? below : Math.max(M, trigger.top - pop.height - 10)

    setPos({ top, left })
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  useLayoutEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close()
    }
    // Fixed coordinates go stale as soon as the page scrolls.
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onDocClick)
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onDocClick)
      window.removeEventListener('scroll', close)
      window.removeEventListener('resize', close)
    }
  }, [open, close])

  if (!entry) return <>{children}</>

  return (
    <span
      ref={wrapRef}
      className="term-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="term-trigger"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) close()
        }}
      >
        {children}
      </button>

      {/* Rendered only while open, so a closed popover never contributes to
          page width — an off-screen absolutely positioned element would
          otherwise create horizontal overflow. */}
      {open && (
        <span
          ref={popRef}
          id={popoverId}
          role="tooltip"
          className="term-popover"
          style={
            pos
              ? { top: pos.top, left: pos.left }
              : // Measured on the first paint; keep it invisible until then.
                { top: 0, left: 0, visibility: 'hidden' }
          }
        >
          <span className="term-popover__name">{entry.term}</span>
          <span className="term-popover__short">{entry.short}</span>
          {entry.analogy && <span className="term-popover__analogy">{entry.analogy}</span>}
          <Link href={`/glossary/#${slugify(entry.term)}`} className="term-popover__link">
            Full definition →
          </Link>
        </span>
      )}
    </span>
  )
}
