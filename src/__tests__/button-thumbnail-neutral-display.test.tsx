import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { ButtonThumbnailStars } from "@/components/ui/button-thumbnail-stars";
import { ButtonThumbnailLabels, LabelColor } from "@/components/ui/button-thumbnail-labels";
import { Icon } from "@/components/ui/icons";

/**
 * `buttonDisplay` (GSP-417): opt-in display mode for the *trigger* of the stars and
 * colour buttons. `"neutral"` makes the trigger borrow the design and the colours of
 * `ButtonMenuStatus` (round, same dimensions, `variant="secondary"`) and show a fixed
 * icon instead of the current value, for action bars writing on a heterogeneous
 * selection. `"value"` — the default — must stay pixel-identical to the previous
 * behaviour, because that is what every thumbnail in the fleet relies on.
 */

afterEach(() => cleanup());

/** The trigger is the only button rendered by these components. */
const trigger = (container: HTMLElement) => {
  const buttons = container.querySelectorAll<HTMLButtonElement>("button");
  expect(buttons).toHaveLength(1);
  return buttons[0];
};

/**
 * Reference markup for a library icon, rendered standalone. Comparing the trigger's
 * inner SVG against this asserts *which* icon is displayed without hard-coding any
 * path data, so a future icon redesign does not silently break the assertion.
 */
const iconMarkup = (name: "Star" | "StarFilled", size: number) => {
  const { container, unmount } = render(<Icon name={name} size={size} />);
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  const html = svg!.outerHTML;
  unmount();
  return html;
};

/**
 * Radix numbers its trigger ids per render, so two renders of the same markup differ
 * on that attribute only. Stripping it lets us compare whole triggers byte for byte.
 */
const normalize = (html: string) => html.replace(/ id="radix-[^"]*"/g, "");

const triggerSvg = (container: HTMLElement) => {
  const svgs = trigger(container).querySelectorAll("svg");
  expect(svgs).toHaveLength(1);
  return svgs[0].outerHTML;
};

/**
 * The dotted "no colour" swatch drawn on the face of ButtonThumbnailLabels. The same
 * rendering serves the "no colour set" case and the whole neutral mode.
 */
const emptySwatch = (container: HTMLElement) =>
  trigger(container).querySelector<HTMLElement>(".border-dotted");

/** Menu items live in a Radix portal, outside the render container. */
const selectedMenuItem = () => {
  const selected = document.body.querySelectorAll<HTMLElement>(
    '.popup-action-item-menu[data-selected="true"]'
  );
  expect(selected).toHaveLength(1);
  return selected[0];
};

const allMenuItems = () =>
  Array.from(document.body.querySelectorAll<HTMLElement>(".popup-action-item-menu"));

describe("icon fixtures", () => {
  it("distinguishes Star from StarFilled, otherwise the icon assertions are vacuous", () => {
    expect(iconMarkup("Star", 12)).not.toBe(iconMarkup("StarFilled", 12));
  });
});

