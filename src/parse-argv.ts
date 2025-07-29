import { Path } from "clefairy";
import { warn } from "./warn.js";
import { ThemeName, invalidThemeError, isThemeName } from "./theme.js";

export type Flags = {
  raw?: boolean;
  css?: boolean;
  title?: string;
  origin?: string;
  i?: Path;
  o?: Path;
  input?: Path;
  output?: Path;
  h?: boolean;
  help?: boolean;
  theme?: string;
  readFrontMatter?: boolean;
};

export type Context =
  | {
      target: "help";
    }
  | {
      target: "css";
      // null means write to stdout
      outputPath: Path | null;
      theme: ThemeName;
    }
  | {
      target: "page";
      // null means read stdin
      inputPath: Path | null;
      // null means write to stdout
      outputPath: Path | null;
      title: string | null;
      origin: string | null;
      theme: ThemeName;
    }
  | {
      target: "raw";
      // null means read stdin
      inputPath: Path | null;
      // null means write to stdout
      outputPath: Path | null;
      origin: string | null;
    }
  | {
      target: "readFrontMatter";
      // null means read stdin
      inputPath: Path | null;
      // null means write to stdout
      outputPath: Path | null;
    };

export function parseArgv(flags: Flags): Context {
  if (flags.h || flags.help) {
    return { target: "help" };
  }

  const inputPath = flags.input ?? flags.i ?? null;
  const outputPath = flags.output ?? flags.o ?? null;
  const title = flags.title ?? null;
  const origin = flags.origin ?? null;
  const theme = flags.theme ?? "auto";
  if (!isThemeName(theme)) {
    throw invalidThemeError(theme);
  }

  if (flags.readFrontMatter) {
    return { target: "readFrontMatter", inputPath, outputPath };
  }

  if (flags.css) {
    if (title) {
      warn(`When using the '--css' option, the '--title' option is ignored.`);
    }
    if (origin) {
      warn(`When using the '--css' option, the '--origin' option is ignored.`);
    }

    return {
      target: "css",
      outputPath,
      theme,
    };
  } else if (flags.raw) {
    if (title) {
      warn(`When using the '---raw' option, the '---title' option is ignored.`);
    }
    if (origin) {
      warn(
        `When using the '---raw' option, the '---origin' option is ignored.`
      );
    }

    return {
      target: "raw",
      inputPath,
      outputPath,
      origin,
    };
  } else {
    return {
      target: "page",
      inputPath,
      outputPath,
      title,
      origin,
      theme,
    };
  }
}
