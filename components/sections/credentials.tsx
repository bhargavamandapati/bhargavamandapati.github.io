import { Award, GraduationCap, ShieldCheck } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'
import { Reveal } from '@/components/reveal'
import { awards, certifications, education } from '@/data/resume'
import { formatMonth } from '@/lib/utils'

export function Credentials() {
  return (
    <Section id="credentials" className="border-b border-line">
      <SectionHeading eyebrow="Credentials" title="Education, certifications & recognition" />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Reveal className="h-full">
          <div className="card h-full p-6">
            <GraduationCap aria-hidden className="size-5 text-accent" />
            <h3 className="mt-3.5 font-display text-base font-semibold text-fg">Education</h3>
            <ul className="mt-5 space-y-5">
              {education.map((e) => (
                <li key={e.institution}>
                  <p className="text-sm font-medium leading-snug text-fg">{e.degree}</p>
                  <p className="mt-1 text-sm leading-snug text-muted">{e.field}</p>
                  <p className="mt-2 text-sm text-muted">{e.institution}</p>
                  <p className="mt-1.5 font-mono text-xs text-subtle">
                    {formatMonth(e.start)} — {formatMonth(e.end)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={70} className="h-full">
          <div className="card h-full p-6">
            <ShieldCheck aria-hidden className="size-5 text-accent" />
            <h3 className="mt-3.5 font-display text-base font-semibold text-fg">Certifications</h3>
            <ul className="mt-5 space-y-4">
              {certifications.map((c) => (
                <li key={c.name} className="border-l border-line pl-3.5">
                  <p className="text-sm font-medium leading-snug text-fg">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-subtle">{c.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140} className="h-full">
          <div className="card h-full p-6">
            <Award aria-hidden className="size-5 text-accent" />
            <h3 className="mt-3.5 font-display text-base font-semibold text-fg">Awards</h3>
            <ul className="mt-5 space-y-3">
              {awards.map((a) => (
                <li key={a.name} className="flex items-center gap-2.5 text-sm text-muted">
                  <span aria-hidden className="size-1.5 shrink-0 rotate-45 bg-accent" />
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
