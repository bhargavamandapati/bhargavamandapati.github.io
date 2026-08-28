import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TechIcon } from '@/components/brand-icon'
import type { Project } from '@/data/resume'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card group relative flex h-full flex-col p-6 transition-all hover:border-accent/50 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <span className="chip">{project.domain}</span>
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-fg">
        {/* Stretched link keeps the whole card clickable without nesting interactive elements. */}
        <Link href={`/projects/${project.slug}/`} className="after:absolute after:inset-0">
          {project.name}
        </Link>
      </h3>

      <p className="mt-1.5 font-mono text-xs text-subtle">{project.period}</p>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <li
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[0.68rem] text-muted"
          >
            <TechIcon label={tech} className="size-3" />
            {tech}
          </li>
        ))}
        {project.stack.length > 4 && (
          <li className="rounded-md px-2 py-1 font-mono text-[0.68rem] text-subtle">
            +{project.stack.length - 4}
          </li>
        )}
      </ul>
    </article>
  )
}
