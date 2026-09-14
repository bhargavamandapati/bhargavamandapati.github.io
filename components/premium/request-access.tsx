'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, Loader2, Lock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  REQUEST_DURATIONS,
  REQUEST_TOPICS,
  WEB3FORMS_ACCESS_KEY,
  type RequestDuration,
  type RequestTopic,
} from '@/data/request-access'

/**
 * The one button every "how do I get access" surface on the site uses.
 *
 * It used to be a pair — a LinkedIn link and a mailto: button — replaced here
 * by a single button that opens a form. The form's submission goes straight
 * to an inbox through Web3Forms (see data/request-access.ts), so there is
 * still no backend to run and no payment gateway to integrate: payment
 * happens off-site, and this form only starts that conversation.
 */
export function RequestAccessButton({
  label = 'Request access',
  variant = 'primary',
  className,
  defaultTopics,
  context,
}: {
  label?: string
  variant?: 'primary' | 'secondary'
  className?: string
  /** Pre-ticks the topic(s) this button was shown next to. */
  defaultTopics?: RequestTopic[]
  /** Where the request came from, e.g. "Property simulator" — travels with the submission. */
  context?: string
}) {
  const [open, setOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  const show = () => {
    openerRef.current = document.activeElement as HTMLElement
    setOpen(true)
  }
  const hide = () => {
    setOpen(false)
    openerRef.current?.focus()
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          variant === 'primary'
            ? 'bg-accent text-accent-fg hover:opacity-90'
            : 'border border-line text-fg transition-colors hover:border-line-strong hover:bg-surface',
          className,
        )}
      >
        <Lock aria-hidden className="size-4" />
        {label}
      </button>
      {open && (
        <RequestAccessModal onClose={hide} defaultTopics={defaultTopics ?? []} context={context} />
      )}
    </>
  )
}

function RequestAccessModal({
  onClose,
  defaultTopics,
  context,
}: {
  onClose: () => void
  defaultTopics: RequestTopic[]
  context?: string
}) {
  const labelId = useId()
  const nameId = useId()
  const emailId = useId()
  const durationId = useId()
  const accountsId = useId()
  const messageId = useId()
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topics, setTopics] = useState<RequestTopic[]>(defaultTopics)
  const [duration, setDuration] = useState<RequestDuration>('1-month')
  // Kept as free-typed text, not a number, so clearing the field to type a
  // new value doesn't get immediately snapped back to 1 on every keystroke —
  // only normalised (clamped to 1-20, defaulted if empty) on blur and submit.
  const [accountsInput, setAccountsInput] = useState('1')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // Same lock-scroll-and-focus-the-first-field pattern as the search dialog.
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    firstFieldRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function toggleTopic(value: RequestTopic) {
    if (REQUEST_TOPICS.find((t) => t.value === value)?.disabled) return
    setTopics((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]))
  }

  /** Clamped to 1-20, defaulting to 1 for anything that isn't a positive integer. */
  function normalisedAccounts(): number {
    const n = Math.trunc(Number(accountsInput))
    if (!Number.isFinite(n) || n < 1) return 1
    return Math.min(20, n)
  }

  const canSubmit = name.trim() !== '' && email.trim() !== '' && topics.length > 0

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || status === 'sending') return
    setStatus('sending')
    try {
      const topicLabels = REQUEST_TOPICS.filter((t) => topics.includes(t.value))
        .map((t) => t.label)
        .join(', ')
      const durationLabel = REQUEST_DURATIONS.find((d) => d.value === duration)?.label ?? duration

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Access request — ${topicLabels}`,
          name: name.trim(),
          email: email.trim(),
          topics: topicLabels,
          access_length: durationLabel,
          accounts_needed: String(normalisedAccounts()),
          message: message.trim() || '(none)',
          requested_from: context ?? '(none)',
          page: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.success === false) throw new Error('submit failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto px-4 pb-8 pt-[8vh]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-bg/80 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="card relative z-10 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={labelId} className="text-sm font-medium text-fg">
            Request access
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-subtle transition-colors hover:text-fg"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Check aria-hidden className="size-5" />
            </span>
            <p className="text-sm text-fg">Request sent.</p>
            <p className="text-xs leading-relaxed text-muted">
              You&rsquo;ll hear back by email once it&rsquo;s reviewed.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 cursor-pointer rounded-lg border border-line px-4 py-2 text-sm transition-colors hover:border-line-strong hover:bg-surface"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
            <div>
              <label htmlFor={nameId} className="block text-xs font-medium text-muted">
                Name
              </label>
              <input
                ref={firstFieldRef}
                id={nameId}
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor={emailId} className="block text-xs font-medium text-muted">
                Email
              </label>
              <input
                id={emailId}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="So there's somewhere to reply"
                className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </div>

            <fieldset>
              <legend className="block text-xs font-medium text-muted">Topics</legend>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {REQUEST_TOPICS.map((t) => {
                  const selected = topics.includes(t.value)
                  return (
                    <button
                      key={t.value}
                      type="button"
                      disabled={t.disabled}
                      aria-pressed={selected}
                      onClick={() => toggleTopic(t.value)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        t.disabled
                          ? 'cursor-not-allowed border-line text-subtle opacity-60'
                          : selected
                            ? 'cursor-pointer border-accent bg-accent-soft text-accent'
                            : 'cursor-pointer border-line text-muted hover:border-line-strong hover:text-fg',
                      )}
                    >
                      {t.label}
                      {t.note && <span className="text-subtle"> · {t.note}</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={durationId} className="block text-xs font-medium text-muted">
                  Access length
                </label>
                <select
                  id={durationId}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as RequestDuration)}
                  className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                >
                  {REQUEST_DURATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={accountsId} className="block text-xs font-medium text-muted">
                  Accounts needed
                </label>
                <input
                  id={accountsId}
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={accountsInput}
                  onChange={(e) => setAccountsInput(e.target.value)}
                  onBlur={() => setAccountsInput(String(normalisedAccounts()))}
                  className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                />
              </div>
            </div>

            <div>
              <label htmlFor={messageId} className="block text-xs font-medium text-muted">
                Anything else? <span className="text-subtle">(optional)</span>
              </label>
              <textarea
                id={messageId}
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || status === 'sending'}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'sending' && <Loader2 aria-hidden className="size-4 animate-spin" />}
              {status === 'sending' ? 'Sending…' : 'Send request'}
            </button>
            <p aria-live="polite" className="min-h-4 text-center text-xs text-muted">
              {status === 'error' && 'That did not go through. Check your connection and try again.'}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
