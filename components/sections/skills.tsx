import { Car, Code2, Layers, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'
import { Reveal } from '@/components/reveal'
import { TechIcon } from '@/components/brand-icon'
import { hasIcon } from '@/lib/brand'
import { skillGroups } from '@/data/resume'

/**
 * Fallback glyph per group. Most platform concepts (VHAL, SEPolicy, SOME/IP)
 * have no brand mark, so the group icon keeps every chip visually consistent
 * instead of leaving half of them bare.
 */
const GROUP_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  'Android Platform': Layers,
  'Automotive & Signals': Car,
  'App & UI': LayoutDashboard,
  'Ways of Working': Users,
}

export function Skills() {
  return (
    <Section id="skills" className="border-b border-line bg-bg-subtle">
      <SectionHeading
        eyebrow="Toolkit"
        title="What I work with"
        description="Grouped by the layer they belong to rather than dumped in a single list — the layer is usually the point."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => {
          const GroupIcon = GROUP_ICONS[group.name] ?? Code2
          return (
            <Reveal key={group.name} delay={i * 60} className="h-full">
              <div className="card h-full p-6">
                <div className="flex items-center gap-2.5">
                  <GroupIcon aria-hidden className="size-[18px] text-accent" />
                  <h3 className="font-display text-base font-semibold tracking-tight text-fg">
                    {group.name}
                  </h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{group.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill} className="chip">
                      {hasIcon(skill) ? (
                        <TechIcon label={skill} className="size-3.5" />
                      ) : (
                        <GroupIcon aria-hidden className="size-3 text-subtle" />
                      )}
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
