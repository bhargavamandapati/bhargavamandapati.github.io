import type { ComponentType } from 'react'

/**
 * The interactive diagrams ("widgets") an AI & ML page can drop in with
 * <Widget name="gradient-descent" />. Each entry is a lazy import, so a page
 * only downloads the widgets it actually uses.
 *
 * Add a widget by writing components/ai-ml/widgets/<name>.tsx with a default
 * export (a client component) and listing it here. The key is the name used in
 * the MDX.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loader = () => Promise<{ default: ComponentType<any> }>

export const widgetLoaders: Record<string, Loader> = {
  'matrix-lab': () => import('./matrix-lab'),
  'gradient-descent': () => import('./gradient-descent'),
  'neuron-lab': () => import('./neuron-lab'),
  'distribution-lab': () => import('./distribution-lab'),
  'regression-lab': () => import('./regression-lab'),
  'softmax-lab': () => import('./softmax-lab'),
}
