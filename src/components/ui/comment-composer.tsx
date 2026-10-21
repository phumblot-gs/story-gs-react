import * as React from "react";
import { createPortal } from "react-dom";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { exitSuggestion, type SuggestionProps } from "@tiptap/suggestion";
import { AtSign, Bold, Italic, Smile } from "lucide-react";
import { useBgContext } from "@/components/layout/BgContext";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const EmojiPicker = React.lazy(() => import("./comment-emoji-picker"));

export type CommentComposerValue = JSONContent;
export interface CommentMention {
  id: string;
  label: string;
  avatarUrl?: string;
  description?: string;
}
export interface CommentComposerChange {
  text: string;
  mentionedIds: string[];
  isEmpty: boolean;
}
export interface CommentComposerProps {
  /** Controlled Tiptap JSON document. Use null to reset the composer. */
  value?: CommentComposerValue | null;
  defaultValue?: CommentComposerValue;
  onChange?: (value: CommentComposerValue, details: CommentComposerChange) => void;
  /** A local directory or an asynchronous search supplied by the application. */
  mentions?: CommentMention[] | ((query: string) => Promise<CommentMention[]>);
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  /** Signals intent only; the parent decides whether to submit. */
  onSubmitShortcut?: () => void;
  locale?: "en" | "fr";
  labels?: Partial<typeof englishLabels>;
}
const englishLabels = {
  mention: "Mention someone", emoji: "Insert emoji", bold: "Bold", italic: "Italic",
  toolbar: "Comment formatting", suggestions: "People", empty: "No people found",
  loading: "Searching…", error: "Could not load people", placeholder: "Write a comment…",
  emojiLoading: "Loading emojis…",
};
const frenchLabels: typeof englishLabels = {
  mention: "Mentionner une personne", emoji: "Insérer un emoji", bold: "Gras", italic: "Italique",
  toolbar: "Mise en forme du commentaire", suggestions: "Personnes", empty: "Aucune personne trouvée",
  loading: "Recherche…", error: "Impossible de charger les personnes", placeholder: "Votre commentaire…",
  emojiLoading: "Chargement des emojis…",
};
const emptyDocument: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

type MentionState = { props: SuggestionProps<CommentMention>; index: number; x: number; y: number };

