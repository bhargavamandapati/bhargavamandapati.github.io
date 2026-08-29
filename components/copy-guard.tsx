'use client'

import { useEffect, useState } from 'react'

/**
 * Discourages casual copying of the written material.
 *
 * This is a deterrent, not a protection. The pages are public static HTML:
 * view-source, reader mode, disabling JavaScript, or a plain HTTP request all
 * still return the full text, and search engines are served the same markup on
 * purpose. What it stops is someone dragging a paragraph out with a mouse.
 *
 * It is deliberately narrow. Code samples and the vehicle property reference
 * exist to be pasted into an editor, so both stay fully selectable — the
 * property pages are a separate route that never carries the guard attribute,
 * and code blocks are excluded here. Form fields stay usable so the search box
 * still accepts a paste.
 */

/** Marks a region whose prose should not be copied. */
const GUARDED = '[data-copy-guard]'

/** Inside a guarded region, these remain free to select and copy. */
const ALLOWED =
  'pre, code, .code-window, input, textarea, select, [data-copyable], [data-no-tts]'

function elementOf(node: EventTarget | Node | null): Element | null {
  if (node instanceof Element) return node
  if (node instanceof Node) return node.parentElement
  return null
}

/** True when the event happened in guarded prose rather than in code or a field. */
function isGuarded(node: EventTarget | Node | null): boolean {
  const el = elementOf(node)
  if (!el) return false
  if (!el.closest(GUARDED)) return false
  return !el.closest(ALLOWED)
}

export function CopyGuard() {
  const [notice, setNotice] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const explain = () => {
      setNotice(true)
      clearTimeout(timer)
      timer = setTimeout(() => setNotice(false), 2400)
    }

    const onContextMenu = (e: MouseEvent) => {
      if (!isGuarded(e.target)) return
      e.preventDefault()
      explain()
    }

    const onCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)

      // A selection that lies wholly inside a code sample or a form field is
      // fine wherever it is on the page.
      if (elementOf(range.commonAncestorContainer)?.closest(ALLOWED)) return

      // Otherwise block if the selection touches guarded prose at all. Asking
      // whether its common ancestor is guarded is not enough: select-all makes
      // that ancestor <body>, which sits above the guard and sailed through.
      const reaches = Array.from(document.querySelectorAll(GUARDED)).some((region) =>
        range.intersectsNode(region),
      )
      if (!reaches) return
      e.preventDefault()
      explain()
    }

    const onDragStart = (e: DragEvent) => {
      if (!isGuarded(e.target)) return
      e.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('copy', onCopy)
    document.addEventListener('cut', onCopy)
    document.addEventListener('dragstart', onDragStart)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('cut', onCopy)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  // Silently doing nothing reads as a broken page, so say what happened.
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        notice
          ? 'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line bg-surface px-4 py-2 text-xs text-fg shadow-lg transition-opacity duration-200'
          : 'sr-only'
      }
    >
      {notice ? 'This text is not available for copying. Code samples and the property reference are.' : ''}
    </div>
  )
}
