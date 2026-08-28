import { Hero } from '@/components/sections/hero'
import { StackStrip } from '@/components/sections/stack-strip'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { ProjectsPreview } from '@/components/sections/projects-preview'
import { Skills } from '@/components/sections/skills'
import { Credentials } from '@/components/sections/credentials'
import { Writing } from '@/components/sections/writing'
import { Connect } from '@/components/sections/connect'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StackStrip />
      <About />
      <Experience />
      <ProjectsPreview />
      <Skills />
      <Credentials />
      <Writing />
      <Connect />
    </>
  )
}
