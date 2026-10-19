/**
 * Access-code generation and hashing.
 *
 * Codes are random, not derived from the email — knowing someone's email must
 * never help guess their code. The alphabet drops visually ambiguous
 * characters (0/O, 1/I/L) since these get copy-pasted from an email but
 * sometimes still get retyped.
 */

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // 32 symbols, 5 bits each
const GROUPS = 4
const GROUP_LENGTH = 4

/** e.g. "7K4P-9XQR-2MNB-VC8T" — 16 symbols, 80 bits of entropy. */
export function generateCode(): string {
  const bytes = new Uint8Array(GROUPS * GROUP_LENGTH)
  crypto.getRandomValues(bytes)
  const groups: string[] = []
  for (let g = 0; g < GROUPS; g++) {
    let group = ''
    for (let i = 0; i < GROUP_LENGTH; i++) {
      group += ALPHABET[bytes[g * GROUP_LENGTH + i] % ALPHABET.length]
    }
    groups.push(group)
  }
  return groups.join('-')
}

/** Codes are stored hashed — the plaintext only ever exists in the one email sent. */
export async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code.trim().toUpperCase())
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** A realm's content-decryption key: long, random, opaque. Not meant to be typed. */
export function generateRealmKey(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}
