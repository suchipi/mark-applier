import { rootDir, runCli, cleanResult } from "./test-utils";
import helpText from "../dist/helptext";

test("--help", async () => {
  const run = runCli(["--help"]);
  await run.completion;
  expect(run.result.code).toBe(0);
  expect(run.result.stderr).toBe("");
  expect(run.result.stdout).toBe(helpText + "\n");
});
