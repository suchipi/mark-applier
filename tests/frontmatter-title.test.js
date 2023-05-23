import { rootDir, runCli, cleanResult } from "./test-utils";

test("title (frontmatter)", async () => {
  const run = runCli(["--input", rootDir("fixtures/index.md")]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});
