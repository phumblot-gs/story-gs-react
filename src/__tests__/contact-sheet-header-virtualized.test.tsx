import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { ContactSheetReference } from "@/components/ContactSheetReference";
import { ContactSheetPicture } from "@/components/ContactSheetPicture";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * CR-684 header features (title, missing reference badge, titleContent) live outside the grid:
 * they must render the same whether the grid is windowed ("auto" above 100 thumbnails, 1.39.0) or not.
 */

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const make = (id: string, count: number, from = 1) => ({
  id,
  name: id,
  thumbnails: Array.from({ length: count }, (_, i) => ({ picture_id: from + i, src: `/p${from + i}.jpg` })),
});

const header = (container: HTMLElement) => {
  const heading = container.querySelector("h3")!;
  return {
    text: heading.textContent,
    tooltip: heading.getAttribute("title"),
    missing: heading.hasAttribute("data-missing-reference"),
    slot: container.querySelector("[data-title-content]")?.textContent ?? null,
    checkbox: screen.getAllByRole("checkbox")[0].getAttribute("aria-label"),
  };
};

describe("ContactSheetReference header — virtualized or not", () => {
  const cases = [
    { label: "smalltext", reference: { reference_id: 1, ref: "R1", smalltext: " Blue shirt " } },
    { label: "missing reference", reference: null },
  ];
  const layouts = ["grouped", "separated"] as const;

  for (const { label, reference } of cases) {
    for (const exportsLayout of layouts) {
      it(`${label}, ${exportsLayout}: same title, badge, slot and checkbox label with 150 thumbnails`, () => {
        const exports = [make("site", 150), make("market", 150, 1001)];
        const props = {
          reference,
          exports,
          exportsLayout,
          titleContent: <span>Vedette</span>,
          onSelectionChange: vi.fn(),
          imageLoading: "native" as const,
        };
        const auto = render(<ContactSheetReference {...props} />);
        expect(auto.container.querySelector("[data-virtualized]")).toBeInTheDocument();
        const windowed = header(auto.container);
        auto.unmount();

        const full = render(<ContactSheetReference {...props} virtualized={false} />);
        expect(full.container.querySelector("[data-virtualized]")).not.toBeInTheDocument();
        expect(header(full.container)).toEqual(windowed);
        expect(windowed.slot).toBe("Vedette");
        expect(windowed.missing).toBe(reference === null);
        expect(windowed.text).toBe(reference === null ? "Missing reference" : "Blue shirt");
      });
    }
  }
});

describe("ContactSheetPicture — CR-684 thumbnail features", () => {
  it("a Broadcast status button renders in a virtualized grid", () => {
    const exports = [
      {
        id: "site",
        thumbnails: Array.from({ length: 150 }, (_, i) => ({
          picture_id: i + 1,
          src: `/p${i + 1}.jpg`,
          statusButtons: [{ key: "broadcast", icon: "Broadcast" as const, status: MediaStatus.READY_TO_BROADCAST, label: "Broadcast" }],
        })),
      },
    ];
    const { container } = render(<ContactSheetPicture exports={exports} imageLoading="native" />);
    expect(container.querySelector("[data-virtualized]")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button", { name: "Broadcast" });
    expect(buttons.length).toBeGreaterThan(0);
    // viewBox of the Typicons cloud-storage glyph: only CustomBroadcastIcon outputs it.
    for (const button of buttons) {
      expect(button.querySelector('svg[viewBox="0 83.5 833 833"] path')).toBeInTheDocument();
    }
  });

  it("the promise of onThumbnailChange (comment) reaches the field in a virtualized grid", async () => {
    const onThumbnailChange = vi.fn((change: { type: string }) =>
      change.type === "comment" ? Promise.reject(new Error("500")) : undefined,
    );
    const thumbnails = Array.from({ length: 150 }, (_, i) => ({
      picture_id: i + 1,
      src: `/p${i + 1}.jpg`,
      filename: `p${i + 1}.tif`,
    }));
    const { container } = render(
      <ContactSheetPicture
        exports={[{ id: "e1", thumbnails }]}
        onThumbnailChange={onThumbnailChange}
        // Only the comments menu stays, so it is the single menu trigger of the thumbnail.
        thumbnailFeatures={{ selection: false, rating: false, label: false, tags: false, validation: false, open: false }}
      />,
    );
    expect(container.querySelector("[data-virtualized]")).toBeInTheDocument();

    const thumbnail = container.querySelector<HTMLElement>('[data-picture-id="7"]')!;
    await userEvent.hover(thumbnail);
    const trigger = within(thumbnail).getByRole("button", { expanded: false });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await userEvent.click(trigger);
    await userEvent.type(await screen.findByPlaceholderText("Add a comment"), "Retouch the collar");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(onThumbnailChange).toHaveBeenCalledWith(expect.objectContaining({ type: "comment" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The comment could not be saved");
    expect(screen.getByPlaceholderText("Add a comment")).toHaveValue("Retouch the collar");
  });
});
