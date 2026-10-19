'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { KeyRound, Loader2, Lock } from 'lucide-react'
import { REALM_LABEL, access, type Realm } from '@/data/access'
import { RequestAccessButton } from '@/components/premium/request-access'
import { decryptPayload, isWrongKeyError, type Payload } from '@/lib/premium-decrypt'
import { getSavedEmail, requestRealmKey, saveEmail, UnlockError } from '@/lib/access-client'
import { CODE_LANGUAGE_STORAGE_KEY, type CodeLanguage } from '@/components/properties/code-sample'

/**
 * The lock on a premium topic, and the machinery that lifts it.
 *
 * The article body is not in the page: the build encrypts it after export and
 * ships the ciphertext separately, so there is nothing to reveal by editing the
 * DOM or reading the source. A reader's email+code is exchanged, through the
 * access-worker, for the realm's current content key; this component fetches
 * the payload, decrypts it with that key, and puts the prose back where it
 * belongs.
 *
 * The key itself — not the email/code — is what gets cached in this browser,
 * exactly as a single shared passphrase used to be. That is what makes
 * monthly revocation work without this component doing anything special: the
 * realm's key rotates server-side once a month, the cached one silently stops
 * decrypting anything newly built, and the reader is back here to re-enter
 * their code — which only succeeds if it is still active.
 *
 * Failure has to be honest. AES-GCM authenticates, so a wrong key throws
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

/**
 * Restores the Java/Kotlin switch inside decrypted content.
 *
 * A `<pre>` that was switchable carries both variants as data attributes
 * (see components/properties/code-sample.tsx) precisely so this has something
 * to switch to — the SSR pass that produced this markup only ever ran with
 * Java selected, so Kotlin's text would otherwise never have shipped at all.
 */
function rewireLanguageToggles(root: HTMLElement) {
  const blocks = root.querySelectorAll<HTMLPreElement>('pre[data-java-code]')
  if (blocks.length === 0) return

  const apply = (language: CodeLanguage) => {
    for (const pre of blocks) {
      const code = pre.querySelector('code')
      const text = language === 'kotlin' ? pre.dataset.kotlinCode : pre.dataset.javaCode
      if (code && text !== undefined) code.textContent = text
    }
    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-lang-btn]')) {
      button.setAttribute('aria-pressed', String(button.dataset.langBtn === language))
    }
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-lang-btn]')) {
    if (button.dataset.wired) continue
    button.dataset.wired = 'true'
    button.addEventListener('click', () => {
      const language = button.dataset.langBtn as CodeLanguage
      try {
        window.localStorage.setItem(CODE_LANGUAGE_STORAGE_KEY, language)
      } catch {
        /* storage blocked — the choice still applies for this page view */
      }
      apply(language)
    })
  }

  // A reader who already picked Kotlin elsewhere on the site should not see
  // this freshly-unlocked block quietly reset to Java.
  let saved: string | null = null
  try {
    saved = window.localStorage.getItem(CODE_LANGUAGE_STORAGE_KEY)
  } catch {
    /* storage blocked — Java, the default the markup already shows, is fine */
  }
  if (saved === 'kotlin') apply('kotlin')
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
  const [status, setStatus] = useState<
    'locked' | 'working' | 'unlocked' | 'wrong' | 'rate-limited' | 'error'
  >('locked')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const attempted = useRef(false)
  const emailFieldId = useId()
  const codeFieldId = useId()

  useEffect(() => {
    setEmail(getSavedEmail())
  }, [])

  /** Decrypts with an already-known key. `silent` is for the auto-retry on mount. */
  const unlockWithKey = useCallback(
    async (candidate: string, { remember, silent }: { remember: boolean; silent: boolean }) => {
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
          rewireLanguageToggles(target)
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
        // A cached key that stopped working almost always means it rotated out
        // last month, not that the reader did anything wrong — so the silent
        // auto-retry on mount just drops back to the plain locked state
        // instead of the "that key did not work" message a real wrong answer
        // gets.
        if (silent) {
          try {
            window.localStorage.removeItem(access.storageKey(realm))
          } catch {
            /* nothing to remove */
          }
          setStatus('locked')
          return
        }
        setStatus(isWrongKeyError(error) ? 'wrong' : 'error')
      }
    },
    [contentId, mode, realm],
  )

  const submitCode = useCallback(async () => {
    const trimmedEmail = email.trim()
    const trimmedCode = code.trim()
    if (!trimmedEmail || !trimmedCode) return
    setStatus('working')
    try {
      const key = await requestRealmKey(realm, trimmedEmail, trimmedCode)
      saveEmail(trimmedEmail)
      await unlockWithKey(key, { remember: true, silent: false })
    } catch (error) {
      if (error instanceof UnlockError) {
        setStatus(error.kind === 'invalid' ? 'wrong' : error.kind === 'rate-limited' ? 'rate-limited' : 'error')
      } else {
        setStatus('error')
      }
    }
  }, [code, email, realm, unlockWithKey])

  // A reader who already has a cached key should never see the lock again.
  useEffect(() => {
    if (attempted.current) return
    attempted.current = true
    let saved: string | null = null
    try {
      saved = window.localStorage.getItem(access.storageKey(realm))
    } catch {
      /* storage blocked */
    }
    if (saved) void unlockWithKey(saved, { remember: false, silent: true })
  }, [unlockWithKey, realm])

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
          and the SDV track have separate codes, each tied to your email.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <RequestAccessButton defaultTopics={[realm]} context={title} />
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
            void submitCode()
          }}
        >
          <label
            htmlFor={emailFieldId}
            className="block font-mono text-[0.7rem] uppercase tracking-wider text-subtle"
          >
            Already have a code?
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              id={emailFieldId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <input
              id={codeFieldId}
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm uppercase text-fg outline-none placeholder:normal-case focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <button
              type="submit"
              disabled={busy || !email.trim() || !code.trim()}
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
            {status === 'wrong' && 'That email and code did not match. Check for a typo, or ask again.'}
            {status === 'rate-limited' && 'Too many attempts. Wait a few minutes and try again.'}
            {status === 'error' && 'The access system could not be reached. Check your connection and retry.'}
            {status === 'locked' && 'Unlocks every topic on this device for 30 days, and is remembered here.'}
          </p>
        </form>
      </div>
    </section>
  )
}
