# `mark-applier`

> Markdown-to-Website Generator, GitHub README style

Generate a barebones GitHub-readme-themed website from markdown.

## Features

- Author websites the same way you write READMEs
- Generated pages don't use JavaScript
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

## Installation

```ts
npm install -g mark-applier
```

## Usage

Pipe markdown into `mark-applier`, and it will output html:

```sh
$ cat README.md | mark-applier --title "My Awesome Page" > README.html
```

## Advanced Usage

### Raw HTML

Outputs the raw rendered markdown, without the enclosing page HTML:

```sh
$ cat README.md | mark-applier --raw > README.html
```

### Template Overrides

You can override the builtin page template(s) by creating files named `index.tmpl` and/or `styles.tmpl` and then passing their enclosing folder with `--templateDir`. Any files you haven't created will fall back to the default implementation (in other words, you can override `styles.tmpl` without overriding `index.tmpl`).

Copy/paste `src/templates/index.original.tmpl` and/or `src/templates/styles.original.tmpl` from this repo as a starting point to use when overriding the default templates.

### Override

## License

MIT
