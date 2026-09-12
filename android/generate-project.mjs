#!/usr/bin/env node
// Generates the Android (TWA) Gradle project from the live web manifest, so the
// project itself never needs to be committed — only this script and the small
// override config below it.
//
// Runs against the deployed site (not a local build): a Trusted Web Activity
// just points Chrome at a URL, so there's nothing to build locally, and
// TwaManifest.fromWebManifest() needs to fetch the manifest and icons from a
// real, reachable host anyway.

import { TwaManifest, TwaGenerator, ConsoleLog } from '@bubblewrap/core'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const overrides = JSON.parse(readFileSync(join(here, 'twa-config.json'), 'utf8'))

const webManifestUrl = process.env.WEB_MANIFEST_URL
const keystorePath = process.env.ANDROID_KEYSTORE_PATH
const targetDirectory = process.env.TWA_PROJECT_DIR || join(here, 'app-project')

if (!webManifestUrl) throw new Error('WEB_MANIFEST_URL is required')
if (!keystorePath) throw new Error('ANDROID_KEYSTORE_PATH is required')

const twaManifest = await TwaManifest.fromWebManifest(webManifestUrl)

twaManifest.packageId = overrides.packageId
twaManifest.launcherName = overrides.launcherName
twaManifest.appVersionCode = overrides.appVersionCode
twaManifest.appVersionName = overrides.appVersionName
twaManifest.minSdkVersion = overrides.minSdkVersion
twaManifest.orientation = overrides.orientation
twaManifest.signingKey = { path: keystorePath, alias: overrides.signingKeyAlias }

const manifestFile = join(targetDirectory, 'twa-manifest.json')
await twaManifest.saveToFile(manifestFile)

const twaGenerator = new TwaGenerator()
await twaGenerator.createTwaProject(targetDirectory, twaManifest, new ConsoleLog('generate'))

// `bubblewrap build` only re-prompts to regenerate the project when this
// checksum is missing or stale — write it up front so the CI build stays
// non-interactive.
const sum = createHash('sha1').update(readFileSync(manifestFile)).digest('hex')
writeFileSync(join(targetDirectory, 'manifest-checksum.txt'), sum)

console.log(`Android project generated at ${targetDirectory}`)
