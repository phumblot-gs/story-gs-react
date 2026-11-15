import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { StrictMode } from "react";

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

  // Like native :focus-visible: a pointer or touch press hides the ring until the user presses a key on the thumb.
  describe("thumb par défaut : anneau au clavier, masqué après un appui jusqu'à la première touche", () => {
    const setup = (props: Partial<React.ComponentProps<typeof Slider>> = {}) => {
      const onValueChange = vi.fn();
      const view = render(
        <StrictMode>
          <button>Avant</button>
          <Slider aria-label="Images par ligne" defaultValue={[3]} min={1} max={7} step={1} onValueChange={onValueChange} {...props} />
        </StrictMode>,
      );
      const thumb = screen.getByRole("slider");
      thumb.setPointerCapture = vi.fn();
      const track = document.querySelector<HTMLElement>(".h-\\[2px\\]")!;
      track.setPointerCapture = vi.fn();
      return { ...view, thumb, track, onValueChange };
    };
    const press = (target: HTMLElement, clientX?: number) => {
      fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX });
      fireEvent.pointerUp(document, { pointerId: 1, button: 0 });
    };
    const tabTo = (thumb: HTMLElement) => {
      const before = screen.getByRole("button", { name: "Avant" });
      before.focus();
      fireEvent.keyDown(before, { key: "Tab" });
      act(() => thumb.focus());
    };
    const RING = "focus-visible:ring-2";

    it("pointerdown sur le thumb : focalisé, sans anneau ; la première flèche change la valeur et rend l'anneau", () => {
      const { thumb, onValueChange } = setup();
      fireEvent.pointerDown(thumb, { pointerId: 1, button: 0 });
      expect(thumb).toHaveFocus();
      expect(ringClasses(thumb)).toEqual([]);

      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(onValueChange).toHaveBeenLastCalledWith([4]);
      expect(ringClasses(thumb)).toContain(RING);
    });

    it("pointerdown sur la piste vers une nouvelle valeur : le thumb est focalisé, sans anneau", () => {
      const { thumb, track } = setup();
      fireEvent.pointerDown(track, { pointerId: 1, button: 0, clientX: 0 });
      expect(thumb).toHaveFocus();
      expect(thumb).toHaveAttribute("aria-valuenow", "1");
      expect(ringClasses(thumb)).toEqual([]);
    });

    // Review scenario A: jsdom rects are 0 wide, so a track press always resolves to `min`; with the value
    // already at `min`, Radix neither changes the value nor focuses the thumb.
    it("appui sur la piste à la valeur courante (thumb non focalisé) puis Tab : anneau", () => {
      const { thumb, track } = setup({ defaultValue: [1] });
      press(track, 0);
      expect(thumb).not.toHaveFocus();
      expect(thumb).toHaveAttribute("aria-valuenow", "1");

      tabTo(thumb);
      expect(thumb).toHaveFocus();
      expect(ringClasses(thumb)).toContain(RING);
    });

    // Review scenario B: preventDefault in the consumer handler makes Radix skip its own, the thumb is never focused.
    it("onPointerDown du consommateur avec preventDefault puis Tab : anneau", () => {
      const onPointerDown = vi.fn((event: React.PointerEvent) => event.preventDefault());
      const { thumb } = setup({ onPointerDown });
      press(thumb);
      expect(onPointerDown).toHaveBeenCalledTimes(1);
      expect(thumb).not.toHaveFocus();

      tabTo(thumb);
      expect(ringClasses(thumb)).toContain(RING);
    });

    // Review scenario C: Chromium blurs the thumb while React commits `disabled`, when ReactDOM drops events, so
    // onBlur never runs. Blurring inside React's removal of tabindex reproduces it in jsdom, and the focus guard
    // mirrors Chromium, where React's post-commit focus restore is a no-op on a thumb without tabindex.
    it("disabled pendant le focus après un clic, réactivé, appui à vide puis Tab : anneau", () => {
      const { thumb, track, rerender } = setup({ defaultValue: [1] });
      fireEvent.pointerDown(thumb, { pointerId: 1, button: 0 });
      fireEvent.pointerUp(document, { pointerId: 1, button: 0 });
      expect(thumb).toHaveFocus();

      const focus = thumb.focus.bind(thumb);
      thumb.focus = (options?: FocusOptions) => {
        if (thumb.hasAttribute("tabindex")) focus(options);
      };
      const removeAttribute = thumb.removeAttribute.bind(thumb);
      const onBlurDuringCommit = vi.fn();
      thumb.addEventListener("blur", onBlurDuringCommit);
      thumb.removeAttribute = (name: string) => {
        if (name === "tabindex") thumb.blur();
        removeAttribute(name);
      };
      const renderSlider = (disabled: boolean) =>
        rerender(
          <StrictMode>
            <button>Avant</button>
            <Slider aria-label="Images par ligne" defaultValue={[1]} min={1} max={7} step={1} disabled={disabled} />
          </StrictMode>,
        );
      renderSlider(true);
      expect(onBlurDuringCommit).toHaveBeenCalled();
      expect(thumb).not.toHaveFocus();

      renderSlider(false);
      press(track, 0);
      expect(thumb).not.toHaveFocus();
      tabTo(thumb);
      expect(ringClasses(thumb)).toContain(RING);
    });

    // On macOS a right-click opening a context menu swallows pointerup: the next key must end the press.
    it("appui sur la piste sans pointerup, puis Tab : la touche termine l'appui, anneau", () => {
      const { thumb, track } = setup({ defaultValue: [1] });
      fireEvent.pointerDown(track, { pointerId: 1, button: 0, clientX: 0 });
      expect(thumb).not.toHaveFocus();

      tabTo(thumb);
      expect(thumb).toHaveFocus();
      expect(ringClasses(thumb)).toContain(RING);
    });

    // A press still open at unmount would otherwise leave its capture listeners on document.
    it("démonté pendant un appui : les écouteurs de fin d'appui sont retirés du document", () => {
      const { thumb, unmount } = setup();
      const add = vi.spyOn(document, "addEventListener");
      const remove = vi.spyOn(document, "removeEventListener");
      const pressEndTypes = ["pointerup", "pointercancel", "keydown"];
      const isPressEnd = ([type, , options]: Parameters<typeof document.addEventListener>) =>
        pressEndTypes.includes(type) && options === true;
      try {
        fireEvent.pointerDown(thumb, { pointerId: 1, button: 0 });
        const added = add.mock.calls.filter(isPressEnd);
        expect(added.map(([type]) => type)).toEqual(pressEndTypes);

        unmount();
        const removed = remove.mock.calls.filter(isPressEnd);
        expect(removed).toEqual(added);
      } finally {
        add.mockRestore();
        remove.mockRestore();
      }
    });

    it("après le blur, un nouveau focus clavier rend l'anneau, conservé avec les flèches", () => {
      const { thumb } = setup();
      press(thumb);
      expect(ringClasses(thumb)).toEqual([]);

      fireEvent.blur(thumb);
      tabTo(thumb);
      expect(ringClasses(thumb)).toContain(RING);

      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(ringClasses(thumb)).toContain(RING);
    });

    it("thumbTabIndex={-1} : appui puis flèche, toujours aucun anneau", () => {
      const { thumb, onValueChange } = setup({ thumbTabIndex: -1 });
      press(thumb);
      expect(thumb).toHaveFocus();
      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(onValueChange).toHaveBeenLastCalledWith([4]);
      expect(ringClasses(thumb)).toEqual([]);
    });

    it("disabled : un pointerdown ne masque pas l'anneau une fois réactivé", () => {
      const { rerender } = render(<Slider aria-label="Images par ligne" defaultValue={[3]} disabled />);
      fireEvent.pointerDown(screen.getByRole("slider"), { pointerId: 1, button: 0 });
      rerender(<Slider aria-label="Images par ligne" defaultValue={[3]} />);
      act(() => screen.getByRole("slider").focus());
      expect(ringClasses(screen.getByRole("slider"))).toContain(RING);
    });

    it("transmet le onPointerDown du consommateur", () => {
      const onPointerDown = vi.fn();
      const { thumb } = setup({ onPointerDown });
      fireEvent.pointerDown(thumb, { pointerId: 1, button: 0 });
      expect(onPointerDown).toHaveBeenCalledTimes(1);
    });
  });
});
