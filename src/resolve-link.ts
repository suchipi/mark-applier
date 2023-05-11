// TODO this isn't used yet

import fs from "node:fs";
import path from "node:path";

// optionally a protocol and colon, followed by two slashes
const EXTERNAL_URL = /^(?:[A-Za-z0-9_\-]+:)?\/\//;
// optionally a leading dot or dot-dot, followed by a slash and some content
const RELPATH = /^(?:\.|\.\.)\/[^/]/;
// leading slash followed by some content
const ROOTPATH = /^\/[^/]/;

export function resolveLink(href: string, location: string, root: string) {
  if (EXTERNAL_URL.test(href)) {
    return href;
  }

  const pathResult = resolvePath(href, location, root);
  if (pathResult == null) {
    return href;
  }

  const extResult = resolveExtension(href, location, root);
  if (extResult == null) {
    return href;
  }

  if (extResult.startsWith(root)) {
    let rooted = extResult.slice(root.length);
    if (!rooted.startsWith("/")) {
      rooted = "/" + rooted;
    }
    return rooted;
  } else {
    return href;
  }
}

function resolvePath(
  href: string,
  location: string,
  root: string
): string | null {
  if (ROOTPATH.test(href)) {
    return path.join(root, href);
  }

  if (RELPATH.test(href)) {
    const sourceDir = path.dirname(location);
    const hrefInSourceDir = path.resolve(sourceDir, href);
    if (!hrefInSourceDir.startsWith(root)) {
      // not allowed to reach out of the root dir.
      return null;
    } else {
      return hrefInSourceDir;
    }
  }

  const err = new Error(
    "Attempting to resolve path which is neither root or relative: " +
      JSON.stringify(href)
  );
  throw Object.assign(err, {
    href,
    location,
    root,
  });
}

function resolveExtension(
  href: string,
  location: string,
  root: string
): string | null {
  const candidates = [href];

  if (href.endsWith(".md")) {
    candidates.push(href.replace(/\.md$/, ".html"));
  } else if (path.extname(href) === "") {
    candidates.push(href + ".html");
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}
