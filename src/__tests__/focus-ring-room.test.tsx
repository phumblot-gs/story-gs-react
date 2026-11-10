import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Layout, HStack, VStack, ActionBar, ActionBarProvider } from "@/components/layout";
import PageSearch from "@/components/PageSearch";
import PageHeader from "@/components/PageHeader";
import { ClippingEditor } from "@/components/ui/clipping-editor";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

afterEach(cleanup);

const OVERFLOW = /^overflow-/;
const overflowClasses = (el: Element) => Array.from(el.classList).filter((c) => OVERFLOW.test(c));

describe("Layout scroll", () => {
  // The existing values must not move: every Layout/HStack/VStack of the consumers relies on them.
  it.each([
    [undefined, ["overflow-auto"]],
    ["auto", ["overflow-auto"]],
    ["none", ["overflow-hidden"]],
    ["always", ["overflow-scroll"]],
    ["vertical", ["overflow-y-auto", "overflow-x-hidden"]],
    ["horizontal", ["overflow-x-auto", "overflow-y-hidden"]],
    ["both", ["overflow-auto"]],
    ["visible", ["overflow-visible"]],
  ] as const)("scroll=%s", (scroll, expected) => {
    render(
      <>
        <Layout scroll={scroll}>
          <span>layout</span>
        </Layout>
        <HStack scroll={scroll}>
          <span>hstack</span>
        </HStack>
        <VStack scroll={scroll}>
          <span>vstack</span>
        </VStack>
      </>,
    );
    for (const text of ["layout", "hstack", "vstack"]) {
      expect(overflowClasses(screen.getByText(text).parentElement!)).toEqual(expected);
    }
  });
});

// CR-1151: these internal rows clipped the 4px focus ring of their buttons.
// Rows that never shrink (flex-shrink-0) cannot scroll, so they are simply visible: no padding a consumer
// could cancel (className="p-0" gave 5px scrollbars). Only the shrinking title area keeps p-1 -m-1.
const expectVisibleRow = (el: Element) => {
  expect(overflowClasses(el)).toEqual(["overflow-visible"]);
  expect(el).toHaveClass("flex-shrink-0");
  expect(Array.from(el.classList).filter((c) => /^-?[pm][xytrbl]?-/.test(c))).toEqual([]);
};

describe("ring room inside the library rows", () => {
  it("PageSearch rightContent row", () => {
    render(<PageSearch leftContent={<span>Left</span>} rightContent={<button>Right</button>} />);
    expectVisibleRow(screen.getByRole("button", { name: "Right" }).parentElement!);
    expect(screen.getByText("Left").parentElement).not.toHaveClass("p-1");
  });

  it("PageHeader rows: right, title area, leftContent and title", () => {
    render(
      <PageHeader
        title="Prod"
        showBackButton
        leftContent={<button>Nav</button>}
        rightContent={<button>Right</button>}
      />,
    );
    expectVisibleRow(screen.getByRole("button", { name: "Right" }).parentElement!);
    const leftContent = screen.getByRole("button", { name: "Nav" }).parentElement!;
    expectVisibleRow(leftContent);
    const titleArea = leftContent.parentElement!;
    expect(titleArea).toHaveClass("p-1", "-m-1", "overflow-hidden", "flex-shrink");
    const title = screen.getByTestId("page-title-button").parentElement!;
    // No padding on the title: its left border is painted on the border box, padding would lengthen it (30 -> 40px).
    expect(title).toHaveClass("pl-4", "border-l", "min-w-0", "flex-shrink");
    expect(overflowClasses(title)).toEqual(["overflow-visible"]);
    expect(Array.from(title.classList).filter((c) => /^-?(p[xytrb]?|m[xytrbl]?)-/.test(c))).toEqual([]);
  });

  // A 50px fixed-height bar: compensated padding would add a vertical scroll once the row passes 40px
  // (wrapped content), so the ring room is an opt-in there.
  it.each([
    ["fixed", undefined],
    ["container", <div key="c" />],
  ])("ActionBar children row (%s): clips by default, contentOverflow=visible opts out", (_, container) => {
    const renderBar = (contentOverflow?: "auto" | "visible") =>
      render(
        <ActionBarProvider>
          <ActionBar selectedCount={2} onDeselectAll={vi.fn()} container={container} contentOverflow={contentOverflow}>
            <button>Act</button>
          </ActionBar>
        </ActionBarProvider>,
      );
    const row = () => screen.getByRole("button", { name: "Act" }).parentElement!;
    renderBar();
    expect(overflowClasses(row())).toEqual(["overflow-auto"]);
    expect(row()).not.toHaveClass("p-1");
    cleanup();
    renderBar("visible");
    expect(overflowClasses(row())).toEqual(["overflow-visible"]);
  });
});

describe("rings that would mislead", () => {
  // The editor focuses itself on pointer enter for its shortcuts, which matches :focus-visible on mouse hover.
  it("ClippingEditor root keeps its focus but has no ring", () => {
    const { container } = render(
      <ClippingEditor src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" onSegment={vi.fn()} language="en" />,
    );
    const root = container.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    expect(root).toHaveAttribute("tabindex", "0");
    expect(root).toHaveClass("outline-none");
    expect(Array.from(root.classList).filter((c) => /ring/.test(c))).toEqual([]);
  });

  // The active slot follows the mouse too; the caret already shows it.
  it("InputOTP active slot has no ring", async () => {
    render(
      <InputOTP maxLength={2} data-testid="otp">
        <InputOTPGroup>
          <InputOTPSlot index={0} data-testid="slot-0" />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    );
    await act(async () => screen.getByTestId("otp").focus());
    const slot = screen.getByTestId("slot-0");
    expect(slot.querySelector(".animate-caret-blink")).not.toBeNull();
    expect(Array.from(slot.classList).filter((c) => /ring|z-10/.test(c))).toEqual([]);
  });
});
