'use client'

import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * A copyable code block for pages built in TSX rather than MDX.
 *
 * The MDX pipeline gets its chrome from components/learn/code-window, which is
 * built around rehype-pretty-code's output and cannot wrap a plain string. This
 * reuses the same visual language so a snippet looks the same wherever it
 * appears.
 */
export function CodeSample({
  code,
  title,
  language = 'java',
}: {
  code: string
  title?: string
  language?: string
}) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked (insecure origin / permission) — leave the UI unchanged */
    }
  }

  return (
    <figure className="code-window not-prose my-4 overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
      <div className="code-window__bar">
        <span aria-hidden className="code-window__lights">
          <i /> <i /> <i />
        </span>
        {title && <span className="code-window__title">{title}</span>}
        <span className="code-window__spacer" />
        <span aria-hidden className="code-window__lang">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="code-window__copy"
          aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      {/* Focusable so keyboard users can scroll a wide block (WCAG 2.1.1). */}
      <pre
        ref={ref}
        tabIndex={0}
        className="overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed text-fg"
      >
        <code>{code}</code>
      </pre>
    </figure>
  )
}
