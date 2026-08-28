import { Github, Linkedin } from 'lucide-react'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

/** lucide-react has no Medium glyph, so ship the official "M" mark inline. */
function MediumIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12ZM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42ZM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12Z" />
    </svg>
  )
}

export const socialLinks = [
  { name: 'LinkedIn', href: site.socials.linkedin, Icon: Linkedin },
  { name: 'GitHub', href: site.socials.github, Icon: Github },
  { name: 'Medium', href: site.socials.medium, Icon: MediumIcon },
] as const

export function SocialLinks({
  className,
  variant = 'icon',
}: {
  className?: string
  variant?: 'icon' | 'labelled'
}) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {socialLinks.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={variant === 'icon' ? `${name} profile (opens in a new tab)` : undefined}
            className={cn(
              'group inline-flex items-center justify-center rounded-lg border border-line bg-surface text-muted transition-all hover:border-accent/60 hover:text-accent',
              variant === 'icon' ? 'size-10' : 'gap-2 px-4 py-2.5 text-sm font-medium'
            )}
          >
            <Icon className="size-[18px] transition-transform group-hover:scale-110" />
            {variant === 'labelled' && <span>{name}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
