/**
 * Tiptap extensions of `RichTextEditor`: the `variable` and `variableBlock` nodes, the
 * link mark with `href` or `variableId`, the `{{` suggestion, the `{{id}}` input / paste
 * conversion and the decorations of variables the editor does not know.
 */
import { Extension, InputRule, Node, PasteRule, mergeAttributes, type Editor } from "@tiptap/core";
import Link, { type LinkOptions } from "@tiptap/extension-link";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { richTextSafeHref } from "@/lib/rich-text/url";
import type { RichTextVariable } from "@/lib/rich-text/types";

/** What the extensions read at each use (the component updates it on every render). */
export interface RichTextEditorContext {
  variables: readonly RichTextVariable[];
  singleLine: boolean;
  unknownVariableLabel: string;
  onLinkShortcut: () => void;
}
export type RichTextContextRef = { current: RichTextEditorContext };

const kindOf = (variable: RichTextVariable) => variable.kind ?? "text";
const findVariable = (ref: RichTextContextRef, id: string) => ref.current.variables.find((v) => v.id === id);

/** Chip of an inline variable; `data-unknown` (decoration) when the editor does not know it. */
export const VARIABLE_CHIP_CLASS =
  "rich-text-variable mx-px inline-block rounded-sm bg-blue/20 px-1 align-baseline text-[0.95em] font-medium leading-snug [&[data-unknown]]:bg-[#f5a623]/25 [&[data-unknown]]:outline [&[data-unknown]]:outline-1 [&[data-unknown]]:outline-[#f5a623]";
/** Full-width chip of a list variable. */
export const VARIABLE_BLOCK_CLASS =
  "rich-text-variable-block my-1 block rounded-sm bg-blue/20 px-2 py-1 text-sm font-medium [&[data-unknown]]:bg-[#f5a623]/25 [&[data-unknown]]:outline [&[data-unknown]]:outline-1 [&[data-unknown]]:outline-[#f5a623]";

const variableAttributes = () => ({
  id: {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute("data-variable-id"),
    renderHTML: (attrs: Record<string, unknown>) => ({ "data-variable-id": attrs.id }),
  },
  label: {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute("data-variable-label"),
    renderHTML: (attrs: Record<string, unknown>) => ({ "data-variable-label": attrs.label }),
  },
});
const chipText = (attrs: Record<string, unknown>) => `{{${String(attrs.label || attrs.id)}}}`;

/** Inline variable: an atom, deleted at once, never edited character by character. */
export const VariableNode = Node.create<{ context: RichTextContextRef | null }>({
  name: "variable",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,
  addOptions: () => ({ context: null }),
  addAttributes: variableAttributes,
  parseHTML: () => [{ tag: "span[data-variable-id]" }],
  renderHTML({ node, HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: VARIABLE_CHIP_CLASS, contenteditable: "false" }), chipText(node.attrs)];
  },
  // Copied as plain text, a chip becomes {{id}}: pasted back, it is a chip again.
  renderText: ({ node }) => `{{${String(node.attrs.id)}}}`,
});

/** List variable: a block of its own (a <ul> inside a <p> would be invalid HTML). */
export const VariableBlockNode = Node.create({
  name: "variableBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: false,
  addAttributes: variableAttributes,
  parseHTML: () => [{ tag: "div[data-variable-id]" }],
  renderHTML({ node, HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: VARIABLE_BLOCK_CLASS, contenteditable: "false" }), chipText(node.attrs)];
  },
  renderText: ({ node }) => `{{${String(node.attrs.id)}}}`,
});

/** Inserts a variable where it belongs: inline, or as a block of its own for a `list` variable. */
export function insertVariable(editor: Editor, variable: RichTextVariable, range?: { from: number; to: number }) {
  const attrs = { id: variable.id, label: variable.label };
  const chain = editor.chain().focus();
  if (range) chain.deleteRange(range);
  if (kindOf(variable) === "list") chain.insertContent({ type: "variableBlock", attrs });
  else chain.insertContent([{ type: "variable", attrs }, { type: "text", text: " " }]);
  chain.run();
}

const TOKEN = /\{\{\s*([\w.-]+)\s*\}\}/;