describe("ButtonThumbnailStars — buttonDisplay", () => {
  describe('default ("value") — counter-proof, must not change', () => {
    it("renders the rating on the button face", () => {
      const { container } = render(<ButtonThumbnailStars value={3} />);

      expect(trigger(container)).toHaveTextContent("3");
      expect(triggerSvg(container)).toBe(iconMarkup("StarFilled", 12));
    });

    it("renders an outline star with no number when value is 0", () => {
      const { container } = render(<ButtonThumbnailStars value={0} />);

      expect(trigger(container)).toHaveTextContent("");
      expect(triggerSvg(container)).toBe(iconMarkup("Star", 12));
    });

    it("keeps the value-mode dimensions and the inherited variant", () => {
      const { container } = render(<ButtonThumbnailStars value={3} />);

      expect(trigger(container)).toHaveClass("w-8", "h-6");
      expect(trigger(container)).toHaveClass("btn-normal");
      expect(trigger(container)).not.toHaveClass("btn-secondary");
    });

    it('is strictly equivalent to an explicit buttonDisplay="value"', () => {
      const implicit = render(<ButtonThumbnailStars value={4} />);
      const implicitHtml = normalize(trigger(implicit.container).outerHTML);
      implicit.unmount();

      const explicit = render(<ButtonThumbnailStars value={4} buttonDisplay="value" />);

      expect(normalize(trigger(explicit.container).outerHTML)).toBe(implicitHtml);
    });
  });

  describe('"neutral"', () => {
    it("shows the fixed Star icon whatever the value", () => {
      const expected = iconMarkup("Star", 12);

      for (const value of [0, 1, 2, 3, 4, 5]) {
        const { container, unmount } = render(
          <ButtonThumbnailStars value={value} buttonDisplay="neutral" />
        );

        expect(trigger(container)).toHaveTextContent("");
        expect(triggerSvg(container)).toBe(expected);
        unmount();
      }
    });

    it("renders the exact same face for every value", () => {
      const faces = [0, 1, 2, 3, 4, 5].map((value) => {
        const { container, unmount } = render(
          <ButtonThumbnailStars value={value} buttonDisplay="neutral" />
        );
        const html = trigger(container).innerHTML;
        unmount();
        return html;
      });

      expect(new Set(faces).size).toBe(1);
    });

    it("borrows the dimensions of ButtonMenuStatus per size", () => {
      const cases: Array<[("small" | "medium" | "large"), string[], number]> = [
        ["small", ["p-1", "w-4", "h-4"], 10],
        ["medium", ["p-0", "w-6", "h-6"], 12],
        ["large", ["p-0", "w-8", "h-8"], 14],
      ];

      for (const [size, classes, iconSize] of cases) {
        const { container, unmount } = render(
          <ButtonThumbnailStars value={3} buttonDisplay="neutral" size={size} />
        );

        expect(trigger(container)).toHaveClass(...classes);
        expect(triggerSvg(container)).toBe(iconMarkup("Star", iconSize));
        unmount();
      }
    });

    it('defaults to variant="secondary", the variant ButtonMenuStatus is used with', () => {
      const { container } = render(<ButtonThumbnailStars value={3} buttonDisplay="neutral" />);

      expect(trigger(container)).toHaveClass("btn-secondary");
      expect(trigger(container)).not.toHaveClass("btn-normal");
    });

    it("still honours an explicit variant", () => {
      const { container } = render(
        <ButtonThumbnailStars value={3} buttonDisplay="neutral" variant="ghost" />
      );

      expect(trigger(container)).toHaveClass("btn-ghost");
      expect(trigger(container)).not.toHaveClass("btn-secondary");
    });
  });

  describe("menu", () => {
    it("ticks the current rating in value mode", () => {
      render(<ButtonThumbnailStars value={3} open />);

      expect(allMenuItems()).toHaveLength(6);
      expect(selectedMenuItem()).toHaveTextContent("3");
    });

    it("ticks the current rating in neutral mode too", () => {
      render(<ButtonThumbnailStars value={3} buttonDisplay="neutral" open />);

      expect(allMenuItems()).toHaveLength(6);
      expect(selectedMenuItem()).toHaveTextContent("3");
    });
  });
});

