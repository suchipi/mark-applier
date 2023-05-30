import { rootDir, runCli, cleanResult } from "./test-utils";

test("--read-front-matter", async () => {
  const run = runCli(["--read-front-matter"]);
  run.write(
    `
---
title: Something
somethingElse: yeah
---

# Something!

yeah
  `.trim()
  );
  run.close("stdin");
  await run.completion;
  expect(cleanResult(run.result)).toMatchInlineSnapshot(`
{
  "code": 0,
  "error": false,
  "stderr": "",
  "stdout": "{
  "title": "Something",
  "somethingElse": "yeah"
}",
}
`);
});
