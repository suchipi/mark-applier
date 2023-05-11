import { createRequire } from "node:module";
import { process, includeRule, Rule } from "@suchipi/macaroni";
import { rel } from "./rel.js";

const require = createRequire(import.meta.url);

function nodeModulesDirForPackage(packageName: string) {
  const specifier = packageName + "/package.json";
  const pkgJsonPath = require.resolve(specifier);

  return pkgJsonPath.replace(new RegExp(specifier + "$"), "");
}

export function htmlToPage(
  content: string,
  options: {
    title?: string;
    additionalIncludePaths?: Array<string>;
    additionalRules?: Array<Rule>;
  }
): string {
  const rootTemplate = require.resolve("../templates/__rootTemplate.tmpl");

  const nodeModulesDirs = new Set();
  nodeModulesDirs.add(nodeModulesDirForPackage("github-markdown-css"));
  nodeModulesDirs.add(nodeModulesDirForPackage("@wooorm/starry-night"));

  const ownNodeModulesDir = rel("../..", import.meta.url);
  nodeModulesDirs.add(ownNodeModulesDir);

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
      ...nodeModulesDirs,
    ],
    rules: [includeRule, titleRule, contentRule].concat(
      options.additionalRules || []
    ),
  });

  return result;
}
