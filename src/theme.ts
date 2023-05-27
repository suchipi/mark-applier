const ThemeNames = new Set(["auto", "light", "dark"]);
export type ThemeName = "auto" | "light" | "dark";
export function isThemeName(name: string): name is ThemeName {
  return ThemeNames.has(name);
}
export function invalidThemeError(input: any): Error {
  return new Error(
    `Invalid theme name: '${input}'. Valid theme names are 'light', 'dark', and 'auto'.`
  );
}
