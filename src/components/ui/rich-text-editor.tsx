import * as React from "react";
import { createPortal } from "react-dom";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import { ListItem } from "@tiptap/extension-list";
import { exitSuggestion, type SuggestionProps } from "@tiptap/suggestion";
import { Bold, Braces, Italic, Link2, List, ListOrdered, Underline } from "lucide-react";
import { useBgContext } from "@/components/layout/BgContext";
import { cn } from "@/lib/utils";
import { richTextEmptyDocument, richTextIsEmpty, richTextSanitize } from "@/lib/rich-text/schema";
import { richTextToPlainText } from "@/lib/rich-text/render";
import { richTextFromTemplateString, richTextToTemplateString } from "@/lib/rich-text/template";
import { richTextNormalizeUrl } from "@/lib/rich-text/url";
import type { RichTextValue, RichTextVariable } from "@/lib/rich-text/types";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import {
  EditorEmojiButton,
  editorPopupClass,
  editorSurfaceClass,
  editorToolClass,
  suggestionsHost,
  suggestionsPosition,
  useDismissSuggestions,
  useScrollActiveOption,
} from "./editor-shared";
import {
  RichTextLink,
  SingleLineKeys,
  VariableBlockNode,
  VariableNode,
  VariableStatus,
  VariableSuggestion,
  VariableTokens,
  insertVariable,
  type RichTextEditorContext,
} from "./rich-text-extensions";

export type { RichTextValue, RichTextVariable, RichTextVariableKind } from "@/lib/rich-text/types";

const englishLabels = {
  toolbar: "Formatting", bold: "Bold", italic: "Italic", underline: "Underline", link: "Link",
  bulletList: "Bulleted list", orderedList: "Numbered list", emoji: "Insert emoji", emojiLoading: "Loading emojis…",
  variable: "Insert a variable", variables: "Variables", noVariables: "No variable found",
  placeholder: "Write your message…", linkUrl: "URL", linkFixed: "Fixed URL", linkVariable: "Variable",
  linkApply: "Apply", linkRemove: "Remove link", linkInvalid: "Only https, http and mailto links are allowed.",
  linkTarget: "Link target", unknownVariable: "Unknown variable: it will be refused when sending.",
  kindUrl: "URL", kindList: "List",
};
export type RichTextEditorLabels = typeof englishLabels;
const frenchLabels: RichTextEditorLabels = {
  toolbar: "Mise en forme", bold: "Gras", italic: "Italique", underline: "Souligné", link: "Lien",
  bulletList: "Liste à puces", orderedList: "Liste numérotée", emoji: "Insérer un emoji", emojiLoading: "Chargement des emojis…",
  variable: "Insérer une variable", variables: "Variables", noVariables: "Aucune variable trouvée",
  placeholder: "Votre message…", linkUrl: "URL", linkFixed: "URL fixe", linkVariable: "Variable",
  linkApply: "Appliquer", linkRemove: "Retirer le lien", linkInvalid: "Seuls les liens https, http et mailto sont acceptés.",
  linkTarget: "Cible du lien", unknownVariable: "Variable inconnue : elle sera refusée à l'envoi.",
  kindUrl: "URL", kindList: "Liste",
};

export interface RichTextEditorChange {
  /** No text and no variable (`richTextIsEmpty`). */
  isEmpty: boolean;
  /** Plain text, variables as `{{label}}` (`richTextToPlainText`). */
  text: string;
}

export interface RichTextEditorProps {
  /** Controlled document (Tiptap JSON, closed schema). `null` empties the editor. */
  value?: RichTextValue | null;
  defaultValue?: RichTextValue;
  /** The document, always reduced to the schema (`richTextSanitize`). */
  onChange?: (value: RichTextValue, details: RichTextEditorChange) => void;
  /** Variables offered by the "Insert a variable" button and by `{{`. */
  variables?: RichTextVariable[];
  /**
   * One line, no toolbar: text and variables only (no list variable), Enter blocked, a
   * pasted text joined on one line. For an email subject; store it with
   * `richTextToTemplateString`. Read at mount.
   */
  singleLine?: boolean;
  placeholder?: string;
  disabled?: boolean;
  /** Minimum height of the typing area, in px. Default 160 (one line when `singleLine`). */
  minHeight?: number;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  locale?: "en" | "fr";
  labels?: Partial<RichTextEditorLabels>;
}

