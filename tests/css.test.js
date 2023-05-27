import { rootDir, runCli, cleanResult } from "./test-utils";

test("--css", async () => {
  const run = runCli(["--css"]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});

test("--css --theme dark", async () => {
  const run = runCli(["--css", "--theme", "dark"]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});

test("--css --theme light", async () => {
  const run = runCli(["--css", "--theme", "light"]);
  await run.completion;
  expect(cleanResult(run.result)).toMatchSnapshot();
});

test("'--css --theme auto' is same as no theme specified", async () => {
  const run1 = runCli(["--css"]);
  await run1.completion;
  const run2 = runCli(["--css", "--theme", "auto"]);
  await run2.completion;

  expect(cleanResult(run1.result)).toEqual(cleanResult(run2.result));
});
