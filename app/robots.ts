import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export const dynamic = 'force-static'

/**
 * Crawlers that collect pages to train generative models, rather than to send
 * readers here.
 *
 * The distinction matters: search crawlers are how anyone finds this site, so
 * they stay welcome. Google-Extended and Applebot-Extended exist precisely so
 * a site can decline AI training without affecting its search ranking, and
 * OAI-SearchBot and ChatGPT-User are left out of this list for the same reason
 * — they answer a reader's question and cite the source.
 *
 * This is a request, not a control. Well-behaved crawlers honour it; anything
 * determined to scrape the site will ignore the file and read the HTML anyway.
 */
const AI_TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'FacebookBot',
  'CCBot',
  'Bytespider',
  'PerplexityBot',
  'Amazonbot',
  'cohere-ai',
  'Diffbot',
  'Omgilibot',
  'ImagesiftBot',
  'YouBot',
  'AI2Bot',
  'Timpibot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_TRAINING_CRAWLERS, disallow: '/' },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
