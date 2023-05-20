import { renderPage } from "./render-page.js";
import { renderCss } from "./render-css.js";
import { markdownToHtml } from "./markdown-to-html.js";
import { getFrontMatter } from "./get-front-matter.js";
import { Context } from "./parse-argv.js";

export async function applyMarks(
  input: string,
  context: Context
): Promise<string> {
  if (context.target === "css") {
    return renderCss();
  }

  const { data, content } = getFrontMatter(input);

  // `options` takes precedence over frontmatter
  const origin = context.origin ?? data.origin;

  if (context.target === "raw") {
    const rawHtml = await markdownToHtml(content, { origin });
    return rawHtml;
  }

  const title = context.title ?? data.title;

  const rawHtml = await markdownToHtml(content, { origin });
  const pageHtml = renderPage(rawHtml, { origin, title });
  return pageHtml;
}
