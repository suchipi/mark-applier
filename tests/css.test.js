import { rootDir, runCli } from "./test-utils";

test("--css", async () => {
  const run = runCli(["--css"]);
  await run.completion;
  expect(run.result).toMatchSnapshot();
});
