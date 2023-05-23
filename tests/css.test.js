import { rootDir, runCli, cleanResult } from "./test-utils";

test("--css", async () => {
  const run = runCli(["--css"]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});
