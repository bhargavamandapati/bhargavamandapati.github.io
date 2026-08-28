import Link from 'next/link'
import { LogoMark } from '@/components/brand'
import { SocialLinks } from '@/components/social-links'
import { site } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-subtle">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${site.name} — home`}>
              <LogoMark className="h-8" />
              <span className="font-display text-base font-semibold">{site.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-subtle">
                Explore
              </h2>
              <ul className="mt-4 space-y-2.5">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-muted transition-colors hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-subtle">
                Elsewhere
              </h2>
              <SocialLinks variant="labelled" className="mt-4 flex-col items-stretch gap-2" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">Built with Next.js · Deployed on GitHub Pages</p>
        </div>
      </div>
    </footer>
  )
}
