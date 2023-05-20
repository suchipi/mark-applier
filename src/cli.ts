#!/usr/bin/env node
import fs from "node:fs";
import * as clefairy from "clefairy";
import { applyMarks } from "./index.js";
import { parseArgv, Flags, Context } from "./parse-argv.js";

clefairy.run(
  {
    raw: clefairy.optionalBoolean,
    css: clefairy.optionalBoolean,
    title: clefairy.optionalString,
    origin: clefairy.optionalString,
    i: clefairy.optionalPath,
    input: clefairy.optionalPath,
    o: clefairy.optionalPath,
    output: clefairy.optionalPath,
  },
  async (options: Flags) => {
    const context = parseArgv(options);

    // TODO left off here; bedtime

    if (process.stdin.isTTY) {
      throw new Error("Please pipe markdown into this process as its stdin.");
    }

    const input = fs.readFileSync(process.stdin.fd, "utf-8");
    const output = await applyMarks(input, options);
    process.stdout.write(output);
  }
);
