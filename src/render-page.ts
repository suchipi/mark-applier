import { rel } from "./rel.js";
import { renderTemplate } from "./render-template.js";

export function renderPage(
  content: string,
  options: {
    title?: string;
    origin?: string;
  }
): string {
  const templatePath = rel("../templates/page.tmpl", import.meta.url);

  return renderTemplate(templatePath, {
    content,
    title: options.title,
    origin: options.origin,
  });
}
