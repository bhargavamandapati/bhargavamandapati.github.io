/**
 * Configuration for the "Request access" form
 * (components/premium/request-access.tsx).
 *
 * Payment happens off-site, by email or a call — there is no checkout on this
 * site and there does not need to be one. This form's only job is getting a
 * request's details (who, which track, how long, how many accounts) into an
 * inbox so it can be handled from there.
 *
 * Submissions are relayed by FormSubmit (https://formsubmit.co), a static-site
 * form backend, straight to email — there is no server on this site to run
 * for something this infrequent, and no signup or key: the destination
 * address itself is the only thing FormSubmit needs, reconstructed at
 * runtime via lib/obscured-email.ts's accessEmail() rather than kept as a
 * plaintext string, the same anti-harvesting reasoning that file already
 * documents.
 *
 * One-time setup, done once and never again: the FIRST submission FormSubmit
 * ever receives for that address triggers an activation email to it with a
 * "Confirm your email address" link — until that's clicked, submissions are
 * accepted but not delivered. There's nothing to configure beyond that: the
 * confirmation email sent back to the requester is built into the submission
 * itself (see the `_autoresponse` field in request-access.tsx), with the
 * real name/topics/length/count already filled in — no dashboard template or
 * placeholder syntax to get right, unlike Web3Forms's dashboard-only
 * autoresponder this replaces.
 */

export type RequestTopic = 'learn' | 'sdv' | 'ai-ml'

export const REQUEST_TOPICS: { value: RequestTopic; label: string; disabled?: boolean; note?: string }[] = [
  { value: 'learn', label: 'Learn AAOS' },
  { value: 'sdv', label: 'SDV' },
  { value: 'ai-ml', label: 'AI & ML for Automotive', disabled: true, note: 'Coming soon' },
]

export type RequestDuration = '1-month' | '1-year' | 'other'

export const REQUEST_DURATIONS: { value: RequestDuration; label: string }[] = [
  { value: '1-month', label: '1 month' },
  { value: '1-year', label: '1 year' },
  { value: 'other', label: 'Other — specify below' },
]
