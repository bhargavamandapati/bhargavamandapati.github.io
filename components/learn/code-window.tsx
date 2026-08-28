'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Check, Copy } from 'lucide-react'

type AnyProps = Record<string, unknown> & { children?: ReactNode }

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement(node)) return textOf((node.props as AnyProps).children)
  return ''
}

function hasProp(node: ReactNode, prop: string): node is ReactElement {
  return isValidElement(node) && (node.props as AnyProps)[prop] !== undefined
}

/**
 * Chrome around a rehype-pretty-code block: a title bar carrying the filename
 * and language, plus a copy button. Replaces the plain <figure> the plugin
 * emits, and pulls the filename out of the generated <figcaption> so the caption
 * is not rendered twice.
 */
export function CodeWindow({ children, ...rest }: { children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  const kids = Children.toArray(children)
  const caption = kids.find((k) => hasProp(k, 'data-rehype-pretty-code-title'))
  const body = kids.filter((k) => k !== caption)
  const pre = body.find((k) => isValidElement(k) && k.type === 'pre') as
    | ReactElement<AnyProps>
    | undefined

  // A horizontally scrolling <pre> must be focusable or keyboard users cannot
  // scroll it (WCAG 2.1.1). rehype-pretty-code does not add this itself.
  const scrollableBody = body.map((child, i) => {
    if (!isValidElement(child)) return child
    const el = child as ReactElement<AnyProps>
    return cloneElement(el, {
      key: `code-window-child-${i}`,
      ...(el.type === 'pre' ? { tabIndex: 0 } : {}),
    })
  })

  const title = caption ? textOf(caption) : undefined
  const language = pre ? ((pre.props as AnyProps)['data-language'] as string | undefined) : undefined

  async function copy() {
    const code = ref.current?.querySelector('pre')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked (insecure origin / permission) — leave the UI unchanged */
    }
  }

  return (
    <figure ref={ref} className="code-window" {...rest}>
      <div className="code-window__bar">
        <span aria-hidden className="code-window__lights">
          <i /> <i /> <i />
        </span>
        {title && <span className="code-window__title">{title}</span>}
        <span className="code-window__spacer" />
        {language && language !== 'text' && (
          <span aria-hidden className="code-window__lang">
            {language}
          </span>
        )}
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
      {scrollableBody}
    </figure>
  )
}
