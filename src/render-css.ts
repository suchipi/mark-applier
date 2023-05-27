import { rel } from "./rel.js";
import { renderTemplate } from "./render-template.js";
import { ThemeName, invalidThemeError } from "./theme.js";

export function renderCss(theme: ThemeName): string {
  let templatePath: string;
  switch (theme) {
    case "auto": {
      templatePath = rel("../templates/auto.css.tmpl", import.meta.url);
      break;
    }
    case "dark": {
      templatePath = rel("../templates/dark.css.tmpl", import.meta.url);
      break;
    }
    case "light": {
      templatePath = rel("../templates/light.css.tmpl", import.meta.url);
      break;
    }
    default: {
      throw invalidThemeError(theme);
    }
  }

  return renderTemplate(templatePath, {});
}
