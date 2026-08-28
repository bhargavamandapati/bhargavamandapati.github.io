/**
 * Prefixes a public/ asset path with the deployment base path.
 *
 * next/image does not apply `basePath` to `src` when images are unoptimized
 * (which a static export requires), and plain <a href> to a static file is
 * never rewritten either. Route links via next/link are handled by Next itself
 * and must NOT go through this helper.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function asset(path: string): string {
  return `${BASE_PATH}${path}`
}
