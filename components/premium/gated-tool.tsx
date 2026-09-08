'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { access, type Realm } from '@/data/access'

/**
 * Gates an interactive tool rather than a piece of prose.
 *
 * The simulators cannot be handled the way the written topics are. Encrypting
 * rendered HTML works for an article because an article is markup; a Three.js
 * scene is behaviour, and injecting its markup back would produce a picture of
 * a simulator rather than a simulator.
 *
 * So the tool is simply not mounted until a key is present, and it is loaded
 * lazily, which means a locked visitor never downloads its code either. This is
 * a weaker guarantee than the encrypted articles: the chunk is still on the
 * server for anyone who goes looking for it. What it is not is a copy of the
 * writing, which is the thing worth protecting.
 */
export function GatedTool({
  realm,
  children,
  fallback,
}: {
  realm: Realm
  children: ReactNode
  fallback: ReactNode
}) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    const read = () => {
      try {
        setUnlocked(Boolean(window.localStorage.getItem(access.storageKey(realm))))
      } catch {
        setUnlocked(false)
      }
    }
    read()
    // Unlocking happens on another page, so pick the key up on return.
    window.addEventListener('storage', read)
    window.addEventListener('focus', read)
    return () => {
      window.removeEventListener('storage', read)
      window.removeEventListener('focus', read)
    }
  }, [realm])

  // Render nothing until the answer is known, so the server markup and the
  // first client paint agree.
  if (unlocked === null) return null
  return <>{unlocked ? children : fallback}</>
}
