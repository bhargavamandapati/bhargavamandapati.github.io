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
    { label: 'Learn AAOS', href: '/learn/' },
    { label: 'Tutorials', href: '/tutorials/' },
    { label: 'Glossary', href: '/glossary/' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Writing', href: '/blog/' },
  ],
} as const

export type Site = typeof site
