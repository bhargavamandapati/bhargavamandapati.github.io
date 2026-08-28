import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import { categories, categoryBySlug, type Category, type Difficulty } from '@/data/curriculum'
import type { Heading } from './blog'

const LEARN_DIR = path.join(process.cwd(), 'content', 'learn')

export type SourceLink = { label: string; href: string }

export type TopicMeta = {
  /** "vehicle-data/vhal-fundamentals" */
  slug: string
  categorySlug: string
  topicSlug: string
  title: string
  description: string
  order: number
  difficulty: Difficulty
  tags: string[]
  sources: SourceLink[]
  updated?: string
  readingMinutes: number
  words: number
}

export type Topic = TopicMeta & { content: string }

function readTopic(categorySlug: string, fileName: string): Topic {
  const topicSlug = fileName.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(LEARN_DIR, categorySlug, fileName), 'utf8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)
  const where = `content/learn/${categorySlug}/${fileName}`

  if (!data.title) throw new Error(`${where}: frontmatter is missing "title"`)
  if (typeof data.order !== 'number') throw new Error(`${where}: frontmatter needs a numeric "order"`)
  if (!categoryBySlug.has(categorySlug)) {
    throw new Error(`${where}: "${categorySlug}" is not a category in data/curriculum.ts`)
  }

  return {
    slug: `${categorySlug}/${topicSlug}`,
    categorySlug,
    topicSlug,
    title: String(data.title),
    description: String(data.description ?? ''),
    order: data.order,
    difficulty: (data.difficulty ?? 'Intermediate') as Difficulty,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    sources: Array.isArray(data.sources) ? (data.sources as SourceLink[]) : [],
    updated: data.updated ? String(data.updated).slice(0, 10) : undefined,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
    content,
  }
}

/** Every topic, in curriculum order: category order first, then frontmatter `order`. */
export function getAllTopics(): Topic[] {
  if (!fs.existsSync(LEARN_DIR)) return []

  const topics: Topic[] = []
  for (const category of categories) {
    const dir = path.join(LEARN_DIR, category.slug)
    if (!fs.existsSync(dir)) continue
    const inCategory = fs
      .readdirSync(dir)
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => readTopic(category.slug, f))
      .sort((a, b) => a.order - b.order)
    topics.push(...inCategory)
  }
  return topics
}

export function getTopic(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug)
}

export type CategoryWithTopics = Category & { topics: TopicMeta[] }

/** The full tree, used by the hub index and the sidebar. */
export function getCurriculum(): CategoryWithTopics[] {
  const all = getAllTopics()
  return categories
    .map((category) => ({
      ...category,
      topics: all
        .filter((t) => t.categorySlug === category.slug)
        .map(({ content: _body, ...meta }) => {
          void _body
          return meta
        }),
    }))
    .filter((c) => c.topics.length > 0)
}

/** Linear walk across the whole curriculum, for prev/next at the foot of a page. */
export function getAdjacentTopics(slug: string): { previous?: TopicMeta; next?: TopicMeta } {
  const all = getAllTopics()
  const i = all.findIndex((t) => t.slug === slug)
  if (i === -1) return {}
  const strip = (t?: Topic): TopicMeta | undefined => {
    if (!t) return undefined
    const { content: _body, ...meta } = t
    void _body
    return meta
  }
  return { previous: strip(all[i - 1]), next: strip(all[i + 1]) }
}

export function extractTopicHeadings(markdown: string): Heading[] {
  // Strip fenced code so `# comments` inside samples never become headings.
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

export function totalReadingMinutes(): number {
  return getAllTopics().reduce((sum, t) => sum + t.readingMinutes, 0)
}
