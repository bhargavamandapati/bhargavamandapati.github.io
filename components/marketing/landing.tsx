import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Car,
  Check,
  Gauge,
  Layers,
  Linkedin,
  Lock,
  MonitorSmartphone,
  Search,
} from 'lucide-react'
import { FREE_TOPICS, access } from '@/data/access'
import { site } from '@/data/site'
import { EmailAccessButton } from '@/components/premium/email-access-button'

/**
 * The home page.
 *
 * It used to open with a résumé, which answered a question nobody had arrived
 * with. What the site is now is a body of work about Android Automotive, so the
 * page leads with that: what is inside, what is readable immediately, and how
 * to reach the rest.
 */

const LIBRARY = [
  { icon: BookOpen, count: '93', label: 'Learn AAOS topics', note: 'Foundations to homologation, in reading order.', href: '/learn/' },
  { icon: Layers, count: '40', label: 'SDV topics', note: 'Service-oriented architecture, data, cloud and cluster.', href: '/sdv/' },
  { icon: Car, count: '280', label: 'Vehicle properties', note: 'Every property, its enums, permissions and dependencies.', href: '/learn/vehicle-properties/' },
  { icon: Boxes, count: '21', label: 'Tutorials', note: 'Build a boot animation, an RRO, a system app.', href: '/tutorials/' },
  { icon: Gauge, count: '2', label: 'Live simulators', note: 'Change a property and watch the car respond.', href: '/learn/vehicle-simulator/' },
  { icon: Search, count: '98', label: 'Glossary terms', note: 'The vocabulary, defined without assuming you know it.', href: '/glossary/' },
]

const FEATURES = [
  {
    src: '/images/screenshots/simulator.png',
    width: 1700,
    height: 488,
    alt: 'The vehicle property simulator: a 3D cabin and top-down exterior view next to a searchable panel of 128 controls, grouped by category.',
    eyebrow: 'Interactive',
    title: 'A 3D cabin that answers to real vehicle properties',
    description:
      'Move the fan speed slider and the vent icon changes. Every control on the panel is a real AIDL property — 128 of them, searchable by name — and each write lands in a log of exactly what the VHAL received.',
    cta: 'Open the simulator',
    href: '/learn/vehicle-simulator/',
  },
  {
    src: '/images/screenshots/property-flow.png',
    width: 900,
    height: 969,
    alt: 'A diagram tracing HVAC_TEMPERATURE_SET across the AAOS stack, from the app through CarService and the VHAL boundary to the vendor bridge and hardware, for both a write request and a change event.',
    eyebrow: 'Traced, not just described',
    title: 'Every property, mapped from app to hardware and back',
    description:
      '264 reference pages carry a diagram like this one — the exact classes and Binder crossings a value passes through, get and set, generated from the real AIDL rather than drawn from memory.',
    cta: 'See the full trace',
    href: '/learn/vehicle-properties/hvac-temperature-set/',
  },
  {
    src: '/images/screenshots/property-browser.png',
    width: 1700,
    height: 874,
    alt: 'The vehicle property reference, searched for "hvac": facets for category, area type, value type, access and change mode, above a filtered list of matching properties.',
    eyebrow: 'Searchable reference',
    title: '280 vehicle properties, not a PDF of them',
    description:
      'Filter by category, area, value type, access or change mode, and jump straight to the AOSP source for any of them.',
    cta: 'Browse the reference',
    href: '/learn/vehicle-properties/',
  },
]

const AUDIENCE = [
  'Android developers moving into automotive, who keep hitting words nobody defines.',
  'Embedded engineers meeting AOSP for the first time, from the HAL upwards.',
  'Platform teams onboarding people onto a programme already in flight.',
  'Anyone preparing for an AAOS interview and tired of guessing what matters.',
]

