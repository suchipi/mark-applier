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

You can override the builtin page and style template(s) by using `--template-overrides-dir`. When creating an HTML document, mark-applier looks for certain specific paths relative to `node_modules`. Specifying a `--template-overrides-dir` will cause mark-applier to first check your specified dir for a file before checking `node_modules`.

| Path                                      | Purpose                                                               | Included by                          |
| ----------------------------------------- | --------------------------------------------------------------------- | ------------------------------------ |
| `mark-applier/templates/index.tmpl`       | The enclosing HTML document; the entry point for all other templates. | mark-applier's compilation semantics |
| `mark-applier/templates/styles.tmpl`      | `<style>` or `<link>` tags that set up CSS.                           | `mark-applier/templates/index.tmpl`  |
| `github-markdown-css/github-markdown.css` | CSS for styling generated markdown                                    | `mark-applier/templates/styles.tmpl` |
| `@wooorm/starry-night/style/both.css`     | CSS for syntax highlighting in fenced code blocks                     | `mark-applier/templates/styles.tmpl` |
| `mark-applier/styles/body-background.css` | CSS that sets the body background color                               |
| `mark-applier/styles/page-layout.css`     | CSS that sets up page margin/padding/width                            |

For example, if you could created a folder named `template_overrides`, then created a file at path `template_overrides/mark-applier/templates/index.tmpl`, then ran mark-applier with `--template-overrides-dir template_overrides`, your created `index.tmpl` would be used instead of the one in `node_modules`.

`node_modules` will still be used as a template search path, though; it will just check your template dir first. So if you reference stuff that isn't in your template dir, it'll check for it in node_modules.

When writing templates, the following macros are available:

| Macro                       | Explanation                                                                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#TITLE`                    | Gets replaced with a `<title>` element and newline when `--title` is present, or just a newline when it isn't present                                                                         |
| `#CONTENT`                  | Gets replaced with the HTML of the compiled markdown. This is the same as what's returned when using `--raw`.                                                                                 |
| `#ORIGIN`                   | Gets replaced with the document origin when `--origin` is present, or `/` otherwise.                                                                                                          |
| `#INCLUDE("some-file.txt")` | Gets replaced with the contents of "some-file.txt". If you specify a non-relative path, mark-applier will attempt to find the file within your `--template-overrides-dir`, then node_modules. |

For a starting point when writing your own template overrides, look at `node_modules/mark-applier/templates/index.original.tmpl` and `node_modules/mark-applier/templates/styles.original.tmpl`.

### Styles in separate CSS files

By default, all styles are included via `<style>` elements in the document head. This makes the html file self-contained. However, if you're going to serve multiple pages, you may wish to instead use `<link>` elements that point to css files. You can accomplish this by using template overrides like so:

- Create a folder named `styles`
- Copy `node_modules/github-markdown-css/github-markdown.css` to `styles/github-markdown-css/github-markdown.css`
- Copy `node_modules/@wooorm/starry-night/style/both.css` to `styles/@wooorm/starry-night/style/both.css`
- Copy `node_modules/mark-applier/styles/body-background.css` to `styles/mark-applier/styles/body-background.css`
- Copy `node_modules/mark-applier/styles/page-layout.css` to `styles/mark-applier/styles/page-layout.css`
- Create a file at the path `template_overrides/mark-applier/templates/styles.tmpl` with this content:
  ```
  #INCLUDE("mark-applier/templates/styles.link-rel.tmpl")
  ```
- Run mark-applier with `--template-overrides-dir template_overrides`
- Deploy the `styles` folder such that it's available at the root of your website URL (ie. by placing it in the "public" or "dist" folder, alongside your HTML files).

## License

MIT
