import type { RichTextIssue, RichTextMark, RichTextNode, RichTextValue, RichTextVariable } from "./types";
import { richTextSafeHref } from "./url";

/** Block nodes allowed under `doc`. */
export const RICH_TEXT_BLOCKS = ["paragraph", "bulletList", "orderedList", "variableBlock"] as const;
/** Inline nodes allowed in a paragraph. */
export const RICH_TEXT_INLINES = ["text", "hardBreak", "variable"] as const;
/** Marks allowed on text. */
export const RICH_TEXT_MARKS = ["bold", "italic", "underline", "link"] as const;

const LISTS = new Set(["bulletList", "orderedList"]);
const INLINES = new Set<string>(RICH_TEXT_INLINES);
const MARKS = new Set<string>(RICH_TEXT_MARKS);

/** An empty document: one empty paragraph. */
export const richTextEmptyDocument = (): RichTextValue => ({ type: "doc", content: [{ type: "paragraph" }] });

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim() !== "";
/** Attributes set to something other than null / undefined. */
const definedKeys = (attrs: unknown) =>
  isObject(attrs) ? Object.keys(attrs).filter((key) => attrs[key] !== null && attrs[key] !== undefined) : [];

/** `true` when the document has neither text nor variable. */
export function richTextIsEmpty(value: RichTextValue | null | undefined): boolean {
  const filled = (node: RichTextNode): boolean =>
    (node.type === "text" && typeof node.text === "string" && node.text.trim() !== "") ||
    node.type === "variable" ||
    node.type === "variableBlock" ||
    (Array.isArray(node.content) && node.content.some(filled));
  return !isObject(value) || !filled(value as RichTextNode);
}

// --- Validation ------------------------------------------------------------------

export interface RichTextValidateOptions {
  /**
   * Known variables. When given, a variable that is not in the list is an issue
   * (`unknown-variable`), as is one used where its kind does not fit (`variable-kind`):
   * a `list` variable inline, a `text`/`url` one as a block, a link to a non-`url` one.
   */
  variables?: readonly RichTextVariable[];
  /** Maximum length of the serialized document (`JSON.stringify`, in characters). */
  maxLength?: number;
}

/**
 * Gaps between a document and the schema; an empty array when it is valid. Meant for an
 * API that refuses a document instead of correcting it (see `richTextSanitize`).
 */
