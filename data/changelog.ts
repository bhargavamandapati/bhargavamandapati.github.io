/**
 * The site's changelog — every shipped release, newest first.
 *
 * One entry per calendar day a change actually deployed. Add a new entry at
 * the top of `changelog` whenever content is added or an issue is fixed —
 * that is the entire point of this file existing.
 */

export type ChangeType = 'added' | 'changed' | 'fixed' | 'security'

export type Change = {
  type: ChangeType
  text: string
}

export type ChangelogEntry = {
  /** "2026.09.12" — the release's own version, not a date format elsewhere on the site. */
  version: string
  /** ISO date, for sorting and display. */
  date: string
  title: string
  changes: Change[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: '2026.09.12',
    date: '2026-09-12',
    title: 'Private content, an installable app, and two security fixes',
    changes: [
      { type: 'changed', text: 'Moved every paywalled article’s source into a private repository — it no longer sits in this public repo’s history regardless of the paywall.' },
      { type: 'added', text: 'The site is now installable as an app, and keeps working offline for pages you’ve already visited.' },
      { type: 'added', text: 'An Android app build, wrapping the site as a Trusted Web Activity.' },
      { type: 'security', text: 'Fixed a paywall bypass: the glossary page’s structured data was exposing every locked term’s definition regardless of access.' },
      { type: 'fixed', text: 'Locked vehicle-property pages were showing their summary before a reader had unlocked them.' },
      { type: 'added', text: 'A branded error page, in place of the framework’s generic one.' },
      { type: 'fixed', text: 'Copy protection extended to the glossary and a tutorial section that had none.' },
      { type: 'fixed', text: 'A glossary notice that kept telling readers they needed a key after they had already unlocked it.' },
      { type: 'added', text: 'Four new Learn AAOS topics: eSIM provisioning, CAN bus security, the UDS diagnostic protocol underneath OBD-II, and flashing/OTA testing in CI.' },
      { type: 'fixed', text: 'Content categories are now checked against the curriculum at build time — a mismatch fails the build instead of silently vanishing.' },
      { type: 'changed', text: 'Renamed two curriculum categories that were too easy to confuse with similarly-named parts of the site, and cross-linked both pairs.' },
      { type: 'added', text: 'The SDV section now has the same sub-navigation Learn AAOS has, instead of one flat link.' },
      { type: 'added', text: 'Articles can now show when they were last updated.' },
      { type: 'added', text: 'This changelog.' },
    ],
  },
  {
    version: '2026.09.11',
    date: '2026-09-11',
    title: 'SEO fixes, and 20 new tutorials and articles',
    changes: [
      { type: 'added', text: '11 new tutorials and 2 new Learn AAOS articles, from a full field-notes analysis pass.' },
      { type: 'changed', text: 'Enriched 37 existing articles with additional field-notes findings.' },
      { type: 'security', text: 'Fixed the site’s biggest SEO risk: paywalled pages were indexable as thin content.' },
      { type: 'changed', text: 'Removed the GitHub profile link — the public repo’s history could otherwise expose paywalled content.' },
      { type: 'changed', text: 'Homepage stats are now computed from the actual content instead of hardcoded.' },
      { type: 'fixed', text: 'Closed legal-readiness gaps found in a subscription-terms audit.' },
    ],
  },
  {
    version: '2026.09.10',
    date: '2026-09-10',
    title: 'Safety disclosures',
    changes: [
      { type: 'changed', text: 'Added safety context and content disclosures to hardware-modification tutorials.' },
    ],
  },
  {
    version: '2026.09.09',
    date: '2026-09-09',
    title: 'Learn AAOS expands to 89 topics',
    changes: [
      { type: 'added', text: '11 new Learn AAOS topics (78 → 89), woven into the guided learning paths.' },
      { type: 'added', text: '24 more vehicle properties wired into the property simulator.' },
      { type: 'added', text: 'A get/set architecture-flow diagram, rolled out across all 264 public-API properties.' },
      { type: 'added', text: 'Real screenshots on the homepage, not just stats.' },
      { type: 'fixed', text: 'The Java/Kotlin code toggle on unlocked vehicle properties.' },
      { type: 'fixed', text: 'Technical errors, broken navigation and content gaps across the curriculum.' },
      { type: 'changed', text: 'Redesigned the simulator’s controls panel around finding a property fast.' },
      { type: 'changed', text: 'Scoped the content licence away from the premium tracks.' },
    ],
  },
  {
    version: '2026.08.30',
    date: '2026-08-30',
    title: 'First posts, image watermarking',
    changes: [
      { type: 'added', text: 'The first four blog posts — Android Automotive vs. Android Auto, VHAL, AAOS as open source, and the hidden Android system service.' },
      { type: 'added', text: 'Automatic watermarking of uploaded images at build time.' },
      { type: 'fixed', text: 'Cover images not updating when replaced — added cache-busting fingerprints.' },
      { type: 'changed', text: 'Extended the copy deterrent to images and post titles.' },
      { type: 'fixed', text: 'Post filenames restricted to plain ASCII, to stop broken links.' },
    ],
  },
  {
    version: '2026.09.08',
    date: '2026-09-08',
    title: 'The premium access system',
    changes: [
      { type: 'added', text: 'A two-tier premium system — a free trial’s worth of content open to everyone, the rest encrypted until unlocked.' },
      { type: 'added', text: 'A global unlock control in the header, reachable from any page.' },
      { type: 'changed', text: 'Rebuilt the home page around Learn AAOS as the main destination.' },
      { type: 'fixed', text: 'A “Request access” button that was effectively invisible; added an email option alongside LinkedIn.' },
      { type: 'fixed', text: 'Lock badges and disabled rows not clearing once a reader actually held a valid key.' },
    ],
  },
  {
    version: '2026.08.29',
    date: '2026-08-29',
    title: 'Launch: interactive tools, search and the writing pipeline',
    changes: [
      { type: 'added', text: 'An interactive 3D vehicle property simulator, with inside and outside views.' },
      { type: 'added', text: 'A cockpit zones and multi-display simulator.' },
      { type: 'added', text: 'Site-wide search.' },
      { type: 'added', text: 'Guided learning paths with on-device progress tracking.' },
      { type: 'added', text: 'A read-aloud player for every article, tutorial and post, using the browser’s own neural voices.' },
      { type: 'changed', text: 'Reorganized the CV under /about/ and dropped former-employer names.' },
      { type: 'security', text: 'Added a deterrent against copying written material — code and property data stay freely copyable.' },
      { type: 'changed', text: 'Licensed the code and writing explicitly, with AOSP material properly attributed.' },
    ],
  },
]
