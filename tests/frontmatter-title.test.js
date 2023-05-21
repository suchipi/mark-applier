import { rootDir, runCli } from "./test-utils";

test("title (frontmatter)", async () => {
  const run = runCli(["--input", rootDir("manual-tests/input/index.md")]);
  await run.completion;
  expect(run.result).toMatchSnapshot();
});