describe("ButtonThumbnailLabels — buttonDisplay", () => {
  describe('default ("value") — counter-proof, must not change', () => {
    it("renders the current colour on the button face", () => {
      const { container } = render(<ButtonThumbnailLabels value="red" />);

      expect(trigger(container).querySelectorAll("svg")).toHaveLength(0);
      expect(trigger(container).innerHTML).toContain("--label-red");
    });

    it("renders a dotted swatch when no colour is set", () => {
      const { container } = render(<ButtonThumbnailLabels value="transparent" />);

      expect(trigger(container).querySelectorAll("svg")).toHaveLength(0);
      expect(trigger(container).querySelector(".border-dotted")).not.toBeNull();
    });

    it("keeps the value-mode dimensions and the inherited variant", () => {
      const { container } = render(<ButtonThumbnailLabels value="red" />);

      expect(trigger(container)).toHaveClass("w-8", "h-6");
      expect(trigger(container)).toHaveClass("btn-normal");
      expect(trigger(container)).not.toHaveClass("btn-secondary");
    });

    it('is strictly equivalent to an explicit buttonDisplay="value"', () => {
      const implicit = render(<ButtonThumbnailLabels value="blue" />);
      const implicitHtml = normalize(trigger(implicit.container).outerHTML);
      implicit.unmount();

      const explicit = render(<ButtonThumbnailLabels value="blue" buttonDisplay="value" />);

      expect(normalize(trigger(explicit.container).outerHTML)).toBe(implicitHtml);
    });
  });

  describe('"neutral"', () => {
    it("shows the dotted empty swatch whatever the value", () => {
      const values: LabelColor[] = [
        "transparent",
        "blue",
        "green",
        "orange",
        "pink",
        "purple",
        "red",
        "yellow",
        "white",
      ];

      for (const value of values) {
        const { container, unmount } = render(
          <ButtonThumbnailLabels value={value} buttonDisplay="neutral" />
        );

        // The face carries the dotted "no colour" swatch, never an icon...
        expect(emptySwatch(container)).not.toBeNull();
        expect(trigger(container).querySelectorAll("svg")).toHaveLength(0);
        // ...and never the value: no colour token leaks onto it, `red` included.
        expect(trigger(container).innerHTML).not.toContain("--label-");
        expect(emptySwatch(container)!.style.backgroundColor).toBe("transparent");
        unmount();
      }
    });

    it("renders the exact same face for every value", () => {
      const values: LabelColor[] = [
        "transparent",
        "blue",
        "green",
        "orange",
        "pink",
        "purple",
        "red",
        "yellow",
        "white",
      ];

      const faces = values.map((value) => {
        const { container, unmount } = render(
          <ButtonThumbnailLabels value={value} buttonDisplay="neutral" />
        );
        const html = trigger(container).innerHTML;
        unmount();
        return html;
      });

      expect(new Set(faces).size).toBe(1);
    });

    /**
     * The counter-proof that matters: `value="red"` is the case a regression would
     * surface on, since it is the only one where the two branches of `buttonContent`
     * disagree. The neutral face must stay the dotted, colourless swatch.
     */
    it('stays dotted and colourless even when value is "red"', () => {
      const neutral = render(<ButtonThumbnailLabels value="red" buttonDisplay="neutral" />);
      const neutralFace = trigger(neutral.container).innerHTML;
      expect(emptySwatch(neutral.container)).not.toBeNull();
      neutral.unmount();

      // Identical to what the default mode draws when there is genuinely no colour,
      // which is exactly the shared rendering being asserted.
      const empty = render(<ButtonThumbnailLabels value="transparent" />);
      expect(trigger(empty.container).innerHTML).toBe(neutralFace);
    });

    it("borrows the dimensions of ButtonMenuStatus per size", () => {
      // The swatch width matches ButtonMenuStatus.getIconSize() (10 / 12 / 14), so it
      // occupies exactly the room the status icon takes in a round of the same size.
      const cases: Array<[("small" | "medium" | "large"), string[], number]> = [
        ["small", ["p-1", "w-4", "h-4"], 10],
        ["medium", ["p-0", "w-6", "h-6"], 12],
        ["large", ["p-0", "w-8", "h-8"], 14],
      ];

      for (const [size, classes, swatchSize] of cases) {
        const { container, unmount } = render(
          <ButtonThumbnailLabels value="red" buttonDisplay="neutral" size={size} />
        );

        expect(trigger(container)).toHaveClass(...classes);
        const swatch = emptySwatch(container);
        expect(swatch).not.toBeNull();
        expect(parseFloat(swatch!.style.width)).toBeCloseTo(swatchSize, 5);
        // 0.7 ratio, compared numerically: `12 * 0.7` is 8.399999999999999 in JS and the
        // style parser normalises it to "8.4px", so a string compare would be brittle.
        expect(parseFloat(swatch!.style.height)).toBeCloseTo(swatchSize * 0.7, 5);
        unmount();
      }
    });

    it('defaults to variant="secondary", the variant ButtonMenuStatus is used with', () => {
      const { container } = render(<ButtonThumbnailLabels value="red" buttonDisplay="neutral" />);

      expect(trigger(container)).toHaveClass("btn-secondary");
      expect(trigger(container)).not.toHaveClass("btn-normal");
    });

    it("still honours an explicit variant", () => {
      const { container } = render(
        <ButtonThumbnailLabels value="red" buttonDisplay="neutral" variant="ghost" />
      );

      expect(trigger(container)).toHaveClass("btn-ghost");
      expect(trigger(container)).not.toHaveClass("btn-secondary");
    });
  });

  describe("menu", () => {
    /** LABEL_COLORS order: transparent, blue, green, orange, pink, purple, red, yellow, white. */
    const RED_INDEX = 6;

    it("ticks the current colour in value mode", () => {
      render(<ButtonThumbnailLabels value="red" open />);

      const items = allMenuItems();
      expect(items).toHaveLength(9);
      expect(selectedMenuItem()).toBe(items[RED_INDEX]);
    });

    it("ticks the current colour in neutral mode too", () => {
      render(<ButtonThumbnailLabels value="red" buttonDisplay="neutral" open />);

      const items = allMenuItems();
      expect(items).toHaveLength(9);
      expect(selectedMenuItem()).toBe(items[RED_INDEX]);
    });
  });
});
