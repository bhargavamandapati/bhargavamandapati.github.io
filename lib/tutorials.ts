import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import { tracks, trackBySlug, type Difficulty, type Track } from '@/data/tutorials'
import type { Heading } from './blog'
import type { SourceLink } from './learn'

const DIR = path.join(process.cwd(), 'content', 'tutorials')

export type Prerequisite = { label: string; href?: string }

export type TutorialMeta = {
  /** "platform/custom-lunch-target" */
  slug: string
  trackSlug: string
  tutorialSlug: string
  title: string
  description: string
  order: number
  difficulty: Difficulty
  /** Human estimate, e.g. "2–3 hours". */
  time: string
  /** One sentence: what exists at the end that did not exist at the start. */
  outcome: string
  prerequisites: Prerequisite[]
  tags: string[]
  sources: SourceLink[]
  readingMinutes: number
  words: number
}

export type Tutorial = TutorialMeta & { content: string }

function read(trackSlug: string, fileName: string): Tutorial {
  const tutorialSlug = fileName.replace(/\.mdx?$/, '')
  const where = `content/tutorials/${trackSlug}/${fileName}`
  const { data, content } = matter(fs.readFileSync(path.join(DIR, trackSlug, fileName), 'utf8'))
  const stats = readingTime(content)

  if (!data.title) throw new Error(`${where}: frontmatter is missing "title"`)
  if (typeof data.order !== 'number') throw new Error(`${where}: needs a numeric "order"`)
  if (!data.outcome) throw new Error(`${where}: needs an "outcome"`)
  if (!trackBySlug.has(trackSlug)) {
    throw new Error(`${where}: "${trackSlug}" is not a track in data/tutorials.ts`)
  }

  return {
    slug: `${trackSlug}/${tutorialSlug}`,
    trackSlug,
    tutorialSlug,
    title: String(data.title),
    description: String(data.description ?? ''),
    order: data.order,
    difficulty: (data.difficulty ?? 'Intermediate') as Difficulty,
    time: String(data.time ?? ''),
    outcome: String(data.outcome),
    prerequisites: Array.isArray(data.prerequisites) ? (data.prerequisites as Prerequisite[]) : [],
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    sources: Array.isArray(data.sources) ? (data.sources as SourceLink[]) : [],
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
    content,
  }
}

export function getAllTutorials(): Tutorial[] {
  if (!fs.existsSync(DIR)) return []
  const all: Tutorial[] = []
  for (const track of tracks) {
    const dir = path.join(DIR, track.slug)
    if (!fs.existsSync(dir)) continue
    all.push(
      ...fs
        .readdirSync(dir)
        .filter((f) => /\.mdx?$/.test(f))
        .map((f) => read(track.slug, f))
        .sort((a, b) => a.order - b.order)
    )
  }
  return all
}

export function getTutorial(slug: string): Tutorial | undefined {
  return getAllTutorials().find((t) => t.slug === slug)
}

export type TrackWithTutorials = Track & { tutorials: TutorialMeta[] }

function toMeta(t: Tutorial): TutorialMeta {
  const { content: _body, ...meta } = t
  void _body
  return meta
}

export function getTracks(): TrackWithTutorials[] {
  const all = getAllTutorials()
  return tracks
    .map((track) => ({
      ...track,
      tutorials: all.filter((t) => t.trackSlug === track.slug).map(toMeta),
    }))
    .filter((t) => t.tutorials.length > 0)
}

export function getAdjacentTutorials(slug: string): {
  previous?: TutorialMeta
  next?: TutorialMeta
} {
  const all = getAllTutorials()
  const i = all.findIndex((t) => t.slug === slug)
  if (i === -1) return {}
  return {
    previous: all[i - 1] ? toMeta(all[i - 1]) : undefined,
    next: all[i + 1] ? toMeta(all[i + 1]) : undefined,
  }
}

/** Steps are authored as `## Step N — …`; everything else is a normal section. */
export function extractTutorialHeadings(markdown: string): Heading[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '')
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  const re = /^(#{2,3})\s+(.+?)\s*$/gm
  let match: RegExpExecArray | null
  while ((match = re.exec(withoutCode)) !== null) {
    const text = match[2].replace(/[*_`]/g, '').trim()
    headings.push({ id: slugger.slug(text), text, level: match[1].length as 2 | 3 })
  }
  return headings
}

export function countSteps(markdown: string): number {
  return (markdown.match(/^##\s+Step\s+\d+/gm) ?? []).length
}
