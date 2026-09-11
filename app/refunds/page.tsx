import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EmailAccessButton } from '@/components/premium/email-access-button'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'What happens if you cancel recurring access, and when a refund is or isn’t available.',
  alternates: { canonical: '/refunds/' },
}

export default function RefundsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Refund & Cancellation Policy"
        description="Last updated 11 September 2026. Read this before you pay for a key — it explains what you're agreeing to."
      />

      <div className="container-page py-14 md:py-16">
        <div className="prose-bm max-w-3xl">
          <h2>Digital content, delivered immediately</h2>
          <p>
            Unlocking a topic gives you the full content straight away — there&rsquo;s
            nothing to ship and nothing partial about what you receive. Because of that,{' '}
            <strong>purchases are final once an access key has been issued to you or
            content has been unlocked</strong>, except in the cases below.
          </p>

          <h2>When a refund is available</h2>
          <ul>
            <li>You were charged more than once for the same purchase.</li>
            <li>You paid but never received a working access key, and we couldn&rsquo;t fix that.</li>
            <li>A charge on your account wasn&rsquo;t authorised by you.</li>
          </ul>
          <p>
            If one of these applies, contact us and we&rsquo;ll refund the charge — approved
            refunds are processed within 10 business days of confirmation, back to your
            original payment method. Outside of these cases, we don&rsquo;t offer refunds
            for change of mind or because the material wasn&rsquo;t what you expected — the
            free trial topics in each track exist specifically so you can judge that before
            paying.
          </p>

          <h2>If you&rsquo;re in the EU or UK</h2>
          <p>
            Consumer law there normally gives you 14 days to withdraw from an online
            purchase. Because this is digital content delivered to you immediately on
            payment, by completing a purchase you expressly ask for immediate access and
            acknowledge that you lose that 14-day withdrawal right once the content has
            been provided, in line with Article 16(m) of EU Directive 2011/83/EU (and the
            equivalent UK implementation). This is confirmed again at checkout before you
            pay — it isn&rsquo;t buried only here.
          </p>

          <h2>Cancelling a recurring plan</h2>
          <p>
            You can cancel future renewals at any time by contacting us — see below. We&rsquo;ll
            confirm by reply within 5 business days. Cancelling stops the <em>next</em>{' '}
            charge; it doesn&rsquo;t refund the period you&rsquo;ve already paid for and
            already have access to, consistent with the &ldquo;no refunds once
            unlocked&rdquo; rule above. Once self-service billing management exists on the
            site, cancelling will move there instead of requiring an email.
          </p>

          <h2>How to request a refund or cancel</h2>
          <p>Contact us with your payment details and what happened, and we&rsquo;ll sort it out.</p>
          <EmailAccessButton subject="Refund or cancellation request" label="Email us" variant="secondary" />
        </div>
      </div>
    </>
  )
}
