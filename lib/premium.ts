/**
 * Whether a locked topic's body is rendered during this build.
 *
 * Emptying the article after export is not enough. Next serialises everything
 * it renders into the RSC flight payload embedded in the page, so prose that
 * was rendered server-side is still sitting in `self.__next_f.push(...)` even
 * when the visible markup is gone — 224 KB of it per page, and searchable.
 *
 * So the site is built twice. The first pass sets PREMIUM_RENDER_ALL and exists
 * only to produce the article HTML that gets encrypted; its output is never
 * published. The second pass renders no locked body at all, which is what
 * ships. Running the same pipeline both times is what guarantees a reader who
 * unlocks a topic sees exactly what a free page would have shown.
 */
export const RENDER_ALL = process.env.PREMIUM_RENDER_ALL === '1'

/** True when this build should emit the article body for a locked topic. */
export function shouldRenderBody(locked: boolean): boolean {
  return !locked || RENDER_ALL
}
