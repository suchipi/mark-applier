import path from "node:path";

export function rel(specifier: string, importMetaUrl: string) {
  return path.resolve(
    new URL(specifier, importMetaUrl).toString().replace(/^file:\//, "")
  );
}
