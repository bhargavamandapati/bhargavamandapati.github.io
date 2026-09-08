import type { Metadata } from 'next'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Skills } from '@/components/sections/skills'
import { Credentials } from '@/components/sections/credentials'
import { Connect } from '@/components/sections/connect'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Team Lead in Android Automotive and AOSP platform engineering — a decade of vehicle HALs, infotainment middleware and software-defined vehicle work, and what each role delivered.',
  alternates: { canonical: '/about/' },
}

/**
 * The CV, on its own page.
 *
 * These sections used to live on the home page, which meant the first thing a
 * visitor met was a résumé rather than the thing the site is actually for.
 * They are unchanged; only their address is.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A decade inside the car's software"
        description="Android Automotive and AOSP platform engineering — vehicle HALs, infotainment middleware, cluster work and the software-defined vehicle stack, in production programmes for global manufacturers."
      />
      <About />
      <Experience />
      <Skills />
      <Credentials />
      <Connect />
    </>
  )
}
