#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import clefairy from "clefairy";
import glomp from "glomp";
import { pathMarker } from "path-less-traveled";
import * as markApplier from "../dist/index.js";
import { rel } from "../dist/rel.js";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

async function main() {
  const rootDir = pathMarker(rel("..", import.meta.url));
  const inputDir = pathMarker(rel("../fixtures", import.meta.url));
  const outputDir = pathMarker(rel("./rendered", import.meta.url));

  await fs.promises.rm(outputDir(), { recursive: true, force: true });

  const files = await glomp.findMatches(inputDir());
  for (const file of files) {
    let targetPath = outputDir(inputDir.relative(file));
    ensureDir(path.dirname(targetPath));

    if (file.endsWith(".md")) {
      targetPath = targetPath.replace(/\.md$/, ".html");
      console.log(
        `compiling ${rootDir.relative(file)} to ${rootDir.relative(targetPath)}`
      );
      const content = await fs.promises.readFile(file, "utf-8");
      const html = await markApplier.makePageHtml(content, {
        origin: "http://localhost",
      });
      await fs.promises.writeFile(targetPath, html);
    } else {
      console.log(
        `copying ${rootDir.relative(file)} to ${rootDir.relative(targetPath)}`
      );
      await fs.promises.copyFile(file, targetPath);
    }
  }
}

clefairy.run({}, main);
