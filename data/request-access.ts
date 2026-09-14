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
 */
export const WEB3FORMS_ACCESS_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'

export type RequestTopic = 'learn' | 'sdv' | 'ai-ml'

export const REQUEST_TOPICS: { value: RequestTopic; label: string }[] = [
  { value: 'learn', label: 'Learn AAOS' },
  { value: 'sdv', label: 'SDV' },
  { value: 'ai-ml', label: 'AI & ML for Automotive' },
]

export type RequestDuration = '1-month' | '1-year' | 'other'

export const REQUEST_DURATIONS: { value: RequestDuration; label: string }[] = [
  { value: '1-month', label: '1 month' },
  { value: '1-year', label: '1 year' },
  { value: 'other', label: 'Other — specify below' },
]
