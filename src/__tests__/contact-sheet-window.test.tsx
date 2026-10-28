import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ContactSheetThumbnails } from "@/components/ContactSheetThumbnails";
import { getThumbnailWindow } from "@/components/ContactSheetReference/useThumbnailWindow";
import { findScrollRoot } from "@/components/ContactSheetReference/useGroupedImageLoading";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("contact sheet row window", () => {
  it("borne la fenêtre sur des lignes complètes, avec deux lignes de réserve", () => {
    expect(getThumbnailWindow(1000, 5, 300, 15, 0, 600)).toEqual({ start: 0, end: 20, offset: 0, height: 62985 });
    expect(getThumbnailWindow(1000, 5, 300, 15, 3150, 3750)).toEqual({ start: 40, end: 70, offset: 2520, height: 62985 });
    expect(getThumbnailWindow(7, 5, 300, 15, 0, 600).end).toBe(7);
    expect(getThumbnailWindow(0, 5, 300, 15, 0, 600).height).toBe(0);
  });

  it("ignore overflow:auto lorsque l'ancêtre ne défile pas réellement", () => {
    const outer = document.createElement("div");
    const inner = document.createElement("div");
    const grid = document.createElement("div");
    outer.style.overflowY = inner.style.overflowY = "auto";
    outer.append(inner); inner.append(grid); document.body.append(outer);
    Object.defineProperties(outer, { scrollHeight: { value: 2000 }, clientHeight: { value: 600 } });
    Object.defineProperties(inner, { scrollHeight: { value: 1800 }, clientHeight: { value: 1800 } });
    expect(findScrollRoot(grid)).toBe(outer);
    outer.remove();
  });

  it("monte une fenêtre bornée, la déplace au scroll, conserve la portée de sélection et se redimensionne", async () => {
    let scrollTop = 0;
    let width = 1000;
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const isCell = this.hasAttribute("data-contact-sheet-cell");
      return new DOMRect(0, isCell ? 0 : -scrollTop, width, isCell ? 300 : 60000);
    });
    const exports = [{ id: "site", thumbnails: Array.from({ length: 1000 }, (_, i) => ({
      picture_id: i + 1, src: `/p${i + 1}.jpg`, filename: `p${i + 1}.jpg`, selected: false,
    })) }];
    const onSelectionChange = vi.fn();
    const { container, rerender } = render(<ContactSheetThumbnails exports={exports} thumbnailsPerRow={5} virtualized imageLoading="native" onSelectionChange={onSelectionChange} />);
    expect(container.querySelectorAll("[data-contact-sheet-cell]").length).toBeLessThan(50);
    expect(container.querySelector('[data-picture-id="1"]')).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onSelectionChange).toHaveBeenCalledWith(true, Array.from({ length: 1000 }, (_, i) => i + 1));

    scrollTop = 4200;
    fireEvent.scroll(window);
    await waitFor(() => expect(container.querySelector('[data-picture-id="1"]')).not.toBeInTheDocument());
    expect(container.querySelector('[data-picture-id="61"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-contact-sheet-cell]").length).toBeLessThan(50);

    width = 800;
    rerender(<ContactSheetThumbnails exports={exports} thumbnailsPerRow={4} virtualized imageLoading="native" />);
    expect(container.querySelector("[data-virtualized] > div")).toHaveStyle({ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" });
    scrollTop = 0;
    fireEvent.scroll(window);
    await waitFor(() => expect(container.querySelector('[data-picture-id="1"]')).toBeInTheDocument());
  });

  it("conserve le rendu complet pour le réordonnancement", () => {
    const exports = [{ id: "site", thumbnails: Array.from({ length: 100 }, (_, i) => ({ picture_id: i + 1, src: `/p${i}.jpg` })) }];
    const { container } = render(<ContactSheetThumbnails exports={exports} virtualized imageLoading="native" onReorder={vi.fn()} />);
    expect(container.querySelector("[data-virtualized]")).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-contact-sheet-cell]")).toHaveLength(100);
  });
});
