import { afterEach, describe, expect, it } from "vitest";
import { computeActiveTabIndicator } from "@/components/ui/tabs";

/**
 * Regression test for the bug reported by Sourcing on TabsWithViews 1.11.1:
 * the active-tab indicator (the black underline at the bottom of TabsList)
 * stayed pinned under the first tab when the active tab was wrapped in a
 * `position: relative` container, which `ViewTabTrigger` does for saved views
 * (`.tabs-view-wrapper`).
 *
 * Cause: `updateIndicatorPosition` previously used `offsetLeft` /
 * `offsetWidth`, which are relative to the closest `offsetParent` — not the
 * TabsList. The wrapper with `position: relative` became the offsetParent of
 * its inner trigger, so `offsetLeft` was 0 even though the trigger was
 * rendered far from the start of the list.
 *
 * The fix relies on `getBoundingClientRect()` relative to the TabsList, which
 * ignores intermediate positioned wrappers entirely. We unit-test the pure
 * helper directly; full-DOM integration would require user-event + a real
 * browser layout (Radix Tabs' state changes don't fire MutationObserver in
 * happy-dom), and would be brittle for what is fundamentally a math check.
 */

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

const fakeRect = ({ left, width }: { left: number; width: number }): DOMRect => ({
  left,
  right: left + width,
  width,
  top: 0,
  bottom: 30,
  height: 30,
  x: left,
  y: 0,
  toJSON: () => ({}) as Rect,
});

const fakeListEl = (rect: { left: number; width: number }, scrollLeft = 0): HTMLElement => ({
  getBoundingClientRect: () => fakeRect(rect),
  scrollLeft,
}) as unknown as HTMLElement;

const fakeTabEl = (rect: { left: number; width: number }): HTMLElement => ({
  getBoundingClientRect: () => fakeRect(rect),
}) as unknown as HTMLElement;

afterEach(() => {});

describe("computeActiveTabIndicator", () => {
  it("returns the active tab's offset relative to the TabsList for a non-wrapped trigger", () => {
    const list = fakeListEl({ left: 0, width: 600 });
    const activeTab = fakeTabEl({ left: 220, width: 100 });

    expect(computeActiveTabIndicator(list, activeTab)).toEqual({ left: 220, width: 100 });
  });

  it("returns the same correct offset even when the trigger is rendered inside a positioned wrapper", () => {
    // Real-world bug from Sourcing: the trigger lives at viewport x=100, but
    // its DOM tree is `<TabsList><div position:relative><TabsTrigger /></div>`.
    // `offsetLeft` would be 0 (relative to the wrapper), `getBoundingClientRect`
    // is correct.
    const list = fakeListEl({ left: 0, width: 600 });
    const wrappedActiveTab = fakeTabEl({ left: 100, width: 120 });

    expect(computeActiveTabIndicator(list, wrappedActiveTab)).toEqual({ left: 100, width: 120 });
  });

  it("works when the TabsList itself is not at viewport x=0", () => {
    // E.g. tabs are inside a sidebar / dialog with horizontal offset.
    const list = fakeListEl({ left: 250, width: 400 });
    const activeTab = fakeTabEl({ left: 380, width: 100 });

    // 380 - 250 = 130
    expect(computeActiveTabIndicator(list, activeTab)).toEqual({ left: 130, width: 100 });
  });

  it("compensates for horizontal scroll on the TabsList (showNavButtons mode)", () => {
    // The list has scrolled 60 px to the right, so a tab visually at viewport
    // x=40 actually has DOM offset 40 + 60 = 100 from the list's start.
    const list = fakeListEl({ left: 0, width: 400 }, 60);
    const activeTab = fakeTabEl({ left: 40, width: 80 });

    // (40 - 0) + 60 = 100
    expect(computeActiveTabIndicator(list, activeTab)).toEqual({ left: 100, width: 80 });
  });
});
