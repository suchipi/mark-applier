import { rel } from "../dist/rel.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { spawn } = require("first-base");
const { pathMarker } = require("path-less-traveled");

export const rootDir = pathMarker(rel("..", import.meta.url));

export function runCli(args, options) {
  return spawn(rootDir("dist/cli.js"), args, options);
}
