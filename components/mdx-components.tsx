import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import { AlertTriangle, Info, Lightbulb } from 'lucide-react'
import { CodeWindow } from '@/components/learn/code-window'
import { Analogy, Plain, Recap, Scenario } from '@/components/learn/explain'
import { T } from '@/components/learn/term'
import { FileTree, Gotcha, Verify } from '@/components/tutorial/blocks'
import { Doc, Find, SourceList, Src, Sym } from '@/components/learn/source'
import {
  AaosStack,
  AbPartitions,
  AreaIdBitmask,
  AudioZones,
  BinderTransaction,
  BootSequence,
  BluetoothProfiles,
  BootTimeline,
  ClusterArchitecture,
  ComplianceSuites,
  DiagramFrame,
  EvsBootPath,
  MediaBrowseTree,
  MemoryPressure,
  PowerStates,
  PropertyIdBits,
  SdvBridge,
  SignalPathFull,
  SubscriptionFanout,
  SystemUiLayout,
  UserModel,
  VhalDataFlow,
} from '@/components/diagrams'

type CalloutKind = 'note' | 'tip' | 'warning'

const calloutStyles: Record<CalloutKind, { icon: typeof Info; className: string; label: string }> = {
  note: { icon: Info, className: 'border-sky-500/40 bg-sky-500/[0.07]', label: 'Note' },
  tip: { icon: Lightbulb, className: 'border-emerald-500/40 bg-emerald-500/[0.07]', label: 'Tip' },
  warning: { icon: AlertTriangle, className: 'border-amber-500/50 bg-amber-500/[0.08]', label: 'Warning' },
}

/** Usage in MDX:  <Callout type="warning">SEPolicy denials fail silently.</Callout> */
export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutKind
  title?: string
  children: React.ReactNode
}) {
  const { icon: Icon, className, label } = calloutStyles[type]
  return (
    <div className={`my-6 flex gap-3 rounded-xl border p-4 ${className}`}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
      <div className="min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <p className="mb-1 font-display text-sm font-semibold text-fg">{title ?? label}</p>
        <div className="text-[0.95rem] leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  a: ({ href = '', children, ...props }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#')
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
  // next/image needs known dimensions; MDX authors just drop in a path, so use <img>.
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ alt = '', ...props }) => <img alt={alt} loading="lazy" decoding="async" {...props} />,

  // rehype-pretty-code wraps every fenced block in a <figure>; swap it for the
  // editor chrome. Any other figure in the content is left alone.
  figure: ({ children, ...props }) =>
    'data-rehype-pretty-code-figure' in props ? (
      <CodeWindow {...props}>{children}</CodeWindow>
    ) : (
      <figure {...props}>{children}</figure>
    ),

  Callout,

  // AOSP reference links
  Src,
  Sym,
  Find,
  Doc,
  SourceList,

  // Comprehension aids
  T,
  Plain,
  Analogy,
  Scenario,
  Recap,

  // Tutorial blocks
  Verify,
  Gotcha,
  FileTree,

  // Diagrams
  DiagramFrame,
  AaosStack,
  PropertyIdBits,
  VhalDataFlow,
  AudioZones,
  PowerStates,
  UserModel,
  SdvBridge,
  SystemUiLayout,
  EvsBootPath,
  ClusterArchitecture,
  BootTimeline,
  AbPartitions,
  MemoryPressure,
  BluetoothProfiles,
  ComplianceSuites,
  MediaBrowseTree,
  AreaIdBitmask,
  SubscriptionFanout,
  BootSequence,
  BinderTransaction,
  SignalPathFull,
}
