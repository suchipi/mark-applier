import { Rule } from "@suchipi/macaroni";
import { htmlToPage } from "./html-to-page.js";
import { markdownToHtml } from "./markdown-to-html.js";

export type Options = {
  raw?: boolean;
  title?: string;
  templateDir?: string;
  templateRules?: Array<Rule>;
};

export async function applyMarks(
  input: string,
  options: Options
): Promise<string> {
  const html = await markdownToHtml(input);
  if (options.raw) {
    return html;
  } else {
    const htmlToPageOptions: Parameters<typeof htmlToPage>[1] = {
      title: options.title,
    };
    if (options.templateDir) {
      htmlToPageOptions.additionalIncludePaths = [options.templateDir];
    }
    if (options.templateRules) {
      htmlToPageOptions.additionalRules = options.templateRules;
    }

    const pageHtml = htmlToPage(html, htmlToPageOptions);
    return pageHtml;
  }
}
