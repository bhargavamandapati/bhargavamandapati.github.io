import { pruneOldAttempts, rotateAllRealmKeys, sweepExpiredCodes } from './db'
import { handleAdminIssue } from './handlers/admin-issue'
import { handleCurrentKey } from './handlers/current-key'
import { corsPreflight, jsonResponse } from './handlers/respond'
import { handleUnlock } from './handlers/unlock'
import { REALMS, type Env } from './types'

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return corsPreflight()

    const url = new URL(req.url)

    if (url.pathname === '/unlock' && req.method === 'POST') {
      return handleUnlock(req, env)
    }
    if (url.pathname === '/admin/issue' && req.method === 'POST') {
      return handleAdminIssue(req, env)
    }
    if (url.pathname === '/internal/current-key' && req.method === 'GET') {
      return handleCurrentKey(req, env)
    }
    if (url.pathname === '/health') {
      return jsonResponse({ ok: true })
    }

    return jsonResponse({ error: 'not found' }, 404)
  },

  /** Monthly: rotate every realm's content key, expire lapsed codes, tidy up. */
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await rotateAllRealmKeys(env.DB, REALMS)
    await sweepExpiredCodes(env.DB)
    await pruneOldAttempts(env.DB)
  },
} satisfies ExportedHandler<Env>
