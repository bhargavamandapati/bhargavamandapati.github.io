/**
 * Guided routes through the curriculum.
 *
 * 128 topics with no entry point is a reference, not a course. Each path is an
 * ordered walk through material that already exists, with a line on why each
 * step follows the last — the value is the ordering and the reasoning, not new
 * content.
 */

export type PathStep = {
  /** Slug within its section, e.g. `foundations/what-is-aaos`. */
  slug: string
  section: 'learn' | 'sdv' | 'tutorials'
  /** Why this comes next. */
  why: string
}

export type LearningPath = {
  slug: string
  name: string
  audience: string
  blurb: string
  /** lucide-react icon name. */
  icon: string
  steps: PathStep[]
}

export const paths: LearningPath[] = [
  {
    slug: 'android-developer',
    name: 'Android developer, new to automotive',
    audience: 'You know Activities, Services and Gradle. You have never seen a VHAL.',
    blurb:
      'Starts from what is familiar and works outwards to the parts of the platform that have no phone equivalent — vehicle data, driving state, and the fact that you no longer own the whole screen.',
    icon: 'Smartphone',
    steps: [
      { section: 'learn', slug: 'foundations/what-is-aaos', why: 'What AAOS is, and what it is not — before anything else.' },
      { section: 'learn', slug: 'foundations/architecture-overview', why: 'Where your app sits relative to the vehicle.' },
      { section: 'learn', slug: 'car-framework/car-api-surface', why: 'The API surface you actually get, and what needs privilege.' },
      { section: 'learn', slug: 'vehicle-data/vhal-fundamentals', why: 'The interface every vehicle value arrives through.' },
      { section: 'learn', slug: 'vehicle-data/carpropertymanager', why: 'How you read and write those values from an app.' },
      { section: 'learn', slug: 'vehicle-data/subscription-internals', why: 'Why the rate you ask for is everyone else’s problem too.' },
      { section: 'learn', slug: 'hmi/ux-restrictions', why: 'The platform decides what you may show while driving.' },
      { section: 'learn', slug: 'hmi/car-ui-library', why: 'Why you theme through overlays instead of forking.' },
      { section: 'learn', slug: 'car-framework/multi-user', why: 'The headless system user breaks phone assumptions about storage and accounts.' },
      { section: 'learn', slug: 'car-framework/occupant-zones', why: 'There is no such thing as “the” display.' },
      { section: 'learn', slug: 'apps-media/media-apps', why: 'The template model — the car draws your UI, not you.' },
      { section: 'learn', slug: 'apps-media/app-distribution', why: 'How your app actually reaches a vehicle.' },
    ],
  },
  {
    slug: 'embedded-developer',
    name: 'Embedded developer, new to Android',
    audience: 'You know CAN, C++ and an RTOS. Android is the unfamiliar half.',
    blurb:
      'Comes at the platform from below — the HAL boundary, the build system, SEPolicy and the process model — rather than from the app layer you will not be working in.',
    icon: 'Cpu',
    steps: [
      { section: 'learn', slug: 'foundations/architecture-overview', why: 'The layer map, so the vocabulary lands.' },
      { section: 'learn', slug: 'foundations/getting-the-source', why: 'Get a build running before reading more about it.' },
      { section: 'learn', slug: 'platform-build/soong-and-the-build-system', why: 'How anything gets compiled and into the image.' },
      { section: 'learn', slug: 'platform-build/device-target-configuration', why: 'Product, board and overlays — where a setting belongs.' },
      { section: 'learn', slug: 'car-framework/binder-and-aidl', why: 'The IPC everything above the HAL is built on.' },
      { section: 'learn', slug: 'vehicle-data/vhal-fundamentals', why: 'The boundary your work will sit on.' },
      { section: 'learn', slug: 'vehicle-data/writing-a-custom-vhal', why: 'End to end, including the two steps that fail silently.' },
      { section: 'learn', slug: 'security/sepolicy-automotive', why: 'The reason your correct service will not start.' },
      { section: 'learn', slug: 'security/permissions-and-treble', why: 'The vendor boundary, and why it constrains you.' },
      { section: 'learn', slug: 'foundations/boot-sequence', why: 'What runs when, and what the camera deadline forces.' },
      { section: 'learn', slug: 'power-boot/car-power-management', why: 'Suspend, resume and Garage Mode — “off” is not off.' },
      { section: 'learn', slug: 'build-test/debugging-toolkit', why: 'Triage in the order that saves the most time.' },
    ],
  },
  {
    slug: 'interview-prep',
    name: 'Preparing for an AAOS interview',
    audience: 'You need the concepts an interviewer actually probes, in one pass.',
    blurb:
      'The topics that come up repeatedly — the property model, the boundaries, the failure modes people have actually debugged — rather than a complete tour.',
    icon: 'MessageSquare',
    steps: [
      { section: 'learn', slug: 'foundations/architecture-overview', why: '“Walk me through the stack” is question one.' },
      { section: 'learn', slug: 'vehicle-data/property-anatomy', why: 'Be able to decompose a property ID on a whiteboard.' },
      { section: 'learn', slug: 'vehicle-data/signal-path-end-to-end', why: 'Sensor to pixel, named layer by layer.' },
      { section: 'learn', slug: 'car-framework/car-service-architecture', why: 'What Car Service is, and what happens when it dies.' },
      { section: 'learn', slug: 'car-framework/binder-and-aidl', why: 'Expect to be asked how the IPC works.' },
      { section: 'learn', slug: 'security/sepolicy-automotive', why: 'Reading an AVC denial out loud is a common exercise.' },
      { section: 'learn', slug: 'security/permissions-and-treble', why: 'Signature vs privileged, and why the allowlist exists.' },
      { section: 'learn', slug: 'car-framework/multi-user', why: 'The headless user model separates people who have shipped from people who have read.' },
      { section: 'learn', slug: 'power-boot/boot-time-optimisation', why: 'Where the seconds really go.' },
      { section: 'learn', slug: 'compliance/functional-safety', why: 'Know why Android is QM and what that implies.' },
      { section: 'learn', slug: 'performance/memory-and-lmkd', why: 'Constrained hardware and long uptime.' },
      { section: 'sdv', slug: 'foundations/what-is-an-sdv', why: 'You will be asked what SDV means. Have a real answer.' },
    ],
  },
  {
    slug: 'sdv-track',
    name: 'Understanding software-defined vehicles',
    audience: 'You want the industry shift, not just the Android part.',
    blurb:
      'The whole-vehicle view — architecture, communication, platforms and delivery — for anyone who needs to hold a conversation outside the cockpit team.',
    icon: 'Route',
    steps: [
      { section: 'sdv', slug: 'foundations/what-is-an-sdv', why: 'A definition that survives contact with a sceptic.' },
      { section: 'sdv', slug: 'foundations/why-the-industry-is-changing', why: 'The pressures behind the money.' },
      { section: 'sdv', slug: 'foundations/ee-architecture-evolution', why: 'How the electronics got here.' },
      { section: 'sdv', slug: 'architecture/zonal-and-central-compute', why: 'The hardware change that makes the software claim possible.' },
      { section: 'sdv', slug: 'architecture/service-oriented-architecture', why: 'Why services replace broadcast signals.' },
      { section: 'sdv', slug: 'communication/some-ip', why: 'The protocol your VHAL is increasingly a client of.' },
      { section: 'sdv', slug: 'communication/vss', why: 'The shared vocabulary the whole industry is converging on.' },
      { section: 'sdv', slug: 'communication/data-brokers', why: 'The component that makes desk testing possible.' },
      { section: 'sdv', slug: 'platforms/android-automotive-as-sdv-platform', why: 'Where Android fits, honestly.' },
      { section: 'sdv', slug: 'delivery/virtual-ecus-and-sil', why: 'The change with the largest effect on your week.' },
      { section: 'sdv', slug: 'delivery/ota-in-sdv', why: 'Nothing else matters if you cannot ship an update.' },
      { section: 'sdv', slug: 'end-to-end/complete-feature-walkthrough', why: 'One feature, the whole way through.' },
    ],
  },
]

export const pathBySlug = new Map(paths.map((p) => [p.slug, p]))

/** The href a step points at. */
export function stepHref(step: PathStep): string {
  return `/${step.section}/${step.slug}/`
}
