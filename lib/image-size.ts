import fs from 'node:fs'
import path from 'node:path'

/**
 * Reads an image's intrinsic size from the file in `public/`.
 *
 * Cover images come from the CMS as a bare path, with no dimensions attached.
 * Rendering one without them means the browser cannot reserve space, so the
 * article below it jumps down once the image loads — worst on the large
 * screenshots people actually upload. Parsing the header is enough to avoid
 * that, and it happens once at build time.
 */
export type ImageSize = { width: number; height: number }

function readPng(buf: Buffer): ImageSize | null {
  // 8-byte signature, then an IHDR chunk whose width and height are big-endian.
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

function readJpeg(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null
  let offset = 2
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buf[offset + 1]
    // SOF0–SOF15 carry the frame size; skip DHT/DRI and the rest.
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isSof) return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) }
    offset += 2 + buf.readUInt16BE(offset + 2)
  }
  return null
}

function readGif(buf: Buffer): ImageSize | null {
  if (buf.length < 10 || buf.toString('ascii', 0, 3) !== 'GIF') return null
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
}

function readWebp(buf: Buffer): ImageSize | null {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF') return null
  const format = buf.toString('ascii', 12, 16)
  if (format === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
  if (format === 'VP8L') {
    const bits = buf.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (format === 'VP8X') {
    const w = buf.readUIntLE(24, 3) + 1
    const h = buf.readUIntLE(27, 3) + 1
    return { width: w, height: h }
  }
  return null
}

/**
 * Returns the size of a public-folder image, or null when it cannot be read —
 * an unsupported format, or a path pointing somewhere other than `public/`.
 */
export function imageSize(publicPath: string): ImageSize | null {
  if (!publicPath.startsWith('/')) return null
  const file = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
  // Never read outside public/, whatever the frontmatter says.
  if (!file.startsWith(path.join(process.cwd(), 'public'))) return null
  if (!fs.existsSync(file)) return null
  try {
    const buf = fs.readFileSync(file).subarray(0, 4096)
    const size = readPng(buf) ?? readJpeg(buf) ?? readGif(buf) ?? readWebp(buf)
    if (!size || !size.width || !size.height) return null
    return size
  } catch {
    return null
  }
}
