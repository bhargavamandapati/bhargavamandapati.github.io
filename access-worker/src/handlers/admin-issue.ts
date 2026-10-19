import { ensureSubscriber, issueCode, recordPayment } from '../db'
import { sendCodeEmail } from '../email'
import { isRealm, type Env } from '../types'
import { jsonResponse } from './respond'

/**
 * Records a payment and issues a fresh code for (email, realm), then emails
 * it. Called by the admin CLI you run after confirming a payment — never
 * exposed to the public site. Protected by ADMIN_TOKEN.
 */
export async function handleAdminIssue(req: Request, env: Env): Promise<Response> {
  const auth = req.headers.get('Authorization')
  if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
    return jsonResponse({ error: 'unauthorized' }, 401)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid JSON body' }, 400)
  }

  const { email, realm, amount, currency, method, reference, notes } = (body ?? {}) as Record<
    string,
    unknown
  >
  if (typeof email !== 'string' || !isRealm(realm) || typeof amount !== 'string') {
    return jsonResponse({ error: 'email, realm and amount are required' }, 400)
  }
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) {
    return jsonResponse({ error: 'email is required' }, 400)
  }

  await ensureSubscriber(env.DB, normalizedEmail)
  await recordPayment(env.DB, {
    email: normalizedEmail,
    realm,
    amount,
    currency: typeof currency === 'string' && currency ? currency : 'USD',
    method: typeof method === 'string' ? method : undefined,
    reference: typeof reference === 'string' ? reference : undefined,
    notes: typeof notes === 'string' ? notes : undefined,
  })
  const code = await issueCode(env.DB, normalizedEmail, realm)

  // The payment is recorded and the code exists either way — a delivery
  // failure (e.g. Resend's sandbox mode refusing a recipient that isn't the
  // account's own address) must not look like the whole operation failed, and
  // must not strand a code nobody can read. The plaintext only ever exists
  // for this one request, so if it can't be emailed, it goes back in the
  // response instead, for the admin to deliver by hand.
  try {
    await sendCodeEmail(env, normalizedEmail, realm, code)
    return jsonResponse({ ok: true, email: normalizedEmail, realm, delivered: true })
  } catch (error) {
    return jsonResponse({
      ok: true,
      email: normalizedEmail,
      realm,
      delivered: false,
      code,
      emailError: error instanceof Error ? error.message : String(error),
    })
  }
}
