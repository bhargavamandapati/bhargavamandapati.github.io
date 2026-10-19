import { generateCode, generateRealmKey, hashCode } from './codes'
import type { Realm } from './types'

const PERIOD_DAYS = 30

export async function ensureSubscriber(db: D1Database, email: string): Promise<void> {
  await db
    .prepare('INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING')
    .bind(email)
    .run()
}

export async function recordPayment(
  db: D1Database,
  args: {
    email: string
    realm: Realm
    amount: string
    currency: string
    method?: string
    reference?: string
    notes?: string
  },
): Promise<void> {
  const now = new Date()
  const periodEnd = new Date(now.getTime() + PERIOD_DAYS * 24 * 60 * 60 * 1000)
  await db
    .prepare(
      `INSERT INTO payments (id, email, realm, amount, currency, period_start, period_end, method, reference, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      crypto.randomUUID(),
      args.email,
      args.realm,
      args.amount,
      args.currency,
      now.toISOString(),
      periodEnd.toISOString(),
      args.method ?? null,
      args.reference ?? null,
      args.notes ?? null,
    )
    .run()
}

/**
 * Issues a new code for (email, realm), revoking whatever was previously
 * active for that pair. Returns the plaintext code — the only time it ever
 * exists outside the subscriber's inbox, so the caller must email it
 * immediately and never log or store it.
 */
export async function issueCode(db: D1Database, email: string, realm: Realm): Promise<string> {
  await db
    .prepare(
      `UPDATE access_codes SET status = 'revoked', revoked_at = datetime('now')
       WHERE email = ? AND realm = ? AND status = 'active'`,
    )
    .bind(email, realm)
    .run()

  const now = new Date()
  const expiresAt = new Date(now.getTime() + PERIOD_DAYS * 24 * 60 * 60 * 1000)

  // Collision odds are astronomically small (80 bits of entropy), but the
  // hash column is UNIQUE, so a retry loop costs nothing and removes the
  // theoretical failure mode entirely.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode()
    const codeHash = await hashCode(code)
    try {
      await db
        .prepare(
          `INSERT INTO access_codes (id, email, realm, code_hash, status, issued_at, expires_at)
           VALUES (?, ?, ?, ?, 'active', ?, ?)`,
        )
        .bind(crypto.randomUUID(), email, realm, codeHash, now.toISOString(), expiresAt.toISOString())
        .run()
      return code
    } catch (error) {
      if (attempt === 4) throw error
    }
  }
  throw new Error('unreachable')
}

/** True when this email+code is currently valid for this realm. */
export async function validateCode(
  db: D1Database,
  email: string,
  realm: Realm,
  code: string,
): Promise<boolean> {
  const codeHash = await hashCode(code)
  const row = await db
    .prepare(
      `SELECT 1 FROM access_codes
       WHERE email = ? AND realm = ? AND code_hash = ? AND status = 'active' AND expires_at > datetime('now')`,
    )
    .bind(email, realm, codeHash)
    .first()
  return row !== null
}

/** The realm's current content key, generating one on first use if none exists yet. */
export async function getCurrentRealmKey(db: D1Database, realm: Realm): Promise<string> {
  const row = await db
    .prepare('SELECT current_key FROM realm_keys WHERE realm = ?')
    .bind(realm)
    .first<{ current_key: string }>()
  if (row) return row.current_key

  const key = generateRealmKey()
  await db
    .prepare('INSERT INTO realm_keys (realm, current_key) VALUES (?, ?)')
    .bind(realm, key)
    .run()
  return key
}

/** Generates a fresh key for every realm. Old cached keys in a browser stop working. */
export async function rotateAllRealmKeys(db: D1Database, realms: Realm[]): Promise<void> {
  for (const realm of realms) {
    const key = generateRealmKey()
    await db
      .prepare(
        `INSERT INTO realm_keys (realm, current_key, rotated_at) VALUES (?, ?, datetime('now'))
         ON CONFLICT(realm) DO UPDATE SET current_key = excluded.current_key, rotated_at = excluded.rotated_at`,
      )
      .bind(realm, key)
      .run()
  }
}

/** Flips anything past its expiry to 'expired'. Payment history is untouched. */
export async function sweepExpiredCodes(db: D1Database): Promise<void> {
  await db
    .prepare(
      `UPDATE access_codes SET status = 'expired'
       WHERE status = 'active' AND expires_at <= datetime('now')`,
    )
    .run()
}

const RATE_LIMIT_WINDOW_MINUTES = 10
const RATE_LIMIT_MAX_ATTEMPTS = 10

/** True when this key (IP+email) has made too many attempts recently. */
export async function isRateLimited(db: D1Database, rateKey: string): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM unlock_attempts
       WHERE rate_key = ? AND ts > datetime('now', '-${RATE_LIMIT_WINDOW_MINUTES} minutes')`,
    )
    .bind(rateKey)
    .first<{ n: number }>()
  return (row?.n ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS
}

export async function recordAttempt(db: D1Database, rateKey: string): Promise<void> {
  await db.prepare('INSERT INTO unlock_attempts (rate_key) VALUES (?)').bind(rateKey).run()
}

/** Prunes attempt rows older than a day. Called from the monthly scheduled handler. */
export async function pruneOldAttempts(db: D1Database): Promise<void> {
  await db.prepare(`DELETE FROM unlock_attempts WHERE ts < datetime('now', '-1 day')`).run()
}
