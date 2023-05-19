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
    origin?: string;
    additionalIncludePaths?: Array<string>;
    additionalRules?: Array<Rule>;
    frontMatterData?: { [key: string]: any };
  }
): string {
  const rootTemplate = require.resolve("../templates/__rootTemplate.tmpl");

  const nodeModulesDirs = new Set();
  nodeModulesDirs.add(nodeModulesDirForPackage("github-markdown-css"));
  nodeModulesDirs.add(nodeModulesDirForPackage("@wooorm/starry-night"));

  const ownNodeModulesDir = rel("../..", import.meta.url);
  nodeModulesDirs.add(ownNodeModulesDir);

  const titleReplacement = options.title
    ? `<title>${options.title}</title>\n`
    : "\n";
  const titleRule: Rule = (input, api) => {
    return input.content.replace(/#TITLE/g, titleReplacement);
  };

  const contentRule: Rule = (input, api) => {
    return input.content.replace(/#CONTENT/g, content);
  };

  const originReplacement = options.origin ?? "/";
  const originRule: Rule = (input, api) => {
    return input.content.replace(/#ORIGIN/g, originReplacement);
  };

  const frontMatterData = options.frontMatterData ?? {};

  const frontMatterDataRule: Rule = (input, api) => {
    return input.content.replace(
      /#FRONTMATTER\(([^)]+)\)/g,
      (match, keyName) => {
        const parsedKeyName = JSON.parse(keyName);
        if (Object.hasOwn(frontMatterData, parsedKeyName)) {
          return frontMatterData[parsedKeyName];
        } else {
          return "";
        }
      }
    );
  };

  const result = process(rootTemplate, {
    includePaths: [
      ...(options.additionalIncludePaths || []),
      ...nodeModulesDirs,
    ],
    rules: [
      includeRule,
      titleRule,
      contentRule,
      originRule,
      frontMatterDataRule,
    ].concat(options.additionalRules || []),
  });

  return result;
}
