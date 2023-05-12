import type { Plugin } from "unified";
import type { Root, ElementContent } from "hast";
import { visit } from "unist-util-visit";
import { warn } from "./warn.js";

export const rehypeLinkTarget: Plugin<[options: { origin?: string }], Root> = (
  options
) => {
  return async function (tree) {
    visit(tree, "element", function (node, index, parent) {
      if (!parent || index === null || node.tagName !== "a") {
        return;
      }

      const href = node.properties?.href;
      if (!href) {
        return;
      }

      if (options.origin == null) {
        warn(
          `I'd like to make links to external websites open in a new tab, but I can't do that unless you tell me where your website will be hosted. If you want that, specify your origin like this: '--origin https://example.com'.`
        );
        return;
      }

      const pageUrl = new URL(options.origin);
      const hrefUrl = new URL(String(href), options.origin);
      const isExternal = pageUrl.origin !== hrefUrl.origin;

      if (isExternal) {
        node.properties = node.properties || {};
        node.properties.target = "_blank";
        node.properties.rel = "nofollow noopener noreferrer";
      }
    });
  };
};
