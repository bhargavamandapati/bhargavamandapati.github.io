import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Search } from 'lucide-react'
import { DiagramFrame } from '@/components/diagrams/primitives'
import { PropertyRelationMap } from '@/components/diagrams/property-relations'
import {
  aidlUrl,
  categoryOf,
  codeSearchUrl,
  dataEnumUrl,
  decomposeId,
  javaUrl,
  propertyBySlug,
  propertySlug,
  relationGroups,
  summarise,
  diagramRelations,
  vehicleProperties,
  type VehicleProperty,
} from '@/lib/vehicle-properties'
import { site } from '@/data/site'

type Params = { name: string }

export function generateStaticParams(): Params[] {
  return vehicleProperties.map((p) => ({ name: propertySlug(p) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { name } = await params
  const property = propertyBySlug(name)
  if (!property) return {}
  const description = `${summarise(property)} — ID ${property.hex}, ${property.area} area, ${property.type}, ${property.access} access, ${property.changeMode}.`
  return {
    title: `${property.name} — vehicle property`,
    description,
    alternates: { canonical: `/learn/vehicle-properties/${propertySlug(property)}/` },
    openGraph: {
      type: 'article',
      title: `${property.name} · ${site.name}`,
      description,
      url: `${site.url}/learn/vehicle-properties/${propertySlug(property)}/`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: property.name }],
    },
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-3 last:border-b-0 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="font-mono text-xs uppercase tracking-wider text-subtle">{label}</dt>
      <dd className="mt-1 min-w-0 text-sm text-fg sm:mt-0">{children}</dd>
    </div>
  )
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 font-mono text-xs transition-colors hover:border-accent/50 hover:text-accent"
    >
      {children}
      <ExternalLink aria-hidden className="size-3.5 shrink-0" />
    </a>
  )
}

