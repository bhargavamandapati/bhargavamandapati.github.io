import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { glossary, glossaryCategories } from '@/data/glossary'
import { site } from '@/data/site'
import { slugify } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'AAOS glossary',
  description:
    'Plain-English definitions of Android Automotive terminology — VHAL, Treble, SELinux, audio zones, occupant zones, ASIL and the rest of the vocabulary, explained without jargon.',
  alternates: { canonical: '/glossary/' },
  openGraph: {
    type: 'website',
    title: `AAOS glossary · ${site.name}`,
    description: 'Every piece of Android Automotive jargon, explained in plain English.',
    url: `${site.url}/glossary/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AAOS glossary' }],
  },
}

export default function GlossaryPage() {
  const byCategory = glossaryCategories
    .map((category) => ({
      category,
      terms: glossary
        .filter((t) => t.category === category)
        .sort((a, b) => a.term.localeCompare(b.term)),
    }))
    .filter((g) => g.terms.length > 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Android Automotive OS glossary',
    description: metadata.description,
    url: `${site.url}/glossary/`,
    hasDefinedTerm: glossary.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.short,
      url: `${site.url}/glossary/#${slugify(t.term)}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow="Glossary"
        title="Every AAOS term, in plain English"
        description="Automotive Android is unusually jargon-dense, and most of it is never defined anywhere. This is the vocabulary, without assuming you already know it. Terms are linked throughout the curriculum — hover any dotted word to read its definition without leaving the page."
      >
        <p className="mt-7 font-mono text-xs text-subtle">
          {glossary.length} terms · {byCategory.length} categories
        </p>
      </PageHeader>

      <div className="container-page py-14 md:py-16">
        <nav aria-label="Glossary categories" className="flex flex-wrap gap-2">
          {byCategory.map((g) => (
            <a
              key={g.category}
              href={`#${slugify(g.category)}`}
              className="rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {g.category}
              <span className="ml-1.5 text-subtle">{g.terms.length}</span>
            </a>
          ))}
        </nav>

        <div className="mt-14 space-y-16">
          {byCategory.map((group) => (
            <section key={group.category} aria-labelledby={slugify(group.category)}>
              <h2
                id={slugify(group.category)}
                className="scroll-mt-24 border-b border-line pb-3 font-display text-xl font-semibold tracking-tight md:text-2xl"
              >
                {group.category}
              </h2>

              <dl className="mt-8 space-y-8">
                {group.terms.map((t) => (
                  <div key={t.term} id={slugify(t.term)} className="scroll-mt-24">
                    <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-lg font-semibold tracking-tight text-fg">
                        {t.term}
                      </span>
                      {t.aliases && t.aliases.length > 0 && (
                        <span className="font-mono text-xs text-subtle">
                          also: {t.aliases.join(' · ')}
                        </span>
                      )}
                    </dt>
                    <dd className="mt-2.5 max-w-3xl">
                      <p className="text-[0.95rem] font-medium leading-relaxed text-fg">{t.short}</p>
                      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{t.long}</p>
                      {t.analogy && (
                        <p className="mt-3 border-l-2 border-accent/50 pl-4 text-[0.9rem] italic leading-relaxed text-muted">
                          {t.analogy}
                        </p>
                      )}
                      {t.related && t.related.length > 0 && (
                        <p className="mt-3 font-mono text-xs text-subtle">
                          See also:{' '}
                          {t.related.map((r, i) => (
                            <span key={r}>
                              {i > 0 && ' · '}
                              <a href={`#${slugify(r)}`} className="text-accent link-underline">
                                {r}
                              </a>
                            </span>
                          ))}
                        </p>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
