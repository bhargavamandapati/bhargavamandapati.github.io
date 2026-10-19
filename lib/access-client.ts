'use client'

import type { Realm } from '@/data/access'

/**
 * Talks to the access-worker (see /access-worker in the repo root) that
 * validates an email+code pair and hands back the realm's current
 * content-decryption key. Shared by the per-topic gate and the header's
 * access menu so the request/error handling exists in exactly one place.
 */

export type UnlockErrorKind = 'invalid' | 'rate-limited' | 'network'

export class UnlockError extends Error {
  kind: UnlockErrorKind
  constructor(kind: UnlockErrorKind, message: string) {
    super(message)
    this.kind = kind
  }
}

export async function requestRealmKey(realm: Realm, email: string, code: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_ACCESS_WORKER_URL
  if (!base) {
    throw new UnlockError('network', 'The access system is not configured on this build.')
  }

  let response: Response
  try {
    response = await fetch(`${base}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, realm, code }),
    })
  } catch {
    throw new UnlockError('network', 'Could not reach the access system. Check your connection.')
  }

  if (response.status === 401) throw new UnlockError('invalid', 'That email and code did not match.')
  if (response.status === 429) {
    throw new UnlockError('rate-limited', 'Too many attempts. Wait a few minutes and try again.')
  }
  if (!response.ok) throw new UnlockError('network', `Unlock failed (${response.status}).`)

  const data = (await response.json()) as { key: string }
  return data.key
}

const EMAIL_STORAGE_KEY = 'bm:access-email'

/** Remembered purely as a form-fill convenience — never used to decide access. */
export function getSavedEmail(): string {
  try {
    return window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveEmail(email: string): void {
  try {
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email)
  } catch {
    /* storage blocked — not essential */
  }
}
