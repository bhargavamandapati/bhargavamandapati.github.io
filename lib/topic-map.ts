import { topicMap } from '@/data/topic-map'
import { categoryBySlug } from '@/data/curriculum'
import { trackBySlug } from '@/data/tutorials'
import { getAllTopics } from '@/lib/learn'
import { getAllTutorials } from '@/lib/tutorials'

/**
 * The two-way map between Learn topics and tutorials.
 *
 * data/topic-map.ts is the single source of truth and is written from the
 * tutorial's side ("read these first"). The Learn side — "tutorials that put
 * this into practice" — is derived from it here, so the two directions can
 * never disagree.
 */
export type RelatedItem = {
  area: 'learn' | 'tutorials'
  slug: string
  href: string
  title: string
  /** Category or track name, shown under the title. */
  kicker: string
  description: string
}

/** Learn topics to read before a tutorial, in the order the map lists them. */
export function learnForTutorial(tutorialSlug: string): RelatedItem[] {
  const entry = topicMap.find((e) => e.tutorial === tutorialSlug)
  if (!entry) return []
  const topics = new Map(getAllTopics().map((t) => [t.slug, t]))
  return entry.learn.flatMap((slug) => {
    const t = topics.get(slug)
    if (!t) return []
    return [
      {
        area: 'learn' as const,
        slug,
        href: `/learn/${slug}/`,
        title: t.title,
        kicker: categoryBySlug.get(t.categorySlug)?.name ?? t.categorySlug,
        description: t.description,
      },
    ]
  })
}

/** Tutorials that put a Learn topic into practice. */
export function tutorialsForLearn(topicSlug: string): RelatedItem[] {
  const tutorials = new Map(getAllTutorials().map((t) => [t.slug, t]))
  return topicMap
    .filter((e) => e.learn.includes(topicSlug))
    .flatMap((e) => {
      const t = tutorials.get(e.tutorial)
      if (!t) return []
      return [
        {
          area: 'tutorials' as const,
          slug: t.slug,
          href: `/tutorials/${t.slug}/`,
          title: t.title,
          kicker: trackBySlug.get(t.trackSlug)?.name ?? t.trackSlug,
          description: t.description,
        },
      ]
    })
}
