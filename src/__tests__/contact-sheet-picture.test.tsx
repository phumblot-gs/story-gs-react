import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ContactSheetPicture, ContactSheetThumbnails } from "@/components/ContactSheetPicture";
import type { ContactSheetExport } from "@/components/ContactSheetReference";

afterEach(cleanup);

const makeExports = (selected: number[] = []): ContactSheetExport[] => [
  { id: "site", name: "Site", thumbnails: [1, 2].map((id) => ({
    picture_id: id, src: `/p${id}.jpg`, filename: `p${id}.jpg`, selected: selected.includes(id),
  })) },
  { id: "market", name: "Marketplace", thumbnails: [
    { view: "F" },
    { picture_id: 3, src: "/p3.jpg", filename: "p3.jpg", selected: selected.includes(3) },
  ] },
];

describe("ContactSheetPicture", () => {
  it("keeps the 1.38.0 name as a deprecated alias", () => {
    expect(ContactSheetThumbnails).toBe(ContactSheetPicture);
  });

  it("enchaîne les exports dans une seule grille sans en-tête", () => {
    const { container } = render(<ContactSheetPicture exports={makeExports()} thumbnailsPerRow={5} />);
    const grid = container.querySelector('[data-exports-layout="grouped"]')!;
    expect(grid.children).toHaveLength(4);
    expect(grid).toHaveStyle({ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" });
    expect(screen.queryByText("Site")).not.toBeInTheDocument();
    expect(screen.queryByText("Marketplace")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("dérive la sélection et remonte tous les médias sans les emplacements vides", () => {
    const onSelectionChange = vi.fn();
    const props = { onSelectionChange, language: "fr" };
    const { rerender } = render(<ContactSheetPicture {...props} exports={makeExports()} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");
    rerender(<ContactSheetPicture {...props} exports={makeExports([1])} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "indeterminate");
    fireEvent.click(screen.getByText("Tout sélectionner"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(true, [1, 2, 3]);
    rerender(<ContactSheetPicture {...props} exports={makeExports([1, 2, 3])} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "checked");
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(false, [1, 2, 3]);
  });

  it("désactive la sélection globale pour une grille vide et respecte les fonctionnalités", () => {
    const props = { onSelectionChange: vi.fn() };
    const { rerender } = render(<ContactSheetPicture {...props} />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
    rerender(<ContactSheetPicture {...props} exports={makeExports()} thumbnailFeatures={{ selection: false }} toolbarActions={<span>Filtres</span>} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });

  it("conserve le format des événements et la sélection par plage entre exports", () => {
    const onThumbnailChange = vi.fn();
    const { container } = render(<ContactSheetPicture exports={makeExports()} onThumbnailChange={onThumbnailChange} />);
    const hitAreas = container.querySelectorAll('[data-testid="thumbnail-checkbox-hit-area"]');
    fireEvent.click(hitAreas[0]);
    expect(onThumbnailChange).toHaveBeenLastCalledWith(expect.objectContaining({
      type: "selection", exportId: "site", pictureId: 1, pictureIds: [1], selected: true,
    }));
    fireEvent.pointerDown(hitAreas[2], { shiftKey: true });
    fireEvent.click(hitAreas[2], { shiftKey: true });
    expect(onThumbnailChange).toHaveBeenLastCalledWith(expect.objectContaining({
      type: "selection", exportId: "market", pictureId: 3, pictureIds: [1, 2, 3], selected: true,
    }));
  });
});
