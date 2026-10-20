'use client'

import { useEffect } from 'react'
import { mountWidgets } from './mount'

/** Mounts the widgets already on the page (the open topics). Locked topics are mounted by the unlock code. */
export function WidgetHost() {
  useEffect(() => {
    mountWidgets(document)
  }, [])
  return null
}
