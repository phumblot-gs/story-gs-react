import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ContactSheetPicture } from "@/components/ContactSheetPicture";
import { getThumbnailWindow } from "@/components/ContactSheetReference/useThumbnailWindow";
import { ContactSheetThumbnailGrid } from "@/components/ContactSheetReference/ContactSheetThumbnailGrid";
import { findScrollRoot } from "@/components/ContactSheetReference/useGroupedImageLoading";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

/** jsdom n'a pas de DragEvent : les coordonnées sont posées sur l'événement. */
function fireDrag(type: "dragOver" | "drop", node: Element, dataTransfer: object, clientX: number, clientY: number) {
  const event = createEvent[type](node, { dataTransfer });
  Object.defineProperties(event, { clientX: { value: clientX }, clientY: { value: clientY } });
  fireEvent(node, event);
}

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
    const { container, rerender } = render(<ContactSheetPicture exports={exports} thumbnailsPerRow={5} virtualized imageLoading="native" onSelectionChange={onSelectionChange} />);
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
    rerender(<ContactSheetPicture exports={exports} thumbnailsPerRow={4} virtualized imageLoading="native" />);
    scrollTop = 0;
    fireEvent.scroll(window);
    await waitFor(() => expect(container.querySelector('[data-picture-id="1"]')).toBeInTheDocument());
    // 4 colonnes : la 5e vignette ouvre la deuxième ligne.
    expect(container.querySelector('[data-picture-id="5"]')?.closest("[data-window-row]")).toHaveStyle({ top: "300px" });
  });

  it("virtualise aussi avec onReorder : la vignette saisie reste montée hors fenêtre et le drop fonctionne", async () => {
    let scrollTop = 0;
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => 1000);
    // Cellules : 5 colonnes de 200px, lignes de 300px ; la grille défile avec la page.
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const id = Number(this.getAttribute("data-picture-id"));
      if (!this.hasAttribute("data-contact-sheet-cell")) return new DOMRect(0, -scrollTop, 1000, 60000);
      const index = id - 1;
      return new DOMRect((index % 5) * 200, Math.floor(index / 5) * 300 - scrollTop, 200, 300);
    });
    const exports = [{ id: "site", thumbnails: Array.from({ length: 1000 }, (_, i) => ({ picture_id: i + 1, src: `/p${i + 1}.jpg` })) }];
    const onReorder = vi.fn();
    const { container } = render(<ContactSheetPicture exports={exports} thumbnailsPerRow={5} virtualized imageLoading="native" onReorder={onReorder} />);
    expect(container.querySelector("[data-virtualized]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-contact-sheet-cell]").length).toBeLessThan(50);

    const source = container.querySelector('[data-picture-id="1"]') as HTMLElement;
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn(), effectAllowed: "", dropEffect: "" };
    fireEvent.dragStart(source, { dataTransfer, clientX: 100, clientY: 150 });
    await new Promise((resolve) => requestAnimationFrame(resolve));

    scrollTop = 4200;
    fireEvent.scroll(window);
    await waitFor(() => expect(container.querySelector('[data-picture-id="71"]')).toBeInTheDocument());
    // Le nœud saisi est le même (pas de remontage), ses voisins sont démontés.
    expect(container.querySelector('[data-picture-id="1"]')).toBe(source);
    expect(container.querySelector('[data-picture-id="2"]')).not.toBeInTheDocument();

    // Milieu de la vignette 71 (ligne 14, colonne 0) : permutation.
    const grid = container.querySelector("[data-virtualized]") as HTMLElement;
    fireDrag("dragOver", grid, dataTransfer, 100, 150);
    await waitFor(() => expect(screen.getByTestId("swap-indicator")).toBeInTheDocument());
    fireDrag("drop", grid, dataTransfer, 100, 150);
    expect(onReorder).toHaveBeenCalledTimes(1);
    const [, pictureIds] = onReorder.mock.calls[0];
    expect(pictureIds[0]).toBe(71);
    expect(pictureIds[70]).toBe(1);
    fireEvent.dragEnd(source, { dataTransfer });
  });

  it("virtualise chaque export en mode separated, en-têtes toujours montés", () => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => 1000);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      if (this.hasAttribute("data-contact-sheet-cell")) return new DOMRect(0, 0, 200, 300);
      // Deuxième section bien plus bas que l'écran.
      const section = this.closest("[data-export-section]")?.getAttribute("data-export-section");
      return new DOMRect(0, section === "market" ? 20000 : 0, 1000, 15000);
    });
    const make = (id: string, from: number) => ({
      id, name: id, thumbnails: Array.from({ length: 250 }, (_, i) => ({ picture_id: from + i, src: `/p${from + i}.jpg` })),
    });
    const { container } = render(
      <ContactSheetThumbnailGrid
        exports={[make("site", 1), make("market", 1001)]}
        thumbnailsPerRow={5}
        exportsLayout="separated"
        renderExportHeader={(e) => <h2>{e.name}</h2>}
        virtualized
        onReorder={vi.fn()}
      />,
    );
    expect(screen.getByRole("heading", { name: "site" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "market" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-virtualized]")).toHaveLength(2);
    expect(container.querySelector('[data-picture-id="1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-picture-id="1001"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-contact-sheet-cell]").length).toBeLessThan(50);
  });
});
