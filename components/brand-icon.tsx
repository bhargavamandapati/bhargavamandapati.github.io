import { brandIcons, type BrandSlug } from '@/data/brand-icons'
import { iconSlugFor, monogramFor } from '@/lib/brand'
import { cn } from '@/lib/utils'

/**
 * Renders one simple-icons glyph. The two brand colours are handed to CSS as
 * custom properties so the theme picks the legible one without any JS.
 */
export function BrandGlyph({
  slug,
  className,
  labelled = false,
}: {
  slug: BrandSlug
  className?: string
  /** Expose the brand name to assistive tech. Decorative by default. */
  labelled?: boolean
}) {
  const icon = brandIcons[slug]
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      style={
        { '--brand-light': icon.hexLight, '--brand-dark': icon.hexDark } as React.CSSProperties
      }
      className={cn('brand-glyph shrink-0', className)}
    >
      {labelled && <title>{icon.title}</title>}
      <path d={icon.path} />
    </svg>
  )
}

/** Logo for a technology label, or nothing when no brand mark exists for it. */
export function TechIcon({ label, className }: { label: string; className?: string }) {
  const slug = iconSlugFor(label)
  if (!slug) return null
  return <BrandGlyph slug={slug} className={className} />
}

/**
 * Square tile for an organisation — brand mark when one exists, initials
 * otherwise, so every row in the timeline carries the same visual weight.
 */
export function CompanyMark({
  name,
  className,
  size = 'md',
}: {
  name: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const slug = iconSlugFor(name)
  const box = size === 'sm' ? 'size-8 rounded-lg' : 'size-11 rounded-xl'
  const glyph = size === 'sm' ? 'size-4' : 'size-[22px]'

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex items-center justify-center border border-line bg-surface-2',
        box,
        className
      )}
    >
      {slug ? (
        <BrandGlyph slug={slug} className={glyph} />
      ) : (
        <span
          className={cn(
            'font-display font-semibold tracking-tight text-muted',
            size === 'sm' ? 'text-[0.65rem]' : 'text-xs'
          )}
        >
          {monogramFor(name)}
        </span>
      )}
    </span>
  )
}
