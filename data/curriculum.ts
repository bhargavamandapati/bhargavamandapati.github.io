/**
 * The AAOS learning hub curriculum.
 *
 * Categories are ordered here; topics inside a category are ordered by the
 * `order` field in each MDX file's frontmatter. Adding a topic means adding one
 * .mdx file — the index, sidebar, sitemap and prev/next links all follow.
 */

export type Category = {
  slug: string
  name: string
  /** Shown on the hub index card. */
  blurb: string
  /** lucide-react icon name, resolved in components/learn/category-icon.tsx */
  icon: string
}

export const categories: Category[] = [
  {
    slug: 'foundations',
    name: 'Foundations',
    blurb:
      'What Android Automotive actually is, how the stack is layered, how to get a build running, and the programme rhythm the work happens in.',
    icon: 'Compass',
  },
  {
    slug: 'vehicle-data',
    name: 'Vehicle Data & VHAL',
    blurb:
      'The Vehicle HAL: property anatomy, areas, access modes, subscriptions, writing your own, and migrating from HIDL to AIDL.',
    icon: 'Gauge',
  },
  {
    slug: 'car-framework',
    name: 'Car Service & Framework',
    blurb:
      'CarService internals, the android.car API surface, occupant zones, watchdog, telemetry, and adding a subservice of your own.',
    icon: 'Layers',
  },
  {
    slug: 'hmi',
    name: 'HMI, System UI & UX',
    blurb:
      'CarSystemUI, driver distraction rules, theming, notifications, the launcher, and the input devices phones never had.',
    icon: 'LayoutDashboard',
  },
  {
    slug: 'apps-media',
    name: 'Apps & Media',
    blurb:
      'Building the apps drivers actually use — media, navigation, assistant — and the template system that keeps them safe.',
    icon: 'AppWindow',
  },
  {
    slug: 'cluster-displays',
    name: 'Cluster, Camera & Displays',
    blurb:
      'The rear-view camera path, the instrument cluster, and the multi-screen cockpit — where AAOS stops looking like Android.',
    icon: 'Monitor',
  },
  {
    slug: 'audio',
    name: 'Audio',
    blurb:
      'Zones, contexts and buses — why car audio is a routing problem before it is a playback problem.',
    icon: 'Volume2',
  },
  {
    slug: 'connectivity',
    name: 'Connectivity & Telephony',
    blurb:
      'Bluetooth profiles, hands-free calling, eCall, and the modem that keeps the vehicle online for fifteen years.',
    icon: 'Radio',
  },
  {
    slug: 'power-boot',
    name: 'Power, Boot & Lifecycle',
    blurb:
      'The power state machine, Garage Mode, and the boot-time budget an OEM will hold you to.',
    icon: 'Power',
  },
  {
    slug: 'performance',
    name: 'Performance & Optimisation',
    blurb:
      'Memory pressure on constrained hardware, binder saturation, jank, and profiling with Perfetto.',
    icon: 'Activity',
  },
  {
    slug: 'security',
    name: 'Security & Hardening',
    blurb:
      'SELinux for vehicle HALs, the car permission model, verified boot, and the keys that sign a vehicle image.',
    icon: 'ShieldCheck',
  },
  {
    slug: 'compliance',
    name: 'Quality, Compliance & Safety',
    blurb:
      'CTS, VTS and the CDD, functional safety, automotive cybersecurity regulation, and what actually blocks a launch.',
    icon: 'ClipboardCheck',
  },
  {
    slug: 'sdv',
    name: 'SDV & Standards',
    blurb:
      'VSS, AUTOSAR, SOME/IP and Eclipse Kuksa — bridging the vehicle network to the Android middleware.',
    icon: 'Network',
  },
  {
    slug: 'platform-build',
    name: 'Platform Build & Release',
    blurb:
      'Soong, product configuration, build infrastructure that scales, and shipping an update to a vehicle in the field.',
    icon: 'Package',
  },
  {
    slug: 'build-test',
    name: 'Testing & Debugging',
    blurb:
      'The commands that tell you what the platform is doing, and automation that survives a real head unit.',
    icon: 'TerminalSquare',
  },
]

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
