import { rootDir, runCli, cleanResult } from "./test-utils";

test("reading from stdin", async () => {
  const run = runCli(["--raw"]);
  run.write("# hi there\n");
  run.write("yeah\n");
  run.write("\n---\nsuper *cool*!");
  run.close("stdin");
  await run.completion;
  expect(cleanResult(run.result)).toMatchInlineSnapshot(`
{
  "code": 0,
  "error": false,
  "stderr": "WARNING: I'd like to make links to external websites open in a new tab, but I can't do that unless you tell me where your website will be hosted. If you want that, specify your origin like this: '--origin https://example.com'.
",
  "stdout": "<h1 id="hi-there"><a class="link-icon" aria-label="link to heading" tabindex="0" href="#hi-there"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <path fill="currentColor" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
</svg></a>hi there</h1>
<p>yeah</p>
<hr>
<p>super <em>cool</em>!</p>",
}
`
);
});
