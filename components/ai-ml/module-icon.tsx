import {
  Boxes,
  Calculator,
  ClipboardCheck,
  Compass,
  Dices,
  Eye,
  FlaskConical,
  Gamepad2,
  Languages,
  Layers,
  Rocket,
  Scale,
  Sigma,
  Sparkles,
  Telescope,
  Terminal,
  TrendingDown,
  Wand2,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  Calculator,
  ClipboardCheck,
  Compass,
  Dices,
  Eye,
  FlaskConical,
  Gamepad2,
  Languages,
  Layers,
  Rocket,
  Scale,
  Sigma,
  Sparkles,
  Telescope,
  Terminal,
  TrendingDown,
  Wand2,
  Workflow,
  Wrench,
}

export function AiMlModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Compass
  return <Icon aria-hidden className={className} />
}
