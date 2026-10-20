import { getCurrentRealmKey } from '../db'
import { isRealm, type Env } from '../types'
import { jsonResponse } from './respond'

/**
 * Hands the site's build pipeline the realm key currently used to encrypt
 * locked content, so every build — a content push or the monthly scheduled
 * rebuild after rotation — re-encrypts with whatever is actually live.
 * Protected by CI_TOKEN, separate from ADMIN_TOKEN: a leaked build secret
 * should not be able to issue codes or see payment data.
 */
export async function handleCurrentKey(req: Request, env: Env): Promise<Response> {
  const auth = req.headers.get('Authorization')
  if (auth !== `Bearer ${env.CI_TOKEN}`) {
    return jsonResponse({ error: 'unauthorized' }, 401)
  }

  const url = new URL(req.url)
  const realm = url.searchParams.get('realm')
  if (!isRealm(realm)) {
    return jsonResponse({ error: 'realm must be "learn", "sdv" or "aiml"' }, 400)
  }

  const key = await getCurrentRealmKey(env.DB, realm)
  return jsonResponse({ realm, key })
}
