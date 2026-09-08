/**
 * Shared crypto shape for the premium payloads.
 *
 * Encryption happens in Node after the site is built; decryption happens in the
 * browser with WebCrypto. Both sides have to agree exactly, so the parameters
 * live here rather than being written twice.
 *
 * PBKDF2 with a high iteration count is what makes a short, human-typed
 * passphrase costly to attack. AES-GCM authenticates as well as encrypts, so a
 * wrong key fails loudly rather than producing plausible rubbish.
 */
export const KDF = {
  name: 'PBKDF2',
  hash: 'SHA-256',
  iterations: 310_000,
  keyLength: 32,
}

export const CIPHER = {
  name: 'AES-GCM',
  ivLength: 12,
  saltLength: 16,
}

export const PAYLOAD_VERSION = 1
