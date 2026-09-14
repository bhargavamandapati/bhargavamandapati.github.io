/**
 * Configuration for the "Request access" form
 * (components/premium/request-access.tsx).
 *
 * Payment happens off-site, by email or a call — there is no checkout on this
 * site and there does not need to be one. This form's only job is getting a
 * request's details (who, which track, how long, how many accounts) into an
 * inbox so it can be handled from there.
 *
 * Submissions are relayed by Web3Forms, a static-site form backend, straight
 * to email — there is no server on this site to run for something this
 * infrequent. The access key below is not a secret: it only tells Web3Forms
 * which inbox a submission should reach, the same way a Formspree form ID
 * works, and is safe to commit. Get one free at https://web3forms.com by
 * entering the destination email — it arrives by return email with nothing
 * else to sign up for.
 *
 * Confirmation email to the requester: enable this in the Web3Forms
 * dashboard, not in this file — under the access key's settings, turn on
 * "Auto-Responder Email" and give it a subject and message. It is sent to
 * whatever address the visitor put in the form's own "email" field, which is
 * exactly what a per-submission confirmation needs and isn't something a
 * fixed access key can express on its own. The message template can use
 * {name}, {topics}, {access_length} and {accounts_needed} — the same field
 * names this form submits — to fill in the specifics. Approved wording:
 *
 *   Subject: Your access request — {topics}
 *
 *   Hi {name},
 *
 *   This confirms your request for {topics} has been received.
 *
 *     Access length:   {access_length}
 *     Accounts needed: {accounts_needed}
 *
 *   You'll hear back at this address once it's reviewed — no need to follow
 *   up in the meantime.
 *
 *   Bhargava Mandapati
 *   https://bhargavamandapati.com
 */
export const WEB3FORMS_ACCESS_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'

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
