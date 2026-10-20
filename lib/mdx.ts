import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const prettyCodeOptions: PrettyCodeOptions = {
  // High-contrast variants: the standard github-light palette puts several
  // token colours (#e36209 orange, #d73a49 red) below WCAG AA on a white
  // background at code-block font sizes.
  theme: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
  keepBackground: false,
  defaultLang: { block: 'text', inline: 'text' },
}

// Derived from the public component props — next-mdx-remote does not export SerializeOptions.
export const mdxOptions: NonNullable<MDXRemoteProps['options']> = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], ariaLabel: 'Link to this section' },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
  },
}

/**
 * AI & ML pages carry mathematics. remark-math reads `$...$` and `$$...$$`
 * and rehype-katex turns it into plain HTML at build time, so the formulas
 * survive the encryption step like any other markup and need no script.
 * Kept separate so the `$` in other tracks' shell snippets and prices is never
 * read as maths. Write a literal dollar sign as `\$` on these pages.
 */
export const aimlMdxOptions: NonNullable<MDXRemoteProps['options']> = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeKatex, { strict: 'ignore', throwOnError: false }],
      ...((mdxOptions.mdxOptions?.rehypePlugins ?? []).slice(1) as []),
    ],
  },
}
