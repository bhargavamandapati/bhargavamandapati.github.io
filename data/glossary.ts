/**
 * Plain-English definitions for every piece of AAOS jargon used across the site.
 *
 * `<T>VHAL</T>` in any MDX file looks a term up by its display text (or an
 * alias), and renders it with a hover/focus definition. Terms not found render
 * as plain text, so adding <T> around something is never a build risk.
 *
 * Keep `short` genuinely short — it appears in a popover. Put the fuller
 * explanation in `long`, which is what /glossary renders.
 */

export type Term = {
  /** Canonical display name. */
  term: string
  /** Other spellings that should resolve to this entry. Matched case-insensitively. */
  aliases?: string[]
  /** One sentence, no jargon. Shown in the popover. */
  short: string
  /** A paragraph or two for the glossary page. */
  long: string
  /** An everyday comparison, where one genuinely helps. */
  analogy?: string
  category:
    | 'Platform'
    | 'Vehicle data'
    | 'Framework'
    | 'UI'
    | 'Audio'
    | 'Build'
    | 'Security'
    | 'Standards'
    | 'Process'
  related?: string[]
}

export const glossary: Term[] = [
  // ---------------------------------------------------------------- Platform
  {
    term: 'AAOS',
    aliases: ['Android Automotive OS', 'Android Automotive'],
    short: 'A full Android operating system that runs on the car itself, not on your phone.',
    long: 'Android Automotive OS is Android installed on the vehicle\'s head unit at the factory. It boots when the car starts, owns the screens, the speakers and the climate controls, and works whether or not a phone is present. It is a complete operating system, not an app.',
    analogy:
      'Think of the difference between a smart TV and a Chromecast. AAOS is the smart TV — the software is built into the device. Android Auto is the Chromecast — your phone does the work and the screen just displays it.',
    category: 'Platform',
    related: ['Android Auto', 'head unit', 'GAS'],
  },
  {
    term: 'Android Auto',
    short: 'Your phone drawing a car-friendly screen and sending the picture to the car display.',
    long: 'Android Auto is a projection system. The app runs on the driver\'s phone; the head unit is only a screen and a touchpad. Unplug the phone and the experience leaves with it. It has no access to vehicle data.',
    category: 'Platform',
    related: ['AAOS', 'head unit'],
  },
  {
    term: 'head unit',
    aliases: ['IVI', 'infotainment head unit'],
    short: 'The computer and screen in the middle of the dashboard.',
    long: 'The head unit is the physical box behind the centre display. It runs the infotainment software, drives one or more screens, and connects to the vehicle network. On an AAOS vehicle, this is where Android runs.',
    category: 'Platform',
  },
  {
    term: 'AOSP',
    aliases: ['Android Open Source Project'],
    short: 'The free, public source code that all Android versions are built from.',
    long: 'AOSP is the openly published Android source code. Anyone can download it, modify it and build their own Android. Car makers start from AOSP and add their own hardware support, apps and branding.',
    category: 'Platform',
    related: ['GAS', 'Treble'],
  },
  {
    term: 'GAS',
    aliases: ['Google Automotive Services'],
    short: 'A licensed bundle of Google apps — Maps, Assistant, Play Store — that a car maker can pay to include.',
    long: 'Google Automotive Services is separate from AAOS. AAOS itself is free and open. GAS adds Google Maps, Google Assistant and the Play Store, and requires a commercial agreement plus passing Google\'s compatibility tests. Some vehicles ship with it; many ship without and use the maker\'s own maps and voice assistant.',
    category: 'Platform',
    related: ['AAOS', 'AOSP', 'CTS'],
  },
  {
    term: 'OEM',
    aliases: ['Original Equipment Manufacturer', 'car maker'],
    short: 'The company whose badge is on the car — Volvo, GM, Ford.',
    long: 'In automotive, OEM means the vehicle manufacturer. They own the product, set the requirements, and decide what ships. Suppliers (also called Tier 1s) build components and software for them.',
    category: 'Process',
    related: ['Tier 1'],
  },
  {
    term: 'Tier 1',
    aliases: ['supplier'],
    short: 'A company that builds parts or software directly for a car maker.',
    long: 'A Tier 1 supplier delivers components to the OEM — a head unit, a cluster, a software stack. Much automotive software is written by Tier 1s to an OEM\'s specification, which is why so much of the platform is designed around clean handover boundaries.',
    category: 'Process',
    related: ['OEM', 'Treble'],
  },
  {
    term: 'ECU',
    aliases: ['Electronic Control Unit'],
    short: 'A small dedicated computer that controls one part of the car.',
    long: 'A modern vehicle contains dozens to hundreds of ECUs. One controls the engine, another the doors, another the seats. Most are not running Android and know nothing about it — they exchange messages on the vehicle network.',
    analogy:
      'Like the separate controller boards inside a washing machine or a printer: each does one job, and they talk over a shared wire.',
    category: 'Vehicle data',
    related: ['CAN', 'vehicle network'],
  },

  // ------------------------------------------------------------ Vehicle data
  {
    term: 'VHAL',
    aliases: ['Vehicle HAL', 'Vehicle Hardware Abstraction Layer'],
    short: 'The single doorway through which everything the car knows reaches Android.',
    long: 'The Vehicle HAL is a piece of software that sits between Android and the car\'s own electronics. It offers Android a list of named values — speed, gear, cabin temperature — that can be read, written or watched for changes. Everything vehicle-related that an Android app can see came through here.',
    analogy:
      'Like a receptionist at a building. Visitors do not wander the corridors; they ask at the desk, and the desk knows how to reach each department. The VHAL is that desk.',
    category: 'Vehicle data',
    related: ['vehicle property', 'HAL', 'Car Service'],
  },
  {
    term: 'HAL',
    aliases: ['Hardware Abstraction Layer'],
    short: 'Code that hides the details of specific hardware behind a standard interface.',
    long: 'A Hardware Abstraction Layer lets Android talk to hardware without knowing whose hardware it is. Android says "take a photo" or "read the cabin temperature"; the HAL translates that into whatever the actual chip or ECU needs. Swap the hardware, rewrite the HAL, and Android above it is unchanged.',
    category: 'Platform',
    related: ['VHAL', 'AIDL', 'Treble'],
  },
  {
    term: 'vehicle property',
    aliases: ['property', 'vehicle properties'],
    short: 'One named piece of car information, like "speed" or "driver seat temperature".',
    long: 'A vehicle property is a single value the VHAL exposes. Each has an ID, a data type, an area it applies to, and rules about whether it can be read, written or both. Apps never talk to the car directly — they read and write properties.',
    category: 'Vehicle data',
    related: ['VHAL', 'property ID', 'area ID'],
  },
  {
    term: 'property ID',
    short: 'A 32-bit number that encodes what a property is, not just which one it is.',
    long: 'A property ID packs four things into one number: which namespace it belongs to (Google\'s or a vendor\'s), what part of the car it applies to, what data type it holds, and a unique identifier. Reading the number tells you a lot before you look anything up.',
    category: 'Vehicle data',
    related: ['vehicle property', 'area ID', 'VENDOR group'],
  },
  {
    term: 'area ID',
    aliases: ['area', 'areaId'],
    short: 'Which specific seat, door or window a value applies to.',
    long: 'Many properties exist several times over — one per seat, per door, per window. The area ID says which one. Crucially it is a set of flags, not a counter: the driver\'s seat is 0x0001 and the front passenger\'s is 0x0004, not 1 and 2.',
    analogy:
      'Like room numbers in a hotel. "Temperature" is meaningless on its own; "temperature in room 204" is a fact.',
    category: 'Vehicle data',
    related: ['vehicle property', 'property ID'],
  },
  {
    term: 'VENDOR group',
    aliases: ['vendor property', 'vendor properties'],
    short: 'The namespace car makers use for properties Google has not defined.',
    long: 'Property IDs carry a group. SYSTEM means Google defined it and every AAOS vehicle understands it the same way. VENDOR means a car maker invented it for their own feature. Using SYSTEM for your own invention causes collisions when Android is upgraded.',
    category: 'Vehicle data',
    related: ['property ID', 'vehicle property'],
  },
  {
    term: 'CarPropertyManager',
    short: 'The class an Android app uses to read and write vehicle values.',
    long: 'CarPropertyManager is the app-facing API for vehicle data. An app asks it for a property value or subscribes to changes; it forwards the request to Car Service, which checks permissions and asks the VHAL.',
    category: 'Framework',
    related: ['Car Service', 'vehicle property', 'VHAL'],
  },
  {
    term: 'CAN',
    aliases: ['CAN bus', 'Controller Area Network'],
    short: 'The shared wire that ECUs use to broadcast short messages to each other.',
    long: 'CAN is the most common vehicle network. ECUs broadcast small numbered messages; anything interested listens. It is fast, extremely reliable and decades old, and it carries no notion of "requests" — just a continuous stream of announcements.',
    analogy:
      'Like a walkie-talkie channel that everyone on a building site can hear. Nobody addresses anyone directly; you announce, and whoever cares listens.',
    category: 'Vehicle data',
    related: ['ECU', 'vehicle network', 'SOME/IP'],
  },
  {
    term: 'vehicle network',
    short: 'The wiring and protocols the car\'s computers use to talk to each other.',
    long: 'Collectively the CAN, LIN, FlexRay and Automotive Ethernet links inside a vehicle. Android does not connect to these directly — a vendor component does, and translates for the VHAL.',
    category: 'Vehicle data',
    related: ['CAN', 'ECU', 'SOME/IP'],
  },
  {
    term: 'change mode',
    aliases: ['VehiclePropertyChangeMode', 'ON_CHANGE', 'CONTINUOUS'],
    short: 'Whether a value is fixed, announced when it moves, or sampled continuously.',
    long: 'STATIC means it never changes after startup, like the VIN. ON_CHANGE means the VHAL announces it whenever it moves, like gear position. CONTINUOUS means it is sampled at a rate, like speed. Choosing wrong either wastes power or makes the UI stutter.',
    category: 'Vehicle data',
    related: ['vehicle property', 'subscription'],
  },
  {
    term: 'subscription',
    aliases: ['subscribe'],
    short: 'Asking to be told whenever a value changes, instead of repeatedly asking for it.',
    long: 'An app registers a callback for a property, and the platform delivers updates. This is always preferable to polling: it wakes fewer components and uses far less power.',
    category: 'Vehicle data',
    related: ['change mode', 'CarPropertyManager'],
  },

  // ---------------------------------------------------------------- Framework
  {
    term: 'Car Service',
    aliases: ['CarService', 'com.android.car'],
    short: 'The part of Android that owns everything car-related.',
    long: 'Car Service is a single system process holding a dozen smaller services: vehicle properties, audio zones, power state, user switching, driver distraction, watchdog. Apps reach the vehicle through it, and it checks permissions on the way.',
    category: 'Framework',
    related: ['CarPropertyManager', 'VHAL', 'system_server'],
  },
  {
    term: 'android.car',
    aliases: ['Car API', 'car-lib'],
    short: 'The library apps use to reach car features, the way android.media is used for audio.',
    long: 'android.car is the public API surface for automotive. It contains CarPropertyManager, CarAudioManager, CarUxRestrictionsManager and others. Apps link against it; it talks to Car Service behind the scenes.',
    category: 'Framework',
    related: ['Car Service', 'CarPropertyManager'],
  },
  {
    term: 'system_server',
    short: 'The single Android process that hosts most of the operating system\'s services.',
    long: 'system_server runs the window manager, activity manager, package manager and dozens more. It is the most important process on the device — if it crashes, the whole user interface restarts.',
    category: 'Framework',
    related: ['Car Service'],
  },
  {
    term: 'Binder',
    aliases: ['binder', 'IPC'],
    short: 'How one Android process asks another process to do something.',
    long: 'Binder is Android\'s mechanism for communication between processes. An app calling CarPropertyManager is really sending a Binder message to Car Service. It is fast, but not free — and each process has a limited pool of threads to handle incoming calls.',
    analogy:
      'Like a phone call between two departments. Fast, but the other department only has so many people to answer.',
    category: 'Framework',
    related: ['AIDL', 'Car Service'],
  },
  {
    term: 'AIDL',
    aliases: ['Android Interface Definition Language'],
    short: 'A small language for describing what one process is allowed to ask another.',
    long: 'You write an .aidl file listing methods and their arguments; the build generates the code that packs them into Binder messages. It is how HALs and system services publish their interfaces.',
    category: 'Framework',
    related: ['Binder', 'HAL', 'HIDL'],
  },
  {
    term: 'HIDL',
    short: 'The older version of AIDL, used for HALs before Android 13.',
    long: 'HIDL served the same purpose as AIDL for hardware interfaces. AOSP has moved HAL interfaces to AIDL; HIDL remains in older vehicles and is gradually being retired.',
    category: 'Framework',
    related: ['AIDL', 'VHAL'],
  },
  {
    term: 'headless system user',
    aliases: ['user 0', 'system user'],
    short: 'An invisible account that runs the car\'s software before anyone logs in.',
    long: 'On a phone, user 0 is you. In a car, user 0 has no screen at all — it exists to run climate, audio and the vehicle connection so the car works with nobody signed in. Drivers are separate users layered on top, and switching between them never restarts user 0.',
    analogy:
      'Like the building\'s caretaker. They keep the heating and lights running whether or not any tenant is home, and they do not move out when tenants change.',
    category: 'Framework',
    related: ['Car Service', 'occupant zone'],
  },
  {
    term: 'occupant zone',
    short: 'A seat position, together with the screens and the user that belong to it.',
    long: 'A cockpit may have a driver display, a cluster, a passenger screen and rear screens, with different people using them at once. Occupant zones model who is sitting where, which screens they own, and which user account is theirs.',
    category: 'Framework',
    related: ['headless system user', 'multi-display'],
  },
  {
    term: 'CarWatchdog',
    short: 'A service that checks other processes are still responding, and kills the ones that are not.',
    long: 'CarWatchdog pings registered services and terminates any that stop answering. It also tracks how much each app writes to storage, because vehicle flash memory has to survive fifteen years.',
    category: 'Framework',
  },

  // ----------------------------------------------------------------------- UI
  {
    term: 'CarSystemUI',
    short: 'The permanent bars and panels around the edge of the screen.',
    long: 'CarSystemUI draws the status bar, the navigation bar, the climate panel and the notification surface. Your app only ever gets the region between them, and the bars stay on top at all times.',
    category: 'UI',
    related: ['RRO', 'car-ui-lib'],
  },
  {
    term: 'RRO',
    aliases: ['Runtime Resource Overlay', 'overlay'],
    short: 'A separate app that replaces another app\'s colours, sizes and layouts without changing its code.',
    long: 'A Runtime Resource Overlay is how car makers rebrand Android without copying and editing it. The overlay supplies new values for named resources; the target application never knows. This matters because a copied-and-edited version has to be re-merged at every Android upgrade, for the vehicle\'s whole life.',
    analogy:
      'Like a phone case and a custom wallpaper. The phone is unchanged underneath, so it can still take system updates.',
    category: 'UI',
    related: ['CarSystemUI', 'car-ui-lib'],
  },
  {
    term: 'car-ui-lib',
    aliases: ['Car UI Library'],
    short: 'A set of ready-made screen components sized and behaved for use in a moving car.',
    long: 'The Car UI Library provides lists, toolbars, dialogs and preferences that are already large enough to hit while driving and already respond to distraction rules. Because every component reads the same named resources, one overlay restyles all of them at once.',
    category: 'UI',
    related: ['RRO', 'UX restrictions'],
  },
  {
    term: 'UX restrictions',
    aliases: ['CarUxRestrictions', 'driver distraction'],
    short: 'Rules the platform enforces on what your screen may show while the car is moving.',
    long: 'Above a speed threshold, the platform limits how many list items you may display, how long your text may be, whether video may play and whether a keyboard may appear. These are enforced by Android itself, not left to each app to honour.',
    category: 'UI',
    related: ['distractionOptimized', 'car-ui-lib'],
  },
  {
    term: 'distractionOptimized',
    short: 'A flag an app sets to claim a screen is safe to show while driving.',
    long: 'An activity marked distractionOptimized may be displayed while the vehicle is moving. Without it, the platform replaces the screen with a "not available while driving" message. Setting it is a safety claim that a car maker will test.',
    category: 'UI',
    related: ['UX restrictions'],
  },
  {
    term: 'EVS',
    aliases: ['Exterior View System'],
    short: 'The fast path that puts the reversing camera on screen before Android has finished starting.',
    long: 'Regulations in many markets require a reversing image within about two seconds. Android takes far longer to boot, so the camera path deliberately bypasses the Android framework and runs as a small native service that can start almost immediately.',
    category: 'UI',
    related: ['head unit', 'boot time'],
  },
  {
    term: 'cluster',
    aliases: ['instrument cluster'],
    short: 'The screen behind the steering wheel showing speed and warning lamps.',
    long: 'The instrument cluster displays legally required information. On many vehicles it is not driven by Android at all but by a separate certified system, with Android sending it content to display in one designated area.',
    category: 'UI',
    related: ['ASIL', 'telltale'],
  },
  {
    term: 'telltale',
    short: 'A warning lamp — seatbelt, airbag, engine — on the instrument cluster.',
    long: 'Telltales have legal requirements for colour, symbol and availability. They are almost never drawn by Android, because a general-purpose operating system cannot guarantee they will appear.',
    category: 'UI',
    related: ['cluster', 'ASIL'],
  },

  // -------------------------------------------------------------------- Audio
  {
    term: 'audio zone',
    aliases: ['zone'],
    short: 'A place in the car with its own volume and its own idea of what is playing.',
    long: 'The cabin is usually zone 0. A rear-seat entertainment system can be zone 1, with its own volume control and its own audio focus, so a passenger\'s film does not pause when the driver gets a navigation prompt.',
    category: 'Audio',
    related: ['audio context', 'bus'],
  },
  {
    term: 'audio context',
    aliases: ['context'],
    short: 'What kind of sound this is — music, navigation, phone call, warning chime.',
    long: 'The audio context is derived from what an app says its sound is for. It decides which speakers the sound reaches and what happens to it when something more important starts playing.',
    category: 'Audio',
    related: ['audio zone', 'bus', 'audio focus'],
  },
  {
    term: 'bus',
    aliases: ['audio bus', 'output device'],
    short: 'One physical audio output path from Android to the amplifier.',
    long: 'A car head unit exposes several separate outputs rather than one. Music goes out one, navigation another. Keeping them separate lets the amplifier lower the music behind a navigation prompt in hardware, without any software involvement.',
    category: 'Audio',
    related: ['audio zone', 'audio context', 'ducking'],
  },
  {
    term: 'audio focus',
    short: 'The system deciding who is allowed to make noise right now.',
    long: 'When two things want to play, focus decides the outcome: one stops, one pauses, or both play with one quieter. In a car some sounds — collision warnings — cannot be interrupted at all, so requests that would interrupt them are simply refused.',
    category: 'Audio',
    related: ['ducking', 'audio context'],
  },
  {
    term: 'ducking',
    short: 'Turning one sound down rather than stopping it, so another can be heard over it.',
    long: 'When a navigation prompt plays, the music does not stop — it gets quieter for a moment. That is ducking. It can be done by the app, by Android, or by the amplifier in hardware.',
    category: 'Audio',
    related: ['audio focus', 'bus'],
  },

  // -------------------------------------------------------------------- Build
  {
    term: 'lunch target',
    aliases: ['lunch', 'build target'],
    short: 'The choice of which device and which build flavour you are compiling.',
    long: 'Before building AOSP you run `lunch` and pick a target, such as a car emulator in debug configuration. It determines which code is compiled, which apps are included and what the resulting image runs on.',
    category: 'Build',
    related: ['product config', 'userdebug'],
  },
  {
    term: 'product config',
    aliases: ['product makefile'],
    short: 'The file listing what software goes into a particular device\'s image.',
    long: 'A product makefile names the apps, HALs, configuration files and settings that make up one device. Board configuration, separately, describes the hardware it runs on.',
    category: 'Build',
    related: ['lunch target', 'Soong'],
  },
  {
    term: 'Soong',
    aliases: ['Android.bp', 'blueprint'],
    short: 'The build system AOSP uses, configured with Android.bp files.',
    long: 'Soong reads declarative Android.bp files describing each module — its sources, its dependencies, which partition it belongs on — and works out how to build everything. It replaced the older Make-based system.',
    category: 'Build',
    related: ['product config'],
  },
  {
    term: 'userdebug',
    short: 'A build flavour that behaves like production but lets you debug it.',
    long: 'user builds are locked down like a customer\'s vehicle. eng builds are permissive and fast to build but unlike production. userdebug sits between: security stays enforcing, but you get root over adb and useful diagnostics. It is what platform development uses.',
    category: 'Build',
    related: ['lunch target'],
  },
  {
    term: 'OTA',
    aliases: ['over-the-air update'],
    short: 'A software update delivered to a vehicle wirelessly.',
    long: 'Over-the-air updates let a car maker fix software after a vehicle is sold. Because there is no way to recover a vehicle that fails mid-update, the design writes the new version to a spare copy of the storage and switches over only once it is complete.',
    category: 'Build',
    related: ['A/B partitions', 'verified boot'],
  },
  {
    term: 'A/B partitions',
    aliases: ['seamless updates', 'slot'],
    short: 'Two complete copies of the system, so an update can be written while the car runs on the other.',
    long: 'The vehicle runs from slot A while the update is written to slot B. A reboot switches to B. If B fails to start, the bootloader falls back to A automatically. There is never a moment where the car has neither a working system nor a spare.',
    analogy:
      'Like painting the spare room while you sleep in the main one, then swapping. If the paint job is wrong, you move back.',
    category: 'Build',
    related: ['OTA', 'verified boot'],
  },
  {
    term: 'Garage Mode',
    short: 'A window after the car is switched off when it may still do background work.',
    long: 'The engine is off and the driver has gone, but the head unit stays awake briefly to apply updates, upload diagnostics and sync data — work nobody should have to wait for while driving. The window is limited, so tasks must be able to stop partway and resume next time.',
    category: 'Platform',
    related: ['OTA', 'power state'],
  },
  {
    term: 'power state',
    aliases: ['CPMS', 'Car Power Management Service'],
    short: 'What the head unit is doing when the car is not being driven.',
    long: 'A head unit is rarely fully off. It suspends, so it can wake in about a second when the driver returns. The power state machine covers booting, running, preparing to shut down, and the different depths of sleep.',
    category: 'Platform',
    related: ['Garage Mode', 'boot time'],
  },
  {
    term: 'boot time',
    short: 'How long from switching the car on to the software being usable.',
    long: 'Car makers commit to specific figures, and some are legal requirements — a reversing camera image within roughly two seconds. Boot time is measured on real hardware from the ignition signal, not from when Android starts.',
    category: 'Platform',
    related: ['EVS', 'power state'],
  },

  // ----------------------------------------------------------------- Security
  {
    term: 'SELinux',
    aliases: ['SEPolicy', 'sepolicy'],
    short: 'A permission system in the Linux kernel that says which programs may touch which files.',
    long: 'SELinux labels every process and every file, and a policy lists what is allowed. Anything not explicitly permitted is denied. On Android it is always on, and it is the usual reason a correctly written program silently does nothing.',
    analogy:
      'Like a building where every door needs a specific badge. Your badge working everywhere is not the default — every door must be granted individually.',
    category: 'Security',
    related: ['AVC denial', 'Treble'],
  },
  {
    term: 'AVC denial',
    aliases: ['avc denied', 'denial'],
    short: 'A log line saying SELinux blocked something.',
    long: 'When SELinux refuses an operation it logs a denial naming who tried, what they touched and what they wanted to do. Denials do not usually crash anything — the operation simply fails — which is why a value that is wrong but consistent is so often a denial.',
    category: 'Security',
    related: ['SELinux'],
  },
  {
    term: 'Treble',
    aliases: ['vendor interface', 'Project Treble'],
    short: 'The rule that hardware code and Android code are kept separate and talk only through fixed interfaces.',
    long: 'Treble splits the system into partitions: Android framework on one, hardware-specific code on another. They communicate only through versioned, stable interfaces. This is what allows Android to be upgraded on a vehicle years later without every supplier rewriting their code.',
    analogy:
      'Like a plug and a socket. You can replace the lamp or rewire the house independently, because the plug shape is agreed and does not change.',
    category: 'Security',
    related: ['HAL', 'AIDL', 'VINTF'],
  },
  {
    term: 'VINTF',
    short: 'A manifest listing which hardware interfaces a device provides, and at which version.',
    long: 'The Vendor Interface Object declares each HAL a device implements. Android checks it at startup, and apps can ask whether an interface exists — which is how a feature can be absent on a cheaper trim without anything crashing.',
    category: 'Security',
    related: ['Treble', 'HAL'],
  },
  {
    term: 'signature permission',
    aliases: ['privileged permission', 'privapp'],
    short: 'A permission only apps built into the car\'s software can hold.',
    long: 'Reading the speed is an ordinary permission any app can request. Moving a window is not — that requires the app to be part of the vehicle image and signed with the car maker\'s key. This is a schedule decision as much as a technical one: such an app ships when the car maker ships.',
    category: 'Security',
    related: ['verified boot'],
  },
  {
    term: 'verified boot',
    aliases: ['AVB', 'dm-verity'],
    short: 'Each stage of startup checking the next is genuine before running it.',
    long: 'A key burned into the chip verifies the bootloader, which verifies the system, and so on. If any stage has been tampered with, the vehicle refuses to start it. This is why the software cannot simply be edited on a production car.',
    category: 'Security',
    related: ['OTA', 'signature permission'],
  },
  {
    term: 'ASIL',
    aliases: ['ISO 26262', 'functional safety'],
    short: 'A rating for how dangerous it is if a particular function fails.',
    long: 'ASIL levels run from A to D, D being the most critical. The rating decides how rigorously something must be developed and tested. Android is generally not rated at all, which is why anything safety-critical — telltales, airbag control — runs on separate hardware.',
    category: 'Security',
    related: ['cluster', 'telltale'],
  },
  {
    term: 'CTS',
    aliases: ['Compatibility Test Suite'],
    short: 'Google\'s automated tests that check a device behaves like Android is supposed to.',
    long: 'CTS runs thousands of tests against the framework. Passing is required to ship with Google services, and failures usually mean a car maker changed platform behaviour that apps rely on.',
    category: 'Security',
    related: ['VTS', 'GAS'],
  },
  {
    term: 'VTS',
    aliases: ['Vendor Test Suite'],
    short: 'Tests that check the hardware-facing code honours its interfaces.',
    long: 'Where CTS tests the framework, VTS tests HALs. For the VHAL it checks the property list is well formed, areas are consistent, and declared limits are actually enforced.',
    category: 'Security',
    related: ['CTS', 'VHAL'],
  },

  // ---------------------------------------------------------------- Standards
  {
    term: 'VSS',
    aliases: ['Vehicle Signal Specification'],
    short: 'An industry-standard naming scheme for car data, like Vehicle.Speed.',
    long: 'The Vehicle Signal Specification is a shared tree of signal names, types and units maintained by an industry body. Its value is that a supplier, a platform team and a UI team can agree on one definition instead of each keeping a private list.',
    category: 'Standards',
    related: ['AUTOSAR', 'SDV'],
  },
  {
    term: 'AUTOSAR',
    aliases: ['ARXML'],
    short: 'The software standard most car ECUs are built to.',
    long: 'AUTOSAR defines how automotive control software is structured. Its signal definitions are published in an XML format called ARXML, which is usually the original source of truth for what data a vehicle produces.',
    category: 'Standards',
    related: ['VSS', 'ECU', 'SOME/IP'],
  },
  {
    term: 'SOME/IP',
    short: 'A way for car components to offer services to each other over a network, rather than just broadcasting.',
    long: 'Where CAN broadcasts numbered messages, SOME/IP lets a component publish named services that others discover and call. It is part of the shift from wiring signals together to treating vehicle functions as software services.',
    category: 'Standards',
    related: ['CAN', 'AUTOSAR', 'SDV'],
  },
  {
    term: 'SDV',
    aliases: ['Software Defined Vehicle'],
    short: 'Designing a car so its features come from software that can be changed later.',
    long: 'A software-defined vehicle treats functions as software running on general-purpose computers, rather than fixed behaviour wired into dedicated ECUs. In practice it means fewer, more powerful computers, service-based communication, and features that can be added after the car is sold.',
    category: 'Standards',
    related: ['VSS', 'SOME/IP', 'OTA'],
  },
  {
    term: 'hypervisor',
    short: 'Software that runs several separate operating systems on one chip, keeping them isolated.',
    long: 'A modern cockpit computer may run Android for infotainment and a safety-rated system for the instrument cluster on the same silicon. The hypervisor partitions the hardware so a fault in one cannot affect the other.',
    analogy:
      'Like flats in one building. Shared foundations and wiring, but a fire door and separate meters between them.',
    category: 'Platform',
    related: ['ASIL', 'cluster'],
  },

  // ------------------------------------------------------- newly covered
  {
    term: 'GNSS',
    aliases: ['GPS', 'satellite positioning'],
    short: 'Positioning from satellites — GPS is one system among several.',
    long: 'Global Navigation Satellite System is the umbrella term for GPS (US), Galileo (EU), GLONASS (Russia) and BeiDou (China). A modern receiver uses several at once, which is why position is far better than GPS alone used to be.',
    category: 'Vehicle data',
    related: ['dead reckoning'],
  },
  {
    term: 'dead reckoning',
    short: 'Working out where you are from how fast and which way you have been going, when satellites are unavailable.',
    long: 'In a tunnel or a multi-storey car park there is no satellite signal. Dead reckoning keeps estimating position from wheel rotation, steering angle and gyroscope data until the signal returns. Error accumulates the longer it runs.',
    analogy:
      'Like keeping track of where you are in a dark room by counting your steps and remembering which way you turned. It works for a while, and gets worse the longer you go.',
    category: 'Vehicle data',
    related: ['GNSS', 'wheel tick'],
  },
  {
    term: 'wheel tick',
    short: 'A count of how far each wheel has rotated, used to measure distance precisely.',
    long: 'Wheel speed sensors produce pulses as the wheel turns. Counting them gives a far more accurate distance measurement than integrating speed, which is why they feed dead reckoning and odometry.',
    category: 'Vehicle data',
    related: ['dead reckoning'],
  },
  {
    term: 'ADAS',
    aliases: ['Advanced Driver Assistance Systems'],
    short: 'The systems that help or intervene while driving — lane keeping, adaptive cruise, emergency braking.',
    long: 'ADAS covers everything from a lane departure warning to automatic emergency braking. It runs on its own dedicated, safety-rated hardware; Android generally only receives its state to display, and never controls it.',
    category: 'Vehicle data',
    related: ['ASIL', 'cluster'],
  },
  {
    term: 'DMS',
    aliases: ['driver monitoring', 'driver monitoring system'],
    short: 'A camera watching the driver to detect drowsiness or distraction.',
    long: 'A driver monitoring system uses an infrared camera pointed at the driver to estimate gaze direction and eye closure. In several markets it is becoming a regulatory requirement. The camera feed is highly sensitive personal data and normally never leaves its own processor.',
    category: 'Vehicle data',
    related: ['ADAS'],
  },
  {
    term: 'digital key',
    aliases: ['phone as key', 'CCC Digital Key'],
    short: 'Using a phone or watch to unlock and start the car instead of a physical key.',
    long: 'Standardised by the Car Connectivity Consortium. It uses secure hardware on both the phone and the vehicle, with ultra-wideband or Bluetooth for proximity. Android is usually not in the trust path at all — a dedicated secure module handles it.',
    category: 'Security',
    related: ['verified boot'],
  },
  {
    term: 'tombstone',
    short: 'A file Android writes when a native program crashes, recording exactly where.',
    long: 'When C or C++ code crashes, the system captures the registers, the stack and the memory map into a tombstone file under /data/tombstones. With the matching symbols it can be turned back into readable function names.',
    analogy:
      'Like a flight recorder. The program is gone, but it left behind enough detail to reconstruct the last moments.',
    category: 'Build',
    related: ['ANR'],
  },
  {
    term: 'ANR',
    aliases: ['Application Not Responding'],
    short: 'Android deciding an app has stopped responding to input and offering to close it.',
    long: 'If an app does not handle input within a few seconds, or a service does not start in time, Android declares an ANR. On a vehicle these are more serious than on a phone: the driver cannot pull over to deal with a frozen screen.',
    category: 'Build',
    related: ['tombstone', 'Binder'],
  },
  {
    term: 'device tree',
    aliases: ['DTB', 'dts'],
    short: 'A description of what hardware exists, handed to the kernel at boot.',
    long: 'Rather than compiling hardware details into the kernel, a device tree describes the board: which chips are on which bus, which pins do what, which display is attached. The same kernel can then boot different boards.',
    category: 'Build',
    related: ['boot time'],
  },
  {
    term: 'RTC',
    aliases: ['real-time clock'],
    short: 'A small battery-backed clock that keeps time while the car is off.',
    long: 'The real-time clock runs on its own tiny power supply so the vehicle knows roughly what time it is at startup, before any network or satellite fix. It drifts, which is why the time is corrected once a better source is available.',
    category: 'Platform',
    related: ['GNSS'],
  },
  {
    term: 'state of charge',
    aliases: ['SoC', 'battery level'],
    short: 'How full the high-voltage battery is, as a percentage.',
    long: 'The equivalent of a fuel gauge for an electric vehicle. It is an estimate rather than a direct measurement, computed by the battery management system from voltage, current and temperature.',
    category: 'Vehicle data',
  },
  {
    term: 'projection',
    short: 'A phone drawing a car interface and sending the picture to the head unit.',
    long: 'Android Auto and Apple CarPlay both work this way. Confusingly, an AAOS vehicle can also host projection — the car runs Android as its own operating system AND can display a projected phone session as one more app.',
    category: 'Platform',
    related: ['Android Auto', 'AAOS'],
  },
]

/** Lookup by display text or alias, case- and punctuation-insensitive. */
function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const index = new Map<string, Term>()
for (const entry of glossary) {
  index.set(normalise(entry.term), entry)
  for (const alias of entry.aliases ?? []) index.set(normalise(alias), entry)
}

export function lookupTerm(value: string): Term | undefined {
  return index.get(normalise(value))
}

export const glossaryCategories = [
  'Platform',
  'Vehicle data',
  'Framework',
  'UI',
  'Audio',
  'Build',
  'Security',
  'Standards',
  'Process',
] as const
