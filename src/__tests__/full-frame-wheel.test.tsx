import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { FullFrame } from '@/components/layout/FullFrame';
import { PageFillLayout } from '@/components/layout/PageFillLayout';

const originalHitTest = document.elementFromPoint;
afterEach(() => {
  cleanup(); vi.restoreAllMocks();
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: originalHitTest });
});
function scrollSurface(element: HTMLElement, height = 300, contentHeight = 1000) {
  element.style.overflowY = 'auto';
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: height });
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: contentHeight });
  element.scrollBy = vi.fn((options: ScrollToOptions) => {
    element.scrollTop = Math.max(0, Math.min(contentHeight - height, element.scrollTop + (options.top ?? 0)));
  });
}
function setup(children = <p>Body content</p>) {
  const view = render(<FullFrame headerContent={<button>Header action</button>} footer={<button>Footer action</button>}>{children}</FullFrame>);
  const body = document.querySelector('[style*="container-type"]') as HTMLElement;
  scrollSurface(body);
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => body) });
  return { ...view, body };
}
function wheel(target: Element, deltaY = 120, extra: WheelEventInit = {}) {
  const event = new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true, ...extra });
  // happy-dom does not populate the inherited modifier fields of WheelEvent.
  if ('ctrlKey' in extra) Object.defineProperty(event, 'ctrlKey', { value: extra.ctrlKey });
  act(() => { target.dispatchEvent(event); });
  return event;
}

describe('FullFrame wheel over fixed chrome', () => {
  it('scrolls the body from both bars, with line/page deltas and clamped boundaries', () => {
    const { body } = setup();
    expect(wheel(screen.getByText('Header action')).defaultPrevented).toBe(true);
    expect(body.scrollTop).toBe(120);
    wheel(screen.getByText('Footer action'), -2, { deltaMode: 1 });
    expect(body.scrollTop).toBe(88);
    wheel(screen.getByText('Footer action'), 1, { deltaMode: 2 });
    expect(body.scrollTop).toBe(388);
    wheel(screen.getByText('Header action'), 5000);
    expect(body.scrollTop).toBe(700);
    expect(wheel(screen.getByText('Footer action'), 120).defaultPrevented).toBe(true);
    expect(body.scrollTop).toBe(700);
  });
  it('retains native body scrolling, zoom and horizontal gestures', () => {
    const { body } = setup();
    expect(wheel(body).defaultPrevented).toBe(false);
    expect(wheel(screen.getByText('Header action'), 120, { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(wheel(screen.getByText('Footer action'), 10, { deltaX: 120 }).defaultPrevented).toBe(false);
    expect(body.scrollBy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Header action'));
  });
  it('scrolls the visible nested list before chaining to the body', () => {
    const { body } = setup(<div data-testid="list">List</div>);
    const list = screen.getByTestId('list');
    scrollSurface(list, 200, 500);
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => list) });
    wheel(screen.getByText('Header action'));
    expect(list.scrollTop).toBe(120);
    expect(body.scrollTop).toBe(0);
    list.scrollTop = 300;
    wheel(screen.getByText('Footer action'));
    expect(body.scrollTop).toBe(120);
    list.scrollTop = 50;
    wheel(screen.getByText('Footer action'), -120);
    expect(list.scrollTop).toBe(0);
    expect(body.scrollTop).toBe(120);
    wheel(screen.getByText('Footer action'), -120);
    expect(body.scrollTop).toBe(0);
  });
  it('lets PageFillLayout collapse its top before scrolling the inner list', () => {
    const { body } = setup(<PageFillLayout collapsible={<p>Top</p>}><div data-testid="list">List</div></PageFillLayout>);
    const list = screen.getByTestId('list');
    const panel = document.querySelector('[data-page-fill-panel]') as HTMLElement;
    scrollSurface(list, 200, 500);
    vi.spyOn(body, 'getBoundingClientRect').mockReturnValue({ top: 60, left: 0, width: 800, height: 300 } as DOMRect);
    vi.spyOn(panel, 'getBoundingClientRect').mockImplementation(() => ({ top: 260 - body.scrollTop } as DOMRect));
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => list) });
    wheel(screen.getByText('Header action'));
    expect(body.scrollTop).toBe(120);
    expect(list.scrollTop).toBe(0);
    wheel(screen.getByText('Footer action'));
    expect(body.scrollTop).toBe(200);
    expect(list.scrollTop).toBe(0);
    wheel(screen.getByText('Footer action'));
    expect(list.scrollTop).toBe(120);
  });
  it('preserves scrollable controls and opt-out regions in the fixed bars', () => {
    render(<FullFrame headerContent={<div data-native-scroll><button>Native</button></div>} footer={<div data-testid="menu" style={{ overflowY: 'auto' }}><button>Menu</button></div>}><p>Body content</p></FullFrame>);
    const body = document.querySelector('[style*="container-type"]') as HTMLElement;
    scrollSurface(body);
    scrollSurface(screen.getByTestId('menu'));
    expect(wheel(screen.getByText('Native')).defaultPrevented).toBe(false);
    expect(wheel(screen.getByText('Menu')).defaultPrevented).toBe(false);
    expect(body.scrollBy).not.toHaveBeenCalled();
  });
  it('does not hijack a cancelled event or retain a listener after unmount', () => {
    const { body, unmount } = setup();
    const action = screen.getByText('Header action');
    const cancel = (event: Event) => event.preventDefault();
    action.addEventListener('wheel', cancel);
    wheel(action);
    expect(body.scrollBy).not.toHaveBeenCalled();
    action.removeEventListener('wheel', cancel);
    unmount();
    wheel(action);
    expect(body.scrollBy).not.toHaveBeenCalled();
  });
});
