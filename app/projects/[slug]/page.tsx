import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, CalendarDays, Layers } from 'lucide-react'
import { CompanyMark, TechIcon } from '@/components/brand-icon'
import { projects } from '@/data/resume'
import { site } from '@/data/site'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}/` },
    openGraph: {
      type: 'article',
      title: `${project.name} · ${site.name}`,
      description: project.summary,
      url: `${site.url}/projects/${project.slug}/`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: project.name }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    about: project.domain,
    keywords: project.stack.join(', '),
    author: { '@type': 'Person', name: site.name, url: site.url },
    url: `${site.url}/projects/${project.slug}/`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="grid-bg absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-40 size-[30rem] rounded-full blur-[120px]"
          style={{ background: 'var(--glow-a)' }}
        />
        <div className="container-page relative py-16 md:py-20">
          <Link
            href="/projects/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>

          <span className="chip mt-6">{project.domain}</span>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {project.name}
          </h1>

          <p className="mt-5 flex items-center gap-2 font-mono text-sm text-muted">
            <CalendarDays aria-hidden className="size-4" />
            {project.period}
          </p>
        </div>
      </header>

      <article className="container-page grid gap-12 py-14 md:py-16 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <div>
          <p className="text-lg leading-[1.8] text-fg">{project.description}</p>

          <h2 className="mt-12 font-display text-xl font-semibold tracking-tight">
            What I did
          </h2>
          <ul className="mt-6 space-y-4">
            {project.highlights.map((h) => (
              <li key={h} className="relative border-l border-line pl-5 text-base leading-relaxed text-muted">
                <span
                  aria-hidden
                  className="absolute -left-[0.3rem] top-2.5 size-[0.4rem] rounded-full bg-accent"
                />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight">
              <Layers aria-hidden className="size-4 text-accent" />
              Stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech} className="chip">
                  <TechIcon label={tech} className="size-3.5" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.clients && (
            <div className="card mt-5 p-6">
              <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight">
                <Building2 aria-hidden className="size-4 text-accent" />
                Delivered for
              </h2>
              <ul className="mt-4 space-y-3">
                {project.clients.map((client) => (
                  <li key={client} className="flex items-center gap-3">
                    <CompanyMark name={client} size="sm" />
                    <span className="text-sm text-muted">{client}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/projects/${next.slug}/`}
            className="card group mt-5 block p-6 transition-colors hover:border-accent/50"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-subtle">Next project</p>
            <p className="mt-2 flex items-center justify-between gap-3 font-display text-sm font-semibold text-fg">
              {next.name}
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
              />
            </p>
          </Link>
        </aside>
      </article>
    </>
  )
}
