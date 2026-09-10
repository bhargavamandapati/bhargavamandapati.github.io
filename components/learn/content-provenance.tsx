import Link from 'next/link'

/**
 * The AI-assistance disclosure previously lived only in LICENSE-CONTENT — a
 * file almost no reader ever opens. Repeating one line of it on the article
 * itself, next to the references list every reader already sees, is what
 * makes the disclosure actually reach anyone.
 */
export function ContentProvenance({ className }: { className?: string }) {
  return (
    <p className={`mt-6 font-mono text-[0.7rem] leading-relaxed text-subtle ${className ?? ''}`}>
      Parts of this article were drafted with the assistance of a large language
      model, then selected, ordered and edited by the author. See{' '}
      <Link href="/licence/" className="link-underline">
        licence and attribution
      </Link>{' '}
      for the full authorship note and what you can do with this content.
    </p>
  )
}
