import { rel } from "./rel.js";
import { renderTemplate } from "./render-template.js";

export function renderCss(): string {
  const templatePath = rel("../templates/css.tmpl", import.meta.url);

  return renderTemplate(templatePath, {});
}
