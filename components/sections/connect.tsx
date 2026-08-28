import { SocialLinks } from '@/components/social-links'
import { LogoMark } from '@/components/brand'

export function Connect() {
  return (
    <section id="connect" className="relative scroll-mt-24 overflow-hidden border-b border-line bg-bg-subtle">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: 'var(--glow-a)' }}
      />
      <div className="container-page relative py-24 text-center md:py-32">
        <LogoMark aria-hidden className="mx-auto h-12 opacity-90" />
        <h2 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
          Let&rsquo;s talk automotive Android
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          Whether it is AAOS platform work, VHAL design, an SDV migration or just a good
          argument about where the middleware boundary belongs — I am easy to reach on any
          of these.
        </p>
        <SocialLinks variant="labelled" className="mt-9 justify-center" />
      </div>
    </section>
  )
}
