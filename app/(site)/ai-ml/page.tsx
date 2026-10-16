import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BrainCircuit, Clock, Compass } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RequestAccessButton } from '@/components/premium/request-access'
import { site } from '@/data/site'
import { aiMlModules, topicsForModule } from '@/data/ai-ml-curriculum'
import { getAllAiMlTopics } from '@/lib/ai-ml'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'AI & ML for Automotive',
  description:
    'A new track on AI and machine learning in the vehicle, in progress — the same source-linked, no-hand-waving treatment as the rest of this site. The first lesson is free to read; the rest of the track will be its own separate subscription.',
  alternates: { canonical: '/ai-ml/' },
  openGraph: {
    type: 'website',
    title: `AI & ML for Automotive · ${site.name}`,
    description: 'A new track on AI and machine learning in the vehicle. First lesson live now.',
    url: `${site.url}/ai-ml/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AI & ML for Automotive' }],
  },
}

export default function AiMlPage() {
  const publishedTopics = getAllAiMlTopics()

  return (
    <>
      <PageHeader
        eyebrow="In progress"
        title="AI & ML for Automotive"
        description="A third track, alongside Learn AAOS and SDV — AI and machine learning as they actually show up in the vehicle, not a generic ML course with a car in the title. The first lesson is live; the rest is still being written."
      />

      <div className="container-page py-14 md:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-surface-2">
            <BrainCircuit aria-hidden className="size-5 text-accent" />
          </span>

          <h2 className="mt-6 font-display text-xl font-semibold tracking-tight md:text-2xl">
            Same standard, new subject
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Everything else on this site is written a specific way: plain explanations, real
            source rather than paraphrased docs, and nothing asserted that hasn&rsquo;t been
            checked. This track applies that to AI and machine learning in the automotive
            stack — where inference actually runs, what changes when it has to happen
            on-device, and how it connects to the platform work the rest of this site already
            covers.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            The first lesson below is live and free to read. Everything after it is still just
            an outline — reviewed here before any more lesson content gets written.
          </p>
        </div>

        <div className="mt-12 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2">
              <Compass aria-hidden className="size-4 text-accent" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Module 1 · {aiMlModules[0].name}
              </h2>
              <p className="mt-0.5 text-sm text-muted">{aiMlModules[0].blurb}</p>
            </div>
          </div>

          <ol className="mt-6 space-y-3">
            {topicsForModule(aiMlModules[0].slug).map((topic, i) => {
              const published = publishedTopics.find(
                (t) => t.moduleSlug === topic.moduleSlug && t.topicSlug === topic.topicSlug
              )
              return (
                <li
                  key={topic.topicSlug}
                  className={cn(
                    'flex gap-4 rounded-xl border p-4',
                    published
                      ? 'card group relative border-accent/30 bg-surface transition-all hover:border-accent/60 hover:shadow-lg'
                      : 'border-line bg-surface'
                  )}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-subtle tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-fg">
                        {published ? (
                          <Link href={`/ai-ml/${published.slug}/`} className="after:absolute after:inset-0">
                            {topic.title}
                          </Link>
                        ) : (
                          topic.title
                        )}
                      </h3>
                      <span
                        className={cn(
                          'font-mono text-[0.65rem] uppercase tracking-wider',
                          topic.difficulty === 'Beginner' && 'diff-beginner',
                          topic.difficulty === 'Intermediate' && 'diff-intermediate',
                          topic.difficulty === 'Advanced' && 'diff-advanced',
                        )}
                      >
                        {topic.difficulty}
                      </span>
                      {published ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-subtle">
                          <Clock aria-hidden className="size-3" />
                          {published.readingMinutes} min
                        </span>
                      ) : (
                        <span className="chip">planned</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted">
                      {topic.description}
                    </p>
                  </div>
                  {published && (
                    <ArrowRight
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 self-start text-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent"
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        <div className="mt-12 max-w-2xl">
          <div className="rounded-xl border border-line bg-bg-subtle p-6">
            <h3 className="font-display text-base font-semibold tracking-tight">
              Its own subscription, separate from Learn AAOS and SDV
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Learn AAOS and SDV already work this way — an access key per track, so holding
              one says nothing about the other. AI &amp; ML for Automotive will follow the
              same pattern once it launches: a separate track, on its own key, so you only
              ever pay for what you actually want. Reach out for details and cost, or to be
              told when it&rsquo;s ready.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <RequestAccessButton context="AI & ML for Automotive — early access" />
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
          >
            Back to the rest of the site
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </>
  )
}
