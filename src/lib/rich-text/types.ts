/**
 * Rich text document (Tiptap JSON) of `RichTextEditor`, and the closed schema shared with
 * the APIs that render it. Pure types: no React, no DOM.
 */

/** A node of the document, as stored (Tiptap / ProseMirror JSON). */
export interface RichTextNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: RichTextMark[];
  content?: RichTextNode[];
}

export interface RichTextMark {
  type: string;
  attrs?: Record<string, unknown>;
}

/** The document: a `doc` node. `null` / `undefined` stand for an empty document. */
export type RichTextValue = RichTextNode;

/**
 * - `text` (default): inline value, a string.
 * - `url`: inline value, a string; can also be the target of a link (`link.attrs.variableId`).
 *   Inserted as text, it is rendered as a clickable URL.
 * - `list`: a list of strings, inserted as a block of its own (`variableBlock`), rendered as
 *   a bulleted list. Not allowed in a single-line field.
 */
export type RichTextVariableKind = "text" | "url" | "list";

export interface RichTextVariable {
  /** Serialized in the document (`attrs.id`) and in template strings (`{{id}}`). */
  id: string;
  /** Shown in the editor and in the insertion menu. */
  label: string;
  /** Default `"text"`. */
  kind?: RichTextVariableKind;
}

/** Values of the variables at render time: a string, or a list of strings for `list` variables. */
export type RichTextValues = Record<string, string | readonly string[] | undefined>;

/** A gap between a document and the schema (`richTextValidate`). */
export interface RichTextIssue {
  /** Where it is, e.g. `content[2].content[0].marks[1]`. */
  path: string;
  code:
    | "invalid-document"
    | "too-long"
    | "unknown-node"
    | "unknown-mark"
    | "invalid-attrs"
    | "invalid-text"
    | "nested-list"
    | "unsafe-link"
    | "unknown-variable"
    | "variable-kind";
  message: string;
}
