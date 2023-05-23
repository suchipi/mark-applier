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
  "stderr": "",
  "stdout": "<h1>hi there</h1>
<p>yeah</p>
<hr>
<p>super <em>cool</em>!</p>",
}
`);
});
