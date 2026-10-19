/**
 * Structure and readability gate for rewritten pages.
 *
 * A page opts in with `rewrite: 2` in its frontmatter (see docs/content-standards.md
 * in the private content repo). This script then checks it against the page
 * anatomy: orientation parts at the top, signposts through the body, and a
 * conclusion and revision section at the end, plus readability and visual
 * minimums. Pages without the flag are skipped (pass --all to check every page).
 *
 *   node scripts/check-page-structure.mjs [--all] [--json] [path-fragment ...]
 *
 * Exits 1 if any checked page fails.
 */
import { readFileSync, globSync } from 'node:fs'

const args = process.argv.slice(2)
const all = args.includes('--all')
const asJson = args.includes('--json')
const filters = args.filter((a) => !a.startsWith('--'))

const files = globSync('content/{learn,tutorials,sdv}/**/*.mdx')
  .sort()
  .filter((f) => !filters.length || filters.some((x) => f.includes(x)))

const SENT_MAX = { learn: 18, tutorials: 20 }
const PARA_MAX = 100
const BANNED = /\b(simply|just|obviously|trivial|trivially|easily)\b/i

const count = (s, re) => (s.match(re) || []).length

function prose(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\|.*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#+.*$/gm, ' ')
    .replace(/[`*_>\[\]()]/g, ' ')
}

function check(file) {
  const raw = readFileSync(file, 'utf8')
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const flagged = /^rewrite:\s*2\s*$/m.test(fm)
  if (!flagged && !all) return null
  const area = file.startsWith('content/tutorials/') ? 'tutorials' : 'learn'
  const body = raw.replace(/^---[\s\S]*?\n---/, '')
  const noCode = body.replace(/```[\s\S]*?```/g, ' ')
  const fails = []
  const warns = []
  const need = (ok, msg) => ok || fails.push(msg)

  // frontmatter
  for (const k of ['title', 'description', 'order', 'difficulty']) need(new RegExp(`^${k}:`, 'm').test(fm), `frontmatter: missing ${k}`)
  if (area === 'tutorials') need(/^outcome:/m.test(fm), 'frontmatter: missing outcome')

  // headings, in order
  const h2 = [...noCode.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim())
  const wanted =
    area === 'learn'
      ? [/^Introduction/i, /^What it is/i, /^How it works/i, /^Worked example/i, /^(Misconceptions|Common mistakes|What people get wrong)/i, /^Conclusion/i, /^Revision/i]
      : [/^Introduction/i, /^The idea in 60 seconds/i, /^Step \d+/i, /^Verify/i, /^Troubleshooting/i, /^Conclusion/i, /^Revision/i]
  let from = 0
  for (const re of wanted) {
    const i = h2.findIndex((h, k) => k >= from && re.test(h))
    if (i < 0) fails.push(`missing or out-of-order section: ${re.source}`)
    else from = i + 1
  }

  // anatomy parts
  need(count(noCode, /<KeyTerms[\s>]/g) >= 1, 'no <KeyTerms>')
  need(count(noCode, /<PageMap[\s>]/g) >= 1, area === 'learn' ? 'no <PageMap>' : 'no <PageMap> (step map)')
  need(count(noCode, /<RevisionCard[\s>]/g) === 1, 'needs exactly one <RevisionCard>')
  need(count(noCode, /<SelfTest[\s>]/g) === 1, 'needs exactly one <SelfTest>')
  need(count(noCode, /<Q[\s]/g) >= 5, `<SelfTest> needs at least 5 <Q> (has ${count(noCode, /<Q[\s]/g)})`)
  need(count(noCode, /<ExplainBack[\s>]/g) >= 1, 'no <ExplainBack>')
  need(count(noCode, /<MemoryHooks[\s>]/g) >= 1, 'no <MemoryHooks>')
  if (area === 'learn') {
    need(count(noCode, /<YouAreHere[\s/>]/g) >= 1, 'no <YouAreHere>')
    need(count(noCode, /<InShort[\s>]/g) >= 3, `needs at least 3 <InShort> (has ${count(noCode, /<InShort[\s>]/g)})`)
    need(count(noCode, /<Analogy[\s>]/g) >= 1, 'no <Analogy>')
  } else {
    const steps = count(noCode, /^## Step \d+/gm)
    need(steps >= 1, 'no "## Step N" headings')
    need(count(noCode, /<StepGoal[\s]/g) === steps, `<StepGoal> count (${count(noCode, /<StepGoal[\s]/g)}) must equal step count (${steps})`)
    need(count(noCode, /<IfNot[\s>]/g) >= 1, 'no <IfNot>')
    need(count(noCode, /<Verify[\s>]/g) >= 1, 'no <Verify>')
  }

  // visuals
  const words = noCode.split(/\s+/).filter(Boolean).length
  const diagrams = count(noCode, /<DiagramFrame/g)
  const tables = count(noCode, /^\|[-: |]+\|$/gm)
  need(diagrams >= (words > 1500 ? 2 : 1), `needs ${words > 1500 ? 2 : 1}+ <DiagramFrame> (has ${diagrams})`)
  need(tables >= 2, `needs 2+ tables (has ${tables})`)

  // readability
  const p = prose(body)
  const pw = p.split(/\s+/).filter(Boolean).length
  const sentences = p.split(/[.!?]+\s/).filter((s) => s.trim().split(/\s+/).length > 2)
  const avg = sentences.length ? pw / sentences.length : 0
  need(avg <= SENT_MAX[area], `average sentence ${avg.toFixed(1)} words (max ${SENT_MAX[area]})`)
  const paras = noCode.split(/\n\s*\n/).filter((x) => x.trim() && !/^(#|\||<|-|\d+\.|>)/.test(x.trim()))
  const longest = Math.max(0, ...paras.map((x) => x.split(/\s+/).length))
  need(longest <= PARA_MAX, `longest paragraph ${longest} words (max ${PARA_MAX})`)
  const banned = p.match(BANNED)
  if (banned) fails.push(`banned word in prose: "${banned[0]}"`)

  // long run of text with no visual or break
  const blocks = noCode.split(/^#{2,3} .*$/gm)
  blocks.forEach((b, i) => {
    const bw = prose(b).split(/\s+/).filter(Boolean).length
    if (bw > 350 && !/<(DiagramFrame|Analogy|Plain|Scenario|FileTree|InShort)|^\|[-: |]+\|$/m.test(b)) warns.push(`section ${i} runs ${bw} words with no visual or signpost`)
  })

  return { file, area, words, diagrams, tables, avgSentence: Math.round(avg * 10) / 10, longestParagraph: longest, fails, warns }
}

const results = files.map(check).filter(Boolean)
if (asJson) console.log(JSON.stringify(results, null, 2))
else {
  if (!results.length) console.log('No pages flagged rewrite: 2 (pass --all to check every page).')
  for (const r of results) {
    console.log(`${r.fails.length ? 'FAIL' : 'pass'}  ${r.file}  (${r.words}w, ${r.diagrams} diagrams, ${r.tables} tables, sentence ${r.avgSentence}, para ${r.longestParagraph})`)
    r.fails.forEach((m) => console.log('      ✗ ' + m))
    r.warns.forEach((m) => console.log('      ! ' + m))
  }
  console.log(`\n${results.filter((r) => !r.fails.length).length}/${results.length} pages pass`)
}
process.exit(results.some((r) => r.fails.length) ? 1 : 0)
