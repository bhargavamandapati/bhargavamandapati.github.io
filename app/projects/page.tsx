import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ProjectFilter } from '@/components/project-filter'
import { projects } from '@/data/resume'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Android Automotive and AOSP programme work — software-defined vehicle enablement, cluster middleware, board bring-up, cockpit digitization and OEM infotainment platforms.',
  alternates: { canonical: '/projects/' },
}

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Selected automotive work"
        description="Programme work spanning a decade — from the prototype that won an OEM's confidence to the middleware and tooling behind production infotainment platforms."
      />
      <div className="container-page py-14 md:py-16">
        <ProjectFilter projects={projects} />
      </div>
    </>
  )
}
