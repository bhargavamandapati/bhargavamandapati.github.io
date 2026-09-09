import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

/**
 * Static vehicle identity.
 *
 * These properties have no visible consequence — a simulator cannot show you a
 * VIN — so they belong beside the 3D view rather than in it. Values are a
 * plausible fictional vehicle; the point is the shape and the units.
 */
const INFO: { property: string; label: string; value: string; note?: string }[] = [
  { property: 'INFO_VIN', label: 'VIN', value: '1HGCM82633A004352', note: '17 characters' },
  { property: 'INFO_MAKE', label: 'Make', value: 'Northwind' },
  { property: 'INFO_MODEL', label: 'Model', value: 'Meridian EV' },
  { property: 'INFO_MODEL_YEAR', label: 'Model year', value: '2026' },
  { property: 'INFO_EV_BATTERY_CAPACITY', label: 'Battery capacity', value: '58000 Wh', note: '58 kWh' },
  { property: 'INFO_EV_CONNECTOR_TYPE', label: 'Connector', value: 'IEC_TYPE_2_AC, IEC_TYPE_4_AC' },
  { property: 'INFO_EV_PORT_LOCATION', label: 'Charge port', value: 'REAR_LEFT' },
  { property: 'INFO_FUEL_TYPE', label: 'Fuel type', value: 'ELECTRIC' },
  { property: 'INFO_DRIVER_SEAT', label: 'Driver seat', value: 'ROW_1_LEFT' },
  { property: 'INFO_EXTERIOR_DIMENSIONS', label: 'Dimensions', value: '4694 × 1849 × 1443 mm' },
]

const slug = (p: string) => p.toLowerCase().replace(/_/g, '-')

export function VehicleInfo() {
  return (
    // Collapsed by default: none of this is a control you came here to set,
    // and at ten rows it used to be the first thing between you and one that
    // is.
    <details className="group card overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="font-mono text-xs uppercase tracking-wider text-subtle">This vehicle</span>
          <span className="mt-1 block text-sm leading-relaxed text-muted">
            Static properties, read once and cached — {INFO.length} of them.
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-subtle transition-transform group-open:rotate-180"
        />
      </summary>
      <dl className="space-y-2.5 px-5 pb-5">
        {INFO.map((row) => (
          <div key={row.property} className="border-b border-line pb-2.5 last:border-b-0 last:pb-0">
            <dt>
              <Link
                href={`/learn/vehicle-properties/${slug(row.property)}/`}
                className="font-mono text-[0.68rem] text-muted transition-colors hover:text-accent [overflow-wrap:anywhere]"
              >
                {row.property}
              </Link>
            </dt>
            <dd className="mt-0.5 text-sm text-fg [overflow-wrap:anywhere]">
              {row.value}
              {row.note && <span className="ml-2 text-xs text-subtle">{row.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  )
}
