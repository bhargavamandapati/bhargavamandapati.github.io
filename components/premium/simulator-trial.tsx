'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Linkedin, Lock } from 'lucide-react'
import { EmailAccessButton } from '@/components/premium/email-access-button'
import { FREE_SIMULATOR_PROPERTIES } from '@/data/access'
import { site } from '@/data/site'
import { useRealmUnlocked } from '@/lib/use-realm-unlocked'

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
  const unlocked = useRealmUnlocked('learn')
  // The hook's default of `false` is the right first-paint value for a small
  // badge elsewhere, but here it would flash the whole trial layout — the
  // banner, 99 extra disabled controls — for a frame before flipping to the
  // real answer. Waiting one tick for a definite state avoids that, at the
  // cost of a brief loading skeleton instead of a wrong one.
  const [known, setKnown] = useState(false)
  useEffect(() => setKnown(true), [])
  if (!known) return <div className="h-[32rem] animate-pulse rounded-xl bg-surface" />

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
