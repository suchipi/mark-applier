# `mark-applier`

> Markdown-to-Website Generator, GitHub README style

Generate a barebones GitHub-readme-themed website from markdown files.

## Usage

Given a folder of markdown files, like this example named `pages`:

```
pages/
├── index.md
├── some-other-page.md
├── some-page.md
└── some-subfolder/
    └── something.md
```

Run this command:

```sh
$ npx mark-applier ./pages ./website
```

And it will generate a folder of HTML files. Given the earlier `pages` example, running that command will generate a folder named `website` like this:

```website/
├── index.html
├── some-other-page.html
├── some-page.html
└── some-subfolder/
    └── something.html
```

Everything gets rendered the same as it does on GitHub:

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

## Features

- Author websites the same way you write READMEs
- Everything renders the same as it does on GitHub
- Supports both light and dark theme
- Generated pages work without JavaScript

## License

MIT
