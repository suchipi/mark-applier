#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import clefairy from "clefairy";
import glomp from "glomp";
import { pathMarker } from "path-less-traveled";
import * as markApplier from "../dist/index.js";
import { rel } from "../dist/rel.js";

function ensureDir(dirPath) {
  // fs.mkdirSync(dirPath, { recursive: true });
}

async function main() {
  const rootDir = pathMarker(rel("..", import.meta.url));
  const inputDir = pathMarker(rel("./input", import.meta.url));
  const outputDir = pathMarker(rel("./output", import.meta.url));

  const files = await glomp.findMatches(inputDir());
  for (const file of files) {
    const targetPath = outputDir(inputDir.relative(file));
    ensureDir(path.dirname(targetPath));

    if (file.endsWith(".md")) {
      console.log(
        `compiling ${rootDir.relative(file)} to ${rootDir.relative(targetPath)}`
      );
      const content = await fs.promises.readFile(file, "utf-8");
      const html = await markApplier.applyMarks(content, {
        title: inputDir.relative(file),
      });
      // await fs.promises.writeFile(targetPath, html);
    } else {
      console.log(
        `copying ${rootDir.relative(file)} to ${rootDir.relative(targetPath)}`
      );
      // await fs.promises.writeFile(file, targetPath);
    }
  }
}

clefairy.run({}, main);