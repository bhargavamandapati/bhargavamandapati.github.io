import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EmailAccessButton } from '@/components/premium/email-access-button'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply to reading this site and to buying access to premium material.',
  alternates: { canonical: '/terms/' },
}

/**
 * Kept deliberately short and specific to what this site actually does —
 * free articles, a two-realm access-key system, and (once billing exists)
 * paid access to the rest. Re-read this alongside LICENSE-CONTENT and
 * /licence/, which it defers to rather than repeats.
 */
export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated 11 September 2026. These terms apply whenever you read this site or request access to a locked topic."
      />

      <div className="container-page py-14 md:py-16">
        <div className="prose-bm max-w-3xl">
          <h2>Who you&rsquo;re dealing with</h2>
          <p>
            This site is operated by Bhargava Mandapati, an individual based in India, as a
            personal project. There is no separate company behind it. &ldquo;We,&rdquo;
            &ldquo;us&rdquo; and &ldquo;the site&rdquo; below mean the same thing as
            &ldquo;I&rdquo; and &ldquo;me.&rdquo; That&rsquo;s a deliberate choice rather
            than an oversight: at this site&rsquo;s current size it&rsquo;s simpler to run
            as an individual than behind a separate legal entity, and it means I&rsquo;m
            personally responsible for it — there&rsquo;s no corporate shield between you
            and me.
          </p>

          <h2>Eligibility</h2>
          <p>
            To request or pay for an access key you need to be able to enter into a binding
            contract where you live — generally 18, or the age of majority in your
            jurisdiction if that&rsquo;s different. If you&rsquo;re younger than that, a
            parent or legal guardian needs to make the purchase and accept these terms on
            your behalf. Reading the free material doesn&rsquo;t require this, but see the{' '}
            <a href="/privacy/">Privacy Policy</a> for how the site treats visitors who are
            children.
          </p>
          <p>
            Access keys aren&rsquo;t offered to anyone located in, or ordinarily resident
            in, a country or region subject to comprehensive trade sanctions administered
            by the United Nations, the European Union, the United Kingdom or the United
            States (including OFAC-administered programmes), or to anyone on a
            restricted-party list maintained by those authorities. Requesting or paying for
            a key is your confirmation that neither applies to you.
          </p>

          <h2>What&rsquo;s free and what&rsquo;s locked</h2>
          <p>
            The blog and a handful of trial topics in each track are open to everyone. The
            rest of Learn AAOS, SDV, the tutorials and the glossary is locked behind a
            per-track access key, requested by contacting us. What each licence covers is
            set out in full on the{' '}
            <a href="/licence/">licence and attribution page</a>; these Terms cover the
            contract around getting and using a key, not the copyright position itself.
          </p>
          <p>
            The vehicle property reference is a partial exception to the &ldquo;locked
            means personal and non-redistributable&rdquo; rule below. The underlying
            property descriptions are Android Open Source Project material under the
            Apache License 2.0, and that licence isn&rsquo;t mine to narrow — see{' '}
            <a href="/licence/">the licence page</a> for exactly what it covers. A key is
            still required to unlock those pages, the same as anything else in Learn AAOS,
            but doing so doesn&rsquo;t convert that specific AOSP-derived text into
            personal, non-transferable, no-redistribution premium material. Everything
            else on those pages — the surrounding prose, diagrams, code samples and the
            simulator — is original to this site and is ordinary premium material like the
            rest of this section.
          </p>

          <h2>Access keys</h2>
          <ul>
            <li>A key is issued to you personally and is not transferable. Don&rsquo;t share, sell, publish or post it.</li>
            <li>Using a key to read locked material doesn&rsquo;t give you, or anyone you share it with, any right to copy, redistribute or republish that material — see <a href="/licence/">the licence page</a>.</li>
            <li>We may revoke and reissue a track&rsquo;s key if it&rsquo;s shared or misused. Because both realms currently use one key per track rather than individual accounts, revoking a key affects everyone holding it — if that happens because of misuse by one person, we&rsquo;ll do our best to get a fresh key to everyone else who legitimately holds one.</li>
          </ul>

          <h2>Payment, pricing and taxes</h2>
          <p>
            Where a fee applies, the price and billing frequency are shown before you pay.
            Payment is handled by a third-party payment processor; we don&rsquo;t receive or
            store your full card details. Prices may be shown exclusive of tax where
            applicable, and any tax we&rsquo;re required to collect will be added at
            checkout.
          </p>

          <h2>Cancelling recurring access</h2>
          <p>
            If you&rsquo;re on a recurring plan, you can cancel at any time before your next
            renewal by contacting us — see below. We&rsquo;ll confirm the cancellation by
            reply within 5 business days and no further charge will be taken. Cancelling
            stops future charges; it doesn&rsquo;t retroactively refund the current period
            except as described in the <a href="/refunds/">Refund &amp; Cancellation
            Policy</a>.
          </p>

          <h2>Refunds</h2>
          <p>
            See the <a href="/refunds/">Refund &amp; Cancellation Policy</a> for the full
            terms. In short: because unlocking a topic delivers the full content
            immediately, purchases are final once a key has been issued or content has
            been unlocked, other than for billing errors or non-delivery, and an approved
            refund is processed within 10 business days.
          </p>

          <h2>Acceptable use</h2>
          <ul>
            <li>Don&rsquo;t attempt to bypass, brute-force or scrape the access-key system.</li>
            <li>Don&rsquo;t resell, sublicense or redistribute access or content.</li>
            <li>Don&rsquo;t use the site in a way that disrupts it for other readers.</li>
          </ul>

          <h2>No professional advice</h2>
          <p>
            Everything here — articles, tutorials, the simulator, the property reference —
            is written for learning and reference. It is not professional engineering,
            safety or legal advice, and it is not a substitute for your own vehicle
            OEM&rsquo;s or Tier-1 supplier&rsquo;s current documentation, functional-safety
            process, or sign-off. Tutorials that involve building, flashing or modifying
            software are written against emulators and development hardware; applying
            them to a production vehicle&rsquo;s safety-critical systems is your
            responsibility and should only be done through your organisation&rsquo;s
            proper engineering and safety processes, never on public roads.
          </p>

          <h2>Disclaimer and liability</h2>
          <p>
            The material is provided &ldquo;as is,&rdquo; without warranty of accuracy,
            completeness or fitness for a particular purpose, to the fullest extent the
            law allows. To the fullest extent the law allows, we&rsquo;re not liable for
            any loss or damage arising from your use of the site or its content. Nothing
            here limits liability that can&rsquo;t be limited by law, including for fraud
            or for death or personal injury caused by negligence.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms as the site changes — for example, once real
            subscription billing exists, this page will be updated to describe it
            precisely. Continuing to use the site after an update means you accept the
            revised terms; material changes affecting anyone with an active paid key will
            be pointed out, not just silently changed.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India, and any dispute is subject to
            the exclusive jurisdiction of the courts of India, without regard to conflict
            of law principles. This doesn&rsquo;t remove any mandatory consumer protection
            you&rsquo;re entitled to under the law of the country you live in.
          </p>

          <h2>Contact</h2>
          <p>Questions about these terms, or about a purchase: get in touch below.</p>
          <EmailAccessButton subject="Legal enquiry" label="Email us" variant="secondary" />
        </div>
      </div>
    </>
  )
}
