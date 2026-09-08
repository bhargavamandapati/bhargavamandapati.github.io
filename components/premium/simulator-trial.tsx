'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Linkedin, Lock } from 'lucide-react'
import { EmailAccessButton } from '@/components/premium/email-access-button'
import { FREE_SIMULATOR_PROPERTIES, access } from '@/data/access'
import { site } from '@/data/site'

const CarSimulator = dynamic(
  () => import('@/components/simulator/car-simulator').then((m) => m.CarSimulator),
  { ssr: false, loading: () => <div className="h-[32rem] animate-pulse rounded-xl bg-surface" /> },
)

/**
 * The simulator, running for everyone, with most controls inert.
 *
 * Hiding it entirely was the wrong trade. A simulator nobody can touch
 * demonstrates nothing, and the thing being sold here is precisely that
 * changing a property does something visible. So the car drives, the gear
 * changes and the HVAC turns on; the rest of the panel is visible but locked,
 * which is a far better argument than a padlock over the whole page.
 */
export function SimulatorTrial() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    const read = () => {
      try {
        setUnlocked(Boolean(window.localStorage.getItem(access.storageKey('learn'))))
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
  }, [])

  // Wait until the answer is known, so the first paint is not wrong.
  if (unlocked === null) return <div className="h-[32rem] animate-pulse rounded-xl bg-surface" />

  return (
    <>
      {!unlocked && (
        <div className="card mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Lock aria-hidden className="size-4 shrink-0 text-accent" />
            <span>
              <span className="text-fg">Trial mode.</span> Speed, gear, battery and HVAC power are
              live — {FREE_SIMULATOR_PROPERTIES.length} of the panel&rsquo;s properties. The rest
              are shown but not operable.
            </span>
          </p>
          {/* No shrink-0 here: with it, this wrapper held its full content width
              even once ml-auto pushed it onto its own line at 320px, which
              overflowed the page instead of letting its two buttons wrap. */}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              <Linkedin aria-hidden className="size-4" />
              Request access
            </a>
            <EmailAccessButton subject="Access request — Property simulator" />
          </div>
        </div>
      )}
      <CarSimulator unlocked={unlocked} />
    </>
  )
}
