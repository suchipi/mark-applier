import path from "node:path";
import type { Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";

export const rehypeLinkMdToHtml: Plugin<
  [options: { origin?: string }],
  Root
> = (options) => {
  return async function (tree) {
    visit(tree, "element", function (node, index, parent) {
      if (!parent || index === null || node.tagName !== "a") {
        return;
      }

      if (node.properties == null) {
        return;
      }

      const href = node.properties.href as string | null;
      if (!href) {
        return;
      }

      if (href.startsWith("#")) {
        return;
      }

      let isInternal: boolean;
      if (options.origin != null) {
        const pageUrl = new URL(options.origin);
        const hrefUrl = new URL(href, options.origin);
        isInternal = pageUrl.origin === hrefUrl.origin;
      } else {
        // heuristic: starts with './', '../' or '/' (but not '//')
        isInternal = /^\.\/|^\.\.\/|^\/[^/]/.test(href);
      }

      if (isInternal) {
        const extension = path.extname(href);
        if (extension === ".md") {
          node.properties.href = href.replace(/\.md$/, ".html");
        } else if (extension === "") {
          node.properties.href = href + ".html";
        }
      }
    });
  };
};
