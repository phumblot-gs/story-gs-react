import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Slider } from "@/components/ui/slider";

afterEach(cleanup);

describe("Slider thumbTabIndex", () => {
  it("par défaut, le thumb reste dans l'ordre de tabulation (tabIndex 0 de Radix)", () => {
    render(<Slider aria-label="Images par ligne" defaultValue={[3]} min={1} max={7} />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "0");
  });

  it("thumbTabIndex={-1} retire le thumb de l'ordre de tabulation", () => {
    render(<Slider aria-label="Images par ligne" defaultValue={[3]} min={1} max={7} thumbTabIndex={-1} />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
  });

  it("disabled garde le comportement Radix (pas de tabindex), même avec thumbTabIndex", () => {
    render(<Slider aria-label="Images par ligne" defaultValue={[3]} disabled thumbTabIndex={0} />);
    expect(screen.getByRole("slider")).not.toHaveAttribute("tabindex");
  });

  // CR-1151: the gs_w images-per-row slider is out of the Tab order but must stay usable after a click.
  it("avec thumbTabIndex={-1}, un pointerdown sur le thumb le focalise et les flèches changent la valeur", () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="Images par ligne"
        defaultValue={[3]}
        min={1}
        max={7}
        step={1}
        thumbTabIndex={-1}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole("slider");
    thumb.setPointerCapture = vi.fn();
    fireEvent.pointerDown(thumb, { pointerId: 1, button: 0 });
    expect(thumb).toHaveFocus();

    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith([4]);
    expect(thumb).toHaveAttribute("aria-valuenow", "4");
  });

  // CR-1151: Radix focuses the thumb by script on pointerdown, and Chromium then matches :focus-visible,
  // so a ring on an unreachable thumb would only ever show on a mouse click or drag.
  const ringClasses = (el: Element) => Array.from(el.classList).filter((c) => /ring/.test(c));

  it.each([
    ["sans thumbTabIndex", undefined],
    ["thumbTabIndex={0}", 0],
  ])("%s, le thumb garde son anneau de focus clavier", (_, thumbTabIndex) => {
    render(<Slider aria-label="Images par ligne" defaultValue={[3]} thumbTabIndex={thumbTabIndex} />);
    const thumb = screen.getByRole("slider");
    expect(ringClasses(thumb)).toEqual([
      "focus-visible:ring-2",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-context",
    ]);
    expect(thumb).toHaveClass("focus-visible:outline-none");
  });

  it("thumbTabIndex négatif : aucun anneau de focus, outline toujours supprimé", () => {
    render(<Slider aria-label="Images par ligne" defaultValue={[3]} thumbTabIndex={-1} />);
    const thumb = screen.getByRole("slider");
    expect(ringClasses(thumb)).toEqual([]);
    expect(thumb).toHaveClass("focus-visible:outline-none", "h-[10px]", "w-[10px]", "rounded-full");
  });
});
