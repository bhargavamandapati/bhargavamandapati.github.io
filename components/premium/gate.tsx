'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Copy, KeyRound, Linkedin, Loader2, Lock } from 'lucide-react'
import { REALM_LABEL, access, type Realm } from '@/data/access'
import { site } from '@/data/site'
import { EmailAccessButton } from '@/components/premium/email-access-button'
import { decryptPayload, isWrongKeyError, type Payload } from '@/lib/premium-decrypt'

/**
 * The lock on a premium topic, and the machinery that lifts it.
 *
 * The article body is not in the page: the build encrypts it after export and
 * ships the ciphertext separately, so there is nothing to reveal by editing the
 * DOM or reading the source. This component fetches that payload, derives a key
 * from the reader's passphrase, and puts the prose back where it belongs.
 *
 * Failure has to be honest. AES-GCM authenticates, so a wrong passphrase throws
 * rather than producing plausible nonsense — which is what lets the wrong-key
 * message be a statement rather than a guess.
 */

/**
 * Restores the copy buttons inside decrypted content.
 *
 * The prose comes back as markup, so anything that was a React control arrives
 * inert. The copy button is the one that matters — a code sample you cannot
 * take is half a code sample — and it is a few lines of delegation rather than
 * a reason to leave the content unlocked.
 */
function rewireCopyButtons(root: HTMLElement) {
  for (const button of root.querySelectorAll<HTMLButtonElement>('.code-window__copy')) {
    if (button.dataset.wired) continue
    button.dataset.wired = 'true'
    button.addEventListener('click', () => {
      const code = button.closest('.code-window')?.querySelector('pre')?.textContent ?? ''
      void navigator.clipboard.writeText(code).then(() => {
        const label = button.querySelector('span')
        if (!label) return
        const original = label.textContent
        label.textContent = 'Copied'
        setTimeout(() => {
          label.textContent = original
        }, 1600)
      })
    })
  }
}

export function PremiumGate({
  contentId,
  title,
  realm,
  /**
   * 'content' decrypts an article back into the page. 'key-only' is for the
   * simulators, which have no markup to restore: the key is checked against a
   * small token and the page is reloaded so the tool mounts.
   */
  mode = 'content',
}: {
  contentId: string
  title: string
  realm: Realm
  mode?: 'content' | 'key-only'
}) {
  const [status, setStatus] = useState<'locked' | 'working' | 'unlocked' | 'wrong' | 'error'>(
    'locked',
  )
  const [passphrase, setPassphrase] = useState('')
  const [copied, setCopied] = useState(false)
  const attempted = useRef(false)
  const fieldId = useId()

  const unlock = useCallback(
    async (candidate: string, { remember }: { remember: boolean }) => {
      // The wrapper, not the article: replacing the article would take the
      // audio player with it.
      const target = document.querySelector<HTMLElement>('[data-premium-body]')
      if (mode === 'content' && !target) return
      setStatus('working')
      try {
        const source = mode === 'content' ? contentId : `_validator-${realm}`
        const response = await fetch(`${access.payloadPath}/${source}.json`)
        if (!response.ok) throw new Error(`payload ${response.status}`)
        const payload: Payload = await response.json()
        const html = await decryptPayload(payload, candidate)
        if (mode === 'content' && target) {
          target.innerHTML = html
          target.removeAttribute('data-premium')
          rewireCopyButtons(target)
        }
        if (remember) {
          try {
            window.localStorage.setItem(access.storageKey(realm), candidate)
          } catch {
            /* storage blocked — unlocked for this page view only */
          }
        }
        setStatus('unlocked')
        // The tool is mounted by a component that reads the key on load.
        if (mode === 'key-only') window.location.reload()
      } catch (error) {
        // A decrypt failure means the key is wrong; anything else is the fetch.
        setStatus(isWrongKeyError(error) ? 'wrong' : 'error')
      }
    },
    [contentId, mode, realm],
  )

  // A reader who has already been given a key should never see the lock again.
  useEffect(() => {
    if (attempted.current) return
    attempted.current = true
    let saved: string | null = null
    try {
      saved = window.localStorage.getItem(access.storageKey(realm))
    } catch {
      /* storage blocked */
    }
    if (saved) void unlock(saved, { remember: false })
  }, [unlock, realm])

  if (status === 'unlocked') return null

  const busy = status === 'working'

  return (
    <section
      aria-label="This topic requires access"
      data-no-tts
      className="not-prose card mt-8 overflow-hidden"
    >
      <div className="border-b border-line bg-surface-2 px-5 py-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-fg">
          <Lock aria-hidden className="size-4 text-accent" />
          {REALM_LABEL[realm]} — access required
        </p>
      </div>

      <div className="px-5 py-5">
        <p className="text-sm leading-relaxed text-muted">
          <span className="text-fg">{title}</span> is part of{' '}
          <span className="text-fg">{REALM_LABEL[realm]}</span>. {access.freeCount} topics across
          the site are open to read first, so you can judge the rest before asking. Learn AAOS
          and the SDV track have separate keys.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            <Linkedin aria-hidden className="size-4" />
            Request access on LinkedIn
          </a>
          <EmailAccessButton subject={`Access request — ${title}`} />
          <Link
            href="/learn/start/"
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Read the {access.freeCount} open topics
          </Link>
        </div>

        <form
          className="mt-6 border-t border-line pt-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (passphrase.trim()) void unlock(passphrase.trim(), { remember: true })
          }}
        >
          <label
            htmlFor={fieldId}
            className="block font-mono text-[0.7rem] uppercase tracking-wider text-subtle"
          >
            Already have a key?
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              id={fieldId}
              type="password"
              autoComplete="off"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Access key"
              className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <button
              type="submit"
              disabled={busy || !passphrase.trim()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm transition-colors hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <KeyRound aria-hidden className="size-4" />
              )}
              Unlock
            </button>
          </div>

          <p aria-live="polite" className="mt-2 min-h-5 text-xs text-muted">
            {status === 'wrong' && 'That key did not work. Check for a stray space, or ask again.'}
            {status === 'error' && 'The content could not be fetched. Check your connection and retry.'}
            {status === 'locked' && 'Unlocks every topic on this device, and is remembered here.'}
          </p>
        </form>

        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(window.location.href).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1600)
            })
          }}
          className="mt-2 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[0.7rem] text-subtle transition-colors hover:text-accent"
        >
          {copied ? <Check aria-hidden className="size-3" /> : <Copy aria-hidden className="size-3" />}
          {copied ? 'Link copied' : 'Copy this page link to mention when you ask'}
        </button>
      </div>
    </section>
  )
}
