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
    github: 'https://github.com/bhargavamandapati',
    linkedin: 'https://www.linkedin.com/in/bhargavamandapati/',
    medium: 'https://medium.com/@bhargavamandapati',
  },
  nav: [
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Projects', href: '/projects/' },
    {
      // The AAOS material outgrew a single nav slot, so the curriculum,
      // the property reference, the tutorials and the glossary sit together.
      label: 'Learn AAOS',
      href: '/learn/',
      children: [
        {
          label: 'Learn AAOS',
          href: '/learn/',
          description: 'The structured curriculum, from VHAL to homologation.',
        },
        {
          label: 'Vehicle property guide',
          href: '/learn/vehicle-properties/',
          description: 'Every vehicle property, searchable and linked to AOSP.',
        },
        {
          label: 'Property simulator',
          href: '/learn/vehicle-simulator/',
          description: 'Change a property in 3D and watch what it does to the car.',
        },
        {
          label: 'Cockpit & displays',
          href: '/learn/cockpit-displays/',
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
          description: 'Plain-language definitions for the vocabulary.',
        },
      ],
    },
    { label: 'SDV', href: '/sdv/' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Writing', href: '/blog/' },
  ],
} as const

export type Site = typeof site

export type NavChild = { label: string; href: string; description: string }
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
