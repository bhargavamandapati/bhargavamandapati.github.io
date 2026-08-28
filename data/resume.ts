/**
 * Single source of truth for every piece of résumé content on the site.
 *
 * Deliberately contains NO phone number, email address or postal address.
 * Reach-out happens through the social profiles in data/site.ts only.
 */

export type Role = {
  company: string
  title: string
  start: string // YYYY-MM
  end: string | null // null = present
  summary: string
  highlights: string[]
}

export type Project = {
  slug: string
  name: string
  period: string
  start: string
  end: string | null
  domain: string
  featured: boolean
  summary: string
  description: string
  highlights: string[]
  stack: string[]
  /** OEM the programme was delivered for, when it is named on the résumé. */
  clients?: string[]
}

export type SkillGroup = {
  name: string
  blurb: string
  skills: string[]
}

/** Career start — used to keep "years of experience" accurate without edits. */
export const CAREER_START = '2016-04'

export function yearsOfExperience(from: string = CAREER_START): number {
  const [y, m] = from.split('-').map(Number)
  const now = new Date()
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
  return Math.floor(months / 12)
}

export const profile = {
  name: 'Bhargava Mandapati',
  headline: 'Team Lead · Android Framework, HAL & Platform Engineering',
  pitch:
    'I build the software layer between the vehicle and the screen — AOSP platform bring-up, ' +
    'vehicle HALs, and the Android Automotive middleware that turns raw CAN and VSS signals ' +
    'into infotainment people actually touch.',
  bio: [
    'I am a Team Lead at Accenture India with over a decade of experience designing and shipping mobile and automotive software. My work centres on Android, the Android Automotive Framework, Kotlin, Java and IoT — most of it running inside production vehicles.',
    'In my current role I lead a team of software engineers across design, development and maintenance, coordinating with cross-functional teams to clear blockers before they stall a sprint. A large part of the job is technical guidance: unblocking engineers, reviewing architecture, and keeping delivery predictable.',
    'I have spearheaded project architecture modifications to align with evolving requirements, and used Java, Kotlin and Android to deliver high-quality software while engaging onsite teams directly. I travelled to Shanghai to support the launch of a major automotive app project — the kind of commitment that turns a hard delivery into a shipped one.',
    'I hold a B.Tech in Electrical, Electronics and Communications Engineering from JNTU Kakinada, where I picked up the fundamentals of embedded systems and network protocols that still underpin my automotive work. I am a certified SAFe® 5 Practitioner, which helps me keep agile practice pragmatic rather than ceremonial.',
    'I thrive in challenges, and I care about the people side as much as the platform side. Communication and leadership are what turn a capable team into a shipping one.',
  ],
  facts: [
    { label: 'Years in software', value: '10+' },
    { label: 'Largest team led', value: '15' },
    { label: 'AOSP platforms shipped', value: 'Info 3.0 → 5.0' },
    { label: 'Automotive OEM', value: 'General Motors' },
  ],
} as const

