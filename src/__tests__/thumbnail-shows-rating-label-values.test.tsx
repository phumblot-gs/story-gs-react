import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Thumbnail } from "@/components/Thumbnail";
import { Icon } from "@/components/ui/icons";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * Fleet-wide contract lock (GSP-417).
 *
 * `Thumbnail` is what gs_w, gs_guidelines and zoom actually render, and it consumes
 * `ButtonThumbnailStars` / `ButtonThumbnailLabels` internally. On a thumbnail, showing
 * the value *is* the function of those buttons: the user reads the rating and the
 * colour of the photo off the footer.
 *
 * `Thumbnail` must therefore never opt into `buttonDisplay="neutral"`, and the default
 * of that prop must stay `"value"`. This suite fails if the neutral mode ever leaks
 * down to the thumbnail — including through a badly chosen default — which the
 * isolated button tests alone would not catch.
 */

afterEach(() => cleanup());

const baseProps = {
  picture_id: 1,
  src: "/photo.jpg",
  filename: "photo.jpg",
  status: MediaStatus.SUBMITTED_FOR_APPROVAL,
};

/**
 * The stars and colour triggers are the two menu triggers of the footer, in DOM order.
 * Same locator as `thumbnail-rating-label-disabled.test.tsx`.
 */
const menuTriggers = (container: HTMLElement) => {
  const triggers = Array.from(
    container.querySelectorAll<HTMLButtonElement>("button[data-open]")
  );
  expect(triggers).toHaveLength(2);
  return triggers;
};

/** Thumbnail renders both buttons with `size="small"`, hence 10px icons. */
const ICON_SIZE = 10;

const iconMarkup = (name: "Star" | "StarFilled" | "Tag") => {
  const { container, unmount } = render(<Icon name={name} size={ICON_SIZE} />);
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  const html = svg!.outerHTML;
  unmount();
  return html;
};

const renderThumbnail = (props: Record<string, unknown> = {}) =>
  render(
    <Thumbnail {...baseProps} onRatingChange={vi.fn()} onLabelChange={vi.fn()} {...props} />
  );

describe("Thumbnail — the footer keeps displaying the rating and the label value", () => {
  it("shows the rating on the stars trigger", () => {
    const { container } = renderThumbnail({ rating: 4, label: "red" });
    const [stars] = menuTriggers(container);

    expect(stars).toHaveTextContent("4");
    expect(stars.querySelector("svg")!.outerHTML).toBe(iconMarkup("StarFilled"));
  });

  it("shows an outline star and no number when the rating is 0", () => {
    const { container } = renderThumbnail({ rating: 0, label: "transparent" });
    const [stars] = menuTriggers(container);

    expect(stars).toHaveTextContent("");
    expect(stars.querySelector("svg")!.outerHTML).toBe(iconMarkup("Star"));
  });

  it("shows the label colour on the colour trigger, not a Tag icon", () => {
    const { container } = renderThumbnail({ rating: 4, label: "red" });
    const [, labels] = menuTriggers(container);

    expect(labels.innerHTML).toContain("--label-red");
    expect(labels.querySelectorAll("svg")).toHaveLength(0);
  });

  it("renders no Tag icon anywhere in the footer", () => {
    const { container } = renderThumbnail({ rating: 4, label: "red" });

    expect(container.innerHTML).not.toContain(iconMarkup("Tag"));
  });

  it("shows a dotted swatch when no label is set", () => {
    const { container } = renderThumbnail({ rating: 4, label: "transparent" });
    const [, labels] = menuTriggers(container);

    expect(labels.querySelector(".border-dotted")).not.toBeNull();
    expect(labels.querySelectorAll("svg")).toHaveLength(0);
  });

  it("keeps showing the value for every rating from 0 to 5", () => {
    for (const rating of [0, 1, 2, 3, 4, 5]) {
      const { container, unmount } = renderThumbnail({ rating, label: "blue" });
      const [stars, labels] = menuTriggers(container);

      if (rating === 0) {
        expect(stars.querySelector("svg")!.outerHTML).toBe(iconMarkup("Star"));
      } else {
        expect(stars).toHaveTextContent(String(rating));
        expect(stars.querySelector("svg")!.outerHTML).toBe(iconMarkup("StarFilled"));
      }
      expect(labels.innerHTML).toContain("--label-blue");
      unmount();
    }
  });
});
