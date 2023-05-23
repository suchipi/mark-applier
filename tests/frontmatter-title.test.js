import { rootDir, runCli } from "./test-utils";

test("title (frontmatter)", async () => {
  const run = runCli(["--input", rootDir("fixtures/index.md")]);
  await run.completion;
  expect(run.result).toMatchSnapshot();
});
