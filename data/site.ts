export const site = {
  name: 'Bhargava Mandapati',
  shortName: 'Bhargava',
  initials: 'BM',
  role: 'Team Lead · Android Automotive',
  tagline: 'Automotive Software Engineer',
  // Update this if you point a custom domain at the site.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bhargavamandapati.github.io',
  locale: 'en_US',
  description:
    'Team Lead and Android Automotive engineer with 10+ years building AOSP/AAOS platforms, ' +
    'vehicle HALs, infotainment middleware and software-defined vehicle capabilities for global OEMs.',
  keywords: [
    'Android Automotive',
    'AAOS',
    'AOSP',
    'VHAL',
    'HAL',
    'Android Framework',
    'Infotainment',
    'Software Defined Vehicle',
    'Vehicle Signal Specification',
    'Kotlin',
    'Jetpack Compose',
    'SEPolicy',
    'AUTOSAR',
    'Automotive Software Engineer',
  ],
  // Social profiles only — no phone, email or postal address is published anywhere on this site.
  socials: {
    linkedin: 'https://www.linkedin.com/in/bhargavamandapati/',
    medium: 'https://medium.com/@bhargavamandapati',
  },
  nav: [
    {
      // The AAOS material outgrew a single nav slot, so the curriculum,
      // the property reference, the tutorials and the glossary sit together.
      label: 'Learn AAOS',
      href: '/learn/',
      children: [
        {
          label: 'Start here',
          href: '/learn/start/',
          description: 'Guided routes through the curriculum for where you are starting from.',
        },
        {
          label: 'Learn AAOS',
          href: '/learn/',
          description: 'The structured curriculum, from VHAL to homologation.',
        },
        {
          label: 'Vehicle property guide',
          href: '/learn/vehicle-properties/',
          locked: true,
          description: 'Every vehicle property, searchable and linked to AOSP.',
        },
        {
          label: 'Property simulator',
          href: '/learn/vehicle-simulator/',
          locked: true,
          description: 'Change a property in 3D and watch what it does to the car.',
        },
        {
          label: 'Cockpit & displays',
          href: '/learn/cockpit-displays/',
          locked: true,
          description: 'Occupant zones, multi-display and UX restrictions, live.',
        },
        {
          label: 'Tutorials',
          href: '/tutorials/',
          description: 'Step-by-step builds for the things you customise.',
        },
        {
          label: 'Glossary',
          href: '/glossary/',
          locked: true,
          description: 'Plain-language definitions for the vocabulary.',
        },
      ],
    },
    {
      // Ten modules and ~35 topics deserved the same sub-nav treatment as
      // Learn AAOS gets, not one flat link — these anchor into the module
      // sections already on /sdv/ rather than needing dedicated pages.
      label: 'SDV',
      href: '/sdv/',
      children: [
        {
          label: 'SDV',
          href: '/sdv/',
          description: 'The full curriculum — architecture, standards, platforms and delivery.',
        },
        {
          label: 'Foundations',
          href: '/sdv/#sdv-foundations',
          description: 'What a software-defined vehicle actually is, and why the shift is happening.',
        },
        {
          label: 'Vehicle architecture',
          href: '/sdv/#sdv-architecture',
          description: 'Zonal wiring, central compute, hypervisors and mixed criticality.',
        },
        {
          label: 'Communication & standards',
          href: '/sdv/#sdv-communication',
          description: 'SOME/IP, DDS, Automotive Ethernet, VSS and the data broker.',
        },
        {
          label: 'The cluster in an SDV',
          href: '/sdv/#sdv-cluster',
          description: 'Safety-rated display and rendering when the cluster shares a chip.',
        },
        {
          label: 'Infotainment in an SDV',
          href: '/sdv/#sdv-ivi',
          description: 'IVI as a consumer of vehicle services, and the cockpit domain controller.',
        },
        {
          label: 'Development & delivery',
          href: '/sdv/#sdv-delivery',
          description: 'Virtual ECUs, CI for vehicles, digital twins, OTA and feature-on-demand.',
        },
      ],
    },
    { label: 'Writing', href: '/blog/' },
    {
      // The portfolio sections live together so the nav is not half CV and
      // half curriculum.
      label: 'About',
      href: '/about/',
      children: [
        { label: 'About', href: '/about/', description: 'Who I am and what I work on.' },
        { label: 'Experience', href: '/about/#experience', description: 'Roles, and what each one delivered.' },
        { label: 'Projects', href: '/projects/', description: 'Selected automotive platform work.' },
        { label: 'Skills', href: '/about/#skills', description: 'Languages, platforms and ways of working.' },
      ],
    },
  ],
} as const

export type Site = typeof site

export type NavChild = {
  label: string
  href: string
  description: string
  /** Set when the destination needs an access key, so the menu can say so. */
  locked?: boolean
}
export type NavItem = {
  label: string
  href: string
  children?: readonly NavChild[]
}

/** Nav as the header consumes it, with groups intact. */
export const navItems: readonly NavItem[] = site.nav

/** Every destination, flattened — for the footer's sitemap-style list. */
export const navLinks: { label: string; href: string }[] = navItems.flatMap((item) =>
  item.children
    ? item.children.map((c) => ({ label: c.label, href: c.href }))
    : [{ label: item.label, href: item.href }],
)
