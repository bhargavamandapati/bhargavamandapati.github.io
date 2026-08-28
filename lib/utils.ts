export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** "2026-03" | "2026-03-14" -> "Mar 2026" */
export function formatMonth(value: string): string {
  const [y, m] = value.split('-').map(Number)
  return new Date(Date.UTC(y, (m ?? 1) - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "2026-03-14" -> "14 March 2026" */
export function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Inclusive month span rendered as "3 yrs 5 mos". */
export function durationBetween(start: string, end: string | null): string {
  const [sy, sm] = start.split('-').map(Number)
  const e = end ? end.split('-').map(Number) : null
  const now = new Date()
  const ey = e ? e[0] : now.getFullYear()
  const em = e ? e[1] : now.getMonth() + 1

  const total = (ey - sy) * 12 + (em - sm) + 1
  const years = Math.floor(total / 12)
  const months = total % 12

  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`)
  return parts.join(' ') || '1 mo'
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
