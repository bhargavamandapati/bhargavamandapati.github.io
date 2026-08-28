# Bhargava Mandapati — Portfolio & Engineering Blog

Personal site and technical blog for an Android Automotive / AOSP engineer.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and MDX, exported
as a fully static site and deployed to GitHub Pages.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. Draft posts are visible here. |
| `npm run build` | Static export to `out/`. Drafts are excluded. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | `tsc --noEmit`. |

> **Node 20+ is required.** This machine uses nvm — run `nvm use --lts` first if
> `node` is not on your PATH.

---

## Writing a blog post

Create a file in `content/blog/`. The filename becomes the URL:
`content/blog/my-post.mdx` → `/blog/my-post/`.

```mdx
---
title: "Writing a Custom VHAL for Android Automotive"
description: "One or two sentences. Used for SEO, the card, and social previews."
date: "2026-08-12"          # YYYY-MM-DD — controls ordering
tags: ["AAOS", "VHAL"]      # tag pages are generated automatically
featured: true              # optional
draft: false                # true = dev only, never published
updated: "2026-08-20"       # optional
canonical: "https://medium.com/@bhargavamandapati/..."  # optional, see below
---

## A heading

Regular markdown, plus GitHub-flavoured tables, task lists and footnotes.
```

Everything else is derived for you: reading time, word count, table of contents,
tag pages, RSS entry, sitemap entry, JSON-LD `BlogPosting`, previous/next links.

### Available in MDX

**Fenced code** with a filename caption and highlighting:

````mdx
```kotlin title="VendorProperties.kt"
const val SEAT_MASSAGE_INTENSITY = 0x2000_0000
```
````

Add `{1,3-5}` after the language to highlight lines.

**Callouts** — `note` (default), `tip`, `warning`:

```mdx
<Callout type="warning" title="Area IDs are not seat numbers">
An area ID is a bitmask, not an index.
</Callout>
```

**Images** go in `public/images/` and are referenced as `/images/name.png`.

### Cross-posting to Medium

If a post appears on Medium first, set `canonical` to the Medium URL. The page then
emits `<link rel="canonical">` pointing there, so search engines credit the original
instead of treating your own site as duplicate content. The post also renders a
small "Originally published on Medium" note.

---

## The Learn AAOS hub

`/learn` is a 62-topic curriculum on Android Automotive development, organised
into fifteen modules. Content lives in `content/learn/<module>/<topic>.mdx`.

| Module | Topics |
| --- | --- |
| Foundations | 5 |
| Vehicle Data & VHAL | 8 |
| Car Service & Framework | 7 |
| HMI, System UI & UX | 6 |
| Apps & Media | 5 |
| Cluster, Camera & Displays | 4 |
| Audio | 3 |
| Connectivity & Telephony | 3 |
| Power, Boot & Lifecycle | 2 |
| Performance & Optimisation | 3 |
| Security & Hardening | 4 |
| Quality, Compliance & Safety | 4 |
| SDV & Standards | 2 |
| Platform Build & Release | 4 |
| Testing & Debugging | 2 |

```mdx
---
title: "Adding a vendor property end to end"
description: "Shown on the hub card and used for SEO."
order: 3                     # position within the module
difficulty: "Advanced"       # Beginner | Intermediate | Advanced
tags: ["VHAL", "SEPolicy"]
sources:                     # rendered as the References block at the foot
  - label: "Vehicle properties configuration"
    href: "https://source.android.com/docs/automotive/vhal/property-configuration"
---
```

Modules and their order are defined in `data/curriculum.ts`. Adding a topic means
adding one `.mdx` file in the right folder — the hub index, sidebar, prev/next
links, sitemap and JSON-LD all follow automatically.

### Linking into AOSP

Four components are available in any learn or blog MDX file:

```mdx
<Src path="packages/services/Car/car-lib/src/android/car/VehiclePropertyIds.java" />
<Src path="hardware/interfaces/automotive/vehicle" line={120} label="IVehicle" />
<Sym name="CarPropertyManager" />          {/* Code Search symbol index */}
<Find q="VehiclePropertyGroup.VENDOR" />   {/* free-text Code Search */}
<Doc p="automotive/vhal">the VHAL docs</Doc>  {/* source.android.com */}
```

