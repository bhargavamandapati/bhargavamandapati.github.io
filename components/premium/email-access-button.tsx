'use client'

import { Mail } from 'lucide-react'
import { accessEmail } from '@/lib/obscured-email'
import { cn } from '@/lib/utils'

/**
 * The email option beside every "request access on LinkedIn" button.
 *
 * Decoding happens inside the click handler, never during render. Rendering
 * the address into a `href` — even one set after mount in an effect — still
 * puts a real mailto: string into the DOM, where devtools, a browser
 * extension, or a screen reader's link list can read it. A button with no
 * address-bearing attribute at any point is the only version of "not shown
 * in the website" that actually holds.
 */
export function EmailAccessButton({
  subject,
  variant = 'secondary',
  label = 'Email for access',
  className,
}: {
  subject: string
  variant?: 'primary' | 'secondary'
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const body = `Page: ${window.location.href}\n\n`
        window.location.href =
          `mailto:${accessEmail()}` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`
      }}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-accent text-accent-fg hover:opacity-90'
          : 'border border-line text-fg transition-colors hover:border-line-strong hover:bg-surface',
        className,
      )}
    >
      <Mail aria-hidden className="size-4" />
      {label}
    </button>
  )
}
