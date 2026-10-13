import { useEffect, type RefObject } from 'react';
import { NATIVE_SCROLL_ATTRIBUTE, wheelDeltaPixels } from './usePageFirstScroll';

function scrollable(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight && /^(auto|scroll|overlay)$/.test(getComputedStyle(element).overflowY);
}

/** Forward wheel gestures from fixed frame chrome to the visible body surface. */
export function useFullFrameWheel(frameRef: RefObject<HTMLElement>, bodyRef: RefObject<HTMLElement>): void {
  useEffect(() => {
    const frame = frameRef.current;
    const body = bodyRef.current;
    if (!frame || !body) return;

    const onWheel = (event: WheelEvent) => {
      const source = event.target;
      if (!(source instanceof Element) || body.contains(source)) return;
      if (event.defaultPrevented || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (source.closest(`[${NATIVE_SCROLL_ATTRIBUTE}], select, input[type="number"]`)) return;

      // A menu or scrollable control in the header/footer retains native scrolling.
      for (let node = source; node !== frame && frame.contains(node); node = node.parentElement!) {
        if (node instanceof HTMLElement && scrollable(node)) return;
      }

      const rect = body.getBoundingClientRect();
      const hit = document.elementFromPoint?.(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const target = hit && body.contains(hit) ? hit : body;
      const forwarded = new WheelEvent('wheel', {
        bubbles: true, cancelable: true,
        deltaX: event.deltaX, deltaY: event.deltaY, deltaZ: event.deltaZ, deltaMode: event.deltaMode,
        ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey, metaKey: event.metaKey,
        clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2,
      });
      // In particular, PageFillLayout gets to fold its top part before the list scrolls.
      if (!target.dispatchEvent(forwarded)) { event.preventDefault(); return; }

      // Synthetic wheel events have no browser scrolling default. Reproduce the
      // native scroll chain: inner list first, then the body when it reaches an end.
      let hasScrollableSurface = false;
      for (let node: Element | null = target; node && body.contains(node); node = node.parentElement) {
        if (!(node instanceof HTMLElement) || !scrollable(node)) continue;
        hasScrollableSurface = true;
        const delta = event.deltaMode === 2 ? event.deltaY * node.clientHeight : wheelDeltaPixels(event);
        const available = delta > 0 ? node.scrollHeight - node.clientHeight - node.scrollTop : node.scrollTop;
        if (available <= 0) continue;
        node.scrollBy({ top: Math.sign(delta) * Math.min(Math.abs(delta), available), behavior: 'instant' as ScrollBehavior });
        event.preventDefault();
        return;
      }
      // Keep the page behind the frame still when the body/list reaches its boundary.
      if (hasScrollableSurface) event.preventDefault();
    };
    frame.addEventListener('wheel', onWheel, { passive: false });
    return () => frame.removeEventListener('wheel', onWheel);
  }, [frameRef, bodyRef]);
}
