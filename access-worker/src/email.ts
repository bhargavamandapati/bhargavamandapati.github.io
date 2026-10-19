import type { Env, Realm } from './types'

const REALM_LABEL: Record<Realm, string> = {
  learn: 'Learn AAOS',
  sdv: 'Software-Defined Vehicles',
}

export async function sendCodeEmail(
  env: Env,
  email: string,
  realm: Realm,
  code: string,
): Promise<void> {
  const label = REALM_LABEL[realm]
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: email,
      subject: `Your ${label} access code`,
      text:
        `Your access code for ${label} is:\n\n${code}\n\n` +
        `Enter it together with this email address on the site to unlock ${label}. ` +
        `It's valid for 30 days from today.\n\n` +
        `Keep this email — the code is only sent once.`,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`resend send failed: ${res.status} ${body}`)
  }
}
