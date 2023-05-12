import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeLinkTarget } from "./rehype-link-target.js";
import { rehypeStarryNight } from "./rehype-starry-night.js";

export async function markdownToHtml(
  input: string,
  options: { origin?: string }
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeLinkTarget, options)
    .use(rehypeStarryNight)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process({ value: input });
  const html = result.toString();
  return html;
}
