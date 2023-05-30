import { renderPage } from "./render-page.js";
import { renderCss } from "./render-css.js";
import { markdownToHtml } from "./markdown-to-html.js";
import { getFrontMatter } from "./get-front-matter.js";
import { ThemeName } from "./theme.js";

export function makeCss(theme: ThemeName) {
  return renderCss(theme);
}

export async function readFrontMatter(input: string) {
  const { data } = getFrontMatter(input);
  return data;
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
  options: { origin?: string | null; title?: string | null; theme?: ThemeName }
): Promise<string> {
  const { data, content } = getFrontMatter(input);

  // `options` takes precedence over frontmatter
  const origin = options.origin ?? data.origin;
  const title = options.title ?? data.title;
  const theme = options.theme ?? "auto";

  const rawHtml = await markdownToHtml(content, { origin });
  const pageHtml = renderPage(rawHtml, { origin, title, theme });
  return pageHtml;
}
