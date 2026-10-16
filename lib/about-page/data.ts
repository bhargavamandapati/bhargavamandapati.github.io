/* Single source of truth. Every string here comes from the résumé (public/Bhargava_Mandapati_Resume.pdf). */

export const PROFILE = {
  name: "Bhargava Mandapati",
  first: "Bhargava",
  initials: "BM",
  role: "Senior Software Engineer",
  headline: "Android Application Stack, Framework & Core Architecture",
  email: "bhargavamandapati@gmail.com",
  phone: "+91 7013154322",
  phoneHref: "tel:+917013154322",
  location: "Hyderabad, India",
  resumeSummary:
    "Accomplished Senior Software Engineer & Technical Lead with over 10 years of experience architecting, developing, and deploying full-lifecycle Android applications and systems software. Highly skilled across the full Android application stack, combining deep mastery of core app architecture (Activity, Fragment, Service, BroadcastReceiver, MVVM, Clean Code, Jetpack, Jetpack Compose) with low-level systems proficiency in AOSP internals, HAL/VHAL, and JNI. Proven track record delivering responsive, high-performance UIs, custom dynamic widgets, and complex multi-module applications integrated with robust backend protocols via TCP/IP and Protocol Buffers. Adept at driving end-to-end software quality through rigorous Espresso UI automation, instrumentation testing, and system-level performance tuning across CPU, GPU, and input responsiveness.",
  extraLine:
    "Led a 15-member cross-functional engineering team delivering full-stack Android applications, middleware, and automotive infotainment features for production platforms (General Motors / Cadillac).",
  quote: "Deep mastery of core app architecture, with low-level systems proficiency underneath.",
  github: null as string | null,
  linkedin: "https://www.linkedin.com/in/bhargavamandapati",
  resume: "/Bhargava_Mandapati_Resume.pdf",
  careerStart: 2016,
  current: { title: "System Developer Associate Manager (Team Lead)", org: "Accenture", place: "Bengaluru, India" },
  photo: "/portrait-bust.webp",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export type Skill = { name: string; sym: string; icon?: string };
export type SkillGroup = { family: string; skills: Skill[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      { name: "Java", sym: "Jv", icon: "java" },
      { name: "Kotlin", sym: "Kt", icon: "kotlin" },
      { name: "C / C++", sym: "C+", icon: "cplusplus" },
      { name: "XML", sym: "Xm", icon: "xml" },
      { name: "Qt", sym: "Qt", icon: "qt" },
    ],
  },
  {
    family: "Android",
    skills: [
      { name: "Android Stack", sym: "An", icon: "android" },
      { name: "Activity", sym: "Ac", icon: "window" },
      { name: "Fragment", sym: "Fg", icon: "layers" },
      { name: "Service", sym: "Sv", icon: "gear" },
      { name: "BroadcastReceiver", sym: "Br", icon: "wave" },
      { name: "Jetpack Compose", sym: "Jc", icon: "jetpackcompose" },
      { name: "Android Jetpack", sym: "Aj", icon: "android" },
      { name: "MVVM", sym: "Mv", icon: "layers" },
      { name: "Clean Code", sym: "Cc", icon: "check" },
      { name: "Custom Views", sym: "Cv", icon: "window" },
      { name: "Dynamic UI", sym: "Du", icon: "grid" },
      { name: "RRO", sym: "Rr", icon: "layers" },
      { name: "UI Theming", sym: "Th", icon: "palette" },
    ],
  },
  {
    family: "Framework",
    skills: [
      { name: "AOSP Internals", sym: "Ao", icon: "chip" },
      { name: "Framework Services", sym: "Fs", icon: "gear" },
      { name: "JNI", sym: "Jn", icon: "bridge" },
      { name: "HAL / VHAL", sym: "Hv", icon: "chip" },
      { name: "System Bring-Up", sym: "Sb", icon: "power" },
      { name: "SEPolicy", sym: "Se", icon: "shield" },
      { name: "IPC / AIDL", sym: "Ip", icon: "bridge" },
      { name: "CarPropertyManager", sym: "Cp", icon: "gauge" },
      { name: "CAN Manager", sym: "Cn", icon: "network" },
      { name: "AAOS", sym: "Aa", icon: "chip" },
    ],
  },
  {
    family: "Networking",
    skills: [
      { name: "TCP/IP Sockets", sym: "Tc", icon: "network" },
      { name: "Protobuf", sym: "Pb", icon: "packet" },
      { name: "VSS", sym: "Vs", icon: "signal" },
      { name: "Franca IDL", sym: "Fr", icon: "packet" },
      { name: "SOME/IP", sym: "So", icon: "network" },
      { name: "Client-Server / FSA", sym: "Cs", icon: "network" },
      { name: "Eclipse Kuksa", sym: "Ku", icon: "signal" },
    ],
  },
  {
    family: "Performance",
    skills: [
      { name: "Benchmarking", sym: "Bm", icon: "gauge" },
      { name: "Latency Tuning", sym: "Lt", icon: "gauge" },
      { name: "Dumpsys", sym: "Dm", icon: "terminal" },
      { name: "Traceview", sym: "Tv", icon: "wave" },
      { name: "Android Profiler", sym: "Ap", icon: "wave" },
      { name: "Logcat", sym: "Lc", icon: "terminal" },
      { name: "Bug Triaging", sym: "Bt", icon: "bug" },
    ],
  },
  {
    family: "Build & Test",
    skills: [
      { name: "Gradle", sym: "Gr", icon: "gradle" },
      { name: "App Bundles (AAB)", sym: "Ab", icon: "packet" },
      { name: "Espresso", sym: "Es", icon: "check" },
      { name: "Instrumentation Tests", sym: "It", icon: "check" },
      { name: "Unit Testing", sym: "Ut", icon: "check" },
      { name: "CI/CD", sym: "Ci", icon: "loop" },
    ],
  },
  {
    family: "Process",
    skills: [
      { name: "Git", sym: "Gt", icon: "git" },
      { name: "Perforce", sym: "Pf", icon: "branch" },
      { name: "Jira", sym: "Ji", icon: "jira" },
      { name: "Confluence", sym: "Cf", icon: "confluence" },
      { name: "Agile / Scrum", sym: "Ag", icon: "loop" },
      { name: "SAFe 5", sym: "Sf", icon: "layers" },
      { name: "Architecture Reviews", sym: "Ar", icon: "eye" },
    ],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  period: string;
  description: string;
  features: string[];
  tech: string[];
  github: string | null;
  ui: "signals" | "cluster" | "boot";
};

export const PROJECTS: Project[] = [
  {
    id: "sdv-android",
    index: "01",
    title: "SDV Android",
    kicker: "Software-Defined Vehicle Framework",
    period: "03/2025 – 03/2026",
    description:
      "Engineered custom HALs, system services, and Car Services bridging Vehicle Signal Specification (VSS) standards with the Android middleware stack. Built a cross-platform C++/Qt simulation tool with dynamic UI generation to accelerate signal validation.",
    features: [
      "Custom HALs and system services",
      "Car Services bridging VSS",
      "C++/Qt simulation tool",
      "Dynamic UI generation",
      "SOME/IP and Franca IDL",
      "Eclipse Kuksa Data Broker on hypervisor-based AAOS",
    ],
    tech: ["Qt", "C / C++", "VSS", "SOME/IP", "Franca IDL", "Eclipse Kuksa"],
    github: null,
    ui: "signals",
  },
  {
    id: "cluster-service-rhmi",
    index: "02",
    title: "ClusterService RHMI",
    kicker: "High-Speed TCP/IP & Protobuf Pipeline",
    period: "07/2024 – 04/2025",
    description:
      "Delivered an Android system service transmitting real-time UI/data packets (Audio, Phone, Navigation cards) from Center Stack to Instrument Cluster using Protocol Buffers over TCP/IP sockets under Fast Software Architecture (FSA).",
    features: [
      "Android system service",
      "Audio, Phone, Navigation cards",
      "Center Stack → Instrument Cluster",
      "Protocol Buffers over TCP/IP",
      "Fast Software Architecture (FSA)",
      "Led a 10-member team of developers and QA",
    ],
    tech: ["Protobuf", "TCP/IP Sockets", "Client-Server / FSA", "Android Stack"],
    github: null,
    ui: "cluster",
  },
  {
    id: "project-guava",
    index: "03",
    title: "Project Guava",
    kicker: "AOSP Bring-Up on Proprietary Hardware",
    period: "11/2019 – 02/2021",
    description:
      "Customized the end-to-end AOSP source tree (HALs, SEPolicy permissions, framework layers) to enable full platform functionality on proprietary automotive computing boards.",
    features: [
      "End-to-end AOSP source tree",
      "Custom HALs",
      "SEPolicy permissions",
      "Framework layers",
      "Proprietary automotive boards",
      "Full platform functionality",
    ],
    tech: ["AOSP Internals", "HAL / VHAL", "SEPolicy", "Framework Services"],
    github: null,
    ui: "boot",
  },
];

export const CERTIFICATIONS = [
  { title: "Certified SAFe® 5 Practitioner", issuer: "Scaled Agile, Inc." },
  { title: "The Complete Guide to Becoming a Software Architect", issuer: "Udemy" },
  { title: "AUTOSAR Architecture (Learn from Scratch with Demo)", issuer: "Udemy" },
];

export type Stop = { year: string; title: string; place: string; detail: string; kind: "education" | "work" };

export const EDUCATION: Stop[] = [
  {
    year: "2010 – 2014",
    title: "B.Tech. in Electronics & Communications Engineering",
    place: "Jawaharlal Nehru Technological University, Kakinada",
    detail: "Bachelor of Technology (08/2010 – 04/2014).",
    kind: "education",
  },
];

export const EXPERIENCE: Stop[] = [
  {
    year: "2016 – 2018",
    title: "Junior Software Engineer",
    place: "People Tech Group Inc · Hyderabad, India",
    detail:
      "Built production-grade Android infotainment applications (Home, Audio, Climate, Navigation, Trailer, Favorites, Phone, Settings). Co-developed the Multi-Functional Control (MFC) library and custom Skew and Blur graphics libraries. Delivered prototypes that validated Android adoption for General Motors production programs (Info 3.x / 4.0).",
    kind: "work",
  },
  {
    year: "2018 – 2021",
    title: "Software Engineer",
    place: "People Tech Group Inc · Hyderabad, India",
    detail:
      "Contributed to native Android OS bring-up on proprietary automotive boards (CSM), developing custom HALs and authoring SEPolicy security contexts. Integrated cluster displays, HUD, camera and rear-view camera (RVC) modules into the central infotainment stack.",
    kind: "work",
  },
  {
    year: "2021 – 2022",
    title: "Senior Software Engineer",
    place: "People Tech Group Inc · Hyderabad, India",
    detail:
      "Spearheaded migration of legacy RTOS C/C++ control systems into native Android components. Designed a dynamic UI architecture generating cards and widgets on-the-fly from real-time signal streams (MVVM, RRO). Authored Espresso UI automation and instrumentation suites, plus a dedicated Validator app.",
    kind: "work",
  },
  {
    year: "2022 – 2026",
    title: "Team Lead",
    place: "People Tech Group Inc · Hyderabad, India",
    detail:
      "Led a 15-member cross-functional team on General Motors / Cadillac platforms. Architected low-latency cluster-to-center-stack synchronization over TCP/IP and Protobuf, custom VHALs and system services, and C++/Qt simulation tools. Travelled to Shanghai to work directly with OEM client stakeholders.",
    kind: "work",
  },
  {
    year: "2026 – Present",
    title: "System Developer Associate Manager (Team Lead)",
    place: "Accenture · Bengaluru, India",
    detail:
      "Lead cross-functional engineering teams in the architecture, implementation, and maintenance of modern Android mobile and automotive software applications, establishing high code quality and architecture standards.",
    kind: "work",
  },
];

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  value: number | null;
  suffix?: string;
  icon: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { label: "Years of experience", caption: "Android applications & systems software", detail: "Full-lifecycle architecture, development and deployment", value: 10, suffix: "+", icon: "loop" },
  { label: "Engineers led", caption: "Team Lead · People Tech Group Inc", detail: "Cross-functional team on General Motors / Cadillac platforms", value: 15, icon: "network" },
  { label: "Developers & QA led", caption: "ClusterService RHMI", detail: "Seamless performance across multi-variant resolutions", value: 10, icon: "packet" },
  { label: "Service Anniversary Award", caption: "Honours & Awards", detail: "Listed under Honors & Awards", value: null, icon: "award" },
  { label: "Unmatched Dedication Award", caption: "Honours & Awards", detail: "Listed under Honors & Awards", value: null, icon: "award" },
  { label: "Outside the Box Thinker", caption: "Honours & Awards", detail: "Listed under Honors & Awards", value: null, icon: "bulb" },
];

const ALL = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family })));
export const skillByName = (name: string) => ALL.find((s) => s.name === name);
