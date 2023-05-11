export async function markdownToHtml(input: string): Promise<string> {
  // have to use dynamic import because of CommonJS/ESM business...
  const [
    { unified },
    { default: remarkParse },
    { default: remarkGfm },
    { default: remarkRehype },
    { default: rehypeStringify },
  ] = await Promise.all([
    import("unified"),
    import("remark-parse"),
    import("remark-gfm"),
    import("remark-rehype"),
    import("rehype-stringify"),
  ]);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process({ value: input });

  return result.toString();
}
