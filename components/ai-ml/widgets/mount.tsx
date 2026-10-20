'use client'

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { widgetLoaders } from './registry'

/**
 * Brings the interactive diagrams on a page to life.
 *
 * A locked topic reaches the browser as encrypted HTML and is dropped into the
 * page with innerHTML after the key is checked. React never sees that markup,
 * so a React component inside it would stay inert. So <Widget> renders only a
 * placeholder (data-bm-widget="name" plus JSON in data-props), and this
 * function mounts the real component into each placeholder. The unlock code
 * calls it after injecting the article; <WidgetHost> calls it on open pages.
 */
const mounted = new WeakSet<Element>()

export function mountWidgets(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-bm-widget]')) {
    if (mounted.has(el)) continue
    const host = el.querySelector<HTMLElement>('[data-bm-widget-root]')
    const name = el.dataset.bmWidget ?? ''
    const load = widgetLoaders[name]
    if (!host) continue
    mounted.add(el)
    if (!load) {
      host.textContent = `Interactive demo "${name}" is not available.`
      continue
    }
    let props: Record<string, unknown> = {}
    try {
      props = JSON.parse(el.dataset.props ?? '{}')
    } catch {
      /* malformed props: mount with defaults */
    }
    load()
      .then((mod) => {
        createRoot(host).render(createElement(mod.default, props))
      })
      .catch(() => {
        host.textContent = 'This interactive demo could not load. Reload the page to try again.'
      })
  }
}
