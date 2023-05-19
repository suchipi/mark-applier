import { Rule } from "@suchipi/macaroni";
import { warn } from "./warn.js";
import { htmlToPage } from "./html-to-page.js";
import { markdownToHtml } from "./markdown-to-html.js";

export type Options = {
  raw?: boolean;
  title?: string;
  origin?: string;
  templateOverridesDir?: string;
  templateRules?: Array<Rule>;
};

export async function applyMarks(
  input: string,
  options: Options
): Promise<string> {
  const html = await markdownToHtml(input, options);
  if (options.raw) {
    for (const key of [
      "templateOverridesDir",
      "templateRules",
      "title",
    ] as const) {
      if (options[key] != null) {
        warn(
          `When using the "raw" option, the ${JSON.stringify(
            key
          )} option is ignored.`
        );
      }
    }

    return html;
  } else {
    const htmlToPageOptions: Parameters<typeof htmlToPage>[1] = {
      title: options.title,
    };
    if (options.templateOverridesDir) {
      htmlToPageOptions.additionalIncludePaths = [options.templateOverridesDir];
    }
    if (options.templateRules) {
      htmlToPageOptions.additionalRules = options.templateRules;
    }

    const pageHtml = htmlToPage(html, htmlToPageOptions);
    return pageHtml;
  }
}
