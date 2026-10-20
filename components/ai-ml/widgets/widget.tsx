import type { ReactNode } from 'react'

/**
 * <Widget name="gradient-descent" caption="..." config={{ learningRate: 0.1 }} />
 *
 * Server-rendered placeholder; the interactive component is mounted in the
 * browser by mountWidgets (see mount.tsx). The text inside is what a reader
 * sees with JavaScript off, or for a moment before the widget loads.
 */
export function Widget({
  name,
  caption,
  config,
  children,
}: {
  name: string
  caption?: string
  config?: Record<string, unknown>
  children?: ReactNode
}) {
  return (
    <figure
      className="bm-widget not-prose my-8 overflow-hidden rounded-xl border border-line bg-surface"
      data-bm-widget={name}
      data-props={JSON.stringify(config ?? {})}
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
