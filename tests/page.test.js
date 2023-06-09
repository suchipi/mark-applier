import { rootDir, runCli, cleanResult } from "./test-utils";

test("page", async () => {
  const run = runCli(["--input", rootDir("fixtures/fixture.md")]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});
