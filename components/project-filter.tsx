'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/data/resume'
import { cn } from '@/lib/utils'

const ALL = 'All'

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>(ALL)

  const domains = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.domain)))],
    [projects]
  )

  const visible = active === ALL ? projects : projects.filter((p) => p.domain === active)

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by domain">
        {domains.map((domain) => {
          const isActive = domain === active
          return (
            <button
              key={domain}
              type="button"
              onClick={() => setActive(domain)}
              aria-pressed={isActive}
              className={cn(
                'rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors',
                isActive
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg'
              )}
            >
              {domain}
              {domain !== ALL && (
                <span className="ml-1.5 text-subtle">
                  {projects.filter((p) => p.domain === domain).length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {projects.length} projects
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}
