import { warn } from "./warn.js";
import { renderPage } from "./render-page.js";
import { renderCss } from "./render-css.js";
import { markdownToHtml } from "./markdown-to-html.js";
import { getFrontMatter } from "./get-front-matter.js";

export type Options = {
  raw?: boolean;
  css?: boolean;
  title?: string;
  origin?: string;
};

export async function applyMarks(
  input: string,
  options: Options
): Promise<string> {
  const { data, content } = getFrontMatter(input);

  // `options` takes precedence over frontmatter
  const title = options.title ?? data.title;
  const origin = options.origin ?? data.origin;

  if (options.raw && title != null) {
    warn(`When using the 'raw' option, the 'title' option is ignored.`);
  }
  if (options.css && title != null) {
    warn(`When using the 'css' option, the 'title' option is ignored.`);
  }

  if (options.css) {
    return renderCss();
  }

  const html = await markdownToHtml(content, { origin });

  if (options.raw) {
    return html;
  } else {
    const pageHtml = renderPage(html, { origin, title });
    return pageHtml;
  }
}
