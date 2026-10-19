# Access code backend

A small Cloudflare Worker that validates per-email, per-realm access codes for
`bhargavamandapati.com`'s Learn AAOS and SDV tracks. The main site stays on
GitHub Pages and stays static — this is the one piece that needs a live
server, kept deliberately small and separate.

How it fits together, in one paragraph: a reader enters their email and code
on the site; this Worker checks it against a Cloudflare D1 database and, if
valid, hands back that realm's current content-decryption key; the site then
decrypts exactly as it always has. Once a month a Cron Trigger rotates every
realm's key and the site rebuilds to match — anyone whose code lapsed before
the next rotation simply can't fetch the new key.

Everything below runs on **your own computer** (or anywhere with normal
internet access) — the Claude session that wrote this code could not reach
Cloudflare's or Resend's APIs to run these steps itself.

## One-time setup

```bash
cd access-worker
npm install

# Auth wrangler with the token/account you already have — no browser needed.
export CLOUDFLARE_API_TOKEN=<the token you generated>
export CLOUDFLARE_ACCOUNT_ID=<your account id>
```

### 1. Create the database

```bash
npm run db:create
```

This prints something like:

```
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy that id into `wrangler.toml`, replacing `REPLACE_WITH_D1_DATABASE_ID`.

### 2. Apply the schema

```bash
npm run db:migrate:remote
```

### 3. Set the secrets

Each of these prompts you to paste a value — nothing goes on disk or in git.

```bash
wrangler secret put RESEND_API_KEY
# paste your Resend API key

wrangler secret put FROM_EMAIL
# for now, use: onboarding@resend.dev
# (Resend's shared test address — works without verifying your own domain,
# but can only deliver to the email address your Resend account itself is
# registered under. Verify your own domain in Resend later to send to real
# subscribers; nothing else here needs to change when you do.)

wrangler secret put ADMIN_TOKEN
# generate one with:  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

wrangler secret put CI_TOKEN
# generate a *different* one the same way
```

### 4. Deploy

```bash
npm run deploy
```

This prints the Worker's live URL, something like:

```
https://bm-access-worker.<your-subdomain>.workers.dev
```

Save that URL — you'll need it three more places:

1. In this directory, create `.admin.env` (gitignored) with:
   ```
   WORKER_URL=https://bm-access-worker.<your-subdomain>.workers.dev
   ADMIN_TOKEN=<the same value you set in step 3>
   ```
2. As a GitHub Actions secret on the main repo, `ACCESS_WORKER_URL` (Settings
   → Secrets and variables → Actions → New repository secret).
3. As a second GitHub Actions secret, `ACCESS_WORKER_CI_TOKEN`, set to the
   same value you used for `CI_TOKEN` above.

### 5. Confirm it's alive

```bash
curl https://bm-access-worker.<your-subdomain>.workers.dev/health
# {"ok":true}
```

## Issuing a code

After you've confirmed someone's payment off-site, same as always:

```bash
node admin-cli.mjs --email reader@example.com --realm sdv --amount 25
```

This records the payment, generates a code, and emails it to them. Options:
`--currency`, `--method`, `--reference`, `--notes` — all optional, stored
alongside the payment for your own records.

**To test the whole flow before issuing anyone a real code**, run this with
your *own* email address (the one your Resend account is registered under —
see the `FROM_EMAIL` note above), confirm you receive it, then:

```bash
curl -X POST https://bm-access-worker.<your-subdomain>.workers.dev/unlock \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","realm":"sdv","code":"THE-CODE-YOU-GOT"}'
```

A valid code returns `{"key":"..."}` — that's the realm's current content key.

## What happens automatically

- **Monthly, 00:00 UTC on the 1st**: every realm's content key rotates, and
  any access code past its 30-day window flips to `expired` (its `payments`
  row is untouched — that history is permanent).
- **A few hours later**: the main site's scheduled rebuild (see
  `.github/workflows/deploy.yml`) picks up the freshly rotated keys and
  redeploys, so the live site always matches what this Worker considers
  current.

## Extending to a third realm later

`src/types.ts` has a single `REALMS` array — add `'ai-ml'` there (and to the
`CHECK` constraints in a new migration) once that track has anything to sell,
and everything else — rotation, issuance, the unlock endpoint — picks it up
without further changes.
