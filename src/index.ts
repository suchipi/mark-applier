import { renderPage } from "./render-page.js";
import { renderCss } from "./render-css.js";
import { markdownToHtml } from "./markdown-to-html.js";
import { getFrontMatter } from "./get-front-matter.js";

export function makeCss() {
  return renderCss();
}

export async function makeRawHtml(
  input: string,
  options: { origin?: string | null }
) {
  const { data, content } = getFrontMatter(input);

  // `options` takes precedence over frontmatter
  const origin = options.origin ?? data.origin;

  const rawHtml = await markdownToHtml(content, { origin });
  return rawHtml;
}

export async function makePageHtml(
  input: string,
  options: { origin?: string | null; title?: string | null }
): Promise<string> {
  const { data, content } = getFrontMatter(input);

  // `options` takes precedence over frontmatter
  const origin = options.origin ?? data.origin;
  const title = options.title ?? data.title;

  const rawHtml = await markdownToHtml(content, { origin });
  const pageHtml = renderPage(rawHtml, { origin, title });
  return pageHtml;
}