type SuggestionState = { props: SuggestionProps<RichTextVariable>; index: number; x: number; y: number };
const kindOf = (variable: RichTextVariable) => variable.kind ?? "text";

/** Value shown by the editor: reduced to the schema, on one paragraph in single-line mode. */
function editorContent(value: RichTextValue | null | undefined, singleLine: boolean, variables: readonly RichTextVariable[]) {
  if (!value) return richTextEmptyDocument();
  return singleLine ? richTextFromTemplateString(richTextToTemplateString(value), variables) : richTextSanitize(value);
}

/**
 * Rich text field for emails: bold, italic, underline, links (fixed URL or `url` variable),
 * bulleted and numbered lists (one level), emojis and variables. Its document follows a
 * closed schema, rendered to email HTML by `richTextToHtml` (`@gs/gs-components-library/rich-text`).
 */
export function RichTextEditor(props: RichTextEditorProps) {
  const { value, defaultValue, disabled = false, variables = [], singleLine = false, locale = "en", className, id, minHeight } = props;
  const bg = useBgContext();
  const dark = bg === "black";
  const labels = { ...(locale === "fr" ? frenchLabels : englishLabels), ...props.labels };
  const listId = React.useId();
  const [suggestions, setSuggestions] = React.useState<SuggestionState | null>(null);
  const activeSuggestion = React.useRef<SuggestionState | null>(null);
  const mounted = React.useRef(true);
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [, refreshToolbar] = React.useReducer((n: number) => n + 1, 0);

  const latest = React.useRef({ props });
  latest.current = { props };
  const editorRef = React.useRef<Editor | null>(null);
  const context = React.useRef<RichTextEditorContext>({ variables, singleLine, unknownVariableLabel: labels.unknownVariable, onLinkShortcut: () => {} });
  context.current.variables = variables;
  context.current.unknownVariableLabel = labels.unknownVariable;
  context.current.onLinkShortcut = () => { if (!latest.current.props.disabled && !singleLine) setLinkOpen(true); };

  const updateSuggestions = React.useCallback((next: SuggestionProps<RichTextVariable>) => {
    const rect = next.clientRect?.();
    if (!rect || !mounted.current) return;
    const state = { props: next, index: 0, ...suggestionsPosition(rect) };
    activeSuggestion.current = state;
    setSuggestions(state);
  }, []);
  const renderSuggestions = React.useRef(() => ({
    onStart: updateSuggestions,
    onUpdate: updateSuggestions,
    onExit: () => { activeSuggestion.current = null; if (mounted.current) setSuggestions(null); },
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      const state = activeSuggestion.current;
      if (!state) return false;
      if (event.key === "Escape") { exitSuggestion(state.props.editor.view); return true; }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const count = state.props.items.length;
        const next = { ...state, index: count ? (state.index + (event.key === "ArrowDown" ? 1 : -1) + count) % count : 0 };
        activeSuggestion.current = next; setSuggestions(next); return true;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        const item = state.props.items[state.index];
        if (!item) return false;
        state.props.command(item);
        return true;
      }
      return false;
    },
  })).current;

  const fieldLabel = props["aria-label"] ?? props.placeholder ?? labels.placeholder;
  const placeholder = props.placeholder ?? labels.placeholder;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      singleLine
        ? StarterKit.configure({
            document: false, blockquote: false, bold: false, bulletList: false, code: false, codeBlock: false,
            hardBreak: false, heading: false, horizontalRule: false, italic: false, listItem: false, listKeymap: false,
            orderedList: false, strike: false, underline: false, link: false, trailingNode: false, dropcursor: false, gapcursor: false,
          })
        : StarterKit.configure({
            blockquote: false, code: false, codeBlock: false, heading: false, horizontalRule: false,
            strike: false, link: false, listItem: false, trailingNode: false,
          }),
      ...(singleLine
        ? [Document.extend({ content: "paragraph" }), SingleLineKeys]
        // One list level: a list item holds paragraphs only (Tab cannot nest).
        : [ListItem.extend({ content: "paragraph+" }), VariableBlockNode, RichTextLink.configure({ context })]),
      VariableNode,
      VariableTokens.configure({ context }),
      VariableSuggestion.configure({ context, render: renderSuggestions }),
      VariableStatus.configure({ context }),
    ],
    content: editorContent(value ?? defaultValue, singleLine, variables),
    editable: !disabled,
    onUpdate: ({ editor: current }) => {
      const clean = richTextSanitize(current.getJSON());
      latest.current.props.onChange?.(clean, { isEmpty: richTextIsEmpty(clean), text: richTextToPlainText(clean) });
    },
    onTransaction: () => refreshToolbar(),
    editorProps: {
      attributes: {
        id: id ?? "", role: "textbox", "aria-multiline": String(!singleLine), "aria-label": fieldLabel,
        "aria-disabled": String(disabled), "aria-invalid": String(props["aria-invalid"] ?? false),
        "aria-describedby": props["aria-describedby"] ?? "",
        "aria-autocomplete": "list", "aria-controls": suggestions ? listId : "",
        "aria-activedescendant": suggestions?.props.items[suggestions.index] ? `${listId}-${suggestions.index}` : "",
        style: `min-height:${minHeight ?? (singleLine ? 0 : 160)}px`,
        class: cn(
          "px-2.5 py-2 text-sm font-light outline-none break-words",
          singleLine ? "whitespace-pre-wrap" : "max-h-[480px] overflow-y-auto whitespace-pre-wrap",
          "[&_p]:m-0 [&_p]:text-inherit [&>*+*]:mt-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_a]:underline",
          "[&_ul]:my-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-0 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_.ProseMirror-selectednode]:outline [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-blue",
        ),
      },
      // One line: a pasted text is joined on one line, its {{id}} become chips.
      handlePaste: singleLine
        ? (_view, event) => {
            const text = event.clipboardData?.getData("text/plain");
            if (text === undefined || !editorRef.current) return false;
            const paragraph = richTextFromTemplateString(text, context.current.variables).content?.[0];
            if (paragraph?.content) editorRef.current.commands.insertContent(paragraph.content);
            return true;
          }
        : undefined,
    },
  }, [singleLine]);
  editorRef.current = editor;

  // Controlled value: compared once reduced to the schema, replaced without emitting a change.
  React.useEffect(() => {
    if (!editor || value === undefined) return;
    const next = editorContent(value, singleLine, latest.current.props.variables ?? []);
    if (JSON.stringify(richTextSanitize(editor.getJSON())) !== JSON.stringify(richTextSanitize(next))) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value, singleLine]);
  React.useEffect(() => {
    editor?.setEditable(!disabled, false);
    if (disabled) {
      setLinkOpen(false);
      if (editor) exitSuggestion(editor.view);
    }
  }, [editor, disabled]);
  // Known variables changed: the warnings of unknown variables are recomputed.
  const variablesKey = JSON.stringify(variables);
  React.useEffect(() => {
    if (editor && !editor.isDestroyed) editor.view.dispatch(editor.state.tr.setMeta("addToHistory", false));
  }, [editor, variablesKey]);
  useDismissSuggestions(!!suggestions, editor, "data-rich-text-suggestions");
  useScrollActiveOption(listId, suggestions ? suggestions.index : null);

  const inlineVariables = variables.filter((v) => !(singleLine && kindOf(v) === "list"));
  const variableMenu = inlineVariables.length > 0 && (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" data-rte-tool="" className={editorToolClass} title={labels.variable} aria-label={labels.variable}
          disabled={disabled || !editor} onMouseDown={(event) => event.preventDefault()}>
          <Braces size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("max-h-[280px] min-w-[220px] overflow-y-auto", editorPopupClass(dark))}
        aria-label={labels.variables} onCloseAutoFocus={(event) => event.preventDefault()}>
        {inlineVariables.map((variable) => (
          <DropdownMenuItem key={variable.id} onSelect={() => editor && insertVariable(editor, variable)} className="flex items-center justify-between gap-3">
            <span className="truncate">{variable.label}</span>
            {kindOf(variable) !== "text" && <span className="shrink-0 text-xs opacity-60">{kindOf(variable) === "url" ? labels.kindUrl : labels.kindList}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className={cn("w-full rounded-sm border transition-colors focus-within:border-blue", editorSurfaceClass(bg), disabled && "opacity-50", className)} data-rich-text-editor="">
      <div className={cn("relative", singleLine && "flex items-start")}>
        <div className="relative min-w-0 flex-1">
          {editor?.isEmpty && <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-2 text-sm font-light text-grey-strongest">{placeholder}</span>}
          <EditorContent editor={editor} />
        </div>
        {singleLine && variableMenu && <div className="shrink-0 p-0.5">{variableMenu}</div>}
      </div>
      {!singleLine && (
        <Toolbar
          editor={editor} disabled={disabled} labels={labels} locale={locale} dark={dark}
          linkOpen={linkOpen} setLinkOpen={setLinkOpen} variables={variables} variableMenu={variableMenu}
        />
      )}
      {!disabled && suggestions && createPortal(
        <div data-rich-text-suggestions="" className={cn("fixed z-[100] w-[280px] max-w-[calc(100vw-16px)] rounded-sm border p-1 shadow-lg", editorPopupClass(dark))} style={{ left: suggestions.x, top: suggestions.y }}>
          <div role="listbox" id={listId} aria-label={labels.variables} className="max-h-[224px] overflow-y-auto">
            {!suggestions.props.items.length ? <p role="status" className="px-3 py-2 text-sm text-inherit">{labels.noVariables}</p> : suggestions.props.items.map((variable, index) => (
              <div role="option" id={`${listId}-${index}`} key={variable.id} aria-selected={index === suggestions.index}
                className={cn("flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm", index === suggestions.index && "bg-blue/20")}
                onMouseDown={(event) => event.preventDefault()} onClick={() => suggestions.props.command(variable)}
                onMouseEnter={() => { const next = { ...suggestions, index }; activeSuggestion.current = next; setSuggestions(next); }}>
                <span className="truncate">{variable.label}</span>
                {kindOf(variable) !== "text" && <span className="shrink-0 text-xs opacity-60">{kindOf(variable) === "url" ? labels.kindUrl : labels.kindList}</span>}
              </div>
            ))}
          </div>
        </div>, suggestionsHost(editor?.view.dom),
      )}
    </div>
  );
}

// --- Toolbar ----------------------------------------------------------------------

interface ToolbarProps {
  editor: Editor | null;
  disabled: boolean;
  labels: RichTextEditorLabels;
  locale: "en" | "fr";
  dark: boolean;
  linkOpen: boolean;
  setLinkOpen: (open: boolean) => void;
  variables: readonly RichTextVariable[];
  variableMenu: React.ReactNode;
}

/**
 * `role="toolbar"`: one Tab stop, arrows (and Home / End) move between the buttons. The
 * buttons keep the editor selection (no focus steal on mouse down).
 */
function Toolbar({ editor, disabled, labels, locale, dark, linkOpen, setLinkOpen, variables, variableMenu }: ToolbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const tools = () => Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("[data-rte-tool]:not(:disabled)") ?? []);
  // Roving tab index: only the current tool is reachable with Tab.
  const [current, setCurrent] = React.useState(0);
  React.useLayoutEffect(() => {
    tools().forEach((tool, index) => { tool.tabIndex = index === current ? 0 : -1; });
  });
  const onKeyDown = (event: React.KeyboardEvent) => {
    const list = tools();
    const index = list.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const next = event.key === "ArrowRight" ? (index + 1) % list.length
      : event.key === "ArrowLeft" ? (index - 1 + list.length) % list.length
      : event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setCurrent(next);
    list[next].focus();
  };
  const onFocus = (event: React.FocusEvent) => {
    const index = tools().indexOf(event.target as HTMLButtonElement);
    if (index !== -1) setCurrent(index);
  };

  const off = disabled || !editor;
  const toggle = (name: string, label: string, shortcut: string | null, run: () => void, icon: React.ReactNode) => (
    <button type="button" data-rte-tool="" className={editorToolClass} title={shortcut ? `${label} (${shortcut})` : label} aria-label={label}
      aria-pressed={editor?.isActive(name) ?? false} disabled={off} onMouseDown={(event) => event.preventDefault()} onClick={run}>
      {icon}
    </button>
  );
  const chain = () => editor!.chain().focus();
  return (
    <div ref={ref} role="toolbar" aria-label={labels.toolbar} aria-orientation="horizontal" onKeyDown={onKeyDown} onFocus={onFocus}
      className="flex flex-wrap items-center gap-1 border-t border-current/10 px-1.5 py-1">
      {toggle("bold", labels.bold, "⌘/Ctrl+B", () => chain().toggleBold().run(), <Bold size={16} />)}
      {toggle("italic", labels.italic, "⌘/Ctrl+I", () => chain().toggleItalic().run(), <Italic size={16} />)}
      {toggle("underline", labels.underline, "⌘/Ctrl+U", () => chain().toggleUnderline().run(), <Underline size={16} />)}
      <LinkTool editor={editor} disabled={off} labels={labels} dark={dark} open={linkOpen} setOpen={setLinkOpen} variables={variables} />
      <span aria-hidden="true" className="mx-1 h-4 border-l border-current/20" />
      {toggle("bulletList", labels.bulletList, null, () => chain().toggleBulletList().run(), <List size={16} />)}
      {toggle("orderedList", labels.orderedList, null, () => chain().toggleOrderedList().run(), <ListOrdered size={16} />)}
      <span aria-hidden="true" className="mx-1 h-4 border-l border-current/20" />
      <EditorEmojiButton editor={editor} disabled={off} locale={locale} dark={dark} label={labels.emoji} loadingLabel={labels.emojiLoading}
        buttonProps={{ "data-rte-tool": "" }} />
      {variableMenu}
    </div>
  );
}

// --- Link -------------------------------------------------------------------------

interface LinkToolProps {
  editor: Editor | null;
  disabled: boolean;
  labels: RichTextEditorLabels;
  dark: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  variables: readonly RichTextVariable[];
}

/** Link button and its input: a fixed URL (filtered) or a `url` variable; edit or remove an existing link. */
function LinkTool({ editor, disabled, labels, dark, open, setOpen, variables }: LinkToolProps) {
  const urlVariables = variables.filter((v) => kindOf(v) === "url");
  const [mode, setMode] = React.useState<"fixed" | "variable">("fixed");
  const [url, setUrl] = React.useState("");
  const [variableId, setVariableId] = React.useState("");
  const [error, setError] = React.useState(false);
  const formId = React.useId();
  const active = editor?.isActive("link") ?? false;

  // Opening reads the link under the selection, if any.
  React.useEffect(() => {
    if (!open || !editor) return;
    const attrs = editor.getAttributes("link");
    const isVariable = typeof attrs.variableId === "string" && attrs.variableId !== "";
    setMode(isVariable ? "variable" : "fixed");
    setUrl(isVariable ? "" : attrs.href ?? "");
    setVariableId(isVariable ? attrs.variableId : urlVariables[0]?.id ?? "");
    setError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editor]);

  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editor) return;
    let attrs: { href: string | null; variableId: string | null };
    let text: string;
    if (mode === "fixed") {
      const href = richTextNormalizeUrl(url);
      if (!href) { setError(true); return; }
      attrs = { href, variableId: null };
      text = href.replace(/^mailto:/, "");
    } else {
      const variable = urlVariables.find((v) => v.id === variableId);
      if (!variable) return;
      attrs = { href: null, variableId: variable.id };
      text = variable.label;
    }
    const { empty } = editor.state.selection;
    if (empty && !editor.isActive("link")) {
      // Nothing selected: the URL (or the variable label) is inserted as the link text.
      editor.chain().focus().insertContent({ type: "text", text, marks: [{ type: "link", attrs }] }).unsetMark("link").run();
    } else {
      editor.chain().focus().extendMarkRange("link").setMark("link", attrs).run();
    }
    setOpen(false);
  };
  const remove = () => {
    editor?.chain().focus().extendMarkRange("link").unsetMark("link").run();
    setOpen(false);
  };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" data-rte-tool="" className={editorToolClass} title={`${labels.link} (⌘/Ctrl+K)`} aria-label={labels.link}
          aria-pressed={active} disabled={disabled} onMouseDown={(event) => event.preventDefault()}>
          <Link2 size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("w-[300px] p-3", editorPopupClass(dark))} aria-label={labels.link} role="dialog"
        onCloseAutoFocus={(event) => { event.preventDefault(); editor?.commands.focus(); }}>
        <form id={formId} onSubmit={apply} className="flex flex-col gap-2 text-sm">
          {urlVariables.length > 0 && (
            <div role="radiogroup" aria-label={labels.linkTarget} className="flex gap-1">
              {(["fixed", "variable"] as const).map((option) => (
                <button key={option} type="button" role="radio" aria-checked={mode === option}
                  className={cn("flex-1 rounded-sm border border-current/20 px-2 py-1", mode === option && "bg-blue/20")}
                  onClick={() => { setMode(option); setError(false); }}>
                  {option === "fixed" ? labels.linkFixed : labels.linkVariable}
                </button>
              ))}
            </div>
          )}
          {mode === "fixed" ? (
            <label className="flex flex-col gap-1">
              <span className="text-xs opacity-70">{labels.linkUrl}</span>
              <input autoFocus type="text" inputMode="url" value={url} placeholder="https://"
                aria-invalid={error} aria-describedby={error ? `${formId}-error` : undefined}
                onChange={(event) => { setUrl(event.target.value); setError(false); }}
                className="rounded-sm border border-current/20 bg-transparent px-2 py-1 outline-none focus:border-blue" />
            </label>
          ) : (
            <label className="flex flex-col gap-1">
              <span className="text-xs opacity-70">{labels.linkVariable}</span>
              <select autoFocus value={variableId} onChange={(event) => setVariableId(event.target.value)}
                className="rounded-sm border border-current/20 bg-transparent px-2 py-1 outline-none focus:border-blue">
                {urlVariables.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
            </label>
          )}
          {error && <p id={`${formId}-error`} role="alert" className="m-0 text-xs text-red-strong">{labels.linkInvalid}</p>}
          <div className="flex justify-end gap-2">
            {active && <button type="button" onClick={remove} className="rounded-sm px-2 py-1 hover:bg-blue/20">{labels.linkRemove}</button>}
            <button type="submit" className="rounded-sm bg-blue/20 px-2 py-1 font-medium hover:bg-blue/30">{labels.linkApply}</button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export {
  richTextEmptyDocument,
  richTextIsEmpty,
  richTextSanitize,
} from "@/lib/rich-text/schema";
export { richTextToPlainText } from "@/lib/rich-text/render";
