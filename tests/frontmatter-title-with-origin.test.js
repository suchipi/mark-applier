import { rootDir, runCli } from "./test-utils";

test("title (frontmatter, with origin)", async () => {
  const run = runCli([
    "--input",
    rootDir("fixtures/index.md"),
    "--origin",
    "https://example.com",
  ]);
  await run.completion;
  expect(run.result).toMatchSnapshot();
});
