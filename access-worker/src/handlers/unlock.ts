import { getCurrentRealmKey, isRateLimited, recordAttempt, validateCode } from '../db'
import { isRealm, type Env } from '../types'
import { jsonResponse } from './respond'

export async function handleUnlock(req: Request, env: Env): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid JSON body' }, 400)
  }

  const { email, realm, code } = (body ?? {}) as Record<string, unknown>
  if (typeof email !== 'string' || typeof code !== 'string' || !isRealm(realm)) {
    return jsonResponse({ error: 'email, realm and code are required' }, 400)
  }
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || !code.trim()) {
    return jsonResponse({ error: 'email, realm and code are required' }, 400)
  }

  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown'
  const rateKey = `${ip}:${normalizedEmail}`
  if (await isRateLimited(env.DB, rateKey)) {
    return jsonResponse({ error: 'too many attempts, try again later' }, 429)
  }
  await recordAttempt(env.DB, rateKey)

  const valid = await validateCode(env.DB, normalizedEmail, realm, code)
  if (!valid) {
    return jsonResponse({ error: 'invalid or expired code' }, 401)
  }

  const key = await getCurrentRealmKey(env.DB, realm)
  return jsonResponse({ key })
}
