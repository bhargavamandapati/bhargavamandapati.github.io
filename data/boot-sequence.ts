/**
 * The nine boot stages, structured for the interactive timeline tool.
 *
 * The content itself is not new — it restates
 * content/learn/foundations/boot-sequence.mdx as data rather than prose, for
 * a click-through reference rather than a read-through article. Keep the two
 * in sync if the sequence ever changes; the timeline links back to the full
 * article for the reasoning behind each stage.
 */

export type BootStage = {
  number: number
  title: string
  summary: string
  detail: string
  /** Commands worth running to confirm this stage happened, or debug it. */
  commands?: string[]
  /** A note on what makes this stage distinct from a stock (non-automotive) boot. */
  aaosNote?: string
}

export const bootStages: BootStage[] = [
  {
    number: 1,
    title: 'Power signal',
    summary: 'The ignition, a door handle, or a remote unlock — before anything digital happens.',
    detail:
      'This is electrical, not software. It matters because the clock for every boot-time deadline starts here, not when Android starts — a requirement like "reversing camera within two seconds" is measured from this moment, and Android will not exist for several more seconds.',
  },
  {
    number: 2,
    title: 'Boot ROM and bootloader',
    summary: 'A chip-burned program loads and verifies the bootloader, which verifies the next stage.',
    detail:
      'This is verified boot: a chain where each link cryptographically verifies the next before running it. Nothing you write runs here — it matters because it is why a production head unit will not simply run an edited file. The chain notices.',
    commands: [
      'adb shell getprop ro.boot.verifiedbootstate   # green on a production vehicle',
      'adb shell getprop ro.boot.flash.locked        # 1',
    ],
  },
  {
    number: 3,
    title: 'The kernel',
    summary: 'Linux starts, probes hardware, loads drivers, and mounts storage against dm-verity hashes.',
    detail:
      'If a driver is slow to probe — a display panel, a CAN controller — the time is spent here, before Android has any say in it.',
    commands: ["adb shell dmesg | grep -iE 'initcall|probe|took'"],
  },
  {
    number: 4,
    title: 'init, the first process',
    summary: 'PID 1. A small native program, not Android, that starts everything else in phases.',
    detail:
      'init works through phases — early-init, init, late-init, boot (which starts class core, then class hal, then class main), then property:sys.boot_completed=1 (class late_start). A service in class hal competes for CPU during the busiest thirty seconds the device ever has; the same service started on sys.boot_completed costs nothing. Moving a service to late_start is the single cheapest boot-time win available, and very few teams check for it.',
  },
  {
    number: 5,
    title: 'Early services, and the EVS shortcut',
    summary: 'The reversing camera path starts immediately — it cannot wait for Android.',
    detail:
      'EVS is the exception to everything else on this page: a small native service talking to a camera and display directly, running long before the framework exists, because the regulatory deadline (roughly two seconds) is shorter than Android needs to boot (roughly fifteen). A reversing image that appears almost instantly and then subtly changes a few seconds later is the handover from the EVS fast path to the Android-based one.',
    aaosNote: 'Not part of a stock Android boot at all — automotive-specific, and it deliberately bypasses the rest of this sequence.',
  },
  {
    number: 6,
    title: 'Vendor HALs, including the VHAL',
    summary: 'The Vehicle HAL connects to the vehicle network and registers so the framework can find it.',
    detail:
      'class hal starts the hardware abstraction layers — audio, camera, graphics, and the Vehicle HAL. A VHAL that waits for the first message from every ECU before registering can take seconds longer than it should; the fix is to register immediately with the property config list and populate the value cache on a background thread. Car Service needs the config list to proceed, not a fully warm cache.',
    commands: [
      'adb shell dumpsys android.hardware.automotive.vehicle.IVehicle/default',
      "# lshal | grep -i automotive.vehicle only shows the legacy HIDL VHAL —",
      '# it stays empty on an AIDL build even when the HAL is healthy.',
    ],
    aaosNote: 'The Vehicle HAL itself is the core automotive addition to this stage.',
  },
  {
    number: 7,
    title: 'Zygote and system_server',
    summary: 'Android proper begins — the framework warms up once, then every app forks from it.',
    detail:
      'Zygote starts the Android runtime, preloads common framework classes and resources, then waits. Every app is created by forking zygote, which is why app launch is fast — the expensive setup happened once. system_server is the first fork, and it starts the framework services: activity manager, window manager, package manager, and dozens more.',
  },
  {
    number: 8,
    title: 'Car Service — and the wait',
    summary: 'A persistent system app that blocks until the VHAL answers. Missing VHAL looks like a dead unit.',
    detail:
      'Car Service starts after the framework is up and immediately connects to the Vehicle HAL — and blocks until it answers. If the VHAL is missing, crashed, or undeclared in the interface manifest, Car Service never starts, and because so much of the automotive experience depends on it, the symptom is not an error message — it is a black screen. Once connected, Car Service asks for the property configs, caches them, and starts its own subservices (audio, power, users, driver distraction) in dependency order.',
    commands: ['adb shell dumpsys car_service --help'],
    aaosNote: 'Car Service itself is the automotive addition to system_server’s framework services, and this VHAL dependency is the single most useful fact on this page for bring-up debugging.',
  },
  {
    number: 9,
    title: 'Launcher, and boot_completed',
    summary: 'The home screen appears and sys.boot_completed=1 becomes a starting gun.',
    detail:
      'Everything in class late_start runs now — deferred jobs become eligible, Garage Mode becomes possible. This whole sequence describes a cold boot, which is actually rare: in daily use the head unit suspends rather than shuts down and resumes in about a second, which is what a driver experiences twenty times a week. Optimise both, but know which one customers feel — and test across suspend/resume, not just uptime, since a resource acquired on every resume and never released leaks once per ignition cycle.',
    commands: ['adb logcat -b events | grep boot_progress', 'adb shell bootstat --print'],
  },
]

/** The article's own "where did it stop" debugging order, one command per step. */
export const debugOrder: { stage: number; check: string; command: string }[] = [
  { stage: 3, check: 'Did the kernel come up?', command: 'adb shell dmesg | head -50' },
  { stage: 4, check: 'Did init get past the early phases?', command: 'adb shell getprop init.svc.servicemanager' },
  {
    stage: 6,
    check: 'Are the HALs up? (the automotive one that catches people)',
    command: 'adb shell dumpsys android.hardware.automotive.vehicle.IVehicle/default',
  },
  { stage: 7, check: 'Did system_server start?', command: 'adb shell ps -A | grep system_server' },
  { stage: 8, check: 'Did Car Service start?', command: 'adb shell dumpsys car_service --help' },
  { stage: 9, check: 'Did boot complete?', command: 'adb shell getprop sys.boot_completed' },
]
