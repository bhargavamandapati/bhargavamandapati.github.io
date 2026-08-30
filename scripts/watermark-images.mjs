#!/usr/bin/env node
/**
 * Bakes a watermark into every image the CMS has uploaded.
 *
 * The point of a watermark is that it survives being copied, so it has to be
 * part of the pixels rather than an overlay in the page — anything drawn in
 * CSS disappears the moment someone saves the file, which is exactly the case
 * it exists for.
 *
 * That is also why originals live in `media-src/` rather than `public/`:
 * anything under `public/` is copied verbatim into the export and served, so
 * keeping the pristine file there would leave it one URL away, watermark or
 * not. Originals stay out of the deployed site and the watermarked copies are
 * generated into `public/media/` on every build.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'media-src')
const OUT = path.join(ROOT, 'public', 'media')
const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

/** The two ink variants of the BM monogram that already ship with the site. */
const MARK_ON_DARK = path.join(ROOT, 'public', 'images', 'mark-light.png')
const MARK_ON_LIGHT = path.join(ROOT, 'public', 'images', 'mark-dark.png')

/** Perceived brightness of a region, 0-255, used to choose the ink. */
async function regionLuma(input, region) {
  const { channels } = await sharp(input).extract(region).removeAlpha().stats()
  const [r, g, b] = channels.map((c) => c.mean)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Builds the logo watermark, in whichever ink stands out against the corner it
 * will sit in.
 *
 * A single fixed variant fails half the time: the light monogram vanishes on a
 * diagram with a white background, and the dark one disappears into a terminal
 * screenshot. Sampling the destination first costs one small read and means the
 * mark is legible on both without anyone having to think about it.
 *
 * A soft shadow underneath separates the mark from busy detail, which is what a
 * flat panel behind it would otherwise be needed for.
 */
async function buildMark({ image, region, opacity = 0.85 }) {
  const luma = await regionLuma(image, region)
  const onDark = luma < 128
  const source = onDark ? MARK_ON_DARK : MARK_ON_LIGHT
  if (!existsSync(source)) throw new Error(`watermark: brand mark missing at ${source}`)

  const targetWidth = region.width
  const resized = await sharp(source)
    .resize({ width: targetWidth, fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .png()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = resized.info

  // Fade the mark by scaling its alpha, so it sits on the image rather than
  // stamping over it.
  const alpha = await sharp(resized.data).extractChannel('alpha').linear(opacity, 0).raw().toBuffer()
  const rgb = await sharp(resized.data).removeAlpha().toBuffer()
  const mark = await sharp(rgb)
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer()

  // The shadow is the mark's own silhouette, blurred — dark behind light ink
  // and light behind dark ink.
  const blur = Math.max(2, Math.round(width * 0.02))
  const shadowAlpha = await sharp(resized.data)
    .extractChannel('alpha')
    .blur(blur)
    .linear(0.55, 0)
    .raw()
    .toBuffer()
  const shadowTone = onDark ? 0 : 255
  const shadowRgb = await sharp({
    create: { width, height, channels: 3, background: { r: shadowTone, g: shadowTone, b: shadowTone } },
  })
    .png()
    .toBuffer()
  const shadow = await sharp(shadowRgb)
    .joinChannel(shadowAlpha, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer()

  const pad = blur * 2
  const composed = await sharp({
    create: { width: width + pad * 2, height: height + pad * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: shadow, top: pad + Math.round(blur * 0.4), left: pad },
      { input: mark, top: pad, left: pad },
    ])
    .png()
    .toBuffer()

  return { mark: composed, width: width + pad * 2, height: height + pad * 2, ink: onDark ? 'light' : 'dark' }
}

/**
 * The widest an image is served at.
 *
 * Covers display around 1100 CSS pixels, so 2048 still has headroom on a
 * high-density screen. The cap exists for what people actually upload: a phone
 * photo arrives four or five thousand pixels wide, and none of that reaches
 * the reader's eye.
 */
const MAX_WIDTH = 2048

async function processImage(name) {
  const from = path.join(SRC, name)
  const to = path.join(OUT, name)

  // Honour EXIF orientation before anything else, or a phone photo is marked
  // in the wrong corner and then rotated by the browser.
  const resized = await sharp(from, { failOn: 'none' })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true })
  const { width, height } = resized.info
  if (!width || !height) throw new Error(`${name}: could not read dimensions`)

  // Scale with the image so a small thumbnail and a full-width screenshot both
  // carry a mark that reads at the size it is actually displayed.
  const markWidth = Math.round(Math.min(Math.max(width * 0.13, 90), 320))
  const margin = Math.round(Math.max(width * 0.022, 10))
  const { mark, width: mw, ink } = await buildMark({
    image: resized.data,
    region: {
      left: Math.max(0, width - markWidth - margin),
      top: 0,
      width: Math.min(markWidth, width),
      height: Math.min(Math.round(markWidth * 0.75), height),
    },
  })

  let pipeline = sharp(resized.data).composite([
    { input: mark, top: margin, left: Math.max(0, width - mw - margin) },
  ])

  const ext = path.extname(name).toLowerCase()
  if (ext === '.png') {
    // Screenshots and diagrams are mostly flat colour, so a palette costs
    // almost nothing visually and roughly a quarter of the bytes. Measured at
    // 0.40/255 mean error on these covers, and transparency survives it.
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 90, effort: 8 })
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 82 })
  } else {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true })
  }

  await pipeline.toFile(to)
  const [before, after] = await Promise.all([fs.stat(from), fs.stat(to)])
  const source = await sharp(from).metadata()
  return {
    name, width, height, ink,
    resizedFrom: source.width && source.width > width ? source.width : null,
    before: before.size, after: after.size,
  }
}

async function main() {
  if (!existsSync(SRC)) {
    console.log('watermark: no media-src/ directory, nothing to do')
    return
  }
  const names = (await fs.readdir(SRC))
    .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort()

  await fs.mkdir(OUT, { recursive: true })
  // Clear stale output so a deleted upload cannot linger in the export.
  for (const existing of await fs.readdir(OUT).catch(() => [])) {
    if (existing !== '.gitkeep' && !names.includes(existing)) {
      await fs.rm(path.join(OUT, existing), { force: true })
    }
  }

  if (names.length === 0) {
    console.log('watermark: no images in media-src/')
    return
  }

  const results = []
  for (const name of names) {
    results.push(await processImage(name))
  }

  const kb = (n) => `${(n / 1024).toFixed(0)} KB`
  for (const r of results) {
    const from = r.resizedFrom ? ` (from ${r.resizedFrom}px)` : ''
    const saved = Math.round((1 - r.after / r.before) * 100)
    console.log(`  ${r.name}  ${r.width}x${r.height}${from}  ${kb(r.before)} -> ${kb(r.after)}  ${saved > 0 ? `-${saved}%` : `+${-saved}%`}  ${r.ink} ink`)
  }
  console.log(`watermark: marked ${results.length} image(s) with the BM monogram`)
}

await main()
