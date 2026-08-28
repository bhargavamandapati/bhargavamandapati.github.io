import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { LogoMark } from '@/components/brand'
import { SocialLinks } from '@/components/social-links'
import { profile, experience } from '@/data/resume'
import { site } from '@/data/site'

/** A stylised VSS read-out — signals like the ones this work actually plumbs. */
const signals = [
  { path: 'Vehicle.Speed', value: '62', unit: 'km/h' },
  { path: 'Vehicle.Cabin.HVAC.Temperature', value: '21.5', unit: '°C' },
  { path: 'Vehicle.Powertrain.Range', value: '318', unit: 'km' },
  { path: 'Vehicle.Body.Lights.Beam', value: 'LOW', unit: '' },
]

function SignalPanel() {
  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <LogoMark
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-4 h-28 opacity-[0.06] dark:opacity-[0.09]"
      />
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">
          VHAL · signal bus
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] text-accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          LIVE
        </span>
      </div>

      <dl className="mt-4 space-y-3">
        {signals.map((s) => (
          <div key={s.path} className="flex items-baseline justify-between gap-4">
            <dt className="truncate font-mono text-[0.78rem] text-muted">{s.path}</dt>
            <dd className="shrink-0 font-mono text-[0.82rem] font-medium text-fg">
              {s.value}
              {s.unit && <span className="ml-1 text-subtle">{s.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
        {['AOSP', 'AAOS', 'SDV'].map((tag) => (
          <span key={tag} className="font-mono text-[0.7rem] tracking-widest text-subtle">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  const current = experience[0]

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 size-[38rem] rounded-full blur-[120px]"
        style={{ background: 'var(--glow-a)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[30rem] rounded-full blur-[120px]"
        style={{ background: 'var(--glow-b)' }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent"
      />

      <div className="container-page relative py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="chip">
              <span className="size-1.5 rounded-full bg-accent" />
              {current.title} · {current.company}
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-4 font-display text-lg font-medium text-accent sm:text-xl">
              {site.tagline}
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {profile.pitch}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/projects/"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover"
              >
                View projects
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/blog/"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-line-strong"
              >
                <BookOpen className="size-4" />
                Read the blog
              </Link>
            </div>

            <SocialLinks className="mt-8" />
          </div>

          <div className="animate-fade-up lg:pl-4" style={{ animationDelay: '140ms' }}>
            <SignalPanel />
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
          {profile.facts.map((fact) => (
            <div key={fact.label} className="bg-surface px-5 py-6">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
                {fact.label}
              </dt>
              <dd className="mt-2 font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
