import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BrainCircuit, Clock, FlaskConical, Sigma } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { NewBadge } from '@/components/new-badge'
import { ItemLockBadge } from '@/components/premium/item-lock-badge'
import { RequestAccessButton } from '@/components/premium/request-access'
import { AiMlModuleIcon } from '@/components/ai-ml/module-icon'
import { aiMlModules } from '@/data/ai-ml-curriculum'
import { isNewContent } from '@/data/new-content'
import { site } from '@/data/site'
import { aiMlTotalMinutes, getAllAiMlTopics, getAiMlCurriculum } from '@/lib/ai-ml'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'AI & ML: from the maths to LLMs',
  description:
    'A complete AI and machine learning curriculum, from the mathematics up: linear algebra, calculus, probability and optimisation, then classical ML, deep learning, vision, NLP, large language models, RAG and agents, with runnable code, interactive diagrams and hands-on projects.',
  alternates: { canonical: '/ai-ml/' },
  openGraph: {
    type: 'website',
    title: `AI & ML: from the maths to LLMs · ${site.name}`,
    description:
      'The mathematics, the models and the practice, explained plainly, with code, interactive diagrams and open-source projects.',
    url: `${site.url}/ai-ml/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AI & ML' }],
  },
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced: 'diff-advanced',
}

export default function AiMlPage() {
  const modules = getAiMlCurriculum()
  const topics = getAllAiMlTopics()
  const minutes = aiMlTotalMinutes()
  const first = topics[0]
  const upcoming = aiMlModules.filter((m) => !modules.some((x) => x.slug === m.slug))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'AI & ML: from the maths to LLMs',
    description: metadata.description,
    url: `${site.url}/ai-ml/`,
    provider: { '@type': 'Person', name: site.name, url: site.url },
    inLanguage: 'en',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${Math.max(1, Math.round(minutes / 60))}H`,
    },
    syllabusSections: aiMlModules.map((m, i) => ({
      '@type': 'Syllabus',
      name: m.name,
      description: m.blurb,
      position: i + 1,
    })),
  }

  let counter = 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader
        eyebrow="AI & ML"
        title="AI and machine learning, from the maths to LLMs"
        description="A full curriculum for people who want to understand how this works, not just call an API. The mathematics comes first and is taught slowly, with pictures and code. Then classical machine learning, deep learning, vision, language, large language models, RAG and agents, with runnable examples, interactive diagrams and hands-on projects built on open-source tools."
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-subtle">
          <span className="inline-flex items-center gap-2">
            <BrainCircuit aria-hidden className="size-4 text-accent" />
            {topics.length} topics · {modules.length} of {aiMlModules.length} modules published
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden className="size-4 text-accent" />
            {Math.floor(minutes / 60)}h {minutes % 60}m of reading
          </span>
          <span className="inline-flex items-center gap-2">
            <Sigma aria-hidden className="size-4 text-accent" />
            Maths first
          </span>
          <span className="inline-flex items-center gap-2">
            <FlaskConical aria-hidden className="size-4 text-accent" />
            Hands-on projects
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {first && (
            <Link
              href={`/ai-ml/${first.slug}/`}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
              Start with {first.title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <RequestAccessButton
            label="Request access"
            variant="secondary"
            defaultTopics={['aiml']}
            context="AI & ML"
          />
        </div>
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        <div className="space-y-16">
          {modules.map((m) => (
            <section key={m.slug} aria-labelledby={`aiml-${m.slug}`}>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2">
                  <AiMlModuleIcon name={m.icon} className="size-5 text-accent" />
                </span>
                <div className="min-w-0">
                  <h2
                    id={`aiml-${m.slug}`}
                    className="font-display text-xl font-semibold tracking-tight md:text-2xl"
                  >
                    {m.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{m.blurb}</p>
                </div>
              </div>

              <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {m.topics.map((t) => {
                  counter += 1
                  return (
                    <li key={t.slug} className="h-full">
                      <article className="card group relative flex h-full flex-col p-5 transition-all hover:border-accent/50 hover:shadow-lg">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.7rem] text-subtle tabular-nums">
                            {String(counter).padStart(2, '0')}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            {isNewContent('aiml', t.slug) && <NewBadge />}
                            {t.kind === 'tutorial' && (
                              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                                Hands-on
                              </span>
                            )}
                            <span
                              className={cn(
                                'font-mono text-[0.65rem] uppercase tracking-wider',
                                DIFFICULTY_STYLES[t.difficulty] ?? 'text-subtle',
                              )}
                            >
                              {t.difficulty}
                            </span>
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-[0.98rem] font-semibold leading-snug tracking-tight text-fg">
                          <Link href={`/ai-ml/${t.slug}/`} className="after:absolute after:inset-0">
                            {t.title}
                          </Link>
                          <ItemLockBadge area="aiml" slug={t.slug} className="ml-2" />
                        </h3>
                        <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-muted">
                          {t.description}
                        </p>
                        <p className="mt-4 font-mono text-[0.7rem] text-subtle">
                          {t.readingMinutes} min read
                        </p>
                      </article>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>

        {upcoming.length > 0 && (
          <section className="mt-16 max-w-3xl" aria-labelledby="aiml-upcoming">
            <h2 id="aiml-upcoming" className="font-display text-xl font-semibold tracking-tight">
              Coming up
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              New topics are added every hour. These modules are on the way.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {upcoming.map((m) => (
                <li key={m.slug} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                  <AiMlModuleIcon name={m.icon} className="mt-0.5 size-4 shrink-0 text-subtle" />
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold tracking-tight text-fg">{m.name}</p>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{m.blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-14 max-w-2xl rounded-xl border border-line bg-bg-subtle p-6">
          <h3 className="font-display text-base font-semibold tracking-tight">
            Its own key, separate from Learn AAOS and SDV
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A few topics are free to read so you can judge the explanations, the maths and the
            projects. The rest of AI &amp; ML is unlocked with its own access key. Holding a key
            for Learn AAOS or SDV does not open it, and the other way round.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <RequestAccessButton defaultTopics={['aiml']} context="AI & ML" />
          </div>
        </div>
      </div>
    </>
  )
}
