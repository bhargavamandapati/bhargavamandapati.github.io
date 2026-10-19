import {
  Boxes,
  Bug,
  Gauge,
  Layers,
  LayoutDashboard,
  Monitor,
  MonitorSmartphone,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  Bug,
  Gauge,
  Layers,
  LayoutDashboard,
  Monitor,
  MonitorSmartphone,
  SlidersHorizontal,
  Users,
}

export function TrackIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Boxes
  return <Icon aria-hidden className={className} />
}
