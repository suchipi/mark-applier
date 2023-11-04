import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeLinkTarget } from "./rehype-link-target.js";
import { rehypeLinkMdToHtml } from "./rehype-link-md-to-html.js";
import { rehypeStarryNight } from "./rehype-starry-night.js";
import { rehypeHeadingLinkIcon } from "./rehype-heading-link-icon.js";

export async function markdownToHtml(
  input: string,
  options: { origin?: string }
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: {
        className: "heading-link",
      },
    } as any)
    .use(rehypeHeadingLinkIcon)
    .use(rehypeLinkTarget, options)
    .use(rehypeLinkMdToHtml, options)
    .use(rehypeStarryNight)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process({ value: input });
  const html = result.toString();
  return html;
}
