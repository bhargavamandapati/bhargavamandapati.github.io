import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '@/components/brand'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark aria-hidden className="h-12 opacity-70" />
      <p className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-accent">Error 404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Signal not found</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        That route is not on the bus. It may have been moved, renamed, or never existed.
      </p>
      <Link
        href="/"
        className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back home
      </Link>
    </div>
  )
}