`<Src>` supports a `line` prop, but the content deliberately uses file- and
symbol-level links almost everywhere: **AOSP line numbers drift with every
revision**, so a pinned line silently points at the wrong code within months,
whereas a symbol link survives refactors. Use `line` only where you have verified
it against the revision you are citing.

### Making topics understandable

The AAOS vocabulary is dense and mostly undefined anywhere public. Five
components exist to fix that, usable in any learn, tutorial or blog MDX file:

```mdx
<T>VHAL</T>          {/* dotted underline; definition on hover/focus/click */}

<Plain>A jargon-free restatement of the paragraph above.</Plain>
<Analogy title="Like a hotel reception desk">An everyday comparison.</Analogy>
<Scenario title="On a real programme">A concrete situation and its outcome.</Scenario>
<Recap>The three or four things worth remembering.</Recap>
```

`<T>` looks a word up in `data/glossary.ts` by its display text or any alias,
case- and punctuation-insensitively. **A term that is not in the glossary renders
as ordinary text**, so wrapping something in `<T>` can never break a build.

The glossary is also a page at `/glossary` — 64 terms with a plain one-liner, a
fuller explanation, an everyday analogy where one helps, and cross-links.

To add a term, append to `glossary` in `data/glossary.ts`. Keep `short` genuinely
short: it appears in a popover, and `long` is what the glossary page renders.

### Diagrams

Diagrams are hand-authored inline SVG in `components/diagrams/`, not images. They
inherit the theme tokens, so they are legible in light and dark, stay crisp at any
zoom, and cost nothing to download.

```mdx
<DiagramFrame title="The Android Automotive OS stack" caption="Optional detail.">
  <AaosStack />
</DiagramFrame>
```

Available: `AaosStack`, `PropertyIdBits`, `VhalDataFlow`, `AudioZones`,
`PowerStates`, `UserModel`, `SdvBridge`, `SystemUiLayout`, `EvsBootPath`,
`ClusterArchitecture`, `BootTimeline`, `AbPartitions`, `MemoryPressure`,
`BluetoothProfiles`, `ComplianceSuites`, `MediaBrowseTree`. Build new ones from
the `Box` / `Arrow` / `Label` primitives in
`components/diagrams/primitives.tsx` — they read the theme tokens, so a new
diagram is legible in both themes for free.

### Code blocks

Fenced blocks render as an editor window with a title bar, language badge and a
copy button:

````mdx
```kotlin title="VendorProperties.kt" showLineNumbers
const val SEAT_MASSAGE_INTENSITY = 0x2540_0501
```
````

`title` sets the filename tab, `showLineNumbers` adds the gutter, and `{1,3-5}`
after the language highlights lines.

## Customisation tutorials

`/tutorials` is a 14-tutorial, step-by-step companion to the `/learn` reference:
build your own lunch target, VHAL, vehicle property, Car subservice, system
service, system app, SEPolicy, RRO and audio topology. Content lives in
`content/tutorials/<track>/<tutorial>.mdx`.

```mdx
---
title: "Add a custom vehicle property end to end"
description: "Shown on the index card and used for SEO."
order: 2                       # position within the track
difficulty: "Advanced"
time: "2-4 hours"
outcome: "Plain text - no backticks or markdown; it renders as-is."
prerequisites:                 # rendered as links in the header card
  - label: "Your own VHAL"
    href: "/tutorials/vehicle/custom-vhal/"
sources:
  - label: "Vehicle property configuration"
    href: "https://source.android.com/docs/automotive/vhal/property-configuration"
---
```

Tracks are defined in `data/tutorials.ts`, along with `surfaces` — the full
inventory of customisation points in AAOS, including ones with no tutorial yet.
The index renders that table, and only links a row whose tutorial actually
exists, so listing a surface early costs nothing.

Steps are plain `## Step N — …` headings so they appear in the table of contents
and in the page's `HowTo` structured data. Three extra components are available
in tutorial MDX:

```mdx
<FileTree>...</FileTree>      {/* what the tutorial creates */}
<Verify>...</Verify>          {/* prove it worked before moving on */}
<Gotcha>...</Gotcha>          {/* the thing that costs an hour */}
```

