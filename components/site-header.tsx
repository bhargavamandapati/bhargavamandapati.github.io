'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LogoMark } from '@/components/brand'
import { NavDropdown } from '@/components/nav-dropdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { navItems, site } from '@/data/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on navigation and lock body scroll while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (href: string) =>
    href.startsWith('/#') ? false : pathname === href || pathname.startsWith(href)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/65'
          : 'border-b border-transparent'
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg"
          aria-label={`${site.name} — home`}
        >
          <LogoMark className="h-7 transition-transform duration-300 group-hover:scale-105" priority />
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.href}
                label={item.label}
                items={item.children}
                active={item.children.some((c) => isActive(c.href))}
                isActive={isActive}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href) ? 'text-accent' : 'text-muted hover:text-fg'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-fg lg:hidden"
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-bg lg:hidden"
        >
          <ul className="container-page flex flex-col py-3">
            {navItems.map((item) =>
              item.children ? (
                <li
                  key={item.href}
                  className="my-2 border-y border-line py-2 first:mt-0 first:border-t-0 first:pt-0"
                >
                  <p className="px-2 pb-1 pt-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                    {item.label}
                  </p>
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={isActive(child.href) ? 'page' : undefined}
                          className={cn(
                            'block rounded-lg px-2 py-3 text-base font-medium transition-colors hover:bg-surface-2 hover:text-fg',
                            isActive(child.href) ? 'text-accent' : 'text-muted'
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-2 py-3 text-base font-medium transition-colors hover:bg-surface-2 hover:text-fg',
                      isActive(item.href) ? 'text-accent' : 'text-muted'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
