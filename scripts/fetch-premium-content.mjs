#!/usr/bin/env node
// Pulls Learn AAOS, SDV and tutorial article source from the private
// bhargavamandapati/aaos-premium-content repo and lays it over this repo's
// content/ directory, so a local `npm run dev`/`npm run build` has real
// content to read. CI does the equivalent via a checkout step in
// .github/workflows/deploy.yml with a read-only deploy key; this script is
// for local development, using whatever git credentials you already have
// for that repo (SSH key or an HTTPS credential helper).
//
// Usage: node scripts/fetch-premium-content.mjs

import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, cpSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const REPO = 'git@github.com:bhargavamandapati/aaos-premium-content.git'
const ROOT = process.cwd()

const tmp = mkdtempSync(path.join(tmpdir(), 'aaos-premium-content-'))

try {
  console.log(`Cloning ${REPO} ...`)
  execFileSync('git', ['clone', '--depth', '1', REPO, tmp], { stdio: 'inherit' })

  const src = path.join(tmp, 'content')
  if (!existsSync(src)) {
    throw new Error(`Expected a content/ directory in ${REPO}, found none.`)
  }

  cpSync(src, path.join(ROOT, 'content'), { recursive: true })
  console.log('Premium content copied into content/learn, content/sdv, content/tutorials.')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