export function Landing() {
  const freeLearn = FREE_TOPICS.learn[0]

  return (
    <>
      {/* ---- Lead ------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-48 size-[34rem] rounded-full blur-[130px]"
          style={{ background: 'var(--glow-a)' }}
        />
        <div className="container-page relative py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Android Automotive · AOSP · Software-defined vehicles
          </p>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            The Android Automotive material I wanted when I started.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
            A decade of platform work, written down properly: how AAOS actually fits together,
            what the vehicle HAL really is, and why the thing you are debugging behaves the way
            it does. Not API docs, and not a blog — the explanation underneath both.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/learn/${freeLearn}/`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              Start reading — free
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-sm transition-colors hover:border-line-strong hover:bg-surface"
            >
              <Linkedin aria-hidden className="size-4" />
              Request full access
            </a>
            <EmailAccessButton subject="Access request — Full library" />
          </div>

          <p className="mt-5 font-mono text-xs text-subtle">
            {access.freeCount} topics open to read now · no sign-up
          </p>
        </div>
      </section>

      {/* ---- What is inside --------------------------------------------- */}
      <section className="border-b border-line">
        <div className="container-page py-16 md:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            What is in here
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY.map((item) => (
              <div
                key={item.label}
                className="group relative bg-bg p-6 transition-colors hover:bg-bg-subtle"
              >
                <item.icon aria-hidden className="size-5 text-accent" />
                <p className="mt-4 font-display text-3xl font-semibold tabular-nums">{item.count}</p>
                <p className="mt-1 text-sm font-medium text-fg">
                  <Link href={item.href} className="after:absolute after:inset-0">
                    {item.label}
                  </Link>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- See it in action --------------------------------------------- */}
      <section className="border-b border-line">
        <div className="container-page py-16 md:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Not just prose
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            A simulator that responds to real properties, a diagram of the exact path each one
            takes through the stack, and a reference you can actually search.
          </p>

          <div className="mt-12 space-y-16 md:space-y-20">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.href}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : undefined}>
                  <Link href={feature.href} className="block">
                    <Image
                      src={feature.src}
                      alt={feature.alt}
                      width={feature.width}
                      height={feature.height}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="h-auto w-full rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] transition-opacity hover:opacity-90"
                    />
                  </Link>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : undefined}>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">{feature.description}</p>
                  <Link
                    href={feature.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
                  >
                    {feature.cta}
                    <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Free and full ---------------------------------------------- */}
      <section className="border-b border-line bg-bg-subtle">
        <div className="container-page py-16 md:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Read some of it now, the rest on request
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            The open topics are whole topics, not previews that stop at the interesting part. Read
            them, decide whether the rest is worth having, then ask.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-fg">
                <Check aria-hidden className="size-4 text-accent" />
                Open to everyone
              </p>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                <li>{access.freeCount} complete topics across Learn AAOS, SDV and the tutorials</li>
                <li>Every blog post</li>
                <li>Search across titles and summaries</li>
                <li>Read-aloud on every page, with neural voices</li>
              </ul>
              <Link
                href="/learn/start/"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
              >
                See where to start
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            </div>

            <div className="card border-accent/40 p-6">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-fg">
                <Lock aria-hidden className="size-4 text-accent" />
                Full access
              </p>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                <li>All 93 Learn AAOS topics and all 40 SDV topics</li>
                <li>The complete vehicle property reference, all 280 of them</li>
                <li>
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge aria-hidden className="size-3.5" />
                    The property simulator and
                    <MonitorSmartphone aria-hidden className="size-3.5" />
                    the cockpit &amp; display tool
                  </span>
                </li>
                <li>The glossary, and every tutorial</li>
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-subtle">
                Learn AAOS and the SDV track have separate keys, so you can take one without the
                other.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
                >
                  <Linkedin aria-hidden className="size-4" />
                  Ask on LinkedIn
                </a>
                <EmailAccessButton subject="Access request — Full library" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Who it is for ---------------------------------------------- */}
      <section className="border-b border-line">
        <div className="container-page py-16 md:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Written for
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {AUDIENCE.map((line) => (
              <li key={line} className="flex gap-3 rounded-lg border border-line bg-surface p-5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-muted">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
