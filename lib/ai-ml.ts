import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { aiMlModules, aiMlModuleBySlug, type Difficulty, type AiMlModule } from '@/data/ai-ml-curriculum'
import type { SourceLink } from './learn'
import { extractTopicHeadings } from './learn'

const DIR = path.join(process.cwd(), 'content', 'ai-ml')

export type AiMlTopicMeta = {
  /** "foundations/what-ai-actually-means" */
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

export type AiMlTopic = AiMlTopicMeta & { content: string }

function read(moduleSlug: string, fileName: string): AiMlTopic {
  const topicSlug = fileName.replace(/\.mdx?$/, '')
  const where = `content/ai-ml/${moduleSlug}/${fileName}`
  const { data, content } = matter(fs.readFileSync(path.join(DIR, moduleSlug, fileName), 'utf8'))
  const stats = readingTime(content)

  if (!data.title) throw new Error(`${where}: frontmatter is missing "title"`)
  if (typeof data.order !== 'number') throw new Error(`${where}: needs a numeric "order"`)
  if (!aiMlModuleBySlug.has(moduleSlug)) {
    throw new Error(`${where}: "${moduleSlug}" is not a module in data/ai-ml-curriculum.ts`)
  }

  return {
    slug: `${moduleSlug}/${topicSlug}`,
    moduleSlug,
    topicSlug,
    title: String(data.title),
    description: String(data.description ?? ''),
    order: data.order,
    difficulty: (data.difficulty ?? 'Beginner') as Difficulty,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    sources: Array.isArray(data.sources) ? (data.sources as SourceLink[]) : [],
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
    content,
  }
}

export function getAllAiMlTopics(): AiMlTopic[] {
  if (!fs.existsSync(DIR)) return []
  const all: AiMlTopic[] = []
  for (const m of aiMlModules) {
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

export function getAiMlTopic(slug: string): AiMlTopic | undefined {
  return getAllAiMlTopics().find((t) => t.slug === slug)
}

export type AiMlModuleWithTopics = AiMlModule & { topics: AiMlTopicMeta[] }

function toMeta(t: AiMlTopic): AiMlTopicMeta {
  const { content: _body, ...meta } = t
  void _body
  return meta
}

export function getAiMlCurriculum(): AiMlModuleWithTopics[] {
  const all = getAllAiMlTopics()
  return aiMlModules
    .map((m) => ({ ...m, topics: all.filter((t) => t.moduleSlug === m.slug).map(toMeta) }))
    .filter((m) => m.topics.length > 0)
}

export function getAdjacentAiMlTopics(slug: string): {
  previous?: AiMlTopicMeta
  next?: AiMlTopicMeta
} {
  const all = getAllAiMlTopics()
  const i = all.findIndex((t) => t.slug === slug)
  if (i === -1) return {}
  return {
    previous: all[i - 1] ? toMeta(all[i - 1]) : undefined,
    next: all[i + 1] ? toMeta(all[i + 1]) : undefined,
  }
}

export { extractTopicHeadings as extractAiMlHeadings }
