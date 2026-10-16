/* Brand logos: official devicon "original" SVGs in /public/logos (MIT, see LICENSE-devicon.txt).
   Concept skills get custom thin line icons in one consistent style. */

export const BRAND: Record<string, { src: string; tint: string }> = {
  java: { src: "/logos/java.svg", tint: "#0074BD" },
  kotlin: { src: "/logos/kotlin.svg", tint: "#7F52FF" },
  cplusplus: { src: "/logos/cplusplus.svg", tint: "#00599C" },
  xml: { src: "/logos/xml.svg", tint: "#E34F26" },
  qt: { src: "/logos/qt.svg", tint: "#41CD52" },
  android: { src: "/logos/android.svg", tint: "#3DDC84" },
  jetpackcompose: { src: "/logos/jetpackcompose.svg", tint: "#4285F4" },
  gradle: { src: "/logos/gradle.svg", tint: "#02303A" },
  git: { src: "/logos/git.svg", tint: "#F05032" },
  jira: { src: "/logos/jira.svg", tint: "#0052CC" },
  confluence: { src: "/logos/confluence.svg", tint: "#172B4D" },
};

const P = {
  window: "M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01",
  layers: "M12 3 3 8l9 5 9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8",
  wave: "M2 12h3l2-6 3 12 3-9 2 3h7",
  check: "M4 12.5 9.5 18 20 6.5",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  palette: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2.2 1.5-2.2H17a4 4 0 0 0 4-4C21 7 17 3 12 3zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
  chip: "M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4",
  bridge: "M2 17h20M4 17V9M20 17V9M4 9c4 6 12 6 16 0M12 15v2",
  power: "M12 3v8M6.3 6.8a8 8 0 1 0 11.4 0",
  shield: "M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6zM8.5 12l2.5 2.5L16 9.5",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l4-6M7 17h.01M12 9h.01M17 17h.01",
  network: "M10 3h4v4h-4zM12 7v4M5 11h14M5 11v4M19 11v4M3 15h4v4H3zM17 15h4v4h-4zM10 15h4v4h-4zM12 11v4",
  packet: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
  signal: "M4 20v-4M9 20v-8M14 20V8M19 20V4",
  terminal: "M3 5h18v14H3zM7 10l3 2.5L7 15M12 15h5",
  bug: "M9 8a3 3 0 0 1 6 0M8 8h8v7a4 4 0 0 1-8 0zM3 11h5M16 11h5M4 18l4-2M20 18l-4-2M5 5l3 2M19 5l-3 2",
  loop: "M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5",
  branch: "M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9c0 5-12 3-12 6",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  award: "M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8.5 14 7 21l5-3 5 3-1.5-7",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
};

export const CONCEPT = P as Record<string, string>;
export const isBrand = (icon?: string): icon is keyof typeof BRAND => !!icon && icon in BRAND;

export default function TechLogo({ icon, size = 28, label, glow = false }: { icon?: string; size?: number; label?: string; glow?: boolean }) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  if (isBrand(icon)) {
    const b = BRAND[icon];
    return (
      <span
        className="tl"
        style={{ display: "inline-block", width: size, height: size, ...(glow ? { filter: `drop-shadow(0 0 ${size * 0.28}px ${b.tint}33)` } : null) }}
        {...a11y}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.src} alt="" width={size} height={size} decoding="async" draggable={false} style={{ display: "block", width: "100%", height: "100%" }} />
      </span>
    );
  }
  const d = (icon && CONCEPT[icon]) || CONCEPT.chip;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" {...a11y}>
      <path d={d} />
    </svg>
  );
}
