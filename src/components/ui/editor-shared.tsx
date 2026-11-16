/**
 * Internal pieces shared by the Tiptap editors of the library (`CommentComposer`,
 * `RichTextEditor`): toolbar button style, field surface per background, emoji picker
 * popover, and the placement / dismissal of the suggestion lists.
 */
import * as React from "react";
import type { Editor } from "@tiptap/react";
import { exitSuggestion } from "@tiptap/suggestion";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const EmojiPicker = React.lazy(() => import("./comment-emoji-picker"));

/** Square toolbar button (32px), pressed state through `aria-pressed`. */
export const editorToolClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-sm hover:bg-blue/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-blue/20";

/** Field surface (border, background, text) for the background context of the editor. */
export function editorSurfaceClass(bg: string | undefined): string {
  if (bg === "black") return "border-black-secondary bg-black-secondary text-white";
  if (bg === "grey") return "border-white bg-white text-black";
  return "border-grey-lighter bg-grey-lighter text-black";
}

/** Floating list surface (suggestions, menus) for a dark or light context. */
export const editorPopupClass = (dark: boolean) =>
  dark ? "border-white/20 bg-black-secondary text-white" : "border-black/10 bg-white text-black";

/**
 * Where the suggestions list is rendered: inside the dialog that holds the editor (a modal dialog — SidePanel, Sheet, Dialog —
 * blocks the pointer outside itself and would close on a click there), else at the end of the page.
 */
export function suggestionsHost(editorDom: HTMLElement | undefined): HTMLElement {
  return editorDom?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') ?? document.body;
}

/** Fixed position of a suggestions list under the caret, above it when there is no room below. */
export function suggestionsPosition(rect: DOMRect): { x: number; y: number } {
  return {
    x: Math.max(8, Math.min(rect.left, window.innerWidth - 288)),
    y: Math.max(8, rect.bottom + 6 + 232 > window.innerHeight ? rect.top - 238 : rect.bottom + 6),
  };
}

/**
 * Closes an open suggestions list on resize, on scroll, and on a pointer down outside the
 * list (`[data-attribute]`) and the editor.
 */
export function useDismissSuggestions(open: boolean, editor: Editor | null, listAttribute: string) {
  React.useEffect(() => {
    if (!open || !editor) return;
    const selector = `[${listAttribute}]`;
    const close = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(selector)) return;
      exitSuggestion(editor.view);
    };
    const outside = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!target.closest?.(selector) && !editor.view.dom.contains(target)) exitSuggestion(editor.view);
    };
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open, editor, listAttribute]);
}

/** Keeps the active option (`${listId}-${index}`) visible in its scrolling list. */
export function useScrollActiveOption(listId: string, index: number | null) {
  React.useEffect(() => {
    if (index === null) return;
    const option = document.getElementById(`${listId}-${index}`);
    const list = document.getElementById(listId);
    if (!option || !list) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [index, listId]);
}

export interface EditorEmojiButtonProps {
  editor: Editor | null;
  disabled: boolean;
  locale: "en" | "fr";
  dark: boolean;
  label: string;
  loadingLabel: string;
  /** Read when an emoji is chosen: nothing is inserted once the editor is disabled. */
  isDisabled?: () => boolean;
  /** Extra props of the toolbar button (tab index, data attributes…). */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & Record<`data-${string}`, string>;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/** Toolbar button opening the emoji picker (loaded on first open); inserts the emoji as text. */
export function EditorEmojiButton({ editor, disabled, locale, dark, label, loadingLabel, isDisabled, buttonProps, onOpenChange }: EditorEmojiButtonProps) {
  const [open, setOpenState] = React.useState(false);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };
  React.useEffect(() => {
    if (disabled) setOpenState(false);
  }, [disabled]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" {...buttonProps} className={cn(editorToolClass, buttonProps?.className)} title={label} aria-label={label} disabled={disabled || !editor} onMouseDown={(event) => event.preventDefault()}>
          <Smile size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-16px)] border-0 p-0" onCloseAutoFocus={(event) => { event.preventDefault(); if (!disabled) editor?.commands.focus(); }}>
        {open && (
          <React.Suspense fallback={<p role="status" className="p-4 text-sm">{loadingLabel}</p>}>
            <EmojiPicker locale={locale} theme={dark ? "dark" : "light"} onSelect={(emoji) => {
              if (!(isDisabled?.() ?? disabled)) editor?.chain().focus().insertContent({ type: "text", text: emoji }).run();
              setOpen(false);
            }} />
          </React.Suspense>
        )}
      </PopoverContent>
    </Popover>
  );
}
