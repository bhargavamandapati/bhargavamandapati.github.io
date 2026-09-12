'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

const DISMISSED_KEY = 'bm:install-prompt-dismissed'

/** The event Chrome fires instead of showing its own install UI, so a page can offer its own. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * A small, dismissible card offering to install the site as an app.
 *
 * Chrome only fires `beforeinstallprompt` when its own install heuristics are
 * satisfied (already visited more than once, served over HTTPS, has a valid
 * manifest and service worker) — this never appears on a first visit, and
 * never on browsers that don't support installable web apps at all.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === '1')
    } catch {
      setDismissed(false)
    }

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setDeferred(null)

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setDeferred(null)
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Private-browsing/storage-blocked: the prompt just reappears next visit.
    }
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  if (!deferred || dismissed) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-lg sm:inset-x-auto sm:right-4">
      <Download aria-hidden className="size-5 shrink-0 text-accent" />
      <p className="flex-1 text-sm text-fg">Install this site as an app for quicker, offline access.</p>
      <button
        type="button"
        onClick={install}
        className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg transition-colors hover:bg-accent-hover"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-subtle transition-colors hover:text-accent"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  )
}
