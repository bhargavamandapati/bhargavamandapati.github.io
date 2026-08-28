import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import { slugify } from './utils'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  updated?: string
  tags: string[]
  cover?: string
  /** Set when the post was published elsewhere first (e.g. Medium) — emits rel=canonical. */
  canonical?: string
  draft: boolean
  featured: boolean
  readingMinutes: number
  words: number
}

export type Post = PostMeta & { content: string }

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  if (!data.title) throw new Error(`content/blog/${fileName}: frontmatter is missing "title"`)
  if (!data.date) throw new Error(`content/blog/${fileName}: frontmatter is missing "date"`)

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ''),
    date: String(data.date).slice(0, 10),
    updated: data.updated ? String(data.updated).slice(0, 10) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    canonical: data.canonical ? String(data.canonical) : undefined,
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
    content,
  }
}

/** Drafts are kept out of production builds but stay visible via `npm run dev`. */
function isVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV === 'development'
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPostFile)
    .filter(isVisible)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export type TagCount = { tag: string; slug: string; count: number }

export function getAllTags(): TagCount[] {
  const counts = new Map<string, TagCount>()
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const slug = slugify(tag)
      const existing = counts.get(slug)
      if (existing) existing.count += 1
      else counts.set(slug, { tag, slug, count: 1 })
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter((p) => p.tags.some((t) => slugify(t) === tagSlug))
}

/** Drops the MDX body so post data can cross the server/client boundary. */
export function toMeta(post: Post): PostMeta {
  const { content: _body, ...meta } = post
  void _body
  return meta
}

/** Previous/next by publication order, for in-article navigation. */
export function getAdjacentPosts(slug: string): { previous?: Post; next?: Post } {
  const posts = getAllPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return { previous: posts[i + 1], next: posts[i - 1] }
}

export type Heading = { id: string; text: string; level: 2 | 3 }

/** Pulls h2/h3 out of raw MDX to build a table of contents, skipping fenced code. */
export function extractHeadings(markdown: string): Heading[] {
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