export function richTextValidate(value: unknown, options: RichTextValidateOptions = {}): RichTextIssue[] {
  const issues: RichTextIssue[] = [];
  const add = (path: string, code: RichTextIssue["code"], message: string) => issues.push({ path, code, message });
  const variables = options.variables ? new Map(options.variables.map((v) => [v.id, v.kind ?? "text"])) : null;

  if (!isObject(value) || value.type !== "doc") {
    add("", "invalid-document", "The document must be a node of type \"doc\".");
    return issues;
  }
  if (options.maxLength !== undefined && JSON.stringify(value).length > options.maxLength) {
    add("", "too-long", `The document is longer than ${options.maxLength} characters.`);
  }

  const checkNoAttrs = (node: Record<string, unknown>, path: string) => {
    if (definedKeys(node.attrs).length) add(path, "invalid-attrs", `"${String(node.type)}" takes no attributes.`);
  };
  const children = (node: Record<string, unknown>, path: string): Record<string, unknown>[] => {
    if (node.content === undefined) return [];
    if (!Array.isArray(node.content)) {
      add(path, "invalid-document", "\"content\" must be an array.");
      return [];
    }
    return node.content.map((child, i) => (isObject(child) ? child : (add(`${path}.content[${i}]`, "invalid-document", "A node must be an object."), {})));
  };
  const checkVariable = (node: Record<string, unknown>, path: string, block: boolean) => {
    const attrs = isObject(node.attrs) ? node.attrs : {};
    if (!nonEmptyString(attrs.id) || (attrs.label !== undefined && typeof attrs.label !== "string")) {
      add(path, "invalid-attrs", "A variable takes { id: string, label: string }.");
      return;
    }
    const extra = definedKeys(attrs).filter((key) => key !== "id" && key !== "label");
    if (extra.length) add(path, "invalid-attrs", `Unknown variable attributes: ${extra.join(", ")}.`);
    if (!variables) return;
    const kind = variables.get(attrs.id);
    if (kind === undefined) add(path, "unknown-variable", `Unknown variable: ${attrs.id}.`);
    else if (block !== (kind === "list")) {
      add(path, "variable-kind", block ? `"${attrs.id}" is not a list variable: it goes inline.` : `"${attrs.id}" is a list variable: it goes on its own line.`);
    }
  };
  const checkMarks = (marks: unknown, path: string) => {
    if (marks === undefined) return;
    if (!Array.isArray(marks)) return add(path, "invalid-document", "\"marks\" must be an array.");
    marks.forEach((mark, i) => {
      const markPath = `${path}.marks[${i}]`;
      if (!isObject(mark) || !MARKS.has(String(mark.type))) {
        return add(markPath, "unknown-mark", `Mark not allowed: ${isObject(mark) ? String(mark.type) : typeof mark}.`);
      }
      if (mark.type !== "link") {
        if (definedKeys(mark.attrs).length) add(markPath, "invalid-attrs", `"${mark.type}" takes no attributes.`);
        return;
      }
      const attrs = isObject(mark.attrs) ? mark.attrs : {};
      const keys = definedKeys(attrs);
      const extra = keys.filter((key) => key !== "href" && key !== "variableId");
      if (extra.length) add(markPath, "invalid-attrs", `Unknown link attributes: ${extra.join(", ")}.`);
      const hasHref = keys.includes("href");
      const hasVariable = keys.includes("variableId");
      if (hasHref === hasVariable) {
        return add(markPath, "invalid-attrs", "A link takes either \"href\" or \"variableId\", not both, not neither.");
      }
      if (hasHref && !richTextSafeHref(attrs.href)) {
        return add(markPath, "unsafe-link", "Only https:, http: and mailto: links are allowed.");
      }
      if (hasVariable) {
        if (!nonEmptyString(attrs.variableId)) return add(markPath, "invalid-attrs", "\"variableId\" must be a string.");
        if (!variables) return;
        const kind = variables.get(attrs.variableId);
        if (kind === undefined) add(markPath, "unknown-variable", `Unknown variable: ${attrs.variableId}.`);
        else if (kind !== "url") add(markPath, "variable-kind", `"${attrs.variableId}" is not a url variable: it cannot be a link target.`);
      }
    });
  };
  const checkInline = (node: Record<string, unknown>, path: string) => {
    if (!INLINES.has(String(node.type))) return add(path, "unknown-node", `Node not allowed here: ${String(node.type)}.`);
    if (node.type === "variable") return checkVariable(node, path, false);
    checkNoAttrs(node, path);
    if (node.type === "hardBreak") return;
    if (typeof node.text !== "string" || node.text === "") add(path, "invalid-text", "A text node needs a non-empty \"text\".");
    checkMarks(node.marks, path);
  };
  const checkParagraph = (node: Record<string, unknown>, path: string) => {
    checkNoAttrs(node, path);
    children(node, path).forEach((child, i) => checkInline(child, `${path}.content[${i}]`));
  };

  children(value, "").forEach((block, i) => {
    const path = `content[${i}]`;
    if (block.type === "paragraph") return checkParagraph(block, path);
    if (block.type === "variableBlock") return checkVariable(block, path, true);
    if (!LISTS.has(String(block.type))) return add(path, "unknown-node", `Node not allowed here: ${String(block.type)}.`);
    checkNoAttrs(block, path);
    const items = children(block, path);
    if (!items.length) add(path, "invalid-document", "A list needs at least one item.");
    items.forEach((item, j) => {
      const itemPath = `${path}.content[${j}]`;
      if (item.type !== "listItem") return add(itemPath, "unknown-node", `Node not allowed in a list: ${String(item.type)}.`);
      checkNoAttrs(item, itemPath);
      const paragraphs = children(item, itemPath);
      if (!paragraphs.length) add(itemPath, "invalid-document", "A list item needs a paragraph.");
      paragraphs.forEach((child, k) => {
        const childPath = `${itemPath}.content[${k}]`;
        if (child.type === "paragraph") return checkParagraph(child, childPath);
        if (LISTS.has(String(child.type))) return add(childPath, "nested-list", "Lists cannot be nested.");
        add(childPath, "unknown-node", `Node not allowed in a list item: ${String(child.type)}.`);
      });
    });
  });
  return issues;
}

// --- Sanitize --------------------------------------------------------------------

const cleanVariableAttrs = (attrs: unknown): { id: string; label: string } | null => {
  if (!isObject(attrs) || !nonEmptyString(attrs.id)) return null;
  return { id: attrs.id, label: typeof attrs.label === "string" && attrs.label ? attrs.label : attrs.id };
};

