'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { KeyRound, Linkedin, Loader2, Lock, LockOpen } from 'lucide-react'
import { REALM_LABEL, access, type Realm } from '@/data/access'
import { site } from '@/data/site'
import { decryptPayload, isWrongKeyError, type Payload } from '@/lib/premium-decrypt'
import { EmailAccessButton } from '@/components/premium/email-access-button'
import { cn } from '@/lib/utils'

/**
 * The header's global unlock control.
 *
 * A key was previously only enterable from the gate on a locked topic itself
 * — someone handed a key had to go find something locked before they could use
 * it. This puts the same form, for both tracks, in the header, reachable from
 * any page including one with nothing locked on it at all.
 *
 * Unlocking here has no article to put back in place, so it validates the
 * candidate against a small per-realm token (the same one the tool gates use)
 * and reloads the page. That is not a shortcut taken for convenience — a
 * reload is the one response every gated surface on the site already knows
 * how to handle correctly, because each one reads its stored key on mount.
 * Anything cleverer here would need to be taught to every one of them.
 */

const REALMS: Realm[] = ['learn', 'sdv']

function RealmRow({ realm }: { realm: Realm }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'working' | 'wrong' | 'error'>('idle')
  const fieldId = useId()

  useEffect(() => {
    try {
      setUnlocked(Boolean(window.localStorage.getItem(access.storageKey(realm))))
    } catch {
      setUnlocked(false)
    }
  }, [realm])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const candidate = value.trim()
    if (!candidate) return
    setStatus('working')
    try {
      const response = await fetch(`${access.payloadPath}/_validator-${realm}.json`)
      if (!response.ok) throw new Error(String(response.status))
      const payload: Payload = await response.json()
      await decryptPayload(payload, candidate)
      window.localStorage.setItem(access.storageKey(realm), candidate)
      window.location.reload()
    } catch (error) {
      setStatus(isWrongKeyError(error) ? 'wrong' : 'error')
    }
  }

  const forget = () => {
    try {
      window.localStorage.removeItem(access.storageKey(realm))
    } catch {
      /* nothing to remove */
    }
    window.location.reload()
  }

  if (unlocked === null) return <div className="h-9 animate-pulse rounded-lg bg-surface-2" />

  if (unlocked) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2">
        <span className="inline-flex items-center gap-2 text-sm text-fg">
          <LockOpen aria-hidden className="size-3.5 text-accent" />
          {REALM_LABEL[realm]}
        </span>
        <button
          type="button"
          onClick={forget}
          className="cursor-pointer font-mono text-[0.68rem] text-subtle underline-offset-2 transition-colors hover:text-fg hover:underline"
        >
          Forget
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor={fieldId} className="block text-xs font-medium text-fg">
        {REALM_LABEL[realm]}
      </label>
      <div className="mt-1.5 flex gap-1.5">
        <input
          id={fieldId}
          type="password"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setStatus('idle')
          }}
          placeholder="Access key"
          className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
        />
        <button
          type="submit"
          disabled={status === 'working' || !value.trim()}
          aria-label={`Unlock ${REALM_LABEL[realm]}`}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line px-2.5 py-1.5 text-sm transition-colors hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'working' ? (
            <Loader2 aria-hidden className="size-3.5 animate-spin" />
          ) : (
            <KeyRound aria-hidden className="size-3.5" />
          )}
        </button>
      </div>
      <p aria-live="polite" className="mt-1 min-h-4 text-xs text-muted">
        {status === 'wrong' && 'That key did not work.'}
        {status === 'error' && 'Could not check that key — try again.'}
      </p>
    </form>
  )
}

export function AccessMenu() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  /**
   * Positioned with fixed coordinates clamped to the viewport — the same
   * technique the inline glossary popover uses. The header can put this
   * trigger anywhere among its icons, closer to the right edge than the left,
   * so a plain CSS `right-0` anchor is not reliable: the panel is wider than
   * the gap between the trigger and the edge it would extend toward.
   */
  const reposition = useCallback(() => {
    if (!triggerRef.current || !panelRef.current) return
    const trigger = triggerRef.current.getBoundingClientRect()
    const panel = panelRef.current.getBoundingClientRect()
    const margin = 12
    const left = Math.min(
      Math.max(margin, trigger.right - panel.width),
      Math.max(margin, window.innerWidth - panel.width - margin),
    )
    setPos({ top: trigger.bottom + 8, left })
  }, [])

  useLayoutEffect(() => {
    if (open) reposition()
  }, [open, reposition])

  useEffect(() => {
    if (!open) return
    const inPanel = (node: Node) =>
      wrapRef.current?.contains(node) || panelRef.current?.contains(node)
    const onPointerDown = (e: PointerEvent) => {
      if (!inPanel(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    const onFocusIn = (e: FocusEvent) => {
      if (!inPanel(e.target as Node)) setOpen(false)
    }
    window.addEventListener('resize', reposition)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      window.removeEventListener('resize', reposition)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open, reposition])

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Access key"
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-muted transition-colors hover:text-fg',
          open && 'text-fg',
        )}
      >
        <KeyRound aria-hidden className="size-[18px]" />
        <span className="hidden font-mono text-[0.68rem] text-subtle lg:inline">Access</span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        style={pos ? { top: pos.top, left: pos.left } : undefined}
        className="fixed z-50 w-[19rem] max-w-[calc(100vw-1.5rem)]"
      >
        <div className="card overflow-hidden shadow-xl">
          <div className="border-b border-line bg-surface-2 px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-fg">
              <Lock aria-hidden className="size-3.5 text-accent" />
              Access key
            </p>
          </div>

          <div className="space-y-3 p-4">
            {REALMS.map((realm) => (
              <RealmRow key={realm} realm={realm} />
            ))}
          </div>

          <div className="border-t border-line p-4">
            <p className="text-xs leading-relaxed text-muted">Don&rsquo;t have a key?</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg transition-opacity hover:opacity-90"
              >
                <Linkedin aria-hidden className="size-3.5" />
                LinkedIn
              </a>
              <EmailAccessButton subject="Access request" label="Email" className="px-3 py-1.5 text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
