import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags } from '@/lib/blog'
import { getAllTopics } from '@/lib/learn'
import { getAllTutorials } from '@/lib/tutorials'
import { getAllSdvTopics } from '@/lib/sdv'
import { vehicleProperties, propertySlug } from '@/lib/vehicle-properties'
import { projects } from '@/data/resume'
import { site } from '@/data/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const topics = getAllTopics()
  const tutorials = getAllTutorials()
  const sdv = getAllSdvTopics()
  const latestPost = posts[0]?.date

  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site.url}/projects/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${site.url}/learn/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${site.url}/sdv/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${site.url}/tutorials/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${site.url}/glossary/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...topics.map((t) => ({
      url: `${site.url}/learn/${t.slug}/`,
      lastModified: t.updated ? new Date(t.updated) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/learn/vehicle-properties/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/learn/vehicle-simulator/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...vehicleProperties.map((p) => ({
      url: `${site.url}/learn/vehicle-properties/${propertySlug(p)}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
    ...sdv.map((t) => ({
      url: `${site.url}/sdv/${t.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...tutorials.map((t) => ({
      url: `${site.url}/tutorials/${t.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}/`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...getAllTags().map((t) => ({
      url: `${site.url}/tags/${t.slug}/`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ]
}
