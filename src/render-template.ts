import { createRequire } from "node:module";
import { process, includeRule, Rule } from "@suchipi/macaroni";
import { rel } from "./rel.js";

const require = createRequire(import.meta.url);

function nodeModulesDirForPackage(packageName: string) {
  const specifier = packageName + "/package.json";
  const pkgJsonPath = require.resolve(specifier);

  return pkgJsonPath.replace(new RegExp(specifier + "$"), "");
}

export function renderTemplate(
  templatePath: string,
  options: {
    title?: string;
    origin?: string;
    content?: string;
  },
  placeholders: {
    [key: string]: string;
  } = Object.create(null)
): string {
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

  const contentReplacement = options.content ?? "\n";
  const contentRule: Rule = (input, api) => {
    return input.content.replace(/#CONTENT/g, contentReplacement);
  };

  const originReplacement = options.origin ?? "/";
  const originRule: Rule = (input, api) => {
    return input.content.replace(/#ORIGIN/g, originReplacement);
  };

  const placeholderRule: Rule = (input, api) => {
    return input.content.replace(
      /#PLACEHOLDER\(([^)]+)\)/g,
      (match, keyNameWithQuotes) => {
        const keyName = JSON.parse(keyNameWithQuotes);
        if (Object.hasOwn(placeholders, keyName)) {
          return placeholders[keyName];
        } else {
          throw new Error("Unspecified placeholder key: " + keyName);
        }
      }
    );
  };

  const result = process(templatePath, {
    includePaths: nodeModulesDirs,
    rules: [includeRule, titleRule, contentRule, originRule, placeholderRule],
  });

  return result;
}
