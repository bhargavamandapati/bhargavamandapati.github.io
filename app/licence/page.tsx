import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Licence and attribution',
  description:
    'How the code, the free and premium written material, and the AOSP-derived vehicle property reference on this site are licensed, and how to reuse them.',
  alternates: { canonical: '/licence/' },
}

/**
 * The site distributes material derived from AOSP, so the Apache 2.0
 * attribution has to be reachable from the site itself — a NOTICE file in the
 * repository only covers people who read the repository.
 */
export default function LicencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Licence"
        title="Licence and attribution"
        description="Four different things live on this site, under four different terms. This page says which is which."
      />

      <div className="container-page py-14 md:py-16">
        <div className="prose-bm max-w-3xl">
          <h2>The source code</h2>
          <p>
            The React components, TypeScript modules, build scripts and styles behind this
            site are under the <strong>MIT License</strong>. Take them, change them, ship
            them — commercially or otherwise. The full text is in{' '}
            <a
              href="https://github.com/bhargavamandapati/bhargavamandapati.github.io/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
            >
              LICENSE
            </a>
            .
          </p>

          <h2>The free written material</h2>
          <p>
            The blog, and the handful of trial topics marked free in each track (three in
            Learn AAOS, one in SDV, one tutorial, plus a few glossary terms and vehicle
            properties), are under{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-NC-ND 4.0
            </a>
            . Share it freely with credit and a link; don&rsquo;t sell it, and don&rsquo;t
            publish modified versions.
          </p>
          <p>
            Parts of this material were drafted with the assistance of a large language
            model and then selected, ordered and edited. In several jurisdictions, work
            generated without sufficient human authorship may not attract copyright at
            all. The licence is asserted over what is protectable — principally the
            selection, arrangement and editorial structure — and offered in good faith
            rather than as a claim over every sentence.
          </p>

          <h2>The premium material</h2>
          <p>
            Everything else under Learn AAOS, SDV, the tutorials and the glossary sits
            behind an access key, and is <strong>not</strong> covered by the CC licence
            above — reading it under a key doesn&rsquo;t make it free-licensed material.
            Holding a key gives you a personal, non-transferable right to read it for your
            own learning. It doesn&rsquo;t give you, or anyone you might share the key
            with, a right to copy, republish, redistribute or post it elsewhere, in whole
            or in part. These terms apply from the moment you request a key, and they sit
            alongside the site&rsquo;s Terms of Service.
          </p>
          <p>
            The full text of both the free-material licence and the premium terms is in{' '}
            <a
              href="https://github.com/bhargavamandapati/bhargavamandapati.github.io/blob/main/LICENSE-CONTENT"
              target="_blank"
              rel="noopener noreferrer"
            >
              LICENSE-CONTENT
            </a>
            .
          </p>

          <h2>The vehicle property reference</h2>
          <p>
            The property pages are a different case, and the terms are not mine to set.
            They are derived from the{' '}
            <strong>Android Open Source Project</strong>, and the descriptions are
            reproduced substantially verbatim from the Javadoc in these files:
          </p>
          <ul>
            <li>
              <code>VehicleProperty.aidl</code> and the enum definitions beside it, from{' '}
              <code>platform/hardware/interfaces</code>
            </li>
            <li>
              <code>VehiclePropertyIds.java</code> and <code>Car.java</code>, from{' '}
              <code>platform/packages/services/Car</code>
            </li>
          </ul>
          <p>
            That material is{' '}
            <strong>Copyright &copy; The Android Open Source Project</strong>, licensed
            under the{' '}
            <a
              href="https://www.apache.org/licenses/LICENSE-2.0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache License 2.0
            </a>{' '}
            (
            <a href="/licenses/APACHE-2.0.txt" target="_blank" rel="noopener noreferrer">
              full text, served from this site
            </a>
            ), and it stays under that licence here. It is not relicensed, and the terms
            above do not apply to it.
          </p>
          <p>
            It has been changed: extracted from Java and AIDL into structured data,
            reformatted for the web, property identifiers resolved into decimal and
            hexadecimal, and annotated with relationships between properties — such as
            HVAC features being gated on <code>HVAC_POWER_ON</code> — that are not present
            as structured data upstream. The explanatory prose, diagrams, code samples and
            simulations around it are original to this site.
          </p>
          <p>
            The Android Open Source Project does not endorse this site.
            &ldquo;Android&rdquo; is a trademark of Google LLC; this site is not
            affiliated with or endorsed by Google.
          </p>

          <h2>Facts are not owned by anyone</h2>
          <p>
            Property identifiers, area types, enum constants and permission names are
            facts. They are not subject to copyright by me, by Google, or by anyone else,
            and nothing above should be read as claiming otherwise.
          </p>
        </div>
      </div>
    </>
  )
}
