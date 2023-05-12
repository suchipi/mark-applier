// Based on https://github.com/wooorm/starry-night#example-integrate-with-unified-remark-and-rehype
import type { Plugin } from "unified";
import type { Root, ElementContent } from "hast";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { createStarryNight, common } from "@wooorm/starry-night";
import { warn } from "./warn.js";

export const rehypeStarryNight: Plugin<[], Root> = () => {
  const starryNightPromise = createStarryNight(common);
  const prefix = "language-";

  return async function (tree) {
    const starryNight = await starryNightPromise;

    visit(tree, "element", function (node, index, parent) {
      if (!parent || index === null || node.tagName !== "pre") {
        return;
      }

      const head = node.children[0];

      if (
        !head ||
        head.type !== "element" ||
        head.tagName !== "code" ||
        !head.properties
      ) {
        return;
      }

      const classes = head.properties.className;

      if (!Array.isArray(classes)) return;

      const language = classes.find(
        (d) => typeof d === "string" && d.startsWith(prefix)
      );

      if (typeof language !== "string") return;

      const langWithoutPrefix = language.slice(prefix.length);
      const scope = starryNight.flagToScope(langWithoutPrefix);

      if (!scope) {
        warn(
          `Skipping syntax highlighting for unknown language: ${langWithoutPrefix}`
        );
        return;
      }

      const fragment = starryNight.highlight(toString(head), scope);
      const children: Array<ElementContent> = fragment.children as any;

      parent.children.splice(index, 1, {
        type: "element",
        tagName: "div",
        properties: {
          className: [
            "highlight",
            "highlight-" + scope.replace(/^source\./, "").replace(/\./g, "-"),
          ],
        },
        children: [
          { type: "element", tagName: "pre", properties: {}, children },
        ],
      });
    });
  };
};
