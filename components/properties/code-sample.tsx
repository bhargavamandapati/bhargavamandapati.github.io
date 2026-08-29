'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CodeLanguage = 'java' | 'kotlin'

const STORAGE_KEY = 'bm:code-language'

type Ctx = { language: CodeLanguage; setLanguage: (l: CodeLanguage) => void }
const LanguageContext = createContext<Ctx | undefined>(undefined)

/**
 * Shares the Java/Kotlin choice across every block on the page.
 *
 * Switching one block switches all of them — reading half a walkthrough in one
 * language and half in another is worse than either. The choice is remembered so
 * a Kotlin developer is not re-selecting it on every property.
 */
export function CodeLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<CodeLanguage>('java')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'java' || stored === 'kotlin') setLanguageState(stored)
    } catch {
      /* storage blocked — the default is fine */
    }
  }, [])

  const setLanguage = useCallback((next: CodeLanguage) => {
    setLanguageState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage blocked — the choice still applies for this page */
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

function useCodeLanguage(): Ctx {
  return (
    useContext(LanguageContext) ?? { language: 'java', setLanguage: () => undefined }
  )
}

function LanguageToggle() {
  const { language, setLanguage } = useCodeLanguage()
  return (
    <div
      role="group"
      aria-label="Code language"
      className="flex overflow-hidden rounded-md border border-line"
    >
      {(['java', 'kotlin'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          className={cn(
            'cursor-pointer px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] transition-colors',
            language === option
              ? 'bg-accent font-medium text-accent-fg'
              : 'text-subtle hover:text-fg',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

/**
 * A copyable code block for pages built in TSX rather than MDX.
 *
 * The MDX pipeline gets its chrome from components/learn/code-window, which is
 * built around rehype-pretty-code's output and cannot wrap a plain string. This
 * reuses the same visual language so a snippet looks the same wherever it
 * appears.
 *
 * Pass `java` and `kotlin` for a switchable block, or `code` plus `language`
 * for one that is the same either way — a manifest entry, for instance.
 */
export function CodeSample({
  title,
  code,
  java,
  kotlin,
  language = 'text',
}: {
  title?: string
  code?: string
  java?: string
  kotlin?: string
  language?: string
}) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const { language: selected } = useCodeLanguage()

  const switchable = java !== undefined && kotlin !== undefined
  const body = switchable ? (selected === 'kotlin' ? kotlin! : java!) : (code ?? java ?? kotlin ?? '')
  const shownLanguage = switchable ? selected : language

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? body)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked (insecure origin / permission) — leave the UI unchanged */
    }
  }

  return (
    <figure className="code-window not-prose my-4 overflow-hidden rounded-xl border border-line shadow-[var(--shadow-card)]">
      <div className="code-window__bar">
        <span aria-hidden className="code-window__lights">
          <i /> <i /> <i />
        </span>
        {title && <span className="code-window__title">{title}</span>}
        <span className="code-window__spacer" />
        {switchable ? (
          <LanguageToggle />
        ) : (
          <span aria-hidden className="code-window__lang">
            {shownLanguage}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          className="code-window__copy"
          aria-label={copied ? 'Code copied' : `Copy ${shownLanguage} code to clipboard`}
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
        <code>{body}</code>
      </pre>
    </figure>
  )
}