> **MDX gotcha:** `{` starts a JavaScript expression in MDX. Shell brace
> expansion like `res/values/{colors,dimens}.xml` outside a code fence will fail
> the build with `ReferenceError: colors is not defined`. Put it in a fence or
> write the paths out.

## Editing your profile

All résumé content lives in two typed files — no component edits needed:

- **`data/resume.ts`** — bio, roles, projects, skills, education, certifications, awards.
- **`data/site.ts`** — name, tagline, description, keywords, social links, nav.

Adding a role or project to those arrays is enough; the timeline, project pages,
filters, sitemap and structured data all follow.

> **Privacy:** this site publishes **no phone number, email address or postal
> address** — only the LinkedIn, GitHub and Medium profiles in `data/site.ts`.
> `.gitignore` excludes `*.pdf` and `logo/` so the source résumé (which does contain
> contact details) is never committed or deployed. Keep it that way if you add files.

---

## Brand logos

Company and technology logos come from [simple-icons](https://simpleicons.org)
(CC0 1.0). They appear in the experience timeline, the "Core stack" band, skill
chips, project stacks and the "Delivered for" block on case studies.

Only the icons actually used are checked in, because `ProjectCard` renders inside
a client component and importing all 3,400+ icons would ship them to the browser:

```bash
# 1. add the slug to SLUGS in scripts/generate-brand-icons.mjs
# 2. regenerate the pinned subset (~16 kB for 13 icons)
node scripts/generate-brand-icons.mjs
# 3. map your label to it in lib/brand.ts
```

`lib/brand.ts` maps résumé labels onto slugs. Several labels share one mark — every
AOSP/AAOS variant uses the Android robot. Anything unmapped falls back gracefully:
technologies get their skill-group glyph, organisations get an initials tile
(People Tech Group → `PT`), so nothing ever renders half-decorated.

Brand colours are authored for white pages, so the generator emits a light and a
dark variant per icon and blends near-black marks (Cadillac, OpenJDK) toward
legibility on the dark theme. CSS picks the right one — no JS.

> **Trademarks.** The icon *files* are public domain; the marks they depict are not.
> They are used here only to identify the technology or organisation named on your
> résumé. That is ordinary nominative use for a portfolio, but if you would rather
> not show OEM marks, delete the `clients` field from the entries in
> `data/resume.ts` and the "Delivered for" block disappears.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

1. Push this repo to GitHub.
2. **Settings → Pages → Source → GitHub Actions**.
3. Push to `main`.

The workflow detects which kind of Pages site you are using:

| Repo name | URL | `basePath` |
| --- | --- | --- |
| `bhargavamandapati.github.io` | `https://bhargavamandapati.github.io` | none |
| anything else, e.g. `portfolio` | `https://bhargavamandapati.github.io/portfolio` | `/portfolio` |

Both are handled automatically — no config edits.

### Custom domain

Add `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` to the build step, put a `CNAME`
file containing the domain in `public/`, and point DNS at GitHub Pages.

---

## Project layout

```
app/                    routes (App Router)
  page.tsx              home
  projects/[slug]/      generated project case studies
  blog/[slug]/          generated posts
  tags/[tag]/           generated tag pages
  feed.xml/route.ts     RSS
  sitemap.ts robots.ts  SEO
components/             UI, split into sections/ for the home page
content/blog/*.mdx      your posts  ← this is where you write
data/resume.ts          résumé content  ← and here
data/site.ts            site config
lib/                    blog loading, MDX plugins, helpers
public/images/          logo variants, generated icons
```

## What is already handled

- Static export — no server, no runtime cost.
- Light/dark theme with no flash of the wrong palette on load.
- **Zero axe (WCAG 2.1 AA) violations** in both themes; verified keyboard
  navigable with a skip link and visible focus rings.
- No horizontal overflow from 320px to 1440px.
- Content is readable with JavaScript disabled — scroll animations are an
  enhancement, and `prefers-reduced-motion` is respected.
- SEO: per-page metadata, canonical URLs, Open Graph + Twitter cards, JSON-LD
  (`Person`, `BlogPosting`, `CreativeWork`), `sitemap.xml`, `robots.txt`, RSS.

## Seed content

The three posts in `content/blog/` were written as working examples so the blog is
not empty and every MDX feature is demonstrated. **Review, rewrite or delete them** —
they are a starting point, not your published words.
