'use client'

import { useId, type ReactNode } from 'react'

/**
 * Small building blocks shared by the interactive widgets, so they all look
 * and behave alike: a labelled slider, a read-out and a panel. Theme colours
 * come from the site's CSS variables (--fg, --accent, --border ...), so the
 * widgets follow light and dark mode without any extra code.
 */

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid gap-4 ${className}`}>{children}</div>
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format = (v: number) => String(v),
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  const id = useId()
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-xs text-muted">
        <span>{label}</span>
        <span className="font-mono text-fg tabular-nums">{format(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-[var(--accent)]"
      />
    </div>
  )
}

export function Readout({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 px-3 py-2">
      <p className="text-[0.68rem] uppercase tracking-wider text-subtle">{label}</p>
      <p className="mt-0.5 font-mono text-sm text-fg tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-[0.7rem] text-subtle">{hint}</p>}
    </div>
  )
}

export function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={o.value === value}
          className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors ${
            o.value === value
              ? 'border-accent bg-accent-soft text-accent'
              : 'border-line text-muted hover:border-accent/50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-md border border-line px-3 py-1.5 text-xs text-fg transition-colors hover:border-accent/60 hover:text-accent"
    >
      {children}
    </button>
  )
}

/** Colours for SVG, taken from the theme. */
export const C = {
  fg: 'var(--fg)',
  muted: 'var(--fg-muted)',
  subtle: 'var(--fg-subtle)',
  line: 'var(--border)',
  strong: 'var(--border-strong)',
  accent: 'var(--accent)',
  soft: 'var(--accent-soft)',
  danger: 'var(--danger)',
  info: 'var(--info)',
  surface: 'var(--surface)',
  surface2: 'var(--surface-2)',
} as const