/** A small rich-text field. Submission, notifications and persistence belong to its parent. */
export function CommentComposer(props: CommentComposerProps) {
  const { value, defaultValue, disabled = false, mentions = [], locale = "en", className, id, "aria-describedby": describedBy, "aria-invalid": invalid } = props;
  const bg = useBgContext();
  const dark = bg === "black";
  const labels = { ...(locale === "fr" ? frenchLabels : englishLabels), ...props.labels };
  const latest = React.useRef({ props, mentions, labels });
  latest.current = { props, mentions, labels };
  const listId = React.useId();
  const [suggestions, setSuggestions] = React.useState<MentionState | null>(null);
  const active = React.useRef<MentionState | null>(null);
  const [searchStatus, setSearchStatus] = React.useState<"ready" | "loading" | "error">("ready");
  const searchStatusRef = React.useRef(searchStatus);
  searchStatusRef.current = searchStatus;
  const searchVersion = React.useRef(0);
  const mounted = React.useRef(true);
  React.useEffect(() => { mounted.current = true; searchVersion.current++; return () => { mounted.current = false; }; }, []);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [, refreshToolbar] = React.useReducer((n) => n + 1, 0);

  const updateSuggestions = React.useCallback((next: SuggestionProps<CommentMention>) => {
    const rect = next.clientRect?.();
    if (!rect || !mounted.current) return;
    const state = {
      props: next, index: 0,
      x: Math.max(8, Math.min(rect.left, window.innerWidth - 288)),
      y: Math.max(8, rect.bottom + 6 + 232 > window.innerHeight ? rect.top - 238 : rect.bottom + 6),
    };
    active.current = state;
    setSuggestions(state);
  }, []);

  const fieldLabel = props["aria-label"] ?? labels.placeholder;
  const placeholder = props.placeholder ?? labels.placeholder;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false, bulletList: false, code: false, codeBlock: false,
        heading: false, horizontalRule: false, listItem: false, orderedList: false,
        strike: false, underline: false, link: false, trailingNode: false, listKeymap: false,
      }),
      Mention.configure({
        HTMLAttributes: { class: "rounded-sm bg-blue/20 px-0.5 font-medium", "data-comment-mention": "true" },
        suggestion: {
          allowSpaces: true,
          items: async ({ query }) => {
            const version = ++searchVersion.current;
            const source = latest.current.mentions;
            try {
              if (typeof source !== "function") {
                setSearchStatus("ready");
                return source.filter(person => normalize(person.label).includes(normalize(query))).slice(0, 8);
              }
              setSearchStatus("loading");
              const people = await source(query);
              if (!mounted.current || version !== searchVersion.current) return [];
              setSearchStatus("ready");
              return people.slice(0, 8);
            } catch {
              if (mounted.current && version === searchVersion.current) setSearchStatus("error");
              return [];
            }
          },
          render: () => ({
            onStart: updateSuggestions,
            onUpdate: updateSuggestions,
            onExit: () => { active.current = null; if (mounted.current) setSuggestions(null); },
            onKeyDown: ({ event }) => {
              const state = active.current;
              if (!state) return false;
              if (event.key === "Escape") { exitSuggestion(state.props.editor.view); return true; }
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                const count = state.props.items.length;
                const next = { ...state, index: count ? (state.index + (event.key === "ArrowDown" ? 1 : -1) + count) % count : 0 };
                active.current = next; setSuggestions(next); return true;
              }
              if (event.key === "Enter") {
                if (searchStatusRef.current === "ready" && state.props.items[state.index]) state.props.command(state.props.items[state.index]);
                return true;
              }
              return false;
            },
          }),
        },
      }),
    ],
    content: value ?? defaultValue ?? emptyDocument,
    editable: !disabled,
    onUpdate: ({ editor: current }) => {
      const mentionedIds = new Set<string>();
      current.state.doc.descendants(node => { if (node.type.name === "mention") mentionedIds.add(node.attrs.id); });
      const text = current.getText();
      latest.current.props.onChange?.(current.getJSON(), { text, mentionedIds: [...mentionedIds], isEmpty: !text.trim() });
    },
    onTransaction: () => refreshToolbar(),
    editorProps: {
      attributes: {
      id: id ?? "", role: "textbox", "aria-multiline": "true", "aria-label": fieldLabel,
      "aria-disabled": String(disabled), "aria-invalid": String(invalid ?? false),
      "aria-describedby": describedBy ?? "",
      "aria-autocomplete": "list", "aria-controls": suggestions ? listId : "",
      "aria-activedescendant": suggestions?.props.items[suggestions.index] ? `${listId}-${suggestions.index}` : "",
      class: "min-h-[120px] max-h-[320px] overflow-y-auto px-2.5 py-2 text-sm font-light outline-none whitespace-pre-wrap break-words [&_p]:m-0 [&_p]:text-inherit [&_strong]:font-bold [&_em]:italic",
    },
      handleKeyDown: (view, event) => {
        if (event.isComposing || view.composing || !view.editable) return false;
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && latest.current.props.onSubmitShortcut) {
          event.preventDefault(); latest.current.props.onSubmitShortcut(); return true;
        }
        return false;
      },
    },
  });

  React.useEffect(() => {
    if (editor && value !== undefined && JSON.stringify(editor.getJSON()) !== JSON.stringify(value ?? emptyDocument)) {
      editor.commands.setContent(value ?? emptyDocument, { emitUpdate: false });
    }
  }, [editor, value]);
  React.useEffect(() => {
    editor?.setEditable(!disabled, false);
    if (disabled) { setEmojiOpen(false); if (editor) exitSuggestion(editor.view); }
  }, [editor, disabled]);
  React.useEffect(() => {
    if (!suggestions || !editor) return;
    const close = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-comment-suggestions]")) return;
      exitSuggestion(editor.view);
    };
    const outside = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!target.closest?.("[data-comment-suggestions]") && !editor.view.dom.contains(target)) exitSuggestion(editor.view);
    };
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("resize", close); window.removeEventListener("scroll", close, true);
      document.removeEventListener("pointerdown", outside);
    };
  }, [suggestions, editor]);

  React.useEffect(() => {
    if (!suggestions) return;
    const option = document.getElementById(`${listId}-${suggestions.index}`);
    const list = document.getElementById(listId);
    if (!option || !list) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [suggestions, listId]);

  const toolClass = "inline-flex h-8 w-8 items-center justify-center rounded-sm hover:bg-blue/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-blue/20";
  return (
    <div className={cn("w-full rounded-sm border transition-colors focus-within:border-blue", dark ? "border-black-secondary bg-black-secondary text-white" : bg === "grey" ? "border-white bg-white text-black" : "border-grey-lighter bg-grey-lighter text-black", disabled && "opacity-50", className)}>
      <div className="relative">
        {editor?.isEmpty && <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-2 text-sm font-light text-grey-strongest">{placeholder}</span>}
        <EditorContent editor={editor} />
      </div>
      <div role="group" aria-label={labels.toolbar} className="flex items-center gap-1 border-t border-current/10 px-1.5 py-1">
        <button type="button" title={labels.mention} aria-label={labels.mention} className={toolClass} disabled={disabled || !editor}
          onMouseDown={event => event.preventDefault()} onClick={() => {
            if (!editor) return;
            const before = editor.state.doc.textBetween(Math.max(0, editor.state.selection.from - 1), editor.state.selection.from);
            editor.chain().focus().insertContent(before && !/\s/.test(before) ? " @" : "@").run();
          }}><AtSign size={16} /></button>
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild><button type="button" className={toolClass} title={labels.emoji} aria-label={labels.emoji} disabled={disabled || !editor} onMouseDown={event => event.preventDefault()}><Smile size={16} /></button></PopoverTrigger>
          <PopoverContent align="start" className="w-auto max-w-[calc(100vw-16px)] border-0 p-0" onCloseAutoFocus={event => { event.preventDefault(); if (!disabled) editor?.commands.focus(); }}>
            {emojiOpen && <React.Suspense fallback={<p role="status" className="p-4 text-sm">{labels.emojiLoading}</p>}><EmojiPicker locale={locale} theme={dark ? "dark" : "light"} onSelect={emoji => {
              if (!latest.current.props.disabled) editor?.chain().focus().insertContent({ type: "text", text: emoji }).run();
              setEmojiOpen(false);
            }} /></React.Suspense>}
          </PopoverContent>
        </Popover>
        <span aria-hidden="true" className="mx-1 h-4 border-l border-current/20" />
        <button type="button" className={toolClass} title={`${labels.bold} (⌘/Ctrl+B)`} aria-label={labels.bold} aria-pressed={editor?.isActive("bold") ?? false} disabled={disabled || !editor} onMouseDown={event => event.preventDefault()} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={16} /></button>
        <button type="button" className={toolClass} title={`${labels.italic} (⌘/Ctrl+I)`} aria-label={labels.italic} aria-pressed={editor?.isActive("italic") ?? false} disabled={disabled || !editor} onMouseDown={event => event.preventDefault()} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={16} /></button>
      </div>
      {!disabled && suggestions && createPortal(
        <div data-comment-suggestions="" className={cn("fixed z-[100] w-[280px] max-w-[calc(100vw-16px)] rounded-sm border p-1 shadow-lg", dark ? "border-white/20 bg-black-secondary text-white" : "border-black/10 bg-white text-black")} style={{ left: suggestions.x, top: suggestions.y }}>
          <div role="listbox" id={listId} aria-label={labels.suggestions} className="max-h-[224px] overflow-y-auto">
            {searchStatus !== "ready" || !suggestions.props.items.length ? <p role="status" className="px-3 py-2 text-sm text-inherit">{searchStatus === "loading" ? labels.loading : searchStatus === "error" ? labels.error : labels.empty}</p> : suggestions.props.items.map((person, index) => (
              <div role="option" id={`${listId}-${index}`} key={person.id} aria-selected={index === suggestions.index}
                className={cn("flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm", index === suggestions.index && "bg-blue/20")}
                onMouseDown={event => event.preventDefault()} onClick={() => suggestions.props.command(person)}
                onMouseEnter={() => { const next = { ...suggestions, index }; active.current = next; setSuggestions(next); }}>
                {person.avatarUrl ? <img src={person.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" /> : <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue/20 text-xs font-medium">{person.label.split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</span>}
                <span className="min-w-0"><span className="block truncate">{person.label}</span>{person.description && <span className="block truncate text-xs opacity-60">{person.description}</span>}</span>
              </div>
            ))}
          </div>
        </div>, document.body
      )}
    </div>
  );
}
