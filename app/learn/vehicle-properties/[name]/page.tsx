import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  ExternalLink,
  Search,
} from "lucide-react";
import { DiagramFrame } from "@/components/diagrams/primitives";
import { PropertyRelationMap } from "@/components/diagrams/property-relations";
import {
  CodeSample,
  CodeLanguageProvider,
} from "@/components/properties/code-sample";
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
  enumsFor,
  isBitFlags,
  carPermissions,
  valueExample,
  valueRules,
  summarise,
  diagramRelations,
  vehicleProperties,
  type VehicleProperty,
} from "@/lib/vehicle-properties";
import { site } from "@/data/site";

type Params = { name: string };

export function generateStaticParams(): Params[] {
  return vehicleProperties.map((p) => ({ name: propertySlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { name } = await params;
  const property = propertyBySlug(name);
  if (!property) return {};
  const description = `${summarise(property)} — ID ${property.hex}, ${property.area} area, ${property.type}, ${property.access} access, ${property.changeMode}.`;
  return {
    title: `${property.name} — vehicle property`,
    description,
    alternates: {
      canonical: `/learn/vehicle-properties/${propertySlug(property)}/`,
    },
    openGraph: {
      type: "article",
      title: `${property.name} · ${site.name}`,
      description,
      url: `${site.url}/learn/vehicle-properties/${propertySlug(property)}/`,
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: property.name },
      ],
    },
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-3 last:border-b-0 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
        {label}
      </dt>
      <dd className="mt-1 min-w-0 text-sm text-fg sm:mt-0">{children}</dd>
    </div>
  );
}

function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
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
  );
}

