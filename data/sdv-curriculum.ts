/**
 * The Software-Defined Vehicle curriculum.
 *
 * Separate from /learn because the audience and scope differ: /learn is about
 * building on Android Automotive specifically, while this covers the whole
 * vehicle-software shift — architecture, communication, platforms, delivery —
 * for both the instrument cluster and the infotainment domain.
 */

export type SdvModule = {
  slug: string
  name: string
  blurb: string
  /** lucide-react icon name, resolved in components/sdv/module-icon.tsx */
  icon: string
}

export const sdvModules: SdvModule[] = [
  {
    slug: 'foundations',
    name: 'Foundations',
    blurb:
      'What a software-defined vehicle actually is, the pressures driving the change, and how vehicle electronics got here.',
    icon: 'Compass',
  },
  {
    slug: 'architecture',
    name: 'Vehicle architecture',
    blurb:
      'Zonal wiring, central compute, hypervisors and mixed criticality — the hardware shape that makes software-defined possible.',
    icon: 'Network',
  },
  {
    slug: 'communication',
    name: 'Communication & standards',
    blurb:
      'The move from broadcast signals to callable services: SOME/IP, DDS, Automotive Ethernet, VSS and the data broker.',
    icon: 'Radio',
  },
  {
    slug: 'platforms',
    name: 'Software platforms',
    blurb:
      'AUTOSAR Classic and Adaptive, Android Automotive, Linux and AGL, QNX — what each is for and how they coexist.',
    icon: 'Layers',
  },
  {
    slug: 'cluster',
    name: 'The cluster in an SDV',
    blurb:
      'Safety-rated display, rendering strategies, and what happens when the cluster and infotainment share one chip.',
    icon: 'Gauge',
  },
  {
    slug: 'ivi',
    name: 'Infotainment in an SDV',
    blurb:
      'IVI as a consumer of vehicle services, app platforms, the cockpit domain controller, and the store model.',
    icon: 'MonitorSmartphone',
  },
  {
    slug: 'delivery',
    name: 'Development & delivery',
    blurb:
      'Virtual ECUs, continuous integration for vehicles, digital twins, OTA and feature-on-demand.',
    icon: 'GitBranch',
  },
  {
    slug: 'data',
    name: 'Data & cloud',
    blurb:
      'What a fleet produces, where it is processed, what may leave the vehicle, and who is accountable for it.',
    icon: 'Cloud',
  },
  {
    slug: 'safety-security',
    name: 'Safety & security',
    blurb:
      'Functional safety across a consolidated stack, zero trust inside the vehicle, and regulation that now has teeth.',
    icon: 'ShieldCheck',
  },
  {
    slug: 'end-to-end',
    name: 'End to end',
    blurb:
      'One feature built the whole way through — from a physical sensor to both the cluster and the centre screen.',
    icon: 'Route',
  },
]

export const sdvModuleBySlug = new Map(sdvModules.map((m) => [m.slug, m]))

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