export const experience: Role[] = [
  {
    company: 'Accenture',
    title: 'System Developer Associate Manager',
    start: '2026-04',
    end: null,
    summary:
      'Leading a software engineering team at a global IT services company, owning design, development and maintenance across mobile and automotive applications.',
    highlights: [
      'Lead a team of software engineers through design, development and maintenance of software applications.',
      'Coordinate with cross-functional teams to proactively resolve blockers and keep project progress uninterrupted.',
      'Provide technical guidance and hands-on support to team members, driving projects to successful completion.',
      'Spearhead project architecture modifications to align delivery with evolving requirements.',
    ],
  },
  {
    company: 'People Tech Group Inc',
    title: 'Team Lead',
    start: '2022-11',
    end: '2026-03',
    summary:
      'Led Android Automotive middleware and infotainment delivery for a global OEM programme, from architecture through multi-variant rollout.',
    highlights: [
      'Led a 15-member cross-functional team delivering Android Automotive middleware and infotainment features.',
      'Architected and guided development of custom VHALs and services for vehicle signal integration.',
      'Implemented cluster–center stack communication using TCP/IP and protobufs for real-time infotainment sync.',
      'Delivered tools such as a VSS Simulation Tool and data converters to accelerate validation.',
      'Managed multi-variant feature rollouts, ensuring scalability across vehicle programs.',
      'Mentored engineers in AOSP bring-up and framework development, enhancing team capability.',
      'Travelled to Shanghai to engage with the client team, addressing major challenges and ensuring project success.',
    ],
  },
  {
    company: 'People Tech Group Inc',
    title: 'Senior Software Engineer',
    start: '2021-08',
    end: '2022-11',
    summary:
      'Digitised the cockpit — migrating legacy RTOS control software into Android Automotive and replacing physical controls with software UI.',
    highlights: [
      'Migrated legacy RTOS C/C++ vehicle control applications into Android, enabling cockpit digitization.',
      'Implemented Virtual Control features (Drive & Park, Doors, Windows, Lights) using CAN Manager, Vehicle Properties and Vendor Properties.',
      'Created custom dynamic cards and widgets generated automatically based on signal types.',
      'Developed OEM-specific designs with RRO themes, supporting Cadillac infotainment branding.',
      'Built a Validator app and Espresso UI automation to validate middleware and UI stability.',
      'Supported agile delivery through scrums, PI planning, story estimation and bug fixing.',
    ],
  },
  {
    company: 'People Tech Group Inc',
    title: 'Software Engineer',
    start: '2018-07',
    end: '2021-07',
    summary:
      'Brought Android up on custom automotive boards — HALs, SEPolicy and module integration for proprietary hardware.',
    highlights: [
      'Contributed to Android OS bring-up on custom automotive boards, developing HALs and customizing SEPolicy for proprietary hardware.',
      'Integrated HUD, Cluster, Camera and RVC modules into the infotainment system.',
      'Designed module-level architectures to improve scalability and reduce integration overhead.',
      'Collaborated with global teams to validate features across multiple infotainment variants.',
      'Performed bug fixing, code reviews and enhancements to stabilize production systems.',
      'Participated in story planning, scrums and client calls, ensuring smooth cross-team alignment.',
      'Maintained effective synchronization between onsite and offshore teams.',
    ],
  },
  {
    company: 'People Tech Group Inc',
    title: 'Junior Software Engineer',
    start: '2016-04',
    end: '2018-06',
    summary:
      'Built the Android infotainment prototypes that won OEM confidence and seeded the larger production programmes.',
    highlights: [
      'Developed an Android prototype platform showcasing next-gen in-vehicle experiences.',
      'Contributed to prototype architecture for next-generation Android infotainment systems.',
      'Developed infotainment apps (Home, Audio, Climate, Navigation, Trailer, Favorites, Phone, Settings) for Cadillac proof-of-concepts.',
      'Built the Multi-Functional Control (MFC) library for hardware-driven navigation of Android widgets.',
      'Co-developed a Skew library to enhance freeform display with dynamic widget skewing.',
      'Focused on UI/UX implementation, aligning with OEM brand guidelines.',
      'Supported proof-of-concept prototypes that secured OEM confidence and enabled larger-scale infotainment programs.',
    ],
  },
]

