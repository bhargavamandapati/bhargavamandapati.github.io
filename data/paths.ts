/**
 * Guided routes through the curriculum.
 *
 * 154 topics with no entry point is a reference, not a course. Each path is an
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
      { section: 'learn', slug: 'performance/binder-saturation-and-jank-budget', why: 'The IPC you just learned, under real load — this is what you will actually be debugging.' },
      { section: 'learn', slug: 'vehicle-data/vhal-fundamentals', why: 'The boundary your work will sit on.' },
      { section: 'learn', slug: 'vehicle-data/writing-a-custom-vhal', why: 'End to end, including the two steps that fail silently.' },
      { section: 'learn', slug: 'sdv/can-signal-bridging', why: 'The CAN background you already have, mapped onto what VHAL actually reads.' },
      { section: 'learn', slug: 'security/sepolicy-automotive', why: 'The reason your correct service will not start.' },
      { section: 'learn', slug: 'security/permissions-and-treble', why: 'The vendor boundary, and why it constrains you.' },
      { section: 'learn', slug: 'security/secure-boot-chain-across-ecus', why: 'The trust boundary does not stop at the SoC — neither should your threat model.' },
      { section: 'learn', slug: 'security/can-bus-security', why: 'That trust boundary extends onto the bus itself — a compromised head unit and a real vehicle command are one forged frame apart.' },
      { section: 'learn', slug: 'foundations/boot-sequence', why: 'What runs when, and what the camera deadline forces.' },
      { section: 'learn', slug: 'foundations/property-system-and-init-triggers', why: 'The mechanism every one of those boot stages actually runs on.' },
      { section: 'learn', slug: 'power-boot/car-power-management', why: 'Suspend, resume and Garage Mode — “off” is not off.' },
      { section: 'learn', slug: 'power-boot/deep-sleep-and-wake-on-can', why: 'What “off” is actually doing, and why a CAN frame — not a button — wakes it back up.' },
      { section: 'learn', slug: 'build-test/debugging-toolkit', why: 'Triage in the order that saves the most time.' },
      { section: 'learn', slug: 'platform-build/ci-device-flashing', why: 'Compiling proves nothing — this is how a build actually reaches real hardware, thousands of times a week.' },
      { section: 'learn', slug: 'car-framework/uds-diagnostics', why: 'The protocol underneath every OBD-II frame — and the one that actually reflashes an ECU.' },
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
      { section: 'learn', slug: 'performance/binder-saturation-and-jank-budget', why: 'The natural follow-up question: what happens when that IPC is under load.' },
      { section: 'learn', slug: 'security/sepolicy-automotive', why: 'Reading an AVC denial out loud is a common exercise.' },
      { section: 'learn', slug: 'security/permissions-and-treble', why: 'Signature vs privileged, and why the allowlist exists.' },
      { section: 'learn', slug: 'security/secure-boot-chain-across-ecus', why: 'A good interviewer asks what happens past the SoC — have an answer ready.' },
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
  {
    slug: 'passenger-display-and-multi-user',
    name: 'Adding a passenger display and a second user',
    audience: 'You have to put a second screen and a second person into a car, and the platform assumes one of each.',
    blurb:
      'Alternates the concepts with the tutorials that put them into a build: the mental model first, then bringing up the display, zoning it, giving it a launcher and SystemUI, assigning a real user, and finally audio and debugging.',
    icon: 'MonitorSmartphone',
    steps: [
      { section: 'tutorials', slug: 'multi-display/aaos-multi-display-overview', why: 'Get the vocabulary of displays, zones and users straight before you touch a config file.' },
      { section: 'learn', slug: 'car-framework/occupant-zones', why: 'The overview named the zone; this is the framework object that every later step hangs a display, a user and a speaker on.' },
      { section: 'tutorials', slug: 'multi-display/enabling-passenger-display-static', why: 'With zones understood, make a second display actually exist on the emulator, where nothing can be unplugged.' },
      { section: 'tutorials', slug: 'multi-display/occupant-zone-config-deep-dive', why: 'The display is up but not yet attached to a seat; the zone config is what ties them together.' },
      { section: 'tutorials', slug: 'multi-display/launcher-on-passenger-display', why: 'A zoned, empty display needs something on it, and the launcher is the first thing it will show.' },
      { section: 'tutorials', slug: 'multi-display/systemui-on-passenger-display', why: 'Once the launcher draws, the bars, notifications and status chrome around it are the next thing that looks wrong.' },
      { section: 'learn', slug: 'hmi/ux-restrictions', why: 'The second screen can show things the driver’s screen must not, so learn what the platform restricts and why before you add rules.' },
      { section: 'tutorials', slug: 'multi-display/ux-restrictions-per-display', why: 'Apply that model per display, so driving state limits the front screen and leaves the rear one alone.' },
      { section: 'learn', slug: 'car-framework/multi-user', why: 'The display now works as a surface; the next problem is that a second person needs their own identity and storage on it.' },
      { section: 'tutorials', slug: 'multi-display/mdmu-concepts-hsum-vs-mumd', why: 'Multi-user comes in two shapes, and which one your build uses decides everything in the next step.' },
      { section: 'tutorials', slug: 'multi-display/per-zone-user-assignment', why: 'Now that you know the model, put a real user in the passenger zone.' },
      { section: 'tutorials', slug: 'multi-display/permissions-and-selinux-for-mdmu', why: 'Two users in one system is exactly where permission and SELinux denials start, so fix them before they hide other bugs.' },
      { section: 'tutorials', slug: 'multi-display/audio-zones-overview', why: 'The second person now has a screen and an identity, but their sound still plays from the front speakers.' },
      { section: 'tutorials', slug: 'multi-display/debugging-and-adb-toolkit', why: 'Something in the last twelve steps will misbehave, and this is the toolkit for finding which zone, display or user is at fault.' },
    ],
  },
  {
    slug: 'vehicle-signal-to-app',
    name: 'Following one signal from the bus to an app',
    audience: 'You own vehicle data: a signal leaves an ECU on CAN and has to arrive in an app as a property.',
    blurb:
      'One signal, followed hop by hop. First the path and the property model, then the bridge from CAN into the HAL, then the framework and app side, and last how to test it and what can go wrong on the bus.',
    icon: 'Activity',
    steps: [
      { section: 'learn', slug: 'vehicle-data/signal-path-end-to-end', why: 'See every hop once, so each later step has a place on the map.' },
      { section: 'learn', slug: 'vehicle-data/property-anatomy', why: 'The signal ends up as a property, so learn how a property ID is built before you define one.' },
      { section: 'learn', slug: 'vehicle-data/vhal-fundamentals', why: 'Properties are served by the HAL, so learn its contract before you try to feed it.' },
      { section: 'learn', slug: 'sdv/can-signal-bridging', why: 'This is where the bus meets the HAL: how raw frames become the values the HAL actually reads.' },
      { section: 'tutorials', slug: 'vehicle/custom-can-hal', why: 'Do that bridging for real with the generic CAN HAL instead of reading about it a second time.' },
      { section: 'learn', slug: 'vehicle-data/writing-a-custom-vhal', why: 'The CAN HAL covers the bus side; a vehicle with its own signals needs a VHAL of its own, and this shows the steps that fail silently.' },
      { section: 'tutorials', slug: 'vehicle/custom-vehicle-property', why: 'Your signal needs a property with an ID, a type and permissions, added across every layer it passes through.' },
      { section: 'learn', slug: 'vehicle-data/carpropertymanager', why: 'The value is in the HAL; this is how an app on the other side reads it.' },
      { section: 'tutorials', slug: 'vehicle/custom-rotary-input', why: 'A worked case of one CAN frame carried all the way to a KeyEvent, so you can check you understood the whole path.' },
      { section: 'learn', slug: 'vehicle-data/subscription-internals', why: 'Once an app reads the value, the rate it asks for is paid by everything between the bus and the screen.' },
      { section: 'learn', slug: 'vehicle-data/vhal-testing', why: 'You do not want a vehicle on the desk for every test, so learn to inject values and watch them arrive.' },
      { section: 'learn', slug: 'security/can-bus-security', why: 'Last, remember that the first hop was untrusted, and a forged frame travels this same path.' },
    ],
  },
  {
    slug: 'build-your-own-product',
    name: 'Building your own OEM product image',
    audience: 'You are the platform integrator: you take AOSP and turn it into one product with a name, a policy, a boot and an update.',
    blurb:
      'Follows the order an image gets built: a product you can lunch, resources overridden without forking, services started and confined, then update, flash and verify.',
    icon: 'Wrench',
    steps: [
      { section: 'learn', slug: 'platform-build/device-target-configuration', why: 'Know where product, board and overlay settings belong before you create any of them.' },
      { section: 'tutorials', slug: 'platform/custom-lunch-target', why: 'Create the product itself, because every other change in this path is built into it.' },
      { section: 'learn', slug: 'platform-build/soong-and-the-build-system', why: 'The target builds; now learn how modules get into the image so you can add yours.' },
      { section: 'tutorials', slug: 'platform/custom-framework-overlay', why: 'The cheapest customisation comes first: change framework resources without touching framework source.' },
      { section: 'tutorials', slug: 'multi-display/build-integration-product-config', why: 'See the product makefile patterns on a real feature set, so you know how config gets grouped.' },
      { section: 'learn', slug: 'foundations/property-system-and-init-triggers', why: 'Before you add a service, learn the property and trigger mechanism that starts it.' },
      { section: 'tutorials', slug: 'platform/custom-init-service', why: 'Add a daemon that init starts, which is the thing the next step then has to confine.' },
      { section: 'learn', slug: 'security/sepolicy-automotive', why: 'Your new service will be denied on first boot, so learn to read the denial before you write a rule.' },
      { section: 'tutorials', slug: 'platform/custom-sepolicy', why: 'Write the policy that lets the service run without turning off enforcement.' },
      { section: 'learn', slug: 'platform-build/ota-and-ab-partitions', why: 'The image has to be updatable in the field, which constrains how partitions are laid out.' },
      { section: 'tutorials', slug: 'platform/custom-ota-packaging', why: 'Sign and package an update against that layout to prove the product can be updated.' },
      { section: 'learn', slug: 'platform-build/ci-device-flashing', why: 'A product that only builds on one laptop is not a product, so get images onto real hardware automatically.' },
      { section: 'learn', slug: 'compliance/cts-vts-and-cdd', why: 'Verify last against the compatibility suites, because the previous steps are what can break them.' },
    ],
  },
]

export const pathBySlug = new Map(paths.map((p) => [p.slug, p]))

/** The href a step points at. */
export function stepHref(step: PathStep): string {
  return `/${step.section}/${step.slug}/`
}