function cleanMarks(marks: unknown): RichTextMark[] {
  if (!Array.isArray(marks)) return [];
  const seen = new Set<string>();
  const result: RichTextMark[] = [];
  for (const mark of marks) {
    if (!isObject(mark) || !MARKS.has(String(mark.type)) || seen.has(String(mark.type))) continue;
    const type = String(mark.type);
    if (type === "link") {
      const attrs = isObject(mark.attrs) ? mark.attrs : {};
      // Both set: the variable wins (the template's intent), never both.
      if (nonEmptyString(attrs.variableId)) result.push({ type, attrs: { variableId: attrs.variableId } });
      else {
        const href = richTextSafeHref(attrs.href);
        if (!href) continue; // unsafe or missing target: the text stays, without a link
        result.push({ type, attrs: { href } });
      }
    } else result.push({ type });
    seen.add(type);
  }
  return result;
}

/** Inline content of a node, whatever it is: unknown inline nodes keep only their text. */
function cleanInlines(nodes: unknown): RichTextNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.flatMap((node): RichTextNode[] => {
    if (!isObject(node)) return [];
    if (node.type === "text") {
      if (typeof node.text !== "string" || node.text === "") return [];
      const marks = cleanMarks(node.marks);
      return [marks.length ? { type: "text", text: node.text, marks } : { type: "text", text: node.text }];
    }
    if (node.type === "hardBreak") return [{ type: "hardBreak" }];
    if (node.type === "variable") {
      const attrs = cleanVariableAttrs(node.attrs);
      return attrs ? [{ type: "variable", attrs }] : [];
    }
    // Unknown inline node (mention, image, emoji node…): its text, if any.
    if (typeof node.text === "string" && node.text) return [{ type: "text", text: node.text }];
    return cleanInlines(node.content);
  });
}

const isInlineLike = (node: unknown) =>
  isObject(node) && (INLINES.has(String(node.type)) || (typeof node.text === "string" && !Array.isArray(node.content)));

const paragraph = (content: RichTextNode[]): RichTextNode =>
  content.length ? { type: "paragraph", content } : { type: "paragraph" };

/** Blocks of a list of nodes: inline runs become paragraphs, unknown blocks are unwrapped. */
function cleanBlocks(nodes: unknown, inList = false): RichTextNode[] {
  if (!Array.isArray(nodes)) return [];
  const blocks: RichTextNode[] = [];
  let run: unknown[] = [];
  const flush = () => {
    if (run.length) blocks.push(paragraph(cleanInlines(run)));
    run = [];
  };
  for (const node of nodes) {
    if (!isObject(node)) continue;
    if (isInlineLike(node)) {
      run.push(node);
      continue;
    }
    flush();
    if (node.type === "paragraph") blocks.push(paragraph(cleanInlines(node.content)));
    else if (LISTS.has(String(node.type))) {
      const items = cleanListItems(node.content);
      // In a list item, a nested list is flattened by the caller (one level only).
      if (items.length) blocks.push({ type: String(node.type), content: items });
    } else if (node.type === "variableBlock") {
      const attrs = cleanVariableAttrs(node.attrs);
      if (attrs && !inList) blocks.push({ type: "variableBlock", attrs });
    } else if (Array.isArray(node.content)) {
      // Unknown block (heading, blockquote, code, table…): a paragraph of its text, or its blocks.
      if (node.content.every(isInlineLike)) blocks.push(paragraph(cleanInlines(node.content)));
      else blocks.push(...cleanBlocks(node.content, inList));
    }
    // Unknown leaf (image, horizontal rule…): dropped.
  }
  flush();
  return blocks;
}

/** Items of a list, one level: the items of a nested list follow their parent item. */
function cleanListItems(nodes: unknown): RichTextNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.flatMap((node): RichTextNode[] => {
    if (!isObject(node)) return [];
    const blocks = node.type === "listItem" ? cleanBlocks(node.content, true) : cleanBlocks([node], true);
    const paragraphs = blocks.filter((b) => b.type === "paragraph");
    const nested = blocks.filter((b) => LISTS.has(b.type)).flatMap((list) => list.content ?? []);
    const item = paragraphs.length ? [{ type: "listItem", content: paragraphs }] : [];
    return [...item, ...nested];
  });
}

/**
 * The document reduced to the schema: unknown nodes become their text (or are dropped),
 * unknown marks and attributes are removed, unsafe links lose their link, nested lists are
 * flattened to one level. Always returns a valid `doc`.
 */
export function richTextSanitize(value: unknown): RichTextValue {
  if (!isObject(value)) return richTextEmptyDocument();
  const content = cleanBlocks(value.type === "doc" ? value.content : [value]);
  return content.length ? { type: "doc", content } : richTextEmptyDocument();
}
