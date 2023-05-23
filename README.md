# `mark-applier`

> Markdown-to-Website Generator, GitHub README style

Generate a barebones GitHub-readme-themed website from markdown.

## Demo

https://suchipi.github.io/mark-applier/ has been generated from this README.

## Features

- Author websites the same way you write READMEs
- Everything renders the same as it does on GitHub:
  - Headings
  - Italics
  - Bold
  - Strikethrough
  - Ordered and unordered lists
  - Blockquotes
  - Code blocks (including syntax highlighting)
  - Inline code
  - Inline HTML (including `<kbd>` and etc)
  - Links
  - Images
  - Tables
  - Horizontal rules
  - Line breaks
  - Task lists
  - ...and more
- Supports both light and dark theme (based on [@media prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme))
- Super simple usage
- Generated pages work even when JavaScript is disabled

## Installation

- Install [Node.js](https://nodejs.org/) to get the `npx` program.

## Usage

To generate `README.html` from the contents of `README.md`:

```sh
$ npx mark-applier --input README.md --title "My Awesome Page" --output README.html
```

You can alternatively use yaml frontmatter to specify the page title instead of `--title`:

```markdown
---
title: My Awesome Page
---

# My Awesome Page

...
```

## Advanced Usage

### Raw HTML

Outputs the raw rendered markdown, without the enclosing page HTML:

```sh
$ npx mark-applier --input README.md --raw --output README.html
```

By using `--css` to get the css and `--raw` to get the raw html, you can use your own page template instead of the one provided by mark-applier.

If you're going to use this with the CSS provided by mark-applier, you should put that raw HTML inside of an element with the class name "markdown-body", like so:

```html
<article class="markdown-body">
  <!-- raw html goes here -->
</article>
```

### Just the CSS

Outputs the CSS from the page, without any of the HTML.

```sh
$ npx mark-applier --css > styles.css
```

By using `--css` to get the css and `--raw` to get the raw html, you can use your own page template instead of the one provided by mark-applier.

### Page Origin

mark-applier adds `target="_blank"` and some other attributes to `<a>` elements when they appear to be linking to an external page. To improve the accuracy of this "appear to be linking to an external page" heuristic, you can specify the origin (protocol and domain name) that the document will appear on. Specify it either in the yaml frontmatter's `origin` key or via the CLI option `--origin`:

```sh
$ npx mark-applier --input README.md --origin https://example.com --output README.html
```

## License

MIT