export const projects: Project[] = [
  {
    slug: 'sdv-android',
    name: 'SDV Android',
    period: 'Mar 2025 — Mar 2026',
    start: '2025-03',
    end: '2026-03',
    domain: 'Software Defined Vehicle',
    featured: true,
    summary:
      'Extended Software Defined Vehicle capabilities into Android Automotive, bridging VSS with the Android middleware stack.',
    description:
      'Extended Software Defined Vehicle (SDV) capabilities into Android Automotive, enabling native support for Vehicle Signal Specification (VSS) and bridging automotive signal standards with Android middleware.',
    highlights: [
      'Developed custom VHALs, system services and Car Services to propagate VSS signals through the Android middleware stack.',
      'Led a 6-member team through scrums, sprint planning and iterative research work to expand SDV support.',
      'Completed a cross-platform VSS Simulation Tool (C++/Qt) with dynamic UI generation based on signal types, enabling rapid validation on Windows and Linux.',
      'Delivered VSS-to-VHAL and ARXML-to-VSS converters, ensuring compatibility with AUTOSAR and industry standards.',
      'Integrated SOME/IP, Franca IDL and the Eclipse Kuksa Data Broker to validate SDV use cases in hypervisor-based AAOS bring-up.',
    ],
    stack: ['Android Automotive', 'VSS', 'VHAL', 'C++', 'Qt', 'AUTOSAR', 'SOME/IP', 'Franca IDL', 'Eclipse Kuksa'],
  },
  {
    slug: 'clusterservice-rhmi-android',
    name: 'Clusterservice RHMI Android',
    period: 'Jul 2024 — Apr 2025',
    start: '2024-07',
    end: '2025-04',
    domain: 'Cluster & Middleware',
    featured: true,
    summary:
      'A system service enabling TCP/IP communication between the Center Stack and Instrument Cluster for GM vehicles.',
    description:
      'A system service module for GM vehicles enabling TCP/IP communication between Center Stack and Instrument Cluster using FSA architecture. The GM cluster is divided into multiple zones; this module manages Zone 3, dedicated to infotainment features such as Audio, Phone, Navigation and OnStar cards.',
    highlights: [
      'Led a 10-member cross-functional team of developers and testers, ensuring smooth coordination and delivery across sprints.',
      'Joined the project mid-way and took ownership of feature delivery and stabilization for multiple infotainment variants.',
      'Delivered key infotainment features (Audio, Phone, Navigation, OnStar) by preparing UIs and transmitting them to the cluster via protobuf over TCP/IP.',
      'Oversaw UI preparation logic for Zone 3 infotainment cards, ensuring compliance with GM design standards.',
      'Worked closely with QA to validate features across multiple cluster–center stack configurations, ensuring robust multi-variant support.',
    ],
    stack: ['Android', 'TCP/IP', 'Protobuf', 'FSA Architecture', 'Kotlin', 'Java'],
    clients: ['General Motors'],
  },
  {
    slug: 'virtual-controls',
    name: 'Virtual Controls',
    period: 'Jan 2023 — Jun 2023',
    start: '2023-01',
    end: '2023-06',
    domain: 'Cockpit Digitization',
    featured: true,
    summary:
      'Replaced physical Cadillac cockpit buttons with software controls by migrating RTOS C/C++ logic to Android Automotive.',
    description:
      'Migrated RTOS-based C/C++ Virtual Controls to Android Automotive OS for a digital cockpit in Cadillac. Replaced physical buttons (Drive & Park, Doors, etc.) with software controls via infotainment UI, leveraging CarPropertyManager, CAN Manager and Vendor Properties.',
    highlights: [
      "Converted RTOS C/C++ implementation into Android, enabling seamless integration with GM's infotainment stack.",
      'Implemented full Virtual Control features (Drive & Park, Doors, Windows, Lights) using CAN Manager, Vehicle Properties and Vendor Properties.',
      'Created custom views for dynamic card UIs that adapt automatically based on vehicle signal types.',
      'Built drag-and-drop home screen widgets, dynamic card tiles and Cadillac-specific theme overlays (RRO).',
      'Automated testing via Espresso UI test cases and built a Validator app to confirm correct functioning of CarPropertyManager, CAN Manager and Ultifi services.',
      "Contributed to Cadillac's next-gen cockpit prototype, demonstrating the feasibility of software-defined controls in place of physical buttons.",
    ],
    stack: ['Android Automotive', 'CarPropertyManager', 'CAN Manager', 'RRO', 'Espresso', 'C/C++', 'RTOS'],
    clients: ['General Motors', 'Cadillac'],
  },
  {
    slug: 'project-guava',
    name: 'Project Guava',
    period: 'Nov 2019 — Feb 2021',
    start: '2019-11',
    end: '2021-02',
    domain: 'AOSP Bring-up',
    featured: true,
    summary:
      'End-to-end AOSP customization to bring Android OS up on a custom automotive CSM board.',
    description:
      'Research initiative to provide Android OS support for a custom automotive CSM board, requiring end-to-end customization of the AOSP stack.',
    highlights: [
      'Customized the Android OS source stack including HALs, SEPolicy and framework layers to enable feature parity on custom hardware.',
      'Developed HALs for proprietary automotive hardware modules, ensuring seamless integration with Android middleware.',
      'Authored and fine-tuned SEPolicy rules to enforce proper security contexts and permissions for new hardware services.',
      'Contributed to Android bring-up on CSM hardware.',
    ],
    stack: ['AOSP', 'HAL', 'SEPolicy', 'Android Framework', 'C/C++', 'Board Bring-up'],
  },
  {
    slug: 'gm-info-35c-prototype',
    name: 'GM INFO 3.5C Prototype — Cadillac',
    period: 'Apr 2016 — Jun 2018',
    start: '2016-04',
    end: '2018-06',
    domain: 'Prototype & Libraries',
    featured: true,
    summary:
      "The Android infotainment prototype that secured GM's trust and paved the way for Info 3.x → 4.0.",
    description:
      'Created an Android infotainment prototype for Cadillac, showcasing next-gen cockpit features and aiding GM in Android adoption validation.',
    highlights: [
      'Delivered infotainment apps: Home, Audio, Climate, Navigation, Trailer, Favorites, Phone and Settings.',
      'Collaborated with a team to design the prototype architecture, ensuring modularity and scalability for future infotainment programs.',
      'Co-developed the Multi-Functional Control (MFC) library, enabling intuitive navigation using a hardware MFC controller.',
      'Contributed to the Skew library, optimizing freeform display with dynamic widget skewing and edge utilization, and a Blur library for unique UI.',
      "The prototype's success directly secured GM's trust, paving the way for larger infotainment programs (Info 3.x → Info 4.0).",
    ],
    stack: ['Android', 'Java', 'Custom Views', 'MFC Library', 'Skew Library', 'UI/UX'],
    clients: ['General Motors', 'Cadillac'],
  },
  {
    slug: 'hmi-infotainment-5',
    name: 'HMI Infotainment 5.0',
    period: 'May 2022 — Apr 2025',
    start: '2022-05',
    end: '2025-04',
    domain: 'HMI Platform',
    featured: false,
    summary:
      'Next-generation HMI letting drivers interact through touchpads, multi-touch dashboards, built-in screens and control panels.',
    description:
      'Human Machine Interface (HMI) development allows drivers to interact with touchpads, multi-touch dashboards, built-in screens, control panels, push buttons and traditional keypads. Because a car is an entire ecosystem of interconnected parts, quality HMI software is crucial for the automotive industry. Modern consumers demand a seamless experience, and HMI solutions satisfy the demand for smooth interactions with a car. Enabled by smart systems and embedded sensors, human machine interfaces make sure that vehicles react to driver intent and preferences.',
    highlights: [
      'Delivered adaptive, personalised next-generation in-vehicle experiences across multiple input surfaces.',
      'Integrated smart systems and embedded sensors so the vehicle responds to driver intent and preferences.',
    ],
    stack: ['Android Automotive', 'HMI', 'Kotlin', 'Jetpack Compose', 'Embedded Sensors'],
  },
  {
    slug: 'gm-automotive-infotainment',
    name: 'General Motors — Automotive Infotainment',
    period: 'Oct 2016 — Apr 2025',
    start: '2016-10',
    end: '2025-04',
    domain: 'OEM Programme',
    featured: false,
    summary:
      'Nearly a decade across GM infotainment variants — Info 3.0, 3.5, 5.0 and 4.0 — from Model Year 2016 onward.',
    description:
      'Automotive Infotainment has multiple variants — Info3.0, Info3.5, Info5.0 and Info4.0 — built from Model Year 2016 to date, with Info3.5 and Info4.0 going into upcoming model years. Infotainment development builds on hardware HMI-CSM, HUD, Cluster, Camera and RVC. This hardware is controlled in-vehicle directly or indirectly by SWC, MFC, face plates and vehicle CAN messages.',
    highlights: [
      'Delivered features across four infotainment variants spanning multiple model years.',
      'Worked across HMI-CSM, HUD, Cluster, Camera and RVC hardware modules.',
      'Handled control paths via SWC, MFC, face plates and vehicle CAN messages.',
    ],
    stack: ['Android', 'HUD', 'Cluster', 'RVC', 'CAN', 'MFC'],
    clients: ['General Motors'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    name: 'Languages',
    blurb: 'Day-to-day implementation languages across app, framework and native layers.',
    skills: ['Kotlin', 'Java', 'C / C++', 'XML'],
  },
  {
    name: 'Android Platform',
    blurb: 'The AOSP surface I work below the app layer.',
    skills: [
      'AOSP',
      'Android Automotive (AAOS)',
      'Android Framework',
      'HAL / VHAL',
      'SEPolicy',
      'System Services',
      'Car Service',
      'RRO (Runtime Resource Overlay)',
      'Board Bring-up',
    ],
  },
  {
    name: 'Automotive & Signals',
    blurb: 'Standards and transports that move data between ECUs and the head unit.',
    skills: [
      'VSS (Vehicle Signal Specification)',
      'AUTOSAR / ARXML',
      'SOME/IP',
      'Franca IDL',
      'CAN',
      'Eclipse Kuksa',
      'Protobuf',
      'TCP/IP',
      'RTOS Migration',
    ],
  },
  {
    name: 'App & UI',
    blurb: 'What the driver actually sees and touches.',
    skills: ['Jetpack', 'Jetpack Compose', 'MVVM', 'Custom Views', 'Espresso', 'UI Automation'],
  },
  {
    name: 'Ways of Working',
    blurb: 'How the work gets planned, reviewed and shipped.',
    skills: [
      'SAFe® 5',
      'Agile / Scrum',
      'PI Planning',
      'Code Review',
      'Clean Code',
      'Technical Mentoring',
      'Cross-functional Leadership',
    ],
  },
]

export const education = [
  {
    institution: 'Jawaharlal Nehru Technological University, Kakinada',
    degree: 'Bachelor of Technology (B.Tech.)',
    field: 'Electrical, Electronics and Communications Engineering',
    start: '2010-08',
    end: '2014-04',
  },
]

export const certifications = [
  { name: 'Certified SAFe® 5 Practitioner', issuer: 'Scaled Agile, Inc.' },
  { name: 'Autosar Architecture (Learn from Scratch with Demo)', issuer: 'Udemy' },
  { name: 'The Complete Guide to Becoming a Software Architect', issuer: 'Udemy' },
]

export const awards = [
  { name: 'Service Anniversary Award' },
  { name: 'Unmatched Dedication Award' },
  { name: 'Outside the Box Thinker' },
]
