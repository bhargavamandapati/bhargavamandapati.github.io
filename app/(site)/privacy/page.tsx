import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EmailAccessButton } from '@/components/premium/email-access-button'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What this site collects today, what changes once paid access launches, and how to reach us about your data.',
  alternates: { canonical: '/privacy/' },
}

/**
 * Written to match reality rather than a generic template: this site
 * currently collects nothing on its own (no analytics, no accounts, no
 * cookies). That's called out explicitly, alongside what changes the day a
 * payment processor is added, so the policy doesn't quietly go stale.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated 9 September 2026. Applies to bhargavamandapati.com and everything under it."
      />

      <div className="container-page py-14 md:py-16">
        <div className="prose-bm max-w-3xl">
          <h2>The short version</h2>
          <p>
            Today, this site collects nothing about you on its own. There are no accounts,
            no analytics, no advertising trackers and no cookies. The only thing stored in
            your browser is your access key, if you have one, kept in your browser&rsquo;s
            local storage on your device — it is never sent to us or to anyone else.
          </p>

          <h2>If you contact us</h2>
          <p>
            Requesting an access key, or otherwise getting in touch, happens by email or
            LinkedIn message — outside this site, through your own email provider or
            LinkedIn. We keep that correspondence (e.g., your email address and message)
            for as long as needed to respond to you and to keep a record of who holds a
            key to which track. We don&rsquo;t use it for anything else, and we don&rsquo;t
            share it with third parties except as described below.
          </p>

          <h2>What changes once paid access launches</h2>
          <p>
            When we add real payment processing, this policy will be updated before that
            happens, and it will at minimum cover:
          </p>
          <ul>
            <li>
              Billing information (name, email, payment details) handled by our
              third-party payment processor — we don&rsquo;t see or store your full card
              details ourselves.
            </li>
            <li>
              Any cookies or analytics the payment flow itself requires, disclosed with a
              consent mechanism before they load for visitors where that&rsquo;s legally
              required.
            </li>
            <li>Basic account information needed to track who holds paid access to what.</li>
          </ul>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, or
            request deletion of personal data we hold about you — for example under
            India&rsquo;s Digital Personal Data Protection Act 2023, the EU/UK GDPR, or
            California&rsquo;s CCPA/CPRA. To exercise any of these, contact us using the details
            below; we&rsquo;ll respond within a reasonable time and confirm what we hold and
            what, if anything, we can delete.
          </p>

          <h2>International visitors</h2>
          <p>
            This site is operated from India and read worldwide. If we use a
            payment processor or other service based outside your country, your
            information may be processed there, subject to that provider&rsquo;s own
            safeguards and privacy terms.
          </p>

          <h2>Children</h2>
          <p>This site isn&rsquo;t directed at children, and we don&rsquo;t knowingly collect information from anyone under 13.</p>

          <h2>Changes to this policy</h2>
          <p>
            We&rsquo;ll update this page as what the site actually does changes — most
            notably the day payment processing is added — rather than leave it describing
            a version of the site that no longer exists.
          </p>

          <h2>Contact</h2>
          <p>Questions about this policy, or a request about your data: get in touch below.</p>
          <EmailAccessButton subject="Privacy enquiry" label="Email us" variant="secondary" />
        </div>
      </div>
    </>
  )
}
