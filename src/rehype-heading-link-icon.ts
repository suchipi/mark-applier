import type { Plugin } from "unified";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { linkIconTree } from "./link-icon-as-hast-tree.js";

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export const rehypeHeadingLinkIcon: Plugin<[], Root> = () => {
  return async function (tree) {
    visit(tree, "element", function (node, index, parent) {
      if (!parent || index == null || !headingTags.has(node.tagName)) {
        return;
      }

      const anchor: Element | undefined = node.children.find(
        (child) =>
          child.type === "element" &&
          child.tagName === "a" &&
          child.properties &&
          child.properties.className === "heading-link"
      ) as any;
      if (!anchor) {
        return;
      }

      anchor.children.push(linkIconTree as any);
    });
  };
};
