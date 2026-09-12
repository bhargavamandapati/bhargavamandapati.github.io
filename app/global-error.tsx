'use client'

import { useEffect } from 'react'
import './globals.css'

/**
 * Only fires for an error inside the root layout itself (the theme script,
 * the nav, the site-wide JSON-LD) — vanishingly rare, since that layout does
 * no data fetching and has no external inputs. Replaces the entire document,
 * so it renders its own <html>/<body> rather than relying on layout.tsx.
 */
export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">Fault detected</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Something stalled</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            The site hit an unexpected error before the page could even load. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-9 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
