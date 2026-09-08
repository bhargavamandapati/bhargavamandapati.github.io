#!/usr/bin/env node
/**
 * Removes locked article bodies from the exported site and replaces them with
 * ciphertext.
 *
 * This runs after `next build`, on the finished HTML, because that is the only
 * point where the real question can be answered: what actually reaches a
 * reader's browser. Hiding an article with CSS or a React flag leaves the prose
 * in the markup, one view-source away, which is not a lock but a suggestion.
 *
 * What ships for a locked topic is its title, description and reading time —
 * enough to know whether to ask for a key — and an AES-GCM blob. Without the
 * passphrase there is no plaintext anywhere in the export.
 */

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { KDF, CIPHER, PAYLOAD_VERSION } from '../lib/premium-crypto.mjs'

const ROOT = process.cwd()
/** The shippable export: locked bodies were never rendered into it. */
const OUT = path.join(ROOT, 'out')
/** The harvest export, built with PREMIUM_RENDER_ALL, never published. */
const SOURCE = path.join(ROOT, 'out-premium-src')
const PAYLOAD_DIR = path.join(OUT, 'premium')

/**
 * The key is read from the environment, falling back to .env.local so a local
 * build works without exporting anything by hand. .env.local is gitignored,
 * which is the point: the key must never be committed beside the ciphertext.
 */
function readPassphrase(name) {
  if (process.env[name]) return process.env[name]
  try {
    const env = readFileSync(path.join(ROOT, '.env.local'), 'utf8')
    const match = new RegExp(`^${name}\\s*=\\s*(.+)$`, 'm').exec(env)
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined
  } catch {
    return undefined
  }
}

const KEYS = {
  learn: readPassphrase('PREMIUM_PASSPHRASE_LEARN'),
  sdv: readPassphrase('PREMIUM_PASSPHRASE_SDV'),
}
for (const [realm, key] of Object.entries(KEYS)) {
  if (!key) {
    console.error(
      `\nencrypt-premium: PREMIUM_PASSPHRASE_${realm.toUpperCase()} is not set.\n` +
        'Without it that track cannot be encrypted, and publishing the build\n' +
        'would put every one of its topics online in full. Refusing to continue.\n' +
        `\nSet it in .env.local, e.g.  PREMIUM_PASSPHRASE_${realm.toUpperCase()}="a long passphrase"\n`,
    )
    process.exit(1)
  }
  if (key.length < 12) {
    console.error(`encrypt-premium: ${realm} passphrase must be at least 12 characters.`)
    process.exit(1)
  }
}
if (KEYS.learn === KEYS.sdv) {
  console.error(
    'encrypt-premium: the two passphrases are identical, which defeats having two.\n' +
      'One key would open both tracks.',
  )
  process.exit(1)
}

/** Which key opens a given payload, from the area encoded in its id. */
function realmFor(id) {
  const area = id.includes('__') ? id.slice(0, id.indexOf('__')) : id
  return area === 'sdv' ? 'sdv' : 'learn'
}

/** Every index.html under out/, so the marker can be found wherever it is. */
async function* htmlFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name === 'index.html') yield full
  }
}

/**
 * Finds the wrapper the build marked as locked.
 *
 * The marker is on a div around the MDX output rather than the article itself,
 * because the article also holds the audio player — which is not part of the
 * topic, and which would be destroyed if an unlock replaced the article wholesale.
 */
function findLockedBody(html) {
  const open = /<div([^>]*)data-premium="([^"]+)"([^>]*)>/.exec(html)
  if (!open) return null
  const id = open[2]
  const bodyStart = open.index + open[0].length
  let depth = 1
  const tag = /<(\/?)div\b/g
  tag.lastIndex = bodyStart
  let m
  let bodyEnd = -1
  while ((m = tag.exec(html))) {
    depth += m[1] ? -1 : 1
    if (depth === 0) {
      bodyEnd = m.index
      break
    }
  }
  if (bodyEnd === -1) return null
  return { id, bodyStart, bodyEnd, body: html.slice(bodyStart, bodyEnd) }
}

function encrypt(plaintext, passphrase) {
  const salt = crypto.randomBytes(CIPHER.saltLength)
  const iv = crypto.randomBytes(CIPHER.ivLength)
  const key = crypto.pbkdf2Sync(passphrase, salt, KDF.iterations, KDF.keyLength, 'sha256')
  // Node names the cipher by key size; WebCrypto infers it from the key.
  const cipher = crypto.createCipheriv(`aes-${KDF.keyLength * 8}-gcm`, key, iv)
  const body = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  // GCM's tag is appended, which is what WebCrypto's decrypt() expects.
  const payload = Buffer.concat([body, cipher.getAuthTag()])
  return {
    v: PAYLOAD_VERSION,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: payload.toString('base64'),
  }
}

/**
 * Confirms the shippable export really is empty where it claims to be.
 *
 * The article element being blank is not proof: the first attempt at this left
 * every locked topic in full inside the page's RSC flight payload, invisible in
 * the markup and perfectly greppable. So the check is against the actual
 * plaintext, in the actual file that will be published.
 */
async function assertNoLeak(shippedFile, body) {
  const shipped = await fs.readFile(shippedFile, 'utf8')
  const probes = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?]) /)
    .map((s) => s.trim())
    .filter((s) => s.length > 60 && s.length < 160)
    .slice(0, 8)
  const leaked = probes.filter((probe) => shipped.includes(probe))
  if (leaked.length > 0) {
    throw new Error(
      `${shippedFile} still contains locked prose (${leaked.length}/${probes.length} probes matched).\n` +
        `First match: "${leaked[0].slice(0, 90)}..."`,
    )
  }
}

async function main() {
  try {
    await fs.access(SOURCE)
  } catch {
    console.error(
      'encrypt-premium: out-premium-src/ is missing.\n' +
        'It is produced by the PREMIUM_RENDER_ALL pass, which has to run first.\n' +
        'Use `npm run build` rather than calling this script on its own.',
    )
    process.exit(1)
  }

  await fs.mkdir(PAYLOAD_DIR, { recursive: true })
  let locked = 0
  let plaintextBytes = 0

  for await (const file of htmlFiles(SOURCE)) {
    const html = await fs.readFile(file, 'utf8')
    const found = findLockedBody(html)
    if (!found || found.body.trim() === '') continue

    const payload = encrypt(found.body, KEYS[realmFor(found.id)])
    await fs.writeFile(path.join(PAYLOAD_DIR, `${found.id}.json`), JSON.stringify(payload), 'utf8')

    // The published page is a separate build that never rendered this body;
    // verify that rather than trusting it.
    const shipped = path.join(OUT, path.relative(SOURCE, file))
    await assertNoLeak(shipped, found.body)

    locked += 1
    plaintextBytes += Buffer.byteLength(found.body)
  }

  if (locked === 0) {
    console.error('encrypt-premium: found no locked articles — is the gate wired into the pages?')
    process.exit(1)
  }

  // The tools have no article to decrypt, so each realm gets a token whose
  // only job is to prove a key is the right one.
  for (const [realm, key] of Object.entries(KEYS)) {
    await fs.writeFile(
      path.join(PAYLOAD_DIR, `_validator-${realm}.json`),
      JSON.stringify(encrypt('unlocked', key)),
      'utf8',
    )
  }

  // The harvest build contains every locked topic in full. It must not linger.
  await fs.rm(SOURCE, { recursive: true, force: true })

  console.log(
    `premium: encrypted ${locked} article(s), ` +
      `${(plaintextBytes / 1024).toFixed(0)} KB of prose kept out of the export`,
  )
}

await main()
