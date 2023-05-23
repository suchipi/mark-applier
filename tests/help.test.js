import { rootDir, runCli, cleanResult } from "./test-utils";

test("--help", async () => {
  const run = runCli(["--help"]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});
