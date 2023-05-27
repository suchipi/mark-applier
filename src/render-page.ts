import { rel } from "./rel.js";
import { renderCss } from "./render-css.js";
import { renderTemplate } from "./render-template.js";
import { invalidThemeError, isThemeName } from "./theme.js";

export function renderPage(
  content: string,
  options: {
    title?: string;
    origin?: string;
    theme?: string;
  }
): string {
  const theme = options.theme ?? "auto";
  if (!isThemeName(theme)) {
    throw invalidThemeError(theme);
  }

  const css = renderCss(theme);

  let checkboxHtml = "";
  if (theme === "auto") {
    checkboxHtml = renderTemplate(
      rel("../templates/theme-toggle.html.tmpl", import.meta.url),
      {}
    );
  }

  return renderTemplate(
    rel("../templates/page.html.tmpl", import.meta.url),
    {
      content,
      title: options.title,
      origin: options.origin,
    },
    { css, checkboxHtml }
  );
}
