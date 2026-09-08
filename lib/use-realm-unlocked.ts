'use client'

import { useEffect, useState } from 'react'
import { access, type Realm } from '@/data/access'

/**
 * Whether this browser already holds a key for a realm.
 *
 * A lock badge or a disabled row rendered purely from the static free-tier
 * policy is correct for a first-time visitor, but wrong for someone who was
 * just handed a key — every topic in that realm is genuinely reachable for
 * them, not only the handful that are free for everyone. This hook is what
 * lets a sidebar row, a nav badge, a browsable index and the simulator's
 * panel all agree on that, without each reimplementing the same
 * localStorage read.
 *
 * It also listens for the `storage` and `focus` events, so entering a key in
 * one tab — or in the header, which reloads the page it was opened from
 * rather than the one showing this component — updates a still-open tab
 * without the reader having to do anything else.
 */
export function useRealmUnlocked(realm: Realm): boolean {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const read = () => {
      try {
        setUnlocked(Boolean(window.localStorage.getItem(access.storageKey(realm))))
      } catch {
        setUnlocked(false)
      }
    }
    read()
    window.addEventListener('storage', read)
    window.addEventListener('focus', read)
    return () => {
      window.removeEventListener('storage', read)
      window.removeEventListener('focus', read)
    }
  }, [realm])

  return unlocked
}
