import {
  Cloud,
  Compass,
  Gauge,
  GitBranch,
  Layers,
  MonitorSmartphone,
  Network,
  Radio,
  Route,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Cloud,
  Compass,
  Gauge,
  GitBranch,
  Layers,
  MonitorSmartphone,
  Network,
  Radio,
  Route,
  ShieldCheck,
}

export function SdvModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Compass
  return <Icon aria-hidden className={className} />
}
