import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import {
  sdvModules,
  sdvModuleBySlug,
  type Difficulty,
  type SdvModule,
} from '@/data/sdv-curriculum'
import type { Heading } from './blog'
import type { SourceLink } from './learn'

const DIR = path.join(process.cwd(), 'content', 'sdv')

export type SdvTopicMeta = {
  /** "architecture/zonal-architecture" */
  slug: string
  moduleSlug: string
  topicSlug: string
  title: string
  description: string
  order: number
  difficulty: Difficulty
  tags: string[]
  sources: SourceLink[]
  readingMinutes: number
  words: number
}

export type SdvTopic = SdvTopicMeta & { content: string }

function read(moduleSlug: string, fileName: string): SdvTopic {
  const topicSlug = fileName.replace(/\.mdx?$/, '')
  const where = `content/sdv/${moduleSlug}/${fileName}`
  const { data, content } = matter(fs.readFileSync(path.join(DIR, moduleSlug, fileName), 'utf8'))
  const stats = readingTime(content)

  if (!data.title) throw new Error(`${where}: frontmatter is missing "title"`)
  if (typeof data.order !== 'number') throw new Error(`${where}: needs a numeric "order"`)
  if (!sdvModuleBySlug.has(moduleSlug)) {
    throw new Error(`${where}: "${moduleSlug}" is not a module in data/sdv-curriculum.ts`)
  }

  return {
    slug: `${moduleSlug}/${topicSlug}`,
    moduleSlug,
    topicSlug,
    title: String(data.title),
    description: String(data.description ?? ''),
    order: data.order,
    difficulty: (data.difficulty ?? 'Intermediate') as Difficulty,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    sources: Array.isArray(data.sources) ? (data.sources as SourceLink[]) : [],
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
    content,
  }
}

export function getAllSdvTopics(): SdvTopic[] {
  if (!fs.existsSync(DIR)) return []
  const all: SdvTopic[] = []
  for (const m of sdvModules) {
    const dir = path.join(DIR, m.slug)
    if (!fs.existsSync(dir)) continue
    all.push(
      ...fs
        .readdirSync(dir)
        .filter((f) => /\.mdx?$/.test(f))
        .map((f) => read(m.slug, f))
        .sort((a, b) => a.order - b.order)
    )
  }
  return all
}

export function getSdvTopic(slug: string): SdvTopic | undefined {
  return getAllSdvTopics().find((t) => t.slug === slug)
}

export type SdvModuleWithTopics = SdvModule & { topics: SdvTopicMeta[] }

function toMeta(t: SdvTopic): SdvTopicMeta {
  const { content: _body, ...meta } = t
  void _body
  return meta
}

export function getSdvCurriculum(): SdvModuleWithTopics[] {
  const all = getAllSdvTopics()
  return sdvModules
    .map((m) => ({ ...m, topics: all.filter((t) => t.moduleSlug === m.slug).map(toMeta) }))
    .filter((m) => m.topics.length > 0)
}

export function getAdjacentSdvTopics(slug: string): {
  previous?: SdvTopicMeta
  next?: SdvTopicMeta
} {
  const all = getAllSdvTopics()
  const i = all.findIndex((t) => t.slug === slug)
  if (i === -1) return {}
  return {
    previous: all[i - 1] ? toMeta(all[i - 1]) : undefined,
    next: all[i + 1] ? toMeta(all[i + 1]) : undefined,
  }
}

export function extractSdvHeadings(markdown: string): Heading[] {
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

export function sdvTotalMinutes(): number {
  return getAllSdvTopics().reduce((n, t) => n + t.readingMinutes, 0)
}
