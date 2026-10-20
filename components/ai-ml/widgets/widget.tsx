import type { ReactNode } from 'react'

/**
 * <Widget name="gradient-descent" caption="..." learningRate="0.1" fn="double-well" />
 *
 * Server-rendered placeholder; the interactive component is mounted in the
 * browser by mountWidgets (see mount.tsx). The text inside is what a reader
 * sees with JavaScript off, or for a moment before the widget loads.
 */
/** MDX gives every attribute as a string; turn the obvious numbers, booleans and arrays back into values. */
function coerce(value: unknown): unknown {
  if (typeof value !== 'string') return value
  if (/^(-?\d|\[|true$|false$|null$)/.test(value)) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  return value
}

export function Widget({
  name,
  caption,
  children,
  ...rest
}: {
  name: string
  caption?: string
  children?: ReactNode
  /** Any other attribute is passed to the widget: <Widget name="gradient-descent" fn="double-well" learningRate="0.3" /> */
  [prop: string]: unknown
}) {
  const config = Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, coerce(v)]))
  return (
    <figure
      className="bm-widget not-prose my-8 overflow-hidden rounded-xl border border-line bg-surface"
      data-bm-widget={name}
      data-props={JSON.stringify(config)}
    >
      <div data-bm-widget-root className="p-4 text-sm text-muted">
        {children ?? <p>Interactive demo. It needs JavaScript to run.</p>}
      </div>
      {caption && (
        <figcaption className="border-t border-line bg-surface-2 px-4 py-2 text-xs leading-relaxed text-subtle">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
