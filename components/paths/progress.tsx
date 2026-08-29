'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * Which topics the reader has marked as read.
 *
 * Kept in localStorage and nowhere else: it is a convenience for one person on
 * one browser, it never leaves the device, and the site works identically if
 * storage is unavailable or cleared.
 */

const KEY = 'bm:read-topics'

type Ctx = {
  read: Set<string>
  ready: boolean
  toggle: (href: string) => void
  isRead: (href: string) => boolean
  clear: () => void
}

const ProgressContext = createContext<Ctx | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [read, setRead] = useState<Set<string>>(new Set())
  // Nothing renders progress until the stored value has been read, so the
  // server-rendered markup and the first client paint agree.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setRead(new Set(JSON.parse(raw) as string[]))
    } catch {
      /* storage blocked or corrupt — start empty */
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: Set<string>) => {
    setRead(next)
    try {
      window.localStorage.setItem(KEY, JSON.stringify([...next]))
    } catch {
      /* storage blocked — the choice still applies for this session */
    }
  }, [])

  const toggle = useCallback(
    (href: string) => {
      setRead((current) => {
        const next = new Set(current)
        if (next.has(href)) next.delete(href)
        else next.add(href)
        try {
          window.localStorage.setItem(KEY, JSON.stringify([...next]))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [],
  )

  const clear = useCallback(() => persist(new Set()), [persist])

  return (
    <ProgressContext.Provider
      value={{ read, ready, toggle, isRead: (href) => read.has(href), clear }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressContext)
  if (ctx) return ctx
  return { read: new Set(), ready: false, toggle: () => undefined, isRead: () => false, clear: () => undefined }
}
