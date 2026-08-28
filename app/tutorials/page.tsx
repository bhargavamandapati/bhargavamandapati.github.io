import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Hammer, ListChecks } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { TrackIcon } from '@/components/tutorial/track-icon'
import { getAllTutorials, getTracks } from '@/lib/tutorials'
import { surfaces } from '@/data/tutorials'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'AAOS customisation tutorials',
  description:
    'Step-by-step tutorials for customising Android Automotive OS — your own lunch target, VHAL, vehicle properties, Car subservice, system service, system app, SEPolicy, RRO theming and audio topology.',
  alternates: { canonical: '/tutorials/' },
  openGraph: {
    type: 'website',
    title: `AAOS customisation tutorials · ${site.name}`,
    description:
      'Build it yourself: custom lunch targets, VHALs, vehicle properties, system services, system apps, SEPolicy and more.',
    url: `${site.url}/tutorials/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AAOS customisation tutorials' }],
  },
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced: 'diff-advanced',
}

export default function TutorialsPage() {
  const trackList = getTracks()
  const all = getAllTutorials()
  const first = all[0]
  // Only link a surface whose tutorial actually exists — the inventory lists
  // surfaces that are mapped but not yet written up, and a link to a missing
  // route would 404 on prefetch.
  const written = new Set(all.map((t) => t.slug))
  const withTutorial = surfaces.filter((s) => s.tutorial && written.has(s.tutorial)).length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Android Automotive OS customisation tutorials',
    description: metadata.description,
    numberOfItems: all.length,
    itemListElement: all.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `${site.url}/tutorials/${t.slug}/`,
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
        eyebrow="Tutorials"
        title="What you can customise in AAOS, and how"
        description="Android Automotive is built to be modified — but the modification points are spread across partitions, build files and policy languages that are documented separately, if at all. This is the map, followed by step-by-step tutorials for each one."
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-subtle">
          <span className="inline-flex items-center gap-2">
            <Hammer aria-hidden className="size-4 text-accent" />
            {all.length} tutorials · {trackList.length} tracks
          </span>
          <span className="inline-flex items-center gap-2">
            <ListChecks aria-hidden className="size-4 text-accent" />
            {surfaces.length} customisation surfaces mapped
          </span>
        </div>

        {first && (
          <Link
            href={`/tutorials/${first.slug}/`}
            className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Start with {first.title}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        {/* -------------------------------------------------- the inventory -- */}
        <section aria-labelledby="surfaces" className="mb-20">
          <h2 id="surfaces" className="font-display text-xl font-semibold tracking-tight md:text-2xl">
            Every customisation surface
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {withTutorial} of these have a full tutorial below. The rest are listed so the map is
            complete — knowing a surface exists is most of the problem.
          </p>

          <div className="mt-7 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2 text-left">
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-subtle">
                    Surface
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-subtle">
                    What it changes
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-subtle">
                    Where it lives
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-subtle">
                    Tutorial
                  </th>
                </tr>
              </thead>
              <tbody>
                {surfaces.map((s) => (
                  <tr key={s.name} className="border-t border-line">
                    <td className="px-4 py-3 font-medium text-fg">{s.name}</td>
                    <td className="px-4 py-3 text-muted">{s.what}</td>
                    <td className="px-4 py-3 font-mono text-[0.78rem] text-subtle">{s.where}</td>
                    <td className="px-4 py-3">
                      {s.tutorial && written.has(s.tutorial) ? (
                        <Link
                          href={`/tutorials/${s.tutorial}/`}
                          className="font-medium text-accent link-underline"
                        >
                          Open
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-subtle">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------------------------------------ the tracks -- */}
        <div className="space-y-16">
          {trackList.map((track) => (
            <section key={track.slug} aria-labelledby={`track-${track.slug}`}>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2">
                  <TrackIcon name={track.icon} className="size-5 text-accent" />
                </span>
                <div className="min-w-0">
                  <h2
                    id={`track-${track.slug}`}
                    className="font-display text-xl font-semibold tracking-tight md:text-2xl"
                  >
                    {track.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{track.blurb}</p>
                </div>
              </div>

              <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {track.tutorials.map((t) => {
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
                          <Link href={`/tutorials/${t.slug}/`} className="after:absolute after:inset-0">
                            {t.title}
                          </Link>
                        </h3>
                        <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-muted">
                          {t.description}
                        </p>
                        {t.time && (
                          <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-subtle">
                            <Clock aria-hidden className="size-3" />
                            {t.time}
                          </p>
                        )}
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
