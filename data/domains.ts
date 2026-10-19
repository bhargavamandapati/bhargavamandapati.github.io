/**
 * Shared domains that line the Learn curriculum up with the tutorial tracks.
 *
 * Learn categories and tutorial tracks grew separately, so the same subject
 * (the vehicle HAL, say) appeared under two unrelated headings. A domain is the
 * subject; each lists the Learn categories that explain it and the tutorial
 * tracks that build it. No URL depends on this — it only drives grouping and
 * the cross-links between the two indexes.
 */

export type Domain = {
  slug: string
  name: string
  blurb: string
  /** Learn category slugs, from data/curriculum.ts. */
  learn: readonly string[]
  /** Tutorial track slugs, from data/tutorials.ts. */
  tutorials: readonly string[]
}

export const domains: readonly Domain[] = [
  {
    slug: 'start-here',
    name: 'Start here',
    blurb: 'What Android Automotive is, how the stack is layered and how a programme runs.',
    learn: ['foundations'],
    tutorials: [],
  },
  {
    slug: 'vehicle-data',
    name: 'Vehicle data & HALs',
    blurb: 'How a signal on the vehicle network becomes a property an app can read.',
    learn: ['vehicle-data'],
    tutorials: ['vehicle'],
  },
  {
    slug: 'framework-security',
    name: 'Framework, security & compliance',
    blurb: 'Car Service and the framework APIs, the permission and SELinux model around them, and the rules the result is held to.',
    learn: ['car-framework', 'security', 'compliance'],
    tutorials: ['framework'],
  },
  {
    slug: 'hmi-apps-product',
    name: 'HMI, apps, audio & product',
    blurb: 'What the driver sees and hears — system UI, apps, audio routing — and the product configuration that makes a build an OEM’s.',
    learn: ['hmi', 'apps-media', 'audio'],
    tutorials: ['apps-ui', 'product'],
  },
  {
    slug: 'displays-users',
    name: 'Displays, zones & users',
    blurb: 'More than one screen and more than one person: occupant zones, passenger displays, the cluster and the multi-user model.',
    learn: ['cluster-displays'],
    tutorials: ['multi-display'],
  },
  {
    slug: 'connectivity',
    name: 'Connectivity & telephony',
    blurb: 'Bluetooth, calling, eCall, V2X and the modem that keeps the vehicle online.',
    learn: ['connectivity'],
    tutorials: [],
  },
  {
    slug: 'platform-build',
    name: 'Platform, build & boot',
    blurb: 'Building, flashing, booting and profiling the platform itself.',
    learn: ['platform-build', 'build-test', 'power-boot', 'performance'],
    tutorials: ['platform'],
  },
  {
    slug: 'sdv',
    name: 'Software-defined vehicle bridge',
    blurb: 'Where an Android Automotive head unit meets the wider software-defined vehicle.',
    learn: ['sdv'],
    tutorials: [],
  },
]

export const domainByLearnCategory = new Map(domains.flatMap((d) => d.learn.map((c) => [c, d] as const)))
export const domainByTutorialTrack = new Map(domains.flatMap((d) => d.tutorials.map((t) => [t, d] as const)))

/**
 * Groups items (Learn categories) by domain, in domain order. Anything not
 * claimed by a domain is returned last rather than dropped, so a new category
 * never silently disappears from the index.
 */
export function groupLearnByDomain<T extends { slug: string }>(categories: readonly T[]) {
  const claimed = new Set<string>()
  const groups = domains
    .map((domain) => {
      const items = domain.learn
        .map((slug) => categories.find((c) => c.slug === slug))
        .filter((c): c is T => c !== undefined)
      items.forEach((c) => claimed.add(c.slug))
      return { domain, items }
    })
    .filter((g) => g.items.length > 0)
  const rest = categories.filter((c) => !claimed.has(c.slug))
  return { groups, rest }
}
