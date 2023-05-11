import path from "node:path";
import { process, includeRule, Rule } from "@suchipi/macaroni";

export function htmlToPage(
  content: string,
  options: {
    title?: string;
    additionalIncludePaths?: Array<string>;
    additionalRules?: Array<Rule>;
  }
): string {
  const rootTemplate = require.resolve("../src/templates/__rootTemplate.tmpl");
  const templateDir = path.dirname(rootTemplate);
  const cssFile = require.resolve("github-markdown-css");
  const cssDir = path.dirname(cssFile);

  const titleRule: Rule = (input, api) => {
    const replacement = options.title
      ? `<title>${options.title}</title>\n`
      : "\n";

    return input.content.replace(/#TITLE/g, replacement);
  };

  const contentRule: Rule = (input, api) => {
    return input.content.replace(/#CONTENT/g, content);
  };

  const result = process(rootTemplate, {
    includePaths: [
      ...(options.additionalIncludePaths || []),
      templateDir,
      cssDir,
    ],
    rules: [includeRule, titleRule, contentRule].concat(
      options.additionalRules || []
    ),
  });

  return result;
}
