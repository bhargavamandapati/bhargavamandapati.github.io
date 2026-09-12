#!/usr/bin/env node
// Generates out/sw.js so the site is installable and readable offline.
//
// Run last in the build, against the final published `out/` — after
// PREMIUM_RENDER_ALL's discarded harvest build, and after encrypt-premium.mjs
// has written the real encrypted /premium/*.json payloads other content
// depends on at runtime.
//
// Precaches only the hashed app shell (_next/static, icons, manifest) —
// cheap, safe to cache forever, and doesn't change on every content edit.
// Everything else (pages, premium payloads, images, fonts) is cached at
// runtime instead, so a previously-visited page — including an unlocked
// premium article, whose payload is fetched once and cached from then on —
// keeps working offline without bloating the precache on every deploy.

import { generateSW } from 'workbox-build'
import { basename } from 'node:path'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const { count, size, warnings } = await generateSW({
  globDirectory: 'out',
  globPatterns: ['_next/static/**/*.{js,css}', 'images/icon-192.png', 'images/icon-512.png'],
  swDest: 'out/sw.js',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // HTML pages: try the network first, so a fresh visit gets fresh
      // content; fall back to whatever was cached from an earlier visit
      // when offline. A page never visited before with no network simply
      // fails, same as any uncached site would.
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 4,
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      // Encrypted premium payloads. Already public, unauthenticated ciphertext
      // — caching them offline reveals nothing a live fetch wouldn't. Once a
      // topic has been unlocked and its payload fetched, it stays readable
      // offline with the same access key.
      urlPattern: new RegExp(`^${basePath}/premium/`),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'premium-payloads',
        expiration: { maxEntries: 500, maxAgeSeconds: 90 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'font',
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
  ],
})

if (warnings.length) {
  for (const w of warnings) console.warn(`service worker: ${w}`)
}
console.log(
  `service worker: precached ${count} file(s), ${(size / 1024).toFixed(0)} KB -> out/${basename('sw.js')}`,
)
