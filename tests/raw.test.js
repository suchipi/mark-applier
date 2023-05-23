import { rootDir, runCli } from "./test-utils";

test("--raw", async () => {
  const run = runCli(["--input", rootDir("fixtures/fixture.md"), "--raw"]);
  await run.completion;
  expect(run.result).toMatchSnapshot();
});