/** Typed or pasted `{{id}}` of a known variable → its chip (a block for a list variable). */
export const VariableTokens = Extension.create<{ context: RichTextContextRef | null }>({
  name: "variableTokens",
  addOptions: () => ({ context: null }),
  addInputRules() {
    const ref = this.options.context;
    return [
      new InputRule({
        find: new RegExp(`${TOKEN.source}$`),
        handler: ({ state, range, match }) => {
          const variable = ref && findVariable(ref, match[1]);
          if (!variable || (kindOf(variable) === "list" && ref.current.singleLine)) return null;
          const attrs = { id: variable.id, label: variable.label };
          const type = state.schema.nodes[kindOf(variable) === "list" ? "variableBlock" : "variable"];
          state.tr.replaceWith(range.from, range.to, type.create(attrs));
        },
      }),
    ];
  },
  addPasteRules() {
    const ref = this.options.context;
    return [
      new PasteRule({
        find: new RegExp(TOKEN.source, "g"),
        handler: ({ state, range, match }) => {
          const variable = ref && findVariable(ref, match[1]);
          if (!variable || kindOf(variable) === "list") return null;
          state.tr.replaceWith(range.from, range.to, state.schema.nodes.variable.create({ id: variable.id, label: variable.label }));
        },
      }),
    ];
  },
});

/** `{{` opens the variables list (the component renders it). */
export function variableSuggestion(
  editor: Editor,
  ref: RichTextContextRef,
  render: SuggestionOptions<RichTextVariable>["render"],
) {
  return Suggestion<RichTextVariable>({
    editor,
    pluginKey: new PluginKey("richTextVariableSuggestion"),
    char: "{{",
    allowedPrefixes: null,
    allowSpaces: false,
    items: ({ query }) => {
      const q = query.replace(/\}+$/, "").toLowerCase();
      return ref.current.variables
        .filter((v) => !(ref.current.singleLine && kindOf(v) === "list"))
        .filter((v) => !q || v.label.toLowerCase().includes(q) || v.id.toLowerCase().includes(q))
        .slice(0, 8);
    },
    command: ({ editor: current, range, props }) => insertVariable(current, props, range),
    render,
  });
}

export const VariableSuggestion = Extension.create<{
  context: RichTextContextRef | null;
  render: SuggestionOptions<RichTextVariable>["render"] | null;
}>({
  name: "variableSuggestion",
  addOptions: () => ({ context: null, render: null }),
  addProseMirrorPlugins() {
    const { context, render } = this.options;
    return context && render ? [variableSuggestion(this.editor, context, render)] : [];
  },
});

/**
 * Variables unknown to the editor (or misplaced: a list inline, a text variable as a
 * block) get `data-unknown` and a title, to explain why the API would refuse them.
 */
export const VariableStatus = Extension.create<{ context: RichTextContextRef | null }>({
  name: "variableStatus",
  addOptions: () => ({ context: null }),
  addProseMirrorPlugins() {
    const ref = this.options.context;
    if (!ref) return [];
    return [
      new Plugin({
        key: new PluginKey("richTextVariableStatus"),
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name !== "variable" && node.type.name !== "variableBlock") return;
              const variable = findVariable(ref, String(node.attrs.id));
              const misplaced = variable && (kindOf(variable) === "list") !== (node.type.name === "variableBlock");
              if (variable && !misplaced) return;
              decorations.push(Decoration.node(pos, pos + node.nodeSize, { "data-unknown": "", title: ref.current.unknownVariableLabel }));
            });
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});

/**
 * Link mark: `href` (fixed URL, `https:`, `http:` or `mailto:` only) or `variableId` (a
 * `url` variable), never both. Not opened on click in the editor. ⌘/Ctrl+K opens the link
 * input of the component.
 */
export const RichTextLink = Link.extend<LinkOptions & { context: RichTextContextRef | null }>({
  addOptions() {
    return { ...this.parent!(), context: null };
  },
  addAttributes() {
    return {
      href: { default: null, parseHTML: (element: HTMLElement) => element.getAttribute("data-variable-id") ? null : element.getAttribute("href") },
      variableId: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-variable-id"),
        renderHTML: (attrs: Record<string, unknown>) => (attrs.variableId ? { "data-variable-id": attrs.variableId } : {}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "a[data-variable-id]" }, ...(this.parent?.() ?? [])];
  },
  renderHTML({ HTMLAttributes }) {
    const href = richTextSafeHref(HTMLAttributes.href);
    return ["a", mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: href ?? undefined }), 0];
  },
  addKeyboardShortcuts() {
    const ref = this.options.context;
    return {
      "Mod-k": () => {
        ref?.current.onLinkShortcut();
        return true;
      },
    };
  },
}).configure({
  openOnClick: false,
  autolink: true,
  linkOnPaste: true,
  defaultProtocol: "https",
  isAllowedUri: (url) => richTextSafeHref(url) !== null,
  HTMLAttributes: { target: null, rel: null, class: "underline" },
});

/** Single-line field: Enter and Shift+Enter do nothing. */
export const SingleLineKeys = Extension.create({
  name: "singleLineKeys",
  addKeyboardShortcuts: () => ({ Enter: () => true, "Shift-Enter": () => true, "Mod-Enter": () => true }),
});
