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
 *
 * Run with: node scripts/check-mdx.mjs
 */
import { readFileSync } from 'node:fs'
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
]

/** Strip fenced code, inline code, and frontmatter — braces are legal there. */
function stripCode(source) {
  return source
    .replace(/^---\n[\s\S]*?\n---\n/, (m) => '\n'.repeat(m.split('\n').length - 1))
    .replace(/```[\s\S]*?```/g, (m) => '\n'.repeat(m.split('\n').length - 1))
    .replace(/`[^`\n]*`/g, '')
}

const problems = []

for (const rel of files) {
  const raw = readFileSync(path.join(ROOT, rel), 'utf8')
  const prose = stripCode(raw)

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

if (problems.length) {
  console.error(`MDX check failed (${problems.length} problem(s)):\n`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`all MDX clean (${files.length} files)`)
