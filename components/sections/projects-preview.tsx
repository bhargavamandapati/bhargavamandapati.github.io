import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'
import { Reveal } from '@/components/reveal'
import { ProjectCard } from '@/components/project-card'
import { projects } from '@/data/resume'

export function ProjectsPreview() {
  const featured = projects.filter((p) => p.featured)

  return (
    <Section id="projects" className="border-b border-line">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Selected work"
          title="Platforms, middleware and the tools around them"
          description="Programme work for a global OEM — signal plumbing, cluster communication, board bring-up and the prototypes that started it all."
        />
        <Link
          href="/projects/"
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent"
        >
          All {projects.length} projects
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 60} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
