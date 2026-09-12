'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { LogoMark } from '@/components/brand'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark aria-hidden className="h-12 opacity-70" />
      <p className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-accent">Fault detected</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Something stalled</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        That page hit an unexpected error. Nothing you did caused it — try again, or head back and
        pick a different route.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
        >
          <RotateCw className="size-4 transition-transform group-hover:rotate-90" />
          Try again
        </button>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent/50 hover:text-accent"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back home
        </Link>
      </div>
    </div>
  )
}
