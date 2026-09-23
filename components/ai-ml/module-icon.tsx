import { Compass, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Compass,
}

export function AiMlModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Compass
  return <Icon aria-hidden className={className} />
}
