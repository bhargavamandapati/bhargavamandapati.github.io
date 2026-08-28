import { Section, SectionHeading } from '@/components/section'
import { Reveal } from '@/components/reveal'
import { CompanyMark } from '@/components/brand-icon'
import { experience } from '@/data/resume'
import { durationBetween, formatMonth } from '@/lib/utils'

export function Experience() {
  return (
    <Section id="experience" className="border-b border-line bg-bg-subtle">
      <SectionHeading
        eyebrow="Experience"
        title="Where the work happened"
        description="Ten years across automotive infotainment programmes — from prototype libraries that won an OEM's trust to leading the middleware teams that shipped production platforms."
      />

      <ol className="mt-14 space-y-4">
        {experience.map((role, i) => {
          const isCurrent = role.end === null
          return (
            <Reveal as="li" key={`${role.company}-${role.title}`} delay={i * 70}>
              <article className="card relative p-6 transition-colors hover:border-line-strong sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                  <div className="flex min-w-0 items-start gap-4">
                    <CompanyMark name={role.company} className="mt-0.5" />
                    <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
                      {role.title}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                      <span className="font-medium text-accent">{role.company}</span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                          <span className="size-1.5 rounded-full bg-accent" />
                          Current
                        </span>
                      )}
                    </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-right font-mono text-xs text-subtle">
                    <span className="block text-muted">
                      {formatMonth(role.start)} — {role.end ? formatMonth(role.end) : 'Present'}
                    </span>
                    <span className="mt-0.5 block">{durationBetween(role.start, role.end)}</span>
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{role.summary}</p>

                <details open={i < 2} className="group mt-4">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-subtle transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                    <span className="transition-transform group-open:rotate-90" aria-hidden>
                      ›
                    </span>
                    <span className="group-open:hidden">Show highlights</span>
                    <span className="hidden group-open:inline">Hide highlights</span>
                  </summary>
                  <ul className="mt-4 space-y-2.5 border-l border-line pl-4">
                    {role.highlights.map((h) => (
                      <li key={h} className="relative text-sm leading-relaxed text-muted">
                        <span
                          aria-hidden
                          className="absolute -left-[1.3rem] top-2 size-1.5 rounded-full bg-accent/50"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
