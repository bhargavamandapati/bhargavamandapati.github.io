import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  BrainCircuit,
  Car,
  Check,
  Gauge,
  Layers,
  Lock,
  MonitorSmartphone,
  Search,
  Sigma,
  Sparkles,
  FlaskConical,
} from 'lucide-react'
import { FREE_TOPICS, access } from '@/data/access'
import { RequestAccessButton } from '@/components/premium/request-access'
import { getAllTopics } from '@/lib/learn'
import { getAllSdvTopics } from '@/lib/sdv'
import { getAllAiMlTopics } from '@/lib/ai-ml'
import { aiMlModules } from '@/data/ai-ml-curriculum'
import { widgetLoaders } from '@/components/ai-ml/widgets/registry'
import { getAllTutorials } from '@/lib/tutorials'
import { vehicleProperties } from '@/lib/vehicle-properties'
import { glossary } from '@/data/glossary'

/**
 * The home page.
 *
 * It used to open with a résumé, which answered a question nobody had arrived
 * with. What the site is now is a body of work about Android Automotive, so the
 * page leads with that: what is inside, what is readable immediately, and how
 * to reach the rest.
 */

/** Counts that drive the stats grid, the feature copy and the "full access" list — computed from the actual content so this page can't go stale when a topic is added. */
function buildLibraryCounts() {
  return {
    learn: getAllTopics().length,
    sdv: getAllSdvTopics().length,
    aiml: getAllAiMlTopics().length,
    widgets: Object.keys(widgetLoaders).length,
    properties: vehicleProperties.length,
    inCarApiProperties: vehicleProperties.filter((p) => p.javaLine !== undefined).length,
    tutorials: getAllTutorials().length,
    glossary: glossary.length,
  }
}

function buildLibrary(counts: ReturnType<typeof buildLibraryCounts>) {
  return [
    { icon: BookOpen, count: String(counts.learn), label: 'Learn AAOS topics', note: 'Foundations to homologation, in reading order.', href: '/learn/' },
    { icon: Layers, count: String(counts.sdv), label: 'SDV topics', note: 'Service-oriented architecture, data, cloud and cluster.', href: '/sdv/' },
    { icon: Car, count: String(counts.properties), label: 'Vehicle properties', note: 'Every property, its enums, permissions and dependencies.', href: '/learn/vehicle-properties/' },
    { icon: Boxes, count: String(counts.tutorials), label: 'Tutorials', note: 'Build a boot animation, an RRO, a system app.', href: '/tutorials/' },
    { icon: Gauge, count: '2', label: 'Live simulators', note: 'Change a property and watch the car respond.', href: '/learn/vehicle-simulator/' },
    { icon: BrainCircuit, count: String(counts.aiml), label: 'AI & ML topics', note: 'From the maths to LLMs, with code and projects.', href: '/ai-ml/' },
    { icon: Sparkles, count: String(counts.widgets), label: 'Interactive diagrams', note: 'Drag, tweak and watch gradient descent, matrices and neurons move.', href: '/ai-ml/' },
    { icon: Search, count: String(counts.glossary), label: 'Glossary terms', note: 'The vocabulary, defined without assuming you know it.', href: '/glossary/' },
  ]
}

function buildFeatures(counts: ReturnType<typeof buildLibraryCounts>) {
  return [
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
      description: `${counts.inCarApiProperties} reference pages carry a diagram like this one — the exact classes and Binder crossings a value passes through, get and set, generated from the real AIDL rather than drawn from memory.`,
      cta: 'See the full trace',
      href: '/learn/vehicle-properties/hvac-temperature-set/',
    },
    {
      src: '/images/screenshots/property-browser.png',
      width: 1700,
      height: 874,
      alt: 'The vehicle property reference, searched for "hvac": facets for category, area type, value type, access and change mode, above a filtered list of matching properties.',
      eyebrow: 'Searchable reference',
      title: `${counts.properties} vehicle properties, not a PDF of them`,
      description:
        'Filter by category, area, value type, access or change mode, and jump straight to the AOSP source for any of them.',
      cta: 'Browse the reference',
      href: '/learn/vehicle-properties/',
    },
  ]
}

const AUDIENCE = [
  'Android developers moving into automotive, who keep hitting words nobody defines.',
  'Embedded engineers meeting AOSP for the first time, from the HAL upwards.',
  'Platform teams onboarding people onto a programme already in flight.',
  'Anyone preparing for an AAOS interview and tired of guessing what matters.',
]

