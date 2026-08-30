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

/** Read from public/CNAME so the mark follows the domain, like everything else. */
async function siteLabel() {
  try {
    return (await fs.readFile(path.join(ROOT, 'public', 'CNAME'), 'utf8')).trim()
  } catch {
    return 'bhargavamandapati.com'
  }
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)
}

/**
 * Renders the mark as its own small image, sized to the text it actually
 * contains.
 *
 * Guessing the text width from character count put the label past the end of
 * its own pill, because glyph advances vary with the font libvips happens to
 * resolve. Drawing the text first and trimming to its bounding box measures it
 * instead, whatever font is installed on the machine running the build.
 */
async function buildMark(label, fontSize) {
  const font = 'DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif'
  // A canvas generous enough that no label can be clipped before trimming.
  const canvasWidth = Math.ceil(fontSize * label.length * 1.4) + fontSize * 4
  const canvasHeight = Math.ceil(fontSize * 3)
  const textOnly = Buffer.from(
    `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
  <text x="${canvasWidth / 2}" y="${canvasHeight / 2}" font-family="${font}"
        font-size="${fontSize}" font-weight="600" fill="#ffffff"
        text-anchor="middle" dominant-baseline="central">${escapeXml(label)}</text>
</svg>`,
  )

  const trimmed = await sharp(textOnly).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true })
  const textWidth = trimmed.info.width
  const textHeight = trimmed.info.height
  if (!textWidth || !textHeight) throw new Error('watermark text did not render — no usable font found')

  const padX = Math.round(fontSize * 0.85)
  const padY = Math.round(fontSize * 0.55)
  const boxWidth = textWidth + padX * 2
  const boxHeight = textHeight + padY * 2
  const radius = Math.round(boxHeight / 2)

  const pill = Buffer.from(
    `<svg width="${boxWidth}" height="${boxHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${boxWidth}" height="${boxHeight}" rx="${radius}" ry="${radius}"
        fill="#000000" fill-opacity="0.45"/>
</svg>`,
  )

  const mark = await sharp(pill)
    .composite([{ input: trimmed.data, top: padY, left: padX }])
    .png()
    .toBuffer()

  return { mark, width: boxWidth, height: boxHeight }
}

async function processImage(name, label) {
  const from = path.join(SRC, name)
  const to = path.join(OUT, name)
  const image = sharp(from, { failOn: 'none' })
  const meta = await image.metadata()
  if (!meta.width || !meta.height) throw new Error(`${name}: could not read dimensions`)

  // Scale with the image so a 600px thumbnail and a 2048px screenshot both
  // carry a mark that reads at the size it is actually displayed.
  const fontSize = Math.round(Math.min(Math.max(meta.width * 0.022, 13), 40))
  const margin = Math.round(Math.max(meta.width * 0.022, 10))
  const { mark, width: markWidth } = await buildMark(label, fontSize)

  let pipeline = image.composite([
    { input: mark, top: margin, left: Math.max(0, meta.width - markWidth - margin) },
  ])

  const ext = path.extname(name).toLowerCase()
  // Re-encode in the same format; compression is lossless for PNG, and JPEG
  // and WebP keep a quality high enough not to soften a screenshot.
  if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9 })
  else if (ext === '.webp') pipeline = pipeline.webp({ quality: 90 })
  else pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true })

  await pipeline.toFile(to)
  const [before, after] = await Promise.all([fs.stat(from), fs.stat(to)])
  return { name, width: meta.width, height: meta.height, before: before.size, after: after.size }
}

async function main() {
  if (!existsSync(SRC)) {
    console.log('watermark: no media-src/ directory, nothing to do')
    return
  }
  const label = await siteLabel()
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
    results.push(await processImage(name, label))
  }

  const kb = (n) => `${(n / 1024).toFixed(0)} KB`
  for (const r of results) {
    console.log(`  ${r.name}  ${r.width}x${r.height}  ${kb(r.before)} -> ${kb(r.after)}`)
  }
  console.log(`watermark: marked ${results.length} image(s) with "${label}"`)
}

await main()
