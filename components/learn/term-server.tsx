import { lookupTerm } from '@/data/glossary'
import { TermPopover } from '@/components/learn/term'

/**
 * Inline glossary term: `<T>VHAL</T>`.
 *
 * The lookup happens here, on the server, so only the definitions a page
 * actually uses travel with it — and they travel inside the page, which is
 * encrypted when the topic is locked. Doing the lookup in the client component
 * shipped the entire glossary in a JS chunk, where gating the glossary page
 * made no difference to anyone who opened the bundle.
 */
export function T({ children, id }: { children: React.ReactNode; id?: string }) {
  const label = typeof children === 'string' ? children : String(children ?? '')
  return <TermPopover entry={lookupTerm(id ?? label)}>{children}</TermPopover>
}