export function Landing() {
  const freeLearn = FREE_TOPICS.learn[0]
  const counts = buildLibraryCounts()
  const LIBRARY = buildLibrary(counts)
  const FEATURES = buildFeatures(counts)

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
            Android Automotive · AOSP · Software-defined vehicles · AI &amp; ML
          </p>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            The Android Automotive material I wanted when I started.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
            A decade of platform work, written down properly: how AAOS actually fits together,
            what the vehicle HAL really is, and why the thing you are debugging behaves the way
            it does. Not API docs, and not a blog — the explanation underneath both.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            And now a second body of work: a full AI and machine learning curriculum, from the
            mathematics up to large language models, with code, interactive diagrams and
            hands-on projects.{' '}
            <Link href="/ai-ml/" className="text-accent underline-offset-4 hover:underline">
              See AI &amp; ML
            </Link>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/learn/${freeLearn}/`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              Start reading — free
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <RequestAccessButton
              label="Request full access"
              variant="secondary"
              className="px-5 py-2.5"
              context="Homepage hero"
            />
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
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
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
                <li>{access.freeCount} complete topics across Learn AAOS, SDV, AI &amp; ML and the tutorials</li>
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
                <li>
                  All {counts.learn} Learn AAOS topics and all {counts.sdv} SDV topics
                </li>
                <li>The complete vehicle property reference, all {counts.properties} of them</li>
                <li>
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge aria-hidden className="size-3.5" />
                    The property simulator and
                    <MonitorSmartphone aria-hidden className="size-3.5" />
                    the cockpit &amp; display tool
                  </span>
                </li>
                <li>
                  All {counts.aiml} AI &amp; ML topics so far, with more added every hour
                </li>
                <li>The glossary, and every tutorial</li>
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-subtle">
                Learn AAOS, SDV and AI &amp; ML each have their own key, so you can take one
                without the others.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <RequestAccessButton
                  label="Request access"
                  defaultTopics={['learn', 'sdv', 'aiml']}
                  context="Full library"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- AI & ML ------------------------------------------------------ */}
      <section className="border-b border-line">
        <div className="container-page py-16 md:py-20">
          <div className="card border-accent/40 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2">
                <BrainCircuit aria-hidden className="size-5 text-accent" />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
                  The third track · growing every hour
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight md:text-2xl">
                  AI &amp; ML, from the maths to LLMs
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  Not a tour of buzzwords. The mathematics comes first and is taught slowly, with
                  pictures and code, so that backpropagation, attention and diffusion are things
                  you can derive rather than things you have heard of. Then classical machine
                  learning, deep learning, vision, language, large language models, RAG and agents,
                  each with runnable examples built on open-source tools.
                </p>
              </div>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              <li className="rounded-lg border border-line bg-surface p-4">
                <Sigma aria-hidden className="size-4 text-accent" />
                <p className="mt-3 text-sm font-medium text-fg">Maths for machine learning</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">
                  Linear algebra, calculus, probability and optimisation, each tied to the model
                  that needs it.
                </p>
              </li>
              <li className="rounded-lg border border-line bg-surface p-4">
                <Sparkles aria-hidden className="size-4 text-accent" />
                <p className="mt-3 text-sm font-medium text-fg">Interactive diagrams</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">
                  Drag a matrix, step gradient descent, move a decision boundary. Hard ideas
                  you can poke at.
                </p>
              </li>
              <li className="rounded-lg border border-line bg-surface p-4">
                <FlaskConical aria-hidden className="size-4 text-accent" />
                <p className="mt-3 text-sm font-medium text-fg">Projects you can run</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">
                  A local chatbot, image recognition, training and fine-tuning models, RAG over
                  your own documents, prompt engineering.
                </p>
              </li>
            </ul>

            <p className="mt-6 font-mono text-xs text-subtle">
              {counts.aiml} topics published · {aiMlModules.length} modules planned · its own key,
              separate from Learn AAOS and SDV
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/ai-ml/"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
              >
                Explore AI &amp; ML
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
              <RequestAccessButton
                label="Request access"
                variant="secondary"
                defaultTopics={['aiml']}
                context="AI & ML"
              />
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
