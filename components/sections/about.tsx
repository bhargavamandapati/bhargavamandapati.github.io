import { Cpu, GitBranch, Layers, Users } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'
import { Reveal } from '@/components/reveal'
import { profile } from '@/data/resume'

const focus = [
  {
    Icon: Layers,
    title: 'Platform, not just apps',
    body: 'AOSP bring-up, framework modification, HALs and SEPolicy on custom automotive boards.',
  },
  {
    Icon: Cpu,
    title: 'Signals to screen',
    body: 'Custom VHALs and Car Services that carry CAN, VSS and AUTOSAR data into the Android middleware.',
  },
  {
    Icon: GitBranch,
    title: 'Multi-variant delivery',
    body: 'Features that hold up across infotainment variants, model years and cluster configurations.',
  },
  {
    Icon: Users,
    title: 'Leading engineers',
    body: 'Teams of up to 15 across onsite and offshore, with mentoring in AOSP and framework work.',
  },
]

export function About() {
  return (
    <Section id="about" className="border-b border-line">
      <SectionHeading
        eyebrow="About"
        title="A decade between the vehicle and the screen"
      />

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal className="space-y-5">
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="text-base leading-[1.8] text-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={100}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {focus.map(({ Icon, title, body }) => (
              <li key={title} className="card p-5 transition-colors hover:border-accent/40">
                <Icon aria-hidden className="size-5 text-accent" />
                <h3 className="mt-3.5 font-display text-[0.95rem] font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
