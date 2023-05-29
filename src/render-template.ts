import * as fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import _ from "lodash";
import { rel } from "./rel.js";

const require = createRequire(import.meta.url);

function nodeModulesDirForPackage(packageName: string) {
  const specifier = packageName + "/package.json";
  const pkgJsonPath = require.resolve(specifier);

  return pkgJsonPath.replace(new RegExp(specifier + "$"), "");
}

export type TemplateData = {
  /** Document title */
  title?: string;
  /** Page origin, including protocol and domain name */
  origin?: string;

  /** Raw HTML generated by markdown compilation */
  content?: string;
  /** Raw CSS to be included in styles */
  css?: string;
  /**
   * Raw HTML to be used to inject the theme checkbox into the page (only
   * present when using 'auto' theme)
   */
  checkboxHtml?: string;
};

export function renderTemplate(
  templatePath: string,
  data: TemplateData = {}
): string {
  if (!path.isAbsolute(templatePath)) {
    const err = new Error(
      `Template path must be an absolute path, but received: '${templatePath}'`
    );
    throw Object.assign(err, { templatePath });
  }

  const nodeModulesDirs = new Set<string>();
  nodeModulesDirs.add(nodeModulesDirForPackage("github-markdown-css"));
  nodeModulesDirs.add(nodeModulesDirForPackage("@wooorm/starry-night"));

  const ownNodeModulesDir = rel("../..", import.meta.url);
  nodeModulesDirs.add(ownNodeModulesDir);

  if (
    !fs.statSync(path.join(ownNodeModulesDir, "mark-applier")).isDirectory()
  ) {
    throw new Error(
      "Expected ../.. to contain a dir called 'mark-applier', but it wasn't present. This is either due to you cloning the mark-applier repo into a folder with a different name, or you're using a fork of the repo with a different name. Please use the name 'mark-applier' for this folder, or update this code to search elsewhere."
    );
  }

  const include = (includedPath: string) => {
    for (const nodeModulesDir of nodeModulesDirs) {
      const potentialPath = path.join(nodeModulesDir, includedPath);
      if (fs.existsSync(potentialPath)) {
        return renderTemplate(potentialPath, data);
      }
    }
    const err = new Error(`Could not locate included file: '${includedPath}'`);
    throw Object.assign(err, {
      includedPath,
      nodeModulesDirs: Array.from(nodeModulesDirs),
    });
  };

  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const templateFunction = _.template(templateContent);
  return templateFunction({
    ...data,
    include,
  });
}
