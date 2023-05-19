import matter from "gray-matter";

export function getFrontMatter(markdown: string): {
  data: { [key: string]: any };
  content: string;
} {
  return matter(markdown);
}
