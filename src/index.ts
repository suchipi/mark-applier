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

function has(target: object, key: string | number | symbol) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export async function applyMarks(
  input: string,
  options: Options
): Promise<string> {
  // copy so we can mutate it
  const mutableOptions = { ...options };

  // `options` takes precedence over frontmatter
  const { data, content } = getFrontMatter(input);
  if (has(data, "title") && !has(mutableOptions, "title")) {
    mutableOptions.title = data.title;
  }
  if (has(data, "origin") && !has(mutableOptions, "origin")) {
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
