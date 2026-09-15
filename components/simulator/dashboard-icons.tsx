import {
  Gauge,
  Lightbulb,
  Thermometer,
  Car,
  BatteryCharging,
  Disc,
  Cloud,
  ShieldAlert,
  Users,
  Cog,
  Footprints,
  Monitor,
  DoorOpen,
  Lock,
  Snowflake,
  Fuel,
  Droplet,
  ParkingCircle,
  Plug,
  Leaf,
  Wind,
  KeyRound,
  AlertTriangle,
  Info,
  Truck,
  type LucideIcon,
} from 'lucide-react'

type IconProps = React.SVGProps<SVGSVGElement>
type IconComp = LucideIcon | ((props: IconProps) => React.JSX.Element)

/** The lap-belt-and-buckle glyph every real cluster uses — lucide has no equivalent. */
function SeatbeltIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <rect x="4.5" y="2.5" width="9" height="14" rx="2" />
      <path d="M4.5 4.5 13 15" />
      <rect x="7.6" y="8.4" width="3" height="3" rx=".6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** A target/gauge glyph for adaptive cruise — distinct from the generic speedometer used for the group header. */
function CruiseIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <circle cx="10" cy="10" r="7.2" />
      <circle cx="10" cy="10" r="2.4" fill="currentColor" stroke="none" />
      <path d="M10 2.6v2.3M10 15.1v2.3" />
    </svg>
  )
}

/** Two converging lane lines — lane keep assist. */
function LaneKeepIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      {...rest}
    >
      <path d="M4 17 8.5 3" />
      <path d="M16 17 11.5 3" />
    </svg>
  )
}

/** A headlamp with beams — lucide's Lightbulb reads as an interior light, not a headlamp. */
function HeadlightIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <rect x="2.5" y="6.5" width="7" height="6" rx="1.6" />
      <path d="M10.5 8l6-2M10.5 10l6.5 0M10.5 12l6-2" />
    </svg>
  )
}

/** One icon per control-group name — shown next to the group heading and its quick-jump chip. */
export const GROUP_ICONS: Record<string, IconComp> = {
  'Motion & powertrain': Gauge,
  Lights: Lightbulb,
  Climate: Thermometer,
  Body: Car,
  Electric: BatteryCharging,
  Tyres: Disc,
  Environment: Cloud,
  'Driver assistance': ShieldAlert,
  Occupants: Users,
  'Engine & chassis': Cog,
  'Pedals & column': Footprints,
  'Units & display': Monitor,
}

const TELLTALE_ICON_BY_LABEL: Record<string, IconComp> = {
  'IGNITION OFF': KeyRound,
  'PARKING BRAKE': ParkingCircle,
  P: ParkingCircle,
  'BOOT OPEN': DoorOpen,
  CHARGING: Plug,
  CHG: Plug,
  CRUISE: CruiseIcon,
  CC: CruiseIcon,
  'CC •': CruiseIcon,
  'LANE KEEP': LaneKeepIcon,
  LKA: LaneKeepIcon,
  'LKA •': LaneKeepIcon,
  'A/C': Snowflake,
  'MAX A/C': Snowflake,
  BELT: SeatbeltIcon,
  'BELT-P': SeatbeltIcon,
  TEMP: Thermometer,
  'BATT TEMP': Thermometer,
  'OIL TEMP': Thermometer,
  OIL: Droplet,
  LOW: Fuel,
  'FUEL DOOR': Fuel,
  REGEN: Leaf,
  'AUTO-STOP': Leaf,
  LAMP: Lightbulb,
  FOG: Wind,
  TOW: Truck,
  'MIRRORS LOCKED': Lock,
  '≡': HeadlightIcon,
  '≡D': HeadlightIcon,
  LIGHTS: HeadlightIcon,
  'MAIN BEAM': HeadlightIcon,
}

/**
 * Maps a telltale's own label text to an icon. Around a dozen concepts get a
 * bespoke glyph; the rest of the cluster's ~40 possible telltales (FCW, ABS,
 * IMPACT and the like) fall back to a shared "needs attention" or "FYI"
 * glyph, chosen from the same colour the canvas cluster already draws that
 * telltale in — still an icon, not text, just not one worth hand-drawing
 * forty of. The property name always stays alongside as the accessible
 * label, so nothing here is lost to a screen reader.
 */
export function telltaleIcon(label: string, colorHex: string): IconComp {
  const exact = TELLTALE_ICON_BY_LABEL[label]
  if (exact) return exact
  if (label.startsWith('TYRE PRESSURE') || label === '(!)') return Disc
  if (label.startsWith('DOOR') || label.endsWith('DOOR OPEN')) return DoorOpen
  if (/^L\d$/.test(label)) return Info
  const urgent = colorHex === '#f87171' || colorHex === '#fbbf24'
  return urgent ? AlertTriangle : Info
}

export { SeatbeltIcon, CruiseIcon, LaneKeepIcon, HeadlightIcon }
