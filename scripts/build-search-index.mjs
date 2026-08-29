/**
 * Builds public/search-index.json before the Next build.
 *
 * Scope is the learning material only — Learn AAOS, SDV and Writing. The
 * portfolio sections are a handful of pages someone reads directly; putting a
 * CV into the same result list as 280 vehicle properties helps nobody.
 *
 * The index has to exist as a static file: the site is an `output: export`
 * build, so there is no server to query, and embedding ~500 entries in the RSC
 * payload of every page would cost far more than fetching it once on demand.
 *
 * Run automatically by `npm run build`.
 */
import { readFileSync, writeFileSync, globSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()

// The data modules are plain TypeScript with no imports, so Node's type
// stripping loads them directly — far less brittle than parsing the source.
const { glossary } = await import('../data/glossary.ts')
const { vehicleProperties } = await import('../data/vehicle-properties.ts')

/** Collapses MDX to plain prose for the excerpt and keyword text. */
function plain(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const entries = []
const add = (e) => entries.push(e)

// ---- MDX content ----------------------------------------------------------
const SECTIONS = [
  { dir: 'content/learn', base: '/learn', kind: 'Learn AAOS' },
  { dir: 'content/sdv', base: '/sdv', kind: 'SDV' },
  { dir: 'content/tutorials', base: '/tutorials', kind: 'Tutorial' },
]
for (const section of SECTIONS) {
  for (const file of globSync(`${section.dir}/**/*.mdx`, { cwd: ROOT }).sort()) {
    const raw = readFileSync(path.join(ROOT, file), 'utf8')
    const { data, content } = matter(raw)
    const slug = file.slice(section.dir.length + 1).replace(/\.mdx$/, '')
    add({
      t: data.title ?? slug,
      d: data.description ?? '',
      u: `${section.base}/${slug}/`,
      k: section.kind,
      // A trimmed body gives search something to match beyond the summary
      // without carrying the whole topic into the index.
      x: plain(content).slice(0, 320),
      g: Array.isArray(data.tags) ? data.tags.join(' ') : '',
    })
  }
}

for (const file of globSync('content/blog/*.mdx', { cwd: ROOT }).sort()) {
  const { data, content } = matter(readFileSync(path.join(ROOT, file), 'utf8'))
  if (data.draft) continue
  add({
    t: data.title,
    d: data.description ?? '',
    u: `/blog/${path.basename(file, '.mdx')}/`,
    k: 'Writing',
    x: plain(content).slice(0, 320),
    g: Array.isArray(data.tags) ? data.tags.join(' ') : '',
  })
}

// ---- Glossary -------------------------------------------------------------
for (const term of glossary) {
  add({
    t: term.term,
    d: term.short,
    u: `/glossary/#${term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    k: 'Glossary',
    x: (term.long ?? '').slice(0, 240),
    g: (term.aliases ?? []).join(' '),
  })
}

// ---- Vehicle properties ---------------------------------------------------
for (const p of vehicleProperties) {
  add({
    t: p.name,
    d: `${p.hex} · ${p.area} · ${p.type} · ${p.access ?? ''}`,
    u: `/learn/vehicle-properties/${p.name.toLowerCase().replace(/_/g, '-')}/`,
    k: 'Property',
    x: p.description.replace(/\s+/g, ' ').slice(0, 200),
    // Searching the decimal ID should find it too.
    g: `${p.id} ${p.hex} ${p.group} ${p.unit ?? ''} ${p.dataEnums.join(' ')}`,
  })
}

// ---- Standalone pages -----------------------------------------------------
for (const page of [
  { t: 'Vehicle property reference', d: 'Every Android Automotive vehicle property, searchable and source-linked.', u: '/learn/vehicle-properties/', k: 'Page' },
  { t: 'Vehicle property simulator', d: 'Change a property and watch what it does to the car, in 3D.', u: '/learn/vehicle-simulator/', k: 'Page' },
  { t: 'Cockpit zones and displays', d: 'Occupant zones, multi-display and UX restrictions, live.', u: '/learn/cockpit-displays/', k: 'Page' },
  { t: 'Glossary', d: 'Plain-language definitions for automotive and AAOS vocabulary.', u: '/glossary/', k: 'Page' },
  { t: 'Tutorials', d: 'Step-by-step builds for the things you customise in AAOS.', u: '/tutorials/', k: 'Page' },
  { t: 'Learn Android Automotive', d: 'A structured, source-linked AAOS curriculum.', u: '/learn/', k: 'Page' },
  { t: 'Software-defined vehicles', d: 'The vehicle-software shift, end to end.', u: '/sdv/', k: 'Page' },
]) {
  add({ ...page, x: '', g: '' })
}

mkdirSync(path.join(ROOT, 'public'), { recursive: true })
const out = path.join(ROOT, 'public/search-index.json')
writeFileSync(out, JSON.stringify(entries))

const bytes = readFileSync(out).length
const byKind = entries.reduce((acc, e) => ({ ...acc, [e.k]: (acc[e.k] ?? 0) + 1 }), {})
console.log(`search index: ${entries.length} entries, ${(bytes / 1024).toFixed(0)} KB`)
for (const [kind, n] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${kind}`)
}
