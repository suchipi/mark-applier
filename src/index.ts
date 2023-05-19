import { Rule } from "@suchipi/macaroni";
import { warn } from "./warn.js";
import { htmlToPage } from "./html-to-page.js";
import { markdownToHtml } from "./markdown-to-html.js";
import { getFrontMatter } from "./get-front-matter.js";

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
  // copy so we can mutate it
  const mutableOptions = { ...options };

  // `options` takes precedence over frontmatter
  const { data, content } = getFrontMatter(input);
  if (Object.hasOwn(data, "title") && !Object.hasOwn(mutableOptions, "title")) {
    mutableOptions.title = data.title;
  }
  if (
    Object.hasOwn(data, "origin") &&
    !Object.hasOwn(mutableOptions, "origin")
  ) {
    mutableOptions.origin = data.origin;
  }

  const html = await markdownToHtml(content, mutableOptions);
  if (mutableOptions.raw) {
    for (const key of [
      "templateOverridesDir",
      "templateRules",
      "title",
    ] as const) {
      if (mutableOptions[key] != null) {
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
      title: mutableOptions.title,
      frontMatterData: data,
    };
    if (mutableOptions.templateOverridesDir) {
      htmlToPageOptions.additionalIncludePaths = [
        mutableOptions.templateOverridesDir,
      ];
    }
    if (mutableOptions.templateRules) {
      htmlToPageOptions.additionalRules = mutableOptions.templateRules;
    }

    const pageHtml = htmlToPage(html, htmlToPageOptions);
    return pageHtml;
  }
}
