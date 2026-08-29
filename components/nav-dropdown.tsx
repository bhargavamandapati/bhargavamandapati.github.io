'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { NavChild } from '@/data/site'
import { cn } from '@/lib/utils'

/**
 * A disclosure, not a `role="menu"` widget.
 *
 * These are ordinary navigation links, so the simpler disclosure pattern is the
 * correct one — a menu role would promise arrow-key semantics that do not match
 * how people use a site nav, and screen readers announce links more usefully
 * than menuitems here.
 */
export function NavDropdown({
  label,
  items,
  active,
  isActive,
}: {
  label: string
  items: readonly NavChild[]
  /** True when any child route is the current page. */
  active: boolean
  isActive: (href: string) => boolean
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    // Tabbing past the last item should close the panel behind you.
    const onFocusIn = (e: FocusEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // Hover is a convenience on top of click, never the only way in.
  const hoverOpen = () => {
    clearTimeout(closeTimer.current)
    if (window.matchMedia('(hover: hover)').matches) setOpen(true)
  }
  const hoverClose = () => {
    if (!window.matchMedia('(hover: hover)').matches) return
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={hoverOpen}
      onMouseLeave={hoverClose}
    >
      <button
        ref={triggerRef}
        type="button"
        // On a hover device the pointer has already opened the panel by the
        // time the click lands, so toggling here would snap it shut under the
        // cursor. There, click only ever opens; Escape and mouse-leave close.
        onClick={() =>
          setOpen((v) => (window.matchMedia('(hover: hover)').matches ? true : !v))
        }
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          active || open ? 'text-accent' : 'text-muted hover:text-fg',
        )}
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-50 w-[19rem] pt-2"
      >
        <ul className="card overflow-hidden p-1.5 shadow-xl">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded-lg px-3 py-2.5 transition-colors hover:bg-bg-subtle',
                  isActive(item.href) ? 'bg-bg-subtle' : '',
                )}
              >
                <span
                  className={cn(
                    'block text-sm font-medium',
                    isActive(item.href) ? 'text-accent' : 'text-fg',
                  )}
                >
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
