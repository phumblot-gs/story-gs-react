import { useEffect, useRef, type RefObject } from 'react';

interface EscapeOptions { closeOnEscape: boolean; onClose?: () => void }
interface FrameEntry { element: HTMLElement; options: () => EscapeOptions }
interface FrameStack { entries: Set<FrameEntry>; dispose: () => void }
const frameStacks = new WeakMap<Document, FrameStack>();
// Radix content can be visible one render before its Escape listener is ready.
// Ignore closed content kept in the DOM only for its exit animation.
const OPEN_LAYER_SELECTOR = [
  '[role="dialog"][data-state="open"]',
  '[role="alertdialog"][data-state="open"]',
  '[role="menu"][data-state="open"]',
  '[role="listbox"][data-state="open"]',
  '[data-state="instant-open"] [role="tooltip"]',
  '[data-state="delayed-open"] [role="tooltip"]',
].join(',');

/** Nested frames paint above their parent; siblings follow z-index, then DOM order. */
function topFrame(entries: Set<FrameEntry>): FrameEntry | undefined {
  let top: FrameEntry | undefined;
  for (const entry of entries) {
    if (!entry.element.isConnected) continue;
    if (!top || top.element.contains(entry.element)) { top = entry; continue; }
    if (entry.element.contains(top.element)) continue;
    const entryZ = Number.parseInt(getComputedStyle(entry.element).zIndex, 10) || 0;
    const topZ = Number.parseInt(getComputedStyle(top.element).zIndex, 10) || 0;
    if (entryZ > topZ || (entryZ === topZ && (top.element.compareDocumentPosition(entry.element) & Node.DOCUMENT_POSITION_FOLLOWING))) top = entry;
  }
  return top;
}

/** Escape is handled after Radix capture listeners and React's bubbling handlers. */
export function useFullFrameEscape(frameRef: RefObject<HTMLElement>, options: EscapeOptions): void {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const doc = element.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;
    let stack = frameStacks.get(doc);
    if (!stack) {
      const entries = new Set<FrameEntry>();
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || event.defaultPrevented || event.repeat || event.isComposing) return;
        const top = topFrame(entries);
        const current = top?.options();
        // Disabled or non-closable frames still shield the frames underneath.
        if (!current?.closeOnEscape || !current.onClose) return;
        if (doc.querySelector(OPEN_LAYER_SELECTOR)) return;
        event.preventDefault();
        current.onClose();
      };
      win.addEventListener('keydown', onKeyDown);
      stack = { entries, dispose: () => win.removeEventListener('keydown', onKeyDown) };
      frameStacks.set(doc, stack);
    }
    const entry: FrameEntry = { element, options: () => optionsRef.current };
    stack.entries.add(entry);
    return () => {
      stack.entries.delete(entry);
      if (!stack.entries.size) { stack.dispose(); frameStacks.delete(doc); }
    };
  }, [frameRef]);
}
