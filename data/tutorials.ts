/**
 * The customisation tutorial tracks.
 *
 * Unlike the /learn curriculum — which explains how AAOS works — these are
 * procedural: follow the steps, build the thing, verify it works. Tracks are
 * ordered by dependency, so a reader can start at the top and never hit a
 * prerequisite they have not already built.
 */

export type Track = {
  slug: string
  name: string
  blurb: string
  /** lucide-react icon name, resolved in components/tutorial/track-icon.tsx */
  icon: string
}

export const tracks: Track[] = [
  {
    slug: 'platform',
    name: 'Platform foundations',
    blurb:
      'Your own product target, your own SELinux domain, your own native daemon — the base everything else is built on.',
    icon: 'Boxes',
  },
  {
    slug: 'vehicle',
    name: 'Vehicle integration',
    blurb:
      'A vendor VHAL from an empty directory, custom properties end to end, and your own AIDL HAL when properties are the wrong shape.',
    icon: 'Gauge',
  },
  {
    slug: 'framework',
    name: 'Framework services',
    blurb:
      'Add a subservice to Car Service, a service to system_server, and the permission that guards it.',
    icon: 'Layers',
  },
  {
    slug: 'apps-ui',
    name: 'Apps & UI',
    blurb:
      'A privileged system app, runtime resource overlays, and modifying CarSystemUI without forking it.',
    icon: 'LayoutDashboard',
  },
  {
    slug: 'product',
    name: 'Product configuration',
    blurb:
      'Audio topology, boot animation and the settings surface — the configuration that makes a build an OEM’s.',
    icon: 'SlidersHorizontal',
  },
]

export const trackBySlug = new Map(tracks.map((t) => [t.slug, t]))

/**
 * The full inventory of customisation surfaces in AAOS, including the ones with
 * no tutorial yet. Rendered on the index so "what can I customise?" has a
 * complete answer rather than only the list of things already written up.
 */
export type Surface = {
  name: string
  what: string
  where: string
  /** Tutorial slug, when one exists. */
  tutorial?: string
}

export const surfaces: Surface[] = [
  { name: 'Product / lunch target', what: 'A build flavour of your own', where: 'device/<oem>/<product>/', tutorial: 'platform/custom-lunch-target' },
  { name: 'Board configuration', what: 'Partitions, architecture, AVB', where: 'BoardConfig.mk', tutorial: 'platform/custom-lunch-target' },
  { name: 'SELinux policy', what: 'Domains, types, allow rules', where: 'device/<oem>/<product>/sepolicy/', tutorial: 'platform/custom-sepolicy' },
  { name: 'init service', what: 'A native daemon started at boot', where: '*.rc + cc_binary', tutorial: 'platform/custom-init-service' },
  { name: 'Vehicle HAL', what: 'The vehicle network bridge', where: 'hardware/<oem>/automotive/vehicle/', tutorial: 'vehicle/custom-vhal' },
  { name: 'Vehicle properties', what: 'Vendor-defined vehicle state', where: 'VHAL config + car-lib', tutorial: 'vehicle/custom-vehicle-property' },
  { name: 'AIDL HAL', what: 'Your own vendor interface', where: 'hardware/interfaces/ or vendor/', tutorial: 'vehicle/custom-aidl-hal' },
  { name: 'Car subservice', what: 'A service inside Car Service', where: 'packages/services/Car/', tutorial: 'framework/custom-car-subservice' },
  { name: 'System service', what: 'A service inside system_server', where: 'frameworks/base/services/', tutorial: 'framework/custom-system-service' },
  { name: 'Permissions', what: 'OEM permissions and allowlists', where: 'framework overlay + privapp XML', tutorial: 'framework/custom-permission' },
  { name: 'System app', what: 'Privileged, platform-signed APK', where: 'packages/apps/ or vendor/', tutorial: 'apps-ui/custom-system-app' },
  { name: 'RRO', what: 'Runtime theming without forking', where: 'An overlay APK', tutorial: 'apps-ui/custom-rro' },
  { name: 'CarSystemUI', what: 'System bars, HVAC panel, keyguard', where: 'packages/apps/Car/SystemUI + RRO', tutorial: 'apps-ui/custom-system-ui' },
  { name: 'Audio topology', what: 'Zones, buses, volume groups', where: 'car_audio_configuration.xml', tutorial: 'product/custom-audio-config' },
  { name: 'Boot animation', what: 'What the driver sees first', where: 'bootanimation.zip', tutorial: 'product/custom-boot-animation' },
  { name: 'Framework resources', what: 'Build-time config overrides', where: 'DEVICE_PACKAGE_OVERLAYS' },
  { name: 'Launcher', what: 'The app grid and home screen', where: 'packages/apps/Car/Launcher' },
  { name: 'Car Settings', what: 'Settings entries and preferences', where: 'packages/apps/Car/Settings' },
  { name: 'Key layout / input', what: 'Steering wheel and rotary mapping', where: '*.kl and *.idc files' },
  { name: 'Locale & region', what: 'Languages, units, regional behaviour', where: 'Product config + resources' },
  { name: 'Kernel & device tree', what: 'Drivers, display ports, CAN interfaces', where: 'kernel/ — outside AOSP' },
  { name: 'OTA packaging', what: 'How updates are built and signed', where: 'ota_from_target_files' },
]

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
