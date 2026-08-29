import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Cpu } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { SdvModuleIcon } from '@/components/sdv/module-icon'
import { getAllSdvTopics, getSdvCurriculum, sdvTotalMinutes } from '@/lib/sdv'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Software-Defined Vehicle',
  description:
    'A complete curriculum on software-defined vehicles — zonal architecture, service-oriented communication, SOME/IP, DDS, VSS, hypervisors, virtual ECUs, OTA and feature-on-demand, covering both the instrument cluster and infotainment.',
  alternates: { canonical: '/sdv/' },
  openGraph: {
    type: 'website',
    title: `Software-Defined Vehicle · ${site.name}`,
    description:
      'Zonal architecture, service-oriented communication, virtual ECUs and continuous delivery — for both cluster and infotainment.',
    url: `${site.url}/sdv/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Software-Defined Vehicle' }],
  },
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced: 'diff-advanced',
}

export default function SdvPage() {
  const modules = getSdvCurriculum()
  const topics = getAllSdvTopics()
  const minutes = sdvTotalMinutes()
  const first = topics[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Software-Defined Vehicle',
    description: metadata.description,
    url: `${site.url}/sdv/`,
    provider: { '@type': 'Person', name: site.name, url: site.url },
    inLanguage: 'en',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${Math.max(1, Math.round(minutes / 60))}H`,
    },
    syllabusSections: modules.map((m, i) => ({
      '@type': 'Syllabus',
      name: m.name,
      description: m.blurb,
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
        eyebrow="SDV"
        title="The software-defined vehicle, explained properly"
        description="Cars are becoming computers with wheels — fewer, more powerful processors, functions delivered as software, features that arrive after the car is sold. This is what that actually means in engineering terms, covering both the instrument cluster and the infotainment domain, with no assumed vocabulary."
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-subtle">
          <span className="inline-flex items-center gap-2">
            <Cpu aria-hidden className="size-4 text-accent" />
            {topics.length} topics · {modules.length} modules
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden className="size-4 text-accent" />
            {Math.floor(minutes / 60)}h {minutes % 60}m of reading
          </span>
        </div>

        {first && (
          <Link
            href={`/sdv/${first.slug}/`}
            className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Start with {first.title}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        <div className="space-y-16">
          {modules.map((m) => (
            <section key={m.slug} aria-labelledby={`sdv-${m.slug}`}>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2">
                  <SdvModuleIcon name={m.icon} className="size-5 text-accent" />
                </span>
                <div className="min-w-0">
                  <h2
                    id={`sdv-${m.slug}`}
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
                          <span
                            className={cn(
                              'font-mono text-[0.65rem] uppercase tracking-wider',
                              DIFFICULTY_STYLES[t.difficulty] ?? 'text-subtle'
                            )}
                          >
                            {t.difficulty}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-[0.98rem] font-semibold leading-snug tracking-tight text-fg">
                          <Link href={`/sdv/${t.slug}/`} className="after:absolute after:inset-0">
                            {t.title}
                          </Link>
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
      </div>
    </>
  )
}