/** The AIDL prose is plain text with blank-line paragraph breaks. */
function Description({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim())
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        const isList = lines.every((l) => /^\s*[-*]\s/.test(l) || /^\s{2,}/.test(l))
        if (isList) {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg border border-line bg-surface p-3 font-mono text-[0.8rem] leading-relaxed text-muted"
            >
              {block.replace(/\n\s*$/, '')}
            </pre>
          )
        }
        return (
          <p
            key={i}
            className="text-[0.95rem] leading-relaxed text-muted [overflow-wrap:anywhere]"
          >
            {block.replace(/\s*\n\s*/g, ' ')}
          </p>
        )
      })}
    </div>
  )
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { name } = await params
  const property = propertyBySlug(name)
  if (!property) notFound()

  const index = vehicleProperties.findIndex((p) => p.name === property.name)
  const previous = vehicleProperties[index - 1]
  const next = vehicleProperties[index + 1]
  const java = javaUrl(property)
  const enumUrl = dataEnumUrl(property)
  const groups = relationGroups(property)
  const dependencies = groups.filter((g) => g.strength === 'dependency')

  // Split the diagram by direction: what this needs, versus what needs this.
  const NEEDS: string[] = ['requires', 'toggled-by', 'display-units', 'commanded-by']
  const nodes = diagramRelations(property)
  const mapNodes = {
    incoming: nodes.filter((n) => NEEDS.includes(n.kind)).slice(0, 3),
    outgoing: nodes.filter((n) => !NEEDS.includes(n.kind)).slice(0, 3),
  }

  return (
    <div className="container-page py-10 md:py-14">
      <Link
        href="/learn/vehicle-properties/"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Vehicle properties
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="chip">{categoryOf(property)}</span>
        {property.deprecated && (
          <span className="chip border-difficulty-advanced/40 text-difficulty-advanced">
            deprecated
          </span>
        )}
        {property.javaLine === undefined && (
          <span className="chip">not in the public Car API</span>
        )}
      </div>

      <h1 className="mt-3 font-mono text-2xl font-bold tracking-tight [overflow-wrap:anywhere] md:text-3xl">
        {property.name}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
            What it is
          </h2>
          <div className="mt-3">
            <Description text={property.description} />
          </div>

          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-subtle">
            How the ID is built
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A property ID is a 32-bit value packing four fields. Reading{' '}
            <code className="font-mono text-fg">{property.hex}</code> apart:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-xs uppercase tracking-wider text-subtle">
                  <th className="py-2 pr-4 font-medium">Field</th>
                  <th className="py-2 pr-4 font-medium">Mask</th>
                  <th className="py-2 pr-4 font-medium">Value</th>
                  <th className="py-2 font-medium">Means</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {decomposeId(property).map((part) => (
                  <tr key={part.label} className="border-b border-line last:border-b-0">
                    <td className="py-2 pr-4 text-muted">{part.label}</td>
                    <td className="py-2 pr-4 text-subtle">{part.mask}</td>
                    <td className="py-2 pr-4 text-fg">{part.value}</td>
                    <td className="py-2 text-accent">{part.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {groups.length > 0 && (
            <>
              <h2
                id="related"
                className="mt-10 scroll-mt-24 text-sm font-semibold uppercase tracking-wider text-subtle"
              >
                Related properties
              </h2>
              {dependencies.length > 0 ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  This property does not stand alone. The relationships marked{' '}
                  <strong className="font-medium text-fg">dependency</strong> change what you have
                  to do — ignore one and reads or writes will appear to work and quietly have no
                  effect.
                </p>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Properties that pair with this one, or that name it in their documentation.
                </p>
              )}

              {mapNodes.incoming.length + mapNodes.outgoing.length > 0 && (
                <DiagramFrame
                  title={`How ${property.name} relates to other properties`}
                  caption="An arrow points from a property to the one it needs. Anything above the centre must be right before this property behaves; anything below depends on this one."
                >
                  <PropertyRelationMap
                    name={property.name}
                    incoming={mapNodes.incoming}
                    outgoing={mapNodes.outgoing}
                  />
                </DiagramFrame>
              )}

              <div className="mt-6 space-y-6">
                {groups.map((group) => (
                  <section key={group.kind}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-sm font-semibold text-fg">{group.label}</h3>
                      <span
                        className={cn(
                          'chip',
                          group.strength === 'dependency' &&
                            'border-difficulty-advanced/40 text-difficulty-advanced',
                        )}
                      >
                        {group.strength}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{group.blurb}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.properties.map((other) => (
                        <li key={other.name}>
                          <Link
                            href={`/learn/vehicle-properties/${propertySlug(other)}/`}
                            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 font-mono text-xs transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            {other.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-subtle">
            Reading it from an app
          </h2>
          {property.javaLine === undefined ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This property is defined in the HAL but is not exposed as a constant in{' '}
              <code className="font-mono text-fg">android.car.VehiclePropertyIds</code>, so it is
              not reachable through <code className="font-mono text-fg">CarPropertyManager</code>{' '}
              from an ordinary app. It is used by the platform, or by vendor code running with
              system privileges.
            </p>
          ) : (
            <>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface p-4 font-mono text-[0.8rem] leading-relaxed">
                <code>{codeSample(property)}</code>
              </pre>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {property.access === 'READ'
                  ? 'This property is read-only — writes are rejected.'
                  : property.access === 'WRITE'
                    ? 'This property is write-only — it cannot be read back.'
                    : 'This property can be read and written, though an OEM may implement it as read-only.'}{' '}
                {property.changeMode === 'CONTINUOUS'
                  ? 'It changes continuously, so subscribe at a sample rate rather than polling.'
                  : property.changeMode === 'STATIC'
                    ? 'It is static for the life of the vehicle, so read it once and cache it.'
                    : 'It fires a callback whenever the value changes.'}
              </p>
            </>
          )}
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">At a glance</h2>
            <dl className="mt-2">
              <Field label="ID (hex)">
                <code className="font-mono">{property.hex}</code>
              </Field>
              <Field label="ID (decimal)">
                <code className="font-mono">{property.id}</code>
              </Field>
              {property.javaId !== undefined && (
                <Field label="car-lib ID">
                  <code className="font-mono">{property.javaId}</code>
                  <p className="mt-1 text-xs text-subtle">
                    Upstream car-lib declares a different value from the AIDL for this property.
                  </p>
                </Field>
              )}
              <Field label="Group">{property.group}</Field>
              <Field label="Area type">{property.area}</Field>
              <Field label="Value type">{property.type}</Field>
              <Field label="Access">
                {property.accessModes.length > 1
                  ? `${property.access} (or ${property.accessModes.slice(1).join(', ')})`
                  : property.access}
              </Field>
              <Field label="Change mode">{property.changeMode}</Field>
              {property.unit && <Field label="Unit">{property.unit}</Field>}
              {property.dataEnum && (
                <Field label="Value enum">
                  {enumUrl ? (
                    <a
                      href={enumUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline font-mono text-accent [overflow-wrap:anywhere]"
                    >
                      {property.dataEnum}
                    </a>
                  ) : (
                    <code className="font-mono [overflow-wrap:anywhere]">{property.dataEnum}</code>
                  )}
                </Field>
              )}
              {property.version !== undefined && (
                <Field label="Since HAL version">{property.version}</Field>
              )}
              {property.readPermissions && property.readPermissions.length > 0 && (
                <Field label="Read permission">
                  <ul className="space-y-1">
                    {property.readPermissions.map((p) => (
                      <li key={p} className="break-all font-mono text-xs">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}
              {property.writePermissions && property.writePermissions.length > 0 && (
                <Field label="Write permission">
                  <ul className="space-y-1">
                    {property.writePermissions.map((p) => (
                      <li key={p} className="break-all font-mono text-xs">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}
            </dl>
          </div>

          <div className="card mt-4 p-5">
            <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-subtle">
              <Code2 aria-hidden className="size-3.5" />
              Source
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              <SourceLink href={aidlUrl(property)}>VehicleProperty.aidl</SourceLink>
              {java && <SourceLink href={java}>VehiclePropertyIds.java</SourceLink>}
              <a
                href={codeSearchUrl(property)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 font-mono text-xs transition-colors hover:border-accent/50 hover:text-accent"
              >
                <Search aria-hidden className="size-3.5 shrink-0" />
                All uses in AOSP
              </a>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-subtle">
              The first two links are anchored to a line number, which drifts as AOSP changes. The
              search link always finds the current definition.
            </p>
          </div>
        </aside>
      </div>

      <nav className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        {previous ? (
          <Link
            href={`/learn/vehicle-properties/${propertySlug(previous)}/`}
            className="group inline-flex min-w-0 items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft aria-hidden className="size-4 shrink-0" />
            <span className="truncate font-mono text-xs">{previous.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/learn/vehicle-properties/${propertySlug(next)}/`}
            className="group inline-flex min-w-0 items-center gap-2 text-sm text-muted transition-colors hover:text-accent sm:justify-end"
          >
            <span className="truncate font-mono text-xs">{next.name}</span>
            <ArrowRight aria-hidden className="size-4 shrink-0" />
          </Link>
        )}
      </nav>
    </div>
  )
}

/** A minimal, correct CarPropertyManager snippet for this property's shape. */
function codeSample(property: VehicleProperty): string {
  const java = `VehiclePropertyIds.${property.name}`
  const areaArg = property.area === 'GLOBAL' ? '0' : `areaId`
  const getter =
    property.type === 'BOOLEAN'
      ? 'getBooleanProperty'
      : property.type === 'FLOAT'
        ? 'getFloatProperty'
        : property.type === 'INT32'
          ? 'getIntProperty'
          : 'getProperty'

  if (property.changeMode === 'CONTINUOUS') {
    return `CarPropertyManager mgr = (CarPropertyManager)
        car.getCarManager(Car.PROPERTY_SERVICE);

mgr.registerCallback(callback,
        ${java},
        CarPropertyManager.SENSOR_RATE_ONCHANGE);`
  }
  if (property.access === 'WRITE') {
    return `CarPropertyManager mgr = (CarPropertyManager)
        car.getCarManager(Car.PROPERTY_SERVICE);

mgr.setProperty(${valueClass(property)}.class,
        ${java}, ${areaArg}, value);`
  }
  return `CarPropertyManager mgr = (CarPropertyManager)
        car.getCarManager(Car.PROPERTY_SERVICE);

${resultType(property, getter)} value =
        mgr.${getter}(${java}, ${areaArg});`
}

function valueClass(property: VehicleProperty): string {
  switch (property.type) {
    case 'BOOLEAN':
      return 'Boolean'
    case 'FLOAT':
    case 'FLOAT_VEC':
      return 'Float'
    case 'INT32':
    case 'INT32_VEC':
      return 'Integer'
    case 'INT64':
    case 'INT64_VEC':
      return 'Long'
    case 'STRING':
      return 'String'
    default:
      return 'Object'
  }
}

function resultType(property: VehicleProperty, getter: string): string {
  if (getter === 'getBooleanProperty') return 'boolean'
  if (getter === 'getFloatProperty') return 'float'
  if (getter === 'getIntProperty') return 'int'
  return `CarPropertyValue<${valueClass(property)}>`
}