/** The AIDL prose is plain text with blank-line paragraph breaks. */
function Description({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim());
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every(
          (l) => /^\s*[-*]\s/.test(l) || /^\s{2,}/.test(l),
        );
        if (isList) {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg border border-line bg-surface p-3 font-mono text-[0.8rem] leading-relaxed text-muted"
            >
              {block.replace(/\n\s*$/, "")}
            </pre>
          );
        }
        return (
          <p
            key={i}
            className="text-[0.95rem] leading-relaxed text-muted [overflow-wrap:anywhere]"
          >
            {block.replace(/\s*\n\s*/g, " ")}
          </p>
        );
      })}
    </div>
  );
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const property = propertyBySlug(name);
  if (!property) notFound();

  const index = vehicleProperties.findIndex((p) => p.name === property.name);
  const previous = vehicleProperties[index - 1];
  const next = vehicleProperties[index + 1];
  const java = javaUrl(property);
  const enumUrl = dataEnumUrl(property);
  const groups = relationGroups(property);
  const enums = enumsFor(property);
  const example = valueExample(property);
  const rules = valueRules(property);
  const samples = codeSamples(property);
  const perms = permissionSnippets(property);
  const dependencies = groups.filter((g) => g.strength === "dependency");

  // Split the diagram by direction: what this needs, versus what needs this.
  const NEEDS: string[] = [
    "requires",
    "toggled-by",
    "display-units",
    "commanded-by",
  ];
  const nodes = diagramRelations(property);
  const mapNodes = {
    incoming: nodes.filter((n) => NEEDS.includes(n.kind)).slice(0, 3),
    outgoing: nodes.filter((n) => !NEEDS.includes(n.kind)).slice(0, 3),
  };

  return (
    <CodeLanguageProvider>
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
              A property ID is a 32-bit value packing four fields. Reading{" "}
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
                    <tr
                      key={part.label}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="py-2 pr-4 text-muted">{part.label}</td>
                      <td className="py-2 pr-4 text-subtle">{part.mask}</td>
                      <td className="py-2 pr-4 text-fg">{part.value}</td>
                      <td className="py-2 text-accent">{part.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2
              id="values"
              className="mt-10 scroll-mt-24 text-sm font-semibold uppercase tracking-wider text-subtle"
            >
              What the value looks like
            </h2>

            {example && (
              <div className="card mt-3 p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <code className="font-mono text-base font-semibold text-accent [overflow-wrap:anywhere]">
                    {example.literal}
                  </code>
                  <span className="text-sm text-muted">{example.meaning}</span>
                </div>
                {example.note && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {example.note}
                  </p>
                )}
                <p className="mt-3 border-t border-line pt-3 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                  Illustrative — the shape and scale, not a reading from a
                  vehicle
                </p>
              </div>
            )}

            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
                  Type
                </dt>
                <dd className="mt-0.5 text-sm text-fg">
                  {property.type}
                  {property.type.endsWith("_VEC") &&
                    " — an array, not a single value"}
                  {property.type === "MIXED" && " — several types in one value"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
                  Reported per
                </dt>
                <dd className="mt-0.5 text-sm text-fg">
                  {property.area === "GLOBAL"
                    ? "the whole vehicle — one value"
                    : `${property.area.toLowerCase()} — one value per area, and they can differ`}
                </dd>
              </div>
              {property.unit && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
                    Always reported in
                  </dt>
                  <dd className="mt-0.5 text-sm text-fg">
                    {property.unit}
                    <span className="text-muted">
                      {" "}
                      — convert for display, never assume
                    </span>
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
                  Can be unavailable
                </dt>
                <dd className="mt-0.5 text-sm text-fg">
                  {enums.some((e) => e.name === "ErrorState")
                    ? "Yes — reported as an ErrorState value, not an exception"
                    : "Yes — handle a missing value rather than assuming one"}
                </dd>
              </div>
            </dl>

            {enums.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-semibold text-fg">
                  {enums.length > 1
                    ? "Values it can take"
                    : `Values from ${enums[0].name}`}
                </h3>
                {enums.some((e) => e.name === "ErrorState") && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    This property declares{" "}
                    <strong className="font-medium text-fg">two</strong> value
                    sets. A reading is either a real state, or an{" "}
                    <code className="font-mono text-[0.85em] text-fg">
                      ErrorState
                    </code>{" "}
                    explaining why there is no real state. Handle only the first
                    and an error code will be treated as a genuine reading.
                  </p>
                )}
                <div className="mt-4 space-y-6">
                  {enums.map((definition) => (
                    <section key={definition.name}>
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        {enums.length > 1 && (
                          <h4 className="font-mono text-sm font-semibold text-fg">
                            {definition.name}
                          </h4>
                        )}
                        {isBitFlags(definition) && (
                          <span className="chip">
                            bit flags — combine with OR
                          </span>
                        )}
                        {definition.name === "ErrorState" && (
                          <span className="chip border-difficulty-advanced/40 text-difficulty-advanced">
                            error values
                          </span>
                        )}
                      </div>
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[34rem] border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-line text-left font-mono text-xs uppercase tracking-wider text-subtle">
                              <th className="py-2 pr-4 font-medium">Value</th>
                              <th className="py-2 pr-4 font-medium">Name</th>
                              <th className="py-2 font-medium">Means</th>
                            </tr>
                          </thead>
                          <tbody>
                            {definition.members.map((member) => (
                              <tr
                                key={member.name}
                                className="border-b border-line last:border-b-0 align-top"
                              >
                                <td className="py-2 pr-4 font-mono text-xs text-subtle">
                                  {member.value}
                                </td>
                                <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs text-fg">
                                  {member.name}
                                </td>
                                <td className="py-2 text-[0.85rem] leading-relaxed text-muted">
                                  {member.description.split("\n\n")[0] || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}

            {rules.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-semibold text-fg">
                  Rules the value must follow
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Quoted from the AIDL, so the rule shown is the rule as
                  written.
                </p>
                <ul className="mt-3 space-y-2">
                  {rules.map((rule, i) => (
                    <li
                      key={i}
                      className="border-l-2 border-line pl-3 text-[0.9rem] leading-relaxed text-muted [overflow-wrap:anywhere]"
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </>
            )}

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
                    This property does not stand alone. The relationships marked{" "}
                    <strong className="font-medium text-fg">dependency</strong>{" "}
                    change what you have to do — ignore one and reads or writes
                    will appear to work and quietly have no effect.
                  </p>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Properties that pair with this one, or that name it in their
                    documentation.
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
                        <h3 className="text-sm font-semibold text-fg">
                          {group.label}
                        </h3>
                        <span
                          className={cn(
                            "chip",
                            group.strength === "dependency" &&
                              "border-difficulty-advanced/40 text-difficulty-advanced",
                          )}
                        >
                          {group.strength}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {group.blurb}
                      </p>
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

            <h2
              id="using-it"
              className="mt-10 scroll-mt-24 text-sm font-semibold uppercase tracking-wider text-subtle"
            >
              Using it from an app
            </h2>
            {property.javaLine === undefined ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                This property is defined in the HAL but is not exposed as a
                constant in{" "}
                <code className="font-mono text-fg">
                  android.car.VehiclePropertyIds
                </code>
                , so it is not reachable through{" "}
                <code className="font-mono text-fg">CarPropertyManager</code>{" "}
                from an ordinary app. It is used by the platform, or by vendor
                code running with system privileges.
              </p>
            ) : (
              <>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {property.access === "READ"
                    ? "This property is read-only — writes are rejected."
                    : property.access === "WRITE"
                      ? "This property is write-only — it cannot be read back."
                      : "This property can be read and written, though an OEM may implement it as read-only, so handle a rejected write."}{" "}
                  {property.changeMode === "CONTINUOUS"
                    ? "It changes continuously, so subscribe at a sample rate rather than polling."
                    : property.changeMode === "STATIC"
                      ? "It is static for the life of the vehicle, so read it once and cache it."
                      : "It fires a callback whenever the value changes."}
                  {property.area !== "GLOBAL" &&
                    ` Values are per ${property.area.toLowerCase()}, so every call takes an area ID.`}
                </p>
                {samples.map((snippet) => (
                  <CodeSample
                    key={snippet.title}
                    title={snippet.title}
                    code={snippet.code}
                    java={snippet.java}
                    kotlin={snippet.kotlin}
                    language={snippet.language}
                  />
                ))}
                {perms.entries.length > 0 && (
                  <>
                    <h3 className="mt-8 text-sm font-semibold text-fg">
                      Permissions
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Declaring a permission is not the same as being able to
                      use it. The protection level decides what your app must
                      actually do.
                    </p>
                    <ul className="mt-3 space-y-2">
                      {perms.entries.map((entry) => (
                        <li key={entry.constant} className="card p-3.5">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <code className="font-mono text-xs text-fg [overflow-wrap:anywhere]">
                              {entry.value}
                            </code>
                            <span
                              className={cn(
                                "chip",
                                entry.protection === "Signature|Privileged" &&
                                  "border-difficulty-advanced/40 text-difficulty-advanced",
                              )}
                            >
                              {entry.protection ?? "protection not stated"}
                            </span>
                            <span className="text-xs text-muted">
                              to {entry.direction}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted">
                            {entry.protection === "Dangerous"
                              ? "Declare it and request it at runtime — the user decides."
                              : entry.protection === "Normal"
                                ? "Granted on install. Declaring it in the manifest is enough."
                                : entry.protection === "Signature|Privileged"
                                  ? "An ordinary app cannot obtain this. The app must be signed by the platform or installed as a privileged app AND named in the privileged permission allowlist."
                                  : "Check the platform build — VehiclePropertyIds does not state a level for this one."}
                          </p>
                        </li>
                      ))}
                    </ul>
                    {perms.snippets.map((snippet) => (
                      <CodeSample
                        key={snippet.title}
                        title={snippet.title}
                        code={snippet.code}
                        java={snippet.java}
                        kotlin={snippet.kotlin}
                        language={snippet.language}
                      />
                    ))}
                  </>
                )}

                {dependencies.length > 0 && (
                  <p className="mt-4 rounded-lg border border-l-2 border-line border-l-difficulty-advanced/60 bg-surface p-4 text-sm leading-relaxed text-muted">
                    These snippets assume the property is usable. It has a{" "}
                    <Link
                      href="#related"
                      className="link-underline text-accent"
                    >
                      dependency
                    </Link>{" "}
                    that must be satisfied first — otherwise the calls above
                    succeed and do nothing.
                  </p>
                )}
              </>
            )}
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
                At a glance
              </h2>
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
                      Upstream car-lib declares a different value from the AIDL
                      for this property.
                    </p>
                  </Field>
                )}
                <Field label="Group">{property.group}</Field>
                <Field label="Area type">{property.area}</Field>
                <Field label="Value type">{property.type}</Field>
                <Field label="Access">
                  {property.accessModes.length > 1
                    ? `${property.access} (or ${property.accessModes.slice(1).join(", ")})`
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
                      <code className="font-mono [overflow-wrap:anywhere]">
                        {property.dataEnum}
                      </code>
                    )}
                  </Field>
                )}
                {property.version !== undefined && (
                  <Field label="Since HAL version">{property.version}</Field>
                )}
                {property.readPermissions &&
                  property.readPermissions.length > 0 && (
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
                {property.writePermissions &&
                  property.writePermissions.length > 0 && (
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
                <SourceLink href={aidlUrl(property)}>
                  VehicleProperty.aidl
                </SourceLink>
                {java && (
                  <SourceLink href={java}>VehiclePropertyIds.java</SourceLink>
                )}
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
                The first two links are anchored to a line number, which drifts
                as AOSP changes. The search link always finds the current
                definition.
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
              <span className="truncate font-mono text-xs">
                {previous.name}
              </span>
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

        {/* The descriptions above are reproduced from AOSP under Apache 2.0.
            The obligation to say so attaches to distribution, so it belongs on
            the page that does the distributing, not only in the repository. */}
        <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-subtle">
          Property descriptions on this page are reproduced from{" "}
          <code className="font-mono">VehicleProperty.aidl</code> and{" "}
          <code className="font-mono">VehiclePropertyIds.java</code> in the Android Open
          Source Project. Copyright &copy; The Android Open Source Project, licensed under
          the{" "}
          <a
            href="https://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Apache License 2.0
          </a>
          . Reformatted and annotated for this site &mdash;{" "}
          <Link href="/licence/" className="link-underline">
            licence and attribution
          </Link>
          .
        </p>
      </div>
    </CodeLanguageProvider>
  );
}

/** Area constants as car-lib names them — verified against the car-lib source. */
const AREA_EXAMPLE: Record<string, { expr: string; importPath: string }> = {
  SEAT: {
    expr: "VehicleAreaSeat.SEAT_ROW_1_LEFT",
    importPath: "android.car.VehicleAreaSeat",
  },
  DOOR: {
    expr: "VehicleAreaDoor.DOOR_ROW_1_LEFT",
    importPath: "android.car.VehicleAreaDoor",
  },
  WINDOW: {
    expr: "VehicleAreaWindow.WINDOW_ROW_1_LEFT",
    importPath: "android.car.VehicleAreaWindow",
  },
  MIRROR: {
    expr: "VehicleAreaMirror.MIRROR_DRIVER_LEFT",
    importPath: "android.car.VehicleAreaMirror",
  },
  WHEEL: {
    expr: "VehicleAreaWheel.WHEEL_LEFT_FRONT",
    importPath: "android.car.VehicleAreaWheel",
  },
};

function valueClass(property: VehicleProperty): string {
  switch (property.type) {
    case "BOOLEAN":
      return "Boolean";
    case "FLOAT":
    case "FLOAT_VEC":
      return "Float";
    case "INT32":
    case "INT32_VEC":
      return "Integer";
    case "INT64":
    case "INT64_VEC":
      return "Long";
    case "STRING":
      return "String";
    default:
      return "Object";
  }
}

/** The typed accessor pair CarPropertyManager offers for this value type. */
function accessors(property: VehicleProperty) {
  switch (property.type) {
    case "BOOLEAN":
      return {
        get: "getBooleanProperty",
        set: "setBooleanProperty",
        primitive: "boolean",
      };
    case "FLOAT":
      return {
        get: "getFloatProperty",
        set: "setFloatProperty",
        primitive: "float",
      };
    case "INT32":
      return { get: "getIntProperty", set: "setIntProperty", primitive: "int" };
    default:
      return { get: "getProperty", set: "setProperty", primitive: undefined };
  }
}

/** A value literal suitable for a setProperty call. */
function writeLiteral(property: VehicleProperty): string {
  const enums = enumsFor(property);
  const primary = enums.find((e) => e.name !== "ErrorState");
  if (primary && property.enumImport) {
    const skip = /^(UNKNOWN|OTHER|SHOULD_NOT_USE|.*_UNKNOWN|OTHER_.*)$/;
    const member =
      primary.members.find((m) => !skip.test(m.name)) ?? primary.members[0];
    if (member) return `${property.enumImport.javaName}.${member.name}`;
  }
  switch (property.type) {
    case "BOOLEAN":
      return "true";
    case "FLOAT":
      return property.unit === "CELSIUS" ? "21.5f" : "0.0f";
    case "INT32":
      return "1";
    case "INT64":
      return "1L";
    case "STRING":
      return '"value"';
    default:
      return "value";
  }
}

export type Snippet = {
  title: string;
  /** Set together for a language-switchable block. */
  java?: string;
  kotlin?: string;
  /** Set instead when the snippet is the same in either language. */
  code?: string;
  language?: string;
};

/**
 * Runnable snippets for this property, shaped to its own type, access and
 * change mode — so a read-only property never shows a write, and a continuous
 * one leads with a subscription rather than a poll.
 *
 * The property and area IDs are bound to locals in the setup snippet so the
 * later lines stay readable; a fully-qualified constant inside every call
 * pushes each line well past a comfortable width.
 */
function codeSamples(property: VehicleProperty): Snippet[] {
  const area = AREA_EXAMPLE[property.area];
  const { get, set, primitive } = accessors(property);
  const boxed = valueClass(property);
  const canRead = property.access !== "WRITE";
  const canWrite =
    property.access === "READ_WRITE" || property.access === "WRITE";
  const continuous = property.changeMode === "CONTINUOUS";

  const imports = [
    "android.car.Car",
    "android.car.VehiclePropertyIds",
    "android.car.hardware.property.CarPropertyManager",
  ];
  if (canRead) imports.push("android.car.hardware.CarPropertyValue");
  if (!primitive) imports.push("android.car.hardware.CarPropertyValue");
  if (area) imports.push(area.importPath);
  if (property.enumImport) imports.push(property.enumImport.importPath);
  const importList = [...new Set(imports)].sort();

  const areaComment = area
    ? ""
    : "   // global property — one value for the whole vehicle";
  const areaExpr = area ? area.expr : "0";

  const snippets: Snippet[] = [
    {
      title: "Imports",
      java: importList.map((i) => `import ${i};`).join("\n"),
      kotlin: importList.map((i) => `import ${i}`).join("\n"),
    },
    {
      title: "Set up",
      java: `// Car.createCar returns null until the car service is ready.
Car car = Car.createCar(context);
CarPropertyManager mgr =
        (CarPropertyManager) car.getCarManager(Car.PROPERTY_SERVICE);

int propertyId = VehiclePropertyIds.${property.name};
int areaId = ${areaExpr};${areaComment}`,
      kotlin: `// Car.createCar returns null until the car service is ready.
val car = Car.createCar(context)
val mgr = car.getCarManager(Car.PROPERTY_SERVICE) as CarPropertyManager

val propertyId = VehiclePropertyIds.${property.name}
val areaId = ${areaExpr}${areaComment}`,
    },
  ];

  if (canRead) {
    const javaRead = primitive
      ? `${primitive} value = mgr.${get}(propertyId, areaId);`
      : `CarPropertyValue<${boxed}> result =
            mgr.getProperty(propertyId, areaId);
    ${boxed} value = result.getValue();`;
    const kotlinRead = primitive
      ? `val value = mgr.${get}(propertyId, areaId)`
      : `val result: CarPropertyValue<${boxed}> =
        mgr.getProperty(propertyId, areaId)
    val value = result.value`;

    snippets.push({
      title: "Read the current value",
      java: `// Availability is per area and can change while you are running,
// so check rather than relying on an exception.
if (mgr.isPropertyAvailable(propertyId, areaId)) {
    ${javaRead}
}`,
      kotlin: `// Availability is per area and can change while you are running,
// so check rather than relying on an exception.
if (mgr.isPropertyAvailable(propertyId, areaId)) {
    ${kotlinRead}
}`,
    });

    const javaRate = continuous
      ? `// Ask for no more than you can render. The rate you request raises the
// HAL subscription for every other app on the system, not just yours.
mgr.registerCallback(callback, propertyId, 10f);`
      : `mgr.registerCallback(callback, propertyId,
        CarPropertyManager.SENSOR_RATE_ONCHANGE);`;
    const kotlinRate = continuous
      ? `// Ask for no more than you can render. The rate you request raises the
// HAL subscription for every other app on the system, not just yours.
mgr.registerCallback(callback, propertyId, 10f)`
      : `mgr.registerCallback(
    callback, propertyId, CarPropertyManager.SENSOR_RATE_ONCHANGE)`;

    snippets.push({
      title: continuous
        ? "Subscribe — this property changes continuously"
        : "Subscribe to changes",
      java: `CarPropertyManager.CarPropertyEventCallback callback =
        new CarPropertyManager.CarPropertyEventCallback() {
    @Override
    public void onChangeEvent(CarPropertyValue value) {
        // Check value.getAreaId() — this fires for whichever area changed.
    }

    @Override
    public void onErrorEvent(int propertyId, int areaId) {
        // The vehicle rejected the request or cannot serve the property.
    }
};

${javaRate}

// Unregister in onStop, or the callback outlives your screen.
mgr.unregisterCallback(callback, propertyId);`,
      kotlin: `val callback = object : CarPropertyManager.CarPropertyEventCallback {
    override fun onChangeEvent(value: CarPropertyValue<*>) {
        // Check value.areaId — this fires for whichever area changed.
    }

    override fun onErrorEvent(propertyId: Int, areaId: Int) {
        // The vehicle rejected the request or cannot serve the property.
    }
}

${kotlinRate}

// Unregister in onStop, or the callback outlives your screen.
mgr.unregisterCallback(callback, propertyId)`,
    });
  }

  if (canWrite) {
    const value = writeLiteral(property);
    const note = `// setProperty returns once the request is sent. It does NOT mean the
// vehicle accepted it — failures arrive on onErrorEvent, and a read
// straight afterwards may still return the old value.`;
    snippets.push({
      title: "Write a value",
      java: `${note}
${
  primitive
    ? `mgr.${set}(propertyId, areaId, ${value});`
    : `mgr.setProperty(${boxed}.class, propertyId, areaId, ${value});`
}`,
      kotlin: `${note}
${
  primitive
    ? `mgr.${set}(propertyId, areaId, ${value})`
    : `mgr.setProperty(${boxed}::class.java, propertyId, areaId, ${value})`
}`,
    });
  }

  return snippets;
}

/**
 * Manifest declarations and, where the permission allows it, a runtime request.
 *
 * The manifest string is not derivable from the constant name, so it comes from
 * Car.java. The protection level decides what an app must actually do: a
 * Dangerous permission can be requested at runtime, a Signature|Privileged one
 * cannot be obtained by an ordinary app at all.
 */
function permissionSnippets(property: VehicleProperty): {
  entries: {
    constant: string;
    value: string;
    protection?: string;
    direction: string;
  }[];
  snippets: Snippet[];
} {
  const read = property.readPermissions ?? [];
  const write = property.writePermissions ?? [];
  const seen = new Map<string, string[]>();
  for (const name of read) seen.set(name, ["read"]);
  for (const name of write)
    seen.set(name, [...(seen.get(name) ?? []), "write"]);

  const entries = [...seen.entries()].map(([constant, directions]) => {
    const meta = carPermissions[constant];
    return {
      constant,
      value:
        meta?.value ??
        `android.car.permission.${constant.replace(/^PERMISSION_/, "")}`,
      protection: meta?.protection,
      direction: directions.join(" and "),
    };
  });

  if (entries.length === 0) return { entries, snippets: [] };

  const snippets: Snippet[] = [
    {
      title: "AndroidManifest.xml",
      language: "xml",
      code: entries
        .map(
          (e) => `<!-- ${e.protection ?? "Permission"} · to ${e.direction} -->
<uses-permission android:name="${e.value}" />`,
        )
        .join("\n\n"),
    },
  ];

  const dangerous = entries.filter((e) => e.protection === "Dangerous");
  if (dangerous.length > 0) {
    const list = dangerous.map((e) => `Car.${e.constant}`);
    snippets.push({
      title: "Request at runtime",
      java: `// Dangerous permissions must also be granted by the user at runtime.
String[] needed = { ${list.join(", ")} };

if (checkSelfPermission(needed[0]) != PackageManager.PERMISSION_GRANTED) {
    requestPermissions(needed, REQUEST_CODE);
}`,
      kotlin: `// Dangerous permissions must also be granted by the user at runtime.
val needed = arrayOf(${list.join(", ")})

if (checkSelfPermission(needed[0]) != PackageManager.PERMISSION_GRANTED) {
    requestPermissions(needed, REQUEST_CODE)
}`,
    });
  }

  return { entries, snippets };
}
