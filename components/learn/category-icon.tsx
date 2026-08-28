import {
  Activity,
  AppWindow,
  ClipboardCheck,
  Compass,
  Gauge,
  Layers,
  LayoutDashboard,
  Monitor,
  Network,
  Package,
  Radio,
  Power,
  ShieldCheck,
  TerminalSquare,
  Volume2,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Activity,
  AppWindow,
  ClipboardCheck,
  Compass,
  Gauge,
  Layers,
  LayoutDashboard,
  Monitor,
  Network,
  Package,
  Radio,
  Power,
  ShieldCheck,
  TerminalSquare,
  Volume2,
}

/** Resolves the icon name stored in data/curriculum.ts to a component. */
export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Compass
  return <Icon aria-hidden className={className} />
}
