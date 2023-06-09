import { rel } from "../dist/rel.js";
import { createRequire } from "module";
import * as util from "node:util";
const require = createRequire(import.meta.url);
const { spawn } = require("first-base");
const { pathMarker } = require("path-less-traveled");

export const rootDir = pathMarker(rel("..", import.meta.url));

export function runCli(args, options) {
  return spawn(rootDir("dist/cli.js"), args, options);
}

export function cleanString(input) {
  return util
    .stripVTControlCharacters(input)
    .replaceAll(rootDir(), "<rootDir>");
}

export function cleanResult(result) {
  const { code, error, stderr, stdout } = result;
  return {
    code,
    error,
    stderr: cleanString(stderr),
    stdout: cleanString(stdout),
  };
}
