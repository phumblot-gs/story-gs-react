import { richTextSanitize } from "./schema";
import type { RichTextNode, RichTextValue, RichTextValues, RichTextVariable } from "./types";

/** `{{id}}` in a template string; spaces inside the braces are tolerated (`{{ id }}`). */
export const RICH_TEXT_VARIABLE_TOKEN = /\{\{\s*([\w.-]+)\s*\}\}/g;

/**
 * Single-line template string of a document (e.g. an email subject): variables serialized
 * as `{{id}}`, line breaks and paragraphs joined by a space.
 */
export function richTextToTemplateString(value: RichTextValue | null | undefined): string {
  const inline = (node: RichTextNode): string =>
    node.type === "variable" ? `{{${String(node.attrs?.id)}}}` : node.type === "hardBreak" ? " " : node.text ?? "";
  const block = (node: RichTextNode): string =>
    node.type === "paragraph"
      ? (node.content ?? []).map(inline).join("")
      : node.type === "variableBlock"
        ? `{{${String(node.attrs?.id)}}}`
        : (node.content ?? []).map(block).join(" ");
  return (richTextSanitize(value).content ?? []).map(block).join(" ").replace(/[\r\n]+/g, " ").trim();
}

/**
 * Document of a single-line template string: each `{{id}}` of a known variable becomes a
 * variable node (its label taken from `variables`); an unknown one, or a `list` variable
 * (not allowed on one line), stays text.
 */
export function richTextFromTemplateString(text: string, variables: readonly RichTextVariable[] = []): RichTextValue {
  const known = new Map(variables.filter((v) => (v.kind ?? "text") !== "list").map((v) => [v.id, v]));
  const content: RichTextNode[] = [];
  const pushText = (part: string) => {
    if (!part) return;
    const last = content[content.length - 1];
    if (last?.type === "text") last.text += part;
    else content.push({ type: "text", text: part });
  };
  const source = text.replace(/[\r\n]+/g, " ");
  let index = 0;
  for (const match of source.matchAll(RICH_TEXT_VARIABLE_TOKEN)) {
    pushText(source.slice(index, match.index));
    const variable = known.get(match[1]);
    if (variable) content.push({ type: "variable", attrs: { id: variable.id, label: variable.label } });
    else pushText(match[0]);
    index = (match.index ?? 0) + match[0].length;
  }
  pushText(source.slice(index));
  return { type: "doc", content: [content.length ? { type: "paragraph", content } : { type: "paragraph" }] };
}

/**
 * Template string with its `{{id}}` replaced by `values[id]` (a list is joined with ", "),
 * on one line. An unknown or missing variable keeps its `{{id}}`. Plain text, not HTML.
 */
export function richTextRenderTemplateString(text: string, values: RichTextValues = {}): string {
  return text
    .replace(RICH_TEXT_VARIABLE_TOKEN, (token, id: string) => {
      const value = values[id];
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.join(", ");
      return token;
    })
    .replace(/[\r\n]+/g, " ")
    .trim();
}
