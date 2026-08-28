/**
 * Builders for Android Open Source Project reference links.
 *
 * Code links target cs.android.com on the `main` branch. Deep line anchors are
 * supported but deliberately used sparingly: line numbers drift with every AOSP
 * revision, so a file- or symbol-level link stays correct far longer than a
 * pinned line that silently points at the wrong thing six months from now.
 */

const CS_BASE = 'https://cs.android.com/android/platform/superproject/main/+/main:'
const CS_SEARCH = 'https://cs.android.com/search?q='
const DOCS_BASE = 'https://source.android.com/docs/'

/** Link to a file in AOSP, optionally anchored at a line or line range. */
export function csFile(repoPath: string, line?: number | [number, number]): string {
  const anchor =
    line === undefined ? '' : Array.isArray(line) ? `;l=${line[0]}-${line[1]}` : `;l=${line}`
  return `${CS_BASE}${repoPath}${anchor}`
}

/** Link to Code Search's symbol index — survives file moves and refactors. */
export function csSymbol(symbol: string): string {
  return `${CS_SEARCH}${encodeURIComponent(`symbol:${symbol}`)}`
}

/** Free-text Code Search, for things that are not a single symbol. */
export function csSearch(query: string): string {
  return `${CS_SEARCH}${encodeURIComponent(query)}`
}

/** Link into the official Android platform documentation. */
export function androidDocs(docPath: string): string {
  return `${DOCS_BASE}${docPath.replace(/^\/+/, '')}`
}

/** Shortens a repo path for display: keeps the tail, elides the middle. */
export function shortenPath(repoPath: string, keep = 3): string {
  const parts = repoPath.split('/')
  if (parts.length <= keep + 1) return repoPath
  return `…/${parts.slice(-keep).join('/')}`
}
