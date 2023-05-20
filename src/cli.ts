#!/usr/bin/env node
import fs from "node:fs";
import * as clefairy from "clefairy";
import { applyMarks } from "./index.js";

clefairy.run(
  {
    raw: clefairy.optionalBoolean,
    css: clefairy.optionalBoolean,
    title: clefairy.optionalString,
    origin: clefairy.optionalString,
  },
  async (options) => {
    if (process.stdin.isTTY) {
      throw new Error("Please pipe markdown into this process as its stdin.");
    }

    const input = fs.readFileSync(process.stdin.fd, "utf-8");
    const output = await applyMarks(input, options);
    process.stdout.write(output);
  }
);
