// Based on https://github.com/wooorm/starry-night#example-integrate-with-unified-remark-and-rehype
import type { Plugin } from "unified";
import type { Root, ElementContent } from "hast";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { createStarryNight, all } from "@wooorm/starry-night";
import { warn } from "./warn.js";

export const rehypeStarryNight: Plugin<[], Root> = () => {
  const starryNightPromise = createStarryNight(all);
  const prefix = "language-";

  return async function (tree) {
    const starryNight = await starryNightPromise;

    visit(tree, "element", function (node, index, parent) {
      if (!parent || index == null || node.tagName !== "pre") {
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

      let langWithoutPrefix = language.slice(prefix.length);
      if (langWithoutPrefix === "md") {
        // This defaults to something other than markdown, but people generally
        // mean markdown
        langWithoutPrefix = "markdown";
      }
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
          {
            type: "comment",
            value: `
The syntax highlighting of the following code block is provided by
npm:@wooorm/starry-night, which has the following license:

(The MIT License)

Copyright (c) 2022 Titus Wormer <tituswormer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          `.trim(),
          },
          { type: "element", tagName: "pre", properties: {}, children },
        ],
      });
    });
  };
};
