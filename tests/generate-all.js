#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const glomp = require("glomp").default;
const { pathMarker } = require("path-less-traveled");
const markApplier = require("..");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const inputDir = pathMarker(path.resolve(__dirname, "pages"));
const outputDir = pathMarker(path.resolve(__dirname, "generated"));

const files = glomp.findMatchesSync(inputDir());
for (const file of files) {
  const targetPath = outputDir(inputDir.relative(file));
  ensureDir(path.dirname(targetPath));

  if (file.endsWith(".md")) {
    const content = fs.readFileSync(file, "utf-8");
    const html = markApplier.applyMarks(content, {
      title: inputDir.relative(file),
    });
    fs.writeFileSync(targetPath, html);
  } else {
    fs.copyFileSync(file, targetPath);
  }
}
