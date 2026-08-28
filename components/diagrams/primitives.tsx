import { cn } from '@/lib/utils'

/**
 * Wrapper for every inline diagram: gives it a frame, a numbered caption and a
 * horizontal scroll container so a wide figure never widens the page.
 */
export function DiagramFrame({
  title,
  caption,
  children,
  className,
}: {
  title: string
  caption?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn('not-prose my-9', className)}>
      {/* tabIndex makes the scroll container reachable by keyboard, which axe
          (and WCAG 2.1.1) require for any independently scrollable region. */}
      <div
        role="region"
        aria-label={`Diagram: ${title}`}
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-line bg-surface p-5 sm:p-6"
      >
        <div className="min-w-[34rem]">{children}</div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        <span className="font-medium text-fg">{title}</span>
        {caption && <> — {caption}</>}
      </figcaption>
    </figure>
  )
}

/** Shared SVG defs: arrow heads in both the muted and accent colours. */
export function DiagramDefs() {
  return (
    <defs>
      <marker id="d-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-subtle)" />
      </marker>
      <marker id="d-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
      </marker>
    </defs>
  )
}

type BoxTone = 'default' | 'accent' | 'muted' | 'vendor'

const TONES: Record<BoxTone, { fill: string; stroke: string; text: string }> = {
  default: { fill: 'var(--surface-2)', stroke: 'var(--border-strong)', text: 'var(--fg)' },
  accent: { fill: 'var(--accent-soft)', stroke: 'var(--accent)', text: 'var(--fg)' },
  muted: { fill: 'var(--bg-subtle)', stroke: 'var(--border)', text: 'var(--fg-muted)' },
  vendor: { fill: 'transparent', stroke: 'var(--border-strong)', text: 'var(--fg-muted)' },
}

/** A labelled rounded rectangle with an optional second line of detail. */
export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  tone = 'default',
  dashed = false,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  tone?: BoxTone
  dashed?: boolean
}) {
  const t = TONES[tone]
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth={1.25}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 7 : y + h / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={t.text}
        fontSize={13}
        fontWeight={600}
        fontFamily="var(--font-display)"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--fg-subtle)"
          fontSize={10.5}
          fontFamily="var(--font-mono)"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

/** Small caption text used for axis labels and side annotations. */
export function Label({
  x,
  y,
  children,
  anchor = 'middle',
  tone = 'subtle',
  size = 10.5,
  mono = true,
}: {
  x: number
  y: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
  tone?: 'subtle' | 'muted' | 'accent'
  size?: number
  mono?: boolean
}) {
  const fill =
    tone === 'accent' ? 'var(--accent)' : tone === 'muted' ? 'var(--fg-muted)' : 'var(--fg-subtle)'
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fill={fill}
      fontSize={size}
      fontFamily={mono ? 'var(--font-mono)' : 'var(--font-sans)'}
      letterSpacing={mono ? 0.3 : 0}
    >
      {children}
    </text>
  )
}

/** Straight connector with an arrow head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  accent = false,
  dashed = false,
  both = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  accent?: boolean
  dashed?: boolean
  both?: boolean
}) {
  const marker = accent ? 'url(#d-arrow-accent)' : 'url(#d-arrow)'
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={accent ? 'var(--accent)' : 'var(--fg-subtle)'}
      strokeWidth={1.4}
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={marker}
      markerStart={both ? marker : undefined}
    />
  )
}
