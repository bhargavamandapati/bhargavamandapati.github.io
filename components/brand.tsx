import Image from 'next/image'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

/**
 * The BM monogram. Both ink variants ship and CSS picks one, so the correct
 * mark is painted on first render with no theme-dependent JS.
 */
export function LogoMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <Image
        src={asset('/images/mark-dark.png')}
        alt=""
        width={703}
        height={352}
        priority={priority}
        className="h-full w-auto dark:hidden"
      />
      <Image
        src={asset('/images/mark-light.png')}
        alt=""
        width={809}
        height={411}
        priority={priority}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  )
}

/** Full lockup: monogram + name + role. Used in the hero and footer. */
export function LogoLockup({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <Image
        src={asset('/images/lockup-dark.png')}
        alt="Bhargava Mandapati — Automotive Software Engineer"
        width={995}
        height={582}
        priority={priority}
        className="h-full w-auto dark:hidden"
      />
      <Image
        src={asset('/images/lockup-light.png')}
        alt="Bhargava Mandapati — Automotive Software Engineer"
        width={995}
        height={581}
        priority={priority}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  )
}
