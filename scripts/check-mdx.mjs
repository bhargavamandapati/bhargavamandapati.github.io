/**
 * Pre-build sanity checks for MDX content.
 *
 * These catch the two failure modes that have actually broken builds here, both
 * of which are invisible until the MDX compiler runs:
 *
 *   1. Brace expressions outside code fences. MDX treats `{...}` as JavaScript,
 *      so a path like res/values/(colors,dimens).xml written with braces becomes
 *      a ReferenceError at build time.
 *   2. Unbalanced custom components. A stray closing tag produces a compiler
 *      error whose message points at the wrong line.
 *   3. A content/{learn,sdv,tutorials} folder that drifted out of sync with
 *      its registry (data/curriculum.ts etc.) — silent otherwise, since those
 *      loaders only ever scan folders already named in the registry.
 *
 * Run with: node scripts/check-mdx.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { globSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const files = globSync('content/**/*.mdx', { cwd: ROOT }).sort()

/** Components that wrap content and must therefore be balanced. */
const PAIRED = [
  'Plain',
  'Analogy',
  'Scenario',
  'Recap',
  'Gotcha',
  'Verify',
  'DiagramFrame',
  'CodeWindow',
  'FileTree',
  'T',
  // Page-anatomy parts (components/learn/page-parts.tsx).
  'KeyTerms',
  'PageMap',
  'InShort',
  'RevisionCard',
  'SelfTest',
  'Q',
  'ExplainBack',
  'MemoryHooks',
  'StepGoal',
  'IfNot',
  'GoDeeper',
]

/** Strip fenced code, inline code, and frontmatter — braces are legal there. */
function stripCode(source, math = false) {
  const text = math
    ? // AI & ML pages hold formulas: braces inside $...$ and $$...$$ are maths, not MDX expressions.
      source.replace(/\$\$[\s\S]*?\$\$/g, (m) => '\n'.repeat(m.split('\n').length - 1)).replace(/(?<!\\)\$[^$\n]+(?<!\\)\$/g, '')
    : source
  return text
    .replace(/^---\n[\s\S]*?\n---\n/, (m) => '\n'.repeat(m.split('\n').length - 1))
    .replace(/```[\s\S]*?```/g, (m) => '\n'.repeat(m.split('\n').length - 1))
    .replace(/`[^`\n]*`/g, '')
}

const problems = []

for (const rel of files) {
  const raw = readFileSync(path.join(ROOT, rel), 'utf8')
  const prose = stripCode(raw, rel.startsWith('content/ai-ml/'))

  // 1. Brace expressions in prose.
  prose.split('\n').forEach((line, i) => {
    const m = line.match(/\{[^}]*\}/)
    // JSX attributes legitimately use braces; only flag braces in text runs.
    if (m && !/^\s*[a-zA-Z-]+=\{/.test(line) && !/<[A-Z]\w*[^>]*\{/.test(line)) {
      problems.push(`${rel}:${i + 1}  brace expression in prose: ${m[0].slice(0, 40)}`)
    }
  })

  // 2. Nested double quotes inside a JSX attribute — closes the attribute early.
  //    Checked against prose only; code fences legitimately contain things like
  //    <?xml version="1.0" encoding="utf-8"?>.
  prose.split('\n').forEach((line, i) => {
    if (!/<[A-Z]\w*\s/.test(line)) return
    const m = line.match(/\s[a-zA-Z-]+="[^"]*"[^\s/>=]/)
    if (m) problems.push(`${rel}:${i + 1}  nested quote in JSX attribute: ${m[0].slice(0, 50)}`)
  })

  // 3. Tag balance for paired components.
  for (const tag of PAIRED) {
    const open = (raw.match(new RegExp(`<${tag}(?=[\\s>])`, 'g')) ?? []).length
    const selfClose = (raw.match(new RegExp(`<${tag}(?:\\s[^>]*)?/>`, 'g')) ?? []).length
    const close = (raw.match(new RegExp(`</${tag}>`, 'g')) ?? []).length
    if (open - selfClose !== close) {
      problems.push(
        `${rel}  <${tag}> unbalanced: ${open - selfClose} opening, ${close} closing`,
      )
    }
  }
}

// 4. Every content/{learn,sdv,tutorials} subfolder must be a registered
//    category/track/module, and vice versa. A folder that isn't registered
//    produces no build error at all — it just never appears anywhere, which
//    is a much easier mistake to miss than a build failure.
const REGISTRIES = [
  { dataFile: 'data/curriculum.ts', contentDir: 'content/learn', kind: 'Learn category' },
  { dataFile: 'data/tutorials.ts', contentDir: 'content/tutorials', kind: 'tutorial track' },
  { dataFile: 'data/sdv-curriculum.ts', contentDir: 'content/sdv', kind: 'SDV module' },
  { dataFile: 'data/ai-ml-curriculum.ts', contentDir: 'content/ai-ml', kind: 'AI & ML module', allowEmpty: true },
]

for (const { dataFile, contentDir, kind, allowEmpty } of REGISTRIES) {
  const dataPath = path.join(ROOT, dataFile)
  const contentPath = path.join(ROOT, contentDir)
  if (!existsSync(dataPath) || !existsSync(contentPath)) continue

  const registered = new Set(
    [...readFileSync(dataPath, 'utf8').matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]),
  )
  const onDisk = new Set(
    readdirSync(contentPath, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name),
  )

  for (const slug of onDisk) {
    if (!registered.has(slug)) {
      problems.push(
        `${contentDir}/${slug}/  has no matching ${kind} in ${dataFile} — its content is unreachable`,
      )
    }
  }
  for (const slug of registered) {
    // A registered module may still be waiting for its first topic (AI & ML is
    // written module by module).
    if (!onDisk.has(slug) && !allowEmpty) {
      problems.push(`${dataFile}  ${kind} '${slug}' has no matching ${contentDir}/${slug}/ folder`)
    }
  }
}

// 5. Compile every file with the same MDX pipeline the site uses. The regex checks
//    above catch the common mistakes; this catches the rest (a nested quote the
//    patterns missed, a stray angle bracket) in seconds instead of ten minutes
//    into a build.
{
  const { compile } = await import('@mdx-js/mdx')
  const { default: matter } = await import('gray-matter')
  const { default: remarkGfm } = await import('remark-gfm')
  const { default: remarkMath } = await import('remark-math')
  for (const rel of files) {
    const { content } = matter(readFileSync(path.join(ROOT, rel), 'utf8'))
    try {
      await compile(content, {
        remarkPlugins: rel.startsWith('content/ai-ml/') ? [remarkGfm, remarkMath] : [remarkGfm],
      })
    } catch (e) {
      problems.push(`${rel}:${e.line ?? '?'}  does not compile: ${String(e.message).split('\n')[0].slice(0, 120)}`)
    }
  }
}

if (problems.length) {
  console.error(`MDX check failed (${problems.length} problem(s)):\n`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`all MDX clean (${files.length} files)`)
