import { brandIcons, type BrandSlug } from '@/data/brand-icons'

/** "C / C++" -> "ccpp",  "SOME/IP" -> "someip",  "SAFe® 5" -> "safe5" */
function normalize(label: string): string {
  return label
    .toLowerCase()
    .replace(/\+/g, 'p')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Maps the labels used across data/resume.ts onto brand icons. Several labels
 * share one mark (every AOSP/AAOS variant is the Android robot); anything not
 * listed simply renders without a logo.
 */
const LABEL_TO_SLUG: Record<string, BrandSlug> = {
  // Organisations
  accenture: 'accenture',
  generalmotors: 'generalmotors',
  cadillac: 'cadillac',

  // Android platform family
  android: 'android',
  aosp: 'android',
  aaos: 'android',
  aospaaos: 'android',
  androidaosp: 'android',
  androidautomotive: 'android',
  androidautomotiveaaos: 'android',
  androidframework: 'android',
  androidos: 'android',
  jetpack: 'android',
  jetpackcompose: 'jetpackcompose',

  // Languages and tooling
  kotlin: 'kotlin',
  java: 'openjdk',
  ccpp: 'cplusplus',
  cpp: 'cplusplus',
  ccppbasic: 'cplusplus',
  qt: 'qt',
  cppqt: 'qt',
  gradle: 'gradle',
  linux: 'linux',
  git: 'git',
  eclipsekuksa: 'eclipseide',
}

export function iconSlugFor(label: string): BrandSlug | undefined {
  return LABEL_TO_SLUG[normalize(label)]
}

export function hasIcon(label: string): boolean {
  return iconSlugFor(label) !== undefined
}

export function brandFor(label: string) {
  const slug = iconSlugFor(label)
  return slug ? brandIcons[slug] : undefined
}

/**
 * Initials for an organisation with no brand mark of its own.
 * "People Tech Group Inc" -> "PT"
 */
export function monogramFor(name: string): string {
  const skip = new Set(['inc', 'ltd', 'llc', 'group', 'the', 'and', 'co', 'corp', 'gmbh', 'pvt'])
  const words = name
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !skip.has(w.toLowerCase()))
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || name.slice(0, 2).toUpperCase()
}
