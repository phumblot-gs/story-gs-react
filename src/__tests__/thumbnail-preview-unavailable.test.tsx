import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { ContactSheetReference, type ContactSheetExport } from "@/components/ContactSheetReference";
import { Thumbnail } from "@/components/Thumbnail";

/**
 * Média sans aperçu (pas d'URL, ou image en erreur) : fichier cassé et « Aperçu indisponible », et dans une planche
 * contact un clic émet `open` même sans la fonction `open`, pour que l'application redemande la vignette.
 */

afterEach(cleanup);

describe("Thumbnail without a preview", () => {
  it("shows the broken file placeholder when the media has no src", () => {
    render(<Thumbnail picture_id={1} filename="a.png" />);
    expect(screen.getByRole("img", { name: "Preview unavailable" })).toBeInTheDocument();
  });

  it("shows it for an image in error, in the requested language", () => {
    render(<Thumbnail picture_id={1} src="/a.png" hasError language="FR" />);
    expect(screen.getByRole("img", { name: "Aperçu indisponible" })).toBeInTheDocument();
  });

  it("does not show it while the image is pending or loading, nor for an empty view", () => {
    const { rerender } = render(<Thumbnail picture_id={1} src="/a.png" imagePending />);
    expect(screen.queryByRole("img", { name: "Preview unavailable" })).toBeNull();
    rerender(<Thumbnail picture_id={1} isLoading />);
    expect(screen.queryByRole("img", { name: "Preview unavailable" })).toBeNull();
    rerender(<Thumbnail view="1" />);
    expect(screen.queryByRole("img", { name: "Preview unavailable" })).toBeNull();
  });
});

describe("Contact sheet thumbnail without a preview", () => {
  const exports: ContactSheetExport[] = [{
    id: "main",
    thumbnails: [
      { picture_id: 1, filename: "missing.png" },
      { picture_id: 2, src: "/ok.png", filename: "ok.png" },
    ],
  }];

  it("sends `open` on a click, even with the open feature off; not on a thumbnail with a preview", async () => {
    const onThumbnailChange = vi.fn();
    render(
      <ContactSheetReference reference={{ reference_id: 1, ref: "R" }} exports={exports} onThumbnailChange={onThumbnailChange}
        thumbnailFeatures={{ selection: true, open: false }} />,
    );
    // The overlays of a thumbnail mount on its first hover (deferred): hover, then click what is there.
    const imageArea = (picture: number) => document.querySelector<HTMLElement>(`[data-picture-id="${picture}"] .cursor-pointer`)!;
    await userEvent.hover(imageArea(1));
    await userEvent.click(imageArea(1));
    expect(onThumbnailChange).toHaveBeenCalledWith(expect.objectContaining({ type: "open", pictureId: 1 }));
    onThumbnailChange.mockClear();
    await userEvent.hover(imageArea(2));
    await userEvent.click(imageArea(2));
    expect(onThumbnailChange).not.toHaveBeenCalledWith(expect.objectContaining({ type: "open" }));
  });
});
