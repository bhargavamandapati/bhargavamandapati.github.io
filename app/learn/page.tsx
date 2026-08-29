import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Database, GraduationCap } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { CategoryIcon } from '@/components/learn/category-icon'
import { getAllTopics, getCurriculum, totalReadingMinutes } from '@/lib/learn'
import { vehicleProperties } from '@/lib/vehicle-properties'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Learn Android Automotive',
  description:
    'A structured, source-linked curriculum for Android Automotive OS development — VHAL, Car Service, audio zones, power management, SEPolicy, VSS and the AOSP internals behind them.',
  alternates: { canonical: '/learn/' },
  openGraph: {
    type: 'website',
    title: `Learn Android Automotive · ${site.name}`,
    description:
      'A structured, source-linked curriculum for Android Automotive OS development, from VHAL fundamentals to software-defined vehicle integration.',
    url: `${site.url}/learn/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Learn Android Automotive' }],
  },
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced: 'diff-advanced',
}

export default function LearnPage() {
  const curriculum = getCurriculum()
  const topics = getAllTopics()
  const minutes = totalReadingMinutes()
  const first = topics[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Android Automotive OS Development',
    description: metadata.description,
    url: `${site.url}/learn/`,
    provider: { '@type': 'Person', name: site.name, url: site.url },
    inLanguage: 'en',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${Math.max(1, Math.round(minutes / 60))}H`,
    },
    syllabusSections: curriculum.map((c, i) => ({
      '@type': 'Syllabus',
      name: c.name,
      description: c.blurb,
      position: i + 1,
    })),
  }

  let counter = 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow="Learn"
        title="Android Automotive OS, from the vehicle bus up"
        description="A structured curriculum for engineers building on AAOS. Every topic links straight into AOSP source on cs.android.com and the platform docs, so you can go from concept to the actual implementation in one click."
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-subtle">
          <span className="inline-flex items-center gap-2">
            <GraduationCap aria-hidden className="size-4 text-accent" />
            {topics.length} topics · {curriculum.length} modules
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden className="size-4 text-accent" />
            {Math.round(minutes / 60)}h {minutes % 60}m of reading
          </span>
        </div>

        {first && (
          <Link
            href={`/learn/${first.slug}/`}
            className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Start with {first.title}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        <div className="space-y-16">
          <section aria-labelledby="reference-heading">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent"
              >
                <Database className="size-4" />
              </span>
              <div>
                <h2
                  id="reference-heading"
                  className="font-display text-xl font-semibold tracking-tight"
                >
                  Reference
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  Lookup material rather than reading material — for when you know what you need.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <article className="card group relative flex flex-col p-6 transition-all hover:border-accent/50 hover:shadow-lg sm:flex-row sm:items-center sm:gap-6">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-fg">
                    <Link
                      href="/learn/vehicle-properties/"
                      className="after:absolute after:inset-0"
                    >
                      Vehicle property reference
                    </Link>
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                    Every one of the {vehicleProperties.length} vehicle properties Android
                    Automotive defines, generated directly from{' '}
                    <code className="font-mono text-[0.85em] text-fg">VehicleProperty.aidl</code>.
                    Search by name or hex ID, filter by area, type and access, and jump straight to
                    the AOSP source for any of them.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="chip">{vehicleProperties.length} properties</span>
                    <span className="chip">searchable</span>
                    <span className="chip">source-linked</span>
                  </div>
                </div>
                <ArrowRight
                  aria-hidden
                  className="mt-5 size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent sm:mt-0"
                />
              </article>
            </div>
          </section>

          {curriculum.map((category) => (
            <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2">
                  <CategoryIcon name={category.icon} className="size-5 text-accent" />
                </span>
                <div className="min-w-0">
                  <h2
                    id={`cat-${category.slug}`}
                    className="font-display text-xl font-semibold tracking-tight md:text-2xl"
                  >
                    {category.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {category.blurb}
                  </p>
                </div>
              </div>

              <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.topics.map((topic) => {
                  counter += 1
                  return (
                    <li key={topic.slug} className="h-full">
                      <article className="card group relative flex h-full flex-col p-5 transition-all hover:border-accent/50 hover:shadow-lg">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.7rem] text-subtle tabular-nums">
                            {String(counter).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'font-mono text-[0.65rem] uppercase tracking-wider',
                              DIFFICULTY_STYLES[topic.difficulty] ?? 'text-subtle'
                            )}
                          >
                            {topic.difficulty}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-[0.98rem] font-semibold leading-snug tracking-tight text-fg">
                          <Link href={`/learn/${topic.slug}/`} className="after:absolute after:inset-0">
                            {topic.title}
                          </Link>
                        </h3>
                        <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-muted">
                          {topic.description}
                        </p>
                        <p className="mt-4 font-mono text-[0.7rem] text-subtle">
                          {topic.readingMinutes} min read
                        </p>
                      </article>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
