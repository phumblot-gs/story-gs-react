import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { ContactSheetPicture } from "@/components/ContactSheetPicture";
import type { ThumbnailProps } from "@/components/Thumbnail/Thumbnail";

const callbacks = vi.hoisted(() => new Map<number, ThumbnailProps["onSelectionChange"]>());
vi.mock("@/components/Thumbnail/Thumbnail", () => ({
  Thumbnail: (props: ThumbnailProps) => {
    callbacks.set(props.picture_id!, props.onSelectionChange);
    return <div />;
  },
}));
afterEach(() => { cleanup(); vi.restoreAllMocks(); callbacks.clear(); });

describe("contact sheet callback cache", () => {
  it("garde les callbacks montés stables et abandonne ceux des cellules sorties de la fenêtre", async () => {
    let scrollTop = 0;
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      return new DOMRect(0, this.hasAttribute("data-contact-sheet-cell") ? 0 : -scrollTop, 1000, this.hasAttribute("data-contact-sheet-cell") ? 300 : 60000);
    });
    const exports = [{ id: "site", thumbnails: Array.from({ length: 500 }, (_, i) => ({ picture_id: i + 1, src: `/p${i}.jpg` })) }];
    const props = { exports, onThumbnailChange: vi.fn(), virtualized: true, imageLoading: "native" as const };
    const { container, rerender } = render(<ContactSheetPicture {...props} />);
    const first = callbacks.get(1);
    expect(first).toBeTypeOf("function");
    rerender(<ContactSheetPicture {...props} />);
    expect(callbacks.get(1)).toBe(first);
    scrollTop = 4200; fireEvent.scroll(window);
    await waitFor(() => expect(container.querySelector('[data-picture-id="1"]')).toBeNull());
    scrollTop = 0; fireEvent.scroll(window);
    await waitFor(() => expect(container.querySelector('[data-picture-id="1"]')).not.toBeNull());
    expect(callbacks.get(1)).not.toBe(first);
  });
});
