import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { Thumbnail } from "@/components/Thumbnail";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * `ratingDisabled` / `labelDisabled` (GSP-417): same contract as
 * `validateDisabled` / `rejectDisabled`, applied to the stars and colour buttons,
 * so the host application can lock a thumbnail while a batch write is in flight.
 *
 * Unlike validate/reject there is no status-based disabling to combine with: the
 * disabling comes from the caller only.
 */

afterEach(() => cleanup());

const baseProps = {
  picture_id: 1,
  src: "/photo.jpg",
  filename: "photo.jpg",
  status: MediaStatus.SUBMITTED_FOR_APPROVAL,
  rating: 3,
  label: "red" as const,
};

/**
 * Neither button carries an accessible name, so they are located by their menu
 * trigger marker (`data-open`) in DOM order: stars first, then labels. The length
 * assertion makes the test fail loudly if that assumption ever breaks.
 */
const menuTriggers = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>("button[data-open]"));

const starsButton = (container: HTMLElement) => {
  const triggers = menuTriggers(container);
  expect(triggers).toHaveLength(2);
  return triggers[0];
};

const labelButton = (container: HTMLElement) => {
  const triggers = menuTriggers(container);
  expect(triggers).toHaveLength(2);
  return triggers[1];
};

const renderThumbnail = (props: Record<string, unknown> = {}) =>
  render(
    <Thumbnail {...baseProps} onRatingChange={vi.fn()} onLabelChange={vi.fn()} {...props} />
  );

describe("Thumbnail — external disabling of rating/label", () => {
  it("identifies the two menu triggers (stars then labels)", () => {
    const { container } = renderThumbnail();

    // The stars trigger displays the current rating next to the star.
    expect(starsButton(container)).toHaveTextContent("3");
    expect(labelButton(container)).not.toHaveTextContent("3");
  });

  it("leaves both buttons enabled when the props are absent (non-breaking default)", () => {
    const { container } = renderThumbnail();

    expect(starsButton(container)).toBeEnabled();
    expect(labelButton(container)).toBeEnabled();
  });

  it("disables only the stars button with ratingDisabled", () => {
    const { container } = renderThumbnail({ ratingDisabled: true });

    expect(starsButton(container)).toBeDisabled();
    expect(labelButton(container)).toBeEnabled();
  });

  it("disables only the colour button with labelDisabled", () => {
    const { container } = renderThumbnail({ labelDisabled: true });

    expect(starsButton(container)).toBeEnabled();
    expect(labelButton(container)).toBeDisabled();
  });

  it("disables both buttons when both props are set", () => {
    const { container } = renderThumbnail({ ratingDisabled: true, labelDisabled: true });

    expect(starsButton(container)).toBeDisabled();
    expect(labelButton(container)).toBeDisabled();
  });

  it("is a strict no-op when the props are explicitly false", () => {
    const { container } = renderThumbnail({ ratingDisabled: false, labelDisabled: false });

    expect(starsButton(container)).toBeEnabled();
    expect(labelButton(container)).toBeEnabled();
  });

  it("keeps the buttons displayed (no layout jump) when disabled", () => {
    const { container } = renderThumbnail({ ratingDisabled: true, labelDisabled: true });

    expect(menuTriggers(container)).toHaveLength(2);
  });

  it("does not disable the rating when only the validation is locked", () => {
    const { container } = renderThumbnail({ validateDisabled: true, rejectDisabled: true });

    expect(starsButton(container)).toBeEnabled();
    expect(labelButton(container)).toBeEnabled();
  });

  it("opens the stars menu when ratingDisabled is absent (control)", async () => {
    const { container } = renderThumbnail();

    await userEvent.click(starsButton(container));

    expect(starsButton(container)).toHaveAttribute("data-open", "true");
    expect(screen.getAllByRole("menuitem").length).toBeGreaterThan(0);
  });

  it("does not open the stars menu while ratingDisabled is set", async () => {
    const onRatingChange = vi.fn();
    const { container } = renderThumbnail({ ratingDisabled: true, onRatingChange });

    await userEvent.click(starsButton(container), { pointerEventsCheck: 0 });

    expect(starsButton(container)).toHaveAttribute("data-open", "false");
    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
    expect(onRatingChange).not.toHaveBeenCalled();
  });

  it("does not open the colour menu while labelDisabled is set", async () => {
    const onLabelChange = vi.fn();
    const { container } = renderThumbnail({ labelDisabled: true, onLabelChange });

    await userEvent.click(labelButton(container), { pointerEventsCheck: 0 });

    expect(labelButton(container)).toHaveAttribute("data-open", "false");
    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
    expect(onLabelChange).not.toHaveBeenCalled();
  });

  it("closes an open stars menu when ratingDisabled turns on, and does not reopen it", async () => {
    const { container, rerender } = renderThumbnail();

    await userEvent.click(starsButton(container));
    expect(starsButton(container)).toHaveAttribute("data-open", "true");

    rerender(
      <Thumbnail {...baseProps} onRatingChange={vi.fn()} onLabelChange={vi.fn()} ratingDisabled />
    );
    expect(starsButton(container)).toHaveAttribute("data-open", "false");

    // Lifting the lock must not pop the menu open again on its own.
    rerender(
      <Thumbnail
        {...baseProps}
        onRatingChange={vi.fn()}
        onLabelChange={vi.fn()}
        ratingDisabled={false}
      />
    );
    expect(starsButton(container)).toHaveAttribute("data-open", "false");
  });

  it("still opens the colour menu when only the stars are locked", async () => {
    const { container } = renderThumbnail({ ratingDisabled: true });

    await userEvent.click(labelButton(container));

    expect(labelButton(container)).toHaveAttribute("data-open", "true");
  });
});
