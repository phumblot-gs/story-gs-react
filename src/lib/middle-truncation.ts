/** Découpe `text` en une tête tronquable et une fin toujours visible. */
export function splitForMiddleTruncation(
  text: string,
  keepBeforeExtension = 1,
): { head: string; tail: string } {
  const dot = text.lastIndexOf(".");
  // Pas d'extension (ou fichier caché type « .env ») : on garde la fin brute.
  const extensionLength = dot > 0 ? text.length - dot : 0;
  const tailLength = Math.min(text.length, extensionLength + keepBeforeExtension);
  return { head: text.slice(0, text.length - tailLength), tail: text.slice(text.length - tailLength) };
}
