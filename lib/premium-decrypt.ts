'use client'

/**
 * Shared AES-GCM decrypt logic for premium payloads.
 *
 * Every surface that checks an access key against scripts/encrypt-premium.mjs's
 * output — the per-topic gate and the header's global unlock form alike —
 * decrypts through this one function, so they can never quietly drift apart.
 */

export type Payload = { v: number; salt: string; iv: string; data: string }

/** Must match scripts/encrypt-premium.mjs. */
const KDF_ITERATIONS = 310_000

/** Returns a plain ArrayBuffer, which is what WebCrypto's BufferSource wants. */
function fromBase64(value: string): ArrayBuffer {
  const binary = atob(value)
  const buffer = new ArrayBuffer(binary.length)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return buffer
}

export async function decryptPayload(payload: Payload, passphrase: string): Promise<string> {
  const encoder = new TextEncoder()
  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: fromBase64(payload.salt),
      iterations: KDF_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(payload.iv) },
    key,
    fromBase64(payload.data),
  )
  return new TextDecoder().decode(plain)
}

/** True when the failure was a wrong key (GCM auth failure) rather than a network problem. */
export function isWrongKeyError(error: unknown): boolean {
  return error instanceof DOMException || String(error).includes('operation-specific')
}
