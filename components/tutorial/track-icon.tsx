import {
  Boxes,
  Gauge,
  Layers,
  LayoutDashboard,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  Gauge,
  Layers,
  LayoutDashboard,
  SlidersHorizontal,
}

export function TrackIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Boxes
  return <Icon aria-hidden className={className} />
}
