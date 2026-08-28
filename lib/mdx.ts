import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

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
