#!/usr/bin/env node
/**
 * Run this after you've confirmed a payment, to issue and email an access
 * code. Never exposed on the public site — this talks to the Worker's
 * /admin/issue endpoint directly, authenticated with ADMIN_TOKEN.
 *
 * Usage:
 *   node admin-cli.mjs --email reader@example.com --realm sdv --amount 25
 *   node admin-cli.mjs --email reader@example.com --realm learn --amount 15 \
 *     --currency USD --method "UPI" --reference "txn_abc123" --notes "renewal"
 *
 * Reads WORKER_URL and ADMIN_TOKEN from the environment, or from .dev.vars /
 * .admin.env in this directory (KEY=VALUE per line) as a fallback — same
 * pattern the main site's scripts/encrypt-premium.mjs already uses for its
 * own local secrets.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.dirname(new URL(import.meta.url).pathname)

function readLocal(name) {
  if (process.env[name]) return process.env[name]
  for (const file of ['.admin.env', '.dev.vars']) {
    try {
      const text = readFileSync(path.join(ROOT, file), 'utf8')
      const match = new RegExp(`^${name}\\s*=\\s*(.+)$`, 'm').exec(text)
      if (match) return match[1].trim().replace(/^["']|["']$/g, '')
    } catch {
      /* file doesn't exist — try the next one */
    }
  }
  return undefined
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      out[argv[i].slice(2)] = argv[i + 1]
      i++
    }
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
const WORKER_URL = readLocal('WORKER_URL')
const ADMIN_TOKEN = readLocal('ADMIN_TOKEN')

if (!WORKER_URL || !ADMIN_TOKEN) {
  console.error(
    'Missing WORKER_URL or ADMIN_TOKEN.\n' +
      'Set them as environment variables, or add them to .admin.env in this directory, e.g.:\n' +
      '  WORKER_URL=https://bm-access-worker.<your-subdomain>.workers.dev\n' +
      '  ADMIN_TOKEN=<the value you set with `wrangler secret put ADMIN_TOKEN`>',
  )
  process.exit(1)
}
if (!args.email || !args.realm || !args.amount) {
  console.error('Usage: node admin-cli.mjs --email <email> --realm <learn|sdv|aiml> --amount <amount>')
  process.exit(1)
}

const res = await fetch(`${WORKER_URL}/admin/issue`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: args.email,
    realm: args.realm,
    amount: args.amount,
    currency: args.currency,
    method: args.method,
    reference: args.reference,
    notes: args.notes,
  }),
})

const body = await res.json()
if (!res.ok) {
  console.error(`Failed (${res.status}):`, body)
  process.exit(1)
}
if (body.delivered) {
  console.log(`Issued and emailed a ${args.realm} code to ${args.email}.`)
} else {
  console.log(
    `Issued a ${args.realm} code for ${args.email}, but the email did not send ` +
      `(${body.emailError}).\n` +
      `Deliver this code to them yourself:\n\n  ${body.code}\n`,
  )
}
