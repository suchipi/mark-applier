import * as kleur from "kleur";

const printedMessages = new Set<string>();

export function warn(msg: string) {
  if (printedMessages.has(msg)) return;

  console.warn(kleur.yellow(`WARNING: ${msg}`));
  printedMessages.add(msg);
}
