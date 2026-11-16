import { richTextSanitize } from "./schema";
import type { RichTextNode, RichTextValue, RichTextValues, RichTextVariable } from "./types";
import { richTextSafeHref } from "./url";

/** Tags that can receive inline styles (email clients ignore style sheets). */
export interface RichTextInlineStyles {
  p?: string;
  ul?: string;
  ol?: string;
  li?: string;
  a?: string;
  /** Paragraph inside a list item (default: `p`), e.g. without the bottom margin of `p`. */
  liParagraph?: string;
}

export interface RichTextToHtmlOptions {
  /** Inline `style` per tag. Without it: bare HTML, no classes, no styles. */
  inlineStyles?: RichTextInlineStyles;
  /**
   * Variable definitions: an inline variable of kind `url` is rendered as a link to its
   * value (if the value is a safe URL), instead of plain text.
   */
  variables?: readonly RichTextVariable[];
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const label = (node: RichTextNode) => String(node.attrs?.label || node.attrs?.id || "");
const placeholder = (node: RichTextNode) => `{{${label(node)}}}`;

/** Value of an inline variable: the string, a list joined with ", ", or `{{label}}` when absent. */
function inlineValue(node: RichTextNode, values: RichTextValues): string {
  const value = values[String(node.attrs?.id)];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v).join(", ");
  return placeholder(node);
}

/** Items of a list variable; empty when absent. */
function listValue(node: RichTextNode, values: RichTextValues): string[] {
  const value = values[String(node.attrs?.id)];
  const items = typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
  return items.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

/**
 * Body HTML of the document, for an email: text and variable values escaped, links
 * limited to `https:`, `http:` and `mailto:` (a link whose target is missing or refused
 * keeps its text, without a link). No envelope (`<html>`, `<body>`). The document is
 * sanitized first: unknown nodes and marks are never rendered as such.
 */
export function richTextToHtml(
  value: RichTextValue | null | undefined,
  values: RichTextValues = {},
  options: RichTextToHtmlOptions = {},
): string {
  const styles = options.inlineStyles ?? {};
  const style = (css: string | undefined) => (css ? ` style="${escapeHtml(css)}"` : "");
  const urlVariables = new Set((options.variables ?? []).filter((v) => v.kind === "url").map((v) => v.id));
  const link = (href: string, inner: string) => `<a href="${escapeHtml(href)}"${style(styles.a)}>${inner}</a>`;

  const inline = (node: RichTextNode): string => {
    if (node.type === "hardBreak") return "<br>";
    if (node.type === "variable") {
      const text = inlineValue(node, values);
      const href = urlVariables.has(String(node.attrs?.id)) ? richTextSafeHref(text) : null;
      return href ? link(href, escapeHtml(text)) : escapeHtml(text);
    }
    let html = escapeHtml(node.text ?? "");
    let target: string | null = null;
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") html = `<strong>${html}</strong>`;
      else if (mark.type === "italic") html = `<em>${html}</em>`;
      else if (mark.type === "underline") html = `<u>${html}</u>`;
      else if (mark.type === "link") {
        const raw = mark.attrs?.variableId !== undefined ? values[String(mark.attrs.variableId)] : mark.attrs?.href;
        target = richTextSafeHref(raw);
      }
    }
    return target ? link(target, html) : html;
  };
  const paragraph = (node: RichTextNode, css: string | undefined) =>
    `<p${style(css)}>${(node.content ?? []).map(inline).join("") || "&nbsp;"}</p>`;
  const list = (tag: "ul" | "ol", items: string[]) =>
    `<${tag}${style(styles[tag])}>${items.map((item) => `<li${style(styles.li)}>${item}</li>`).join("")}</${tag}>`;
  const listParagraph = styles.liParagraph ?? styles.p;

  return (richTextSanitize(value).content ?? [])
    .map((block) => {
      if (block.type === "paragraph") return paragraph(block, styles.p);
      if (block.type === "variableBlock") {
        const items = listValue(block, values);
        return items.length ? list("ul", items.map((item) => `<p${style(listParagraph)}>${escapeHtml(item)}</p>`)) : "";
      }
      const tag = block.type === "orderedList" ? "ol" : "ul";
      return list(tag, (block.content ?? []).map((item) => (item.content ?? []).map((p) => paragraph(p, listParagraph)).join("")));
    })
    .join("");
}

/**
 * Plain text of the document (text version of an email, previews): variables replaced by
 * `values[id]`, else `{{label}}`; list items as `- item` (`1. item` when ordered); blocks
 * separated by a blank line. A list variable without items produces nothing.
 */
export function richTextToPlainText(value: RichTextValue | null | undefined, values: RichTextValues = {}): string {
  const inline = (node: RichTextNode): string =>
    node.type === "hardBreak" ? "\n" : node.type === "variable" ? inlineValue(node, values) : node.text ?? "";
  const paragraph = (node: RichTextNode) => (node.content ?? []).map(inline).join("");
  return (richTextSanitize(value).content ?? [])
    .flatMap((block): string[] => {
      if (block.type === "paragraph") return [paragraph(block)];
      if (block.type === "variableBlock") {
        const items = listValue(block, values);
        return items.length ? [items.map((item) => `- ${item}`).join("\n")] : [];
      }
      const ordered = block.type === "orderedList";
      return [
        (block.content ?? [])
          .map((item, i) => `${ordered ? `${i + 1}.` : "-"} ${(item.content ?? []).map(paragraph).join("\n")}`)
          .join("\n"),
      ];
    })
    .join("\n\n")
    .trim();
}
