import { BrandGlyph } from '@/components/brand-icon'
import type { BrandSlug } from '@/data/brand-icons'

/** The stack a visitor should recognise within a second of landing. */
const CORE: { slug: BrandSlug; label: string }[] = [
  { slug: 'android', label: 'Android / AOSP' },
  { slug: 'kotlin', label: 'Kotlin' },
  { slug: 'openjdk', label: 'Java' },
  { slug: 'cplusplus', label: 'C / C++' },
  { slug: 'jetpackcompose', label: 'Compose' },
  { slug: 'qt', label: 'Qt' },
  { slug: 'linux', label: 'Linux' },
  { slug: 'git', label: 'Git' },
]

export function StackStrip() {
  return (
    <section aria-label="Core technologies" className="border-b border-line bg-bg-subtle">
      <div className="container-page py-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:gap-12">
          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-subtle">
            Core stack
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:flex lg:flex-1 lg:justify-between">
            {CORE.map(({ slug, label }) => (
              <li key={slug} className="group flex items-center gap-2.5">
                <BrandGlyph
                  slug={slug}
                  className="size-5 opacity-85 transition-opacity group-hover:opacity-100"
                />
                <span className="text-sm font-medium text-muted transition-colors group-hover:text-fg">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
