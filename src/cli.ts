#!/usr/bin/env node
import fs from "node:fs";
import * as clefairy from "clefairy";
import * as markApplier from "./index.js";
import { parseArgv, Flags } from "./parse-argv.js";
import helptext from "./helptext.js";

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
    h: clefairy.optionalBoolean,
    help: clefairy.optionalBoolean,
  },
  async (options: Flags) => {
    const context = parseArgv(options);

    if (context.target === "help") {
      console.log(helptext);
      return;
    }

    if (context.target === "css") {
      const output = markApplier.makeCss();
      if (context.outputPath) {
        await fs.promises.writeFile(context.outputPath, output, "utf-8");
      } else {
        process.stdout.write(output, "utf-8");
      }
      return;
    }

    let markdown: string;
    if (context.inputPath != null) {
      markdown = await fs.promises.readFile(context.inputPath, "utf-8");
    } else if (!process.stdin.isTTY) {
      markdown = fs.readFileSync(process.stdin.fd, "utf-8");
    } else {
      throw new Error(
        "Please either specify an input file (with --input) or pipe markdown into this process as its stdin."
      );
    }

    let output: string;
    if (context.target === "raw") {
      output = await markApplier.makeRawHtml(markdown, context);
    } else if (context.target === "page") {
      output = await markApplier.makePageHtml(markdown, context);
    } else {
      throw new Error(
        "Internal error: unknown CLI target: " + (context as any).target
      );
    }

    if (context.outputPath != null) {
      await fs.promises.writeFile(context.outputPath, output, "utf-8");
    } else {
      process.stdout.write(output, "utf-8");
    }
  }
);
