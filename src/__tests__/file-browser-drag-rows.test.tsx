import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser, FileItem } from "@/components/ui/file-browser";
import { INTERNAL_DRAG_TYPE } from "@/lib/file-browser-drag";

// Le DnD HTML5 n'est pas implémenté par happy-dom : on fournit un DataTransfer
// factice, suffisant pour vérifier le câblage (types, callbacks, effets), pas
// le rendu réel du drag — qui se valide dans un navigateur.
const makeDataTransfer = (types: string[] = []) => ({
  types,
  effectAllowed: "none",
  dropEffect: "none",
  setData: vi.fn((type: string) => types.push(type)),
  getData: vi.fn(() => ""),
  setDragImage: vi.fn(),
});

const file = (id: string): FileItem => ({
  id,
  file_name: `${id}.png`,
  parent_path: "/",
  file_size: 1024,
  mime_type: "image/png",
  is_directory: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
});

const dir = (id: string): FileItem => ({
  ...file(id),
  file_name: id,
  is_directory: true,
  mime_type: "",
});

const files = [file("a"), file("b"), dir("Target"), dir("Other")];

const rowFor = (label: string) => {
  const table = document.querySelector("table");
  if (!table) throw new Error("No table rendered");
  const row = within(table as HTMLElement).getByText(label).closest("tr");
  if (!row) throw new Error(`No row for ${label}`);
  return row;
};

afterEach(() => cleanup());

describe("FileBrowser — row drag and drop", () => {
  it("makes rows draggable only when onMoveItems is provided", () => {
    const { unmount } = render(<FileBrowser files={files} currentPath="/" />);
    expect(rowFor("a.png")).not.toHaveAttribute("draggable", "true");
    unmount();

    render(<FileBrowser files={files} currentPath="/" onMoveItems={vi.fn()} />);
    expect(rowFor("a.png")).toHaveAttribute("draggable", "true");
  });

  it("reports the dragged rows and the target folder on drop", () => {
    const onMoveItems = vi.fn();
    render(<FileBrowser files={files} currentPath="/" onMoveItems={onMoveItems} />);

    // Sélection de deux fichiers, puis drag depuis l'un d'eux.
    fireEvent.click(rowFor("a.png"));
    fireEvent.click(rowFor("b.png"), { ctrlKey: true });

    const dataTransfer = makeDataTransfer();
    fireEvent.dragStart(rowFor("a.png"), { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith(INTERNAL_DRAG_TYPE, expect.any(String));
    expect(dataTransfer.setDragImage).toHaveBeenCalled();

    fireEvent.dragOver(rowFor("Target"), { dataTransfer });
    fireEvent.drop(rowFor("Target"), { dataTransfer });

    expect(onMoveItems).toHaveBeenCalledTimes(1);
    const [items, target] = onMoveItems.mock.calls[0];
    expect(items.map((i: FileItem) => i.id)).toEqual(["a", "b"]);
    expect(target.id).toBe("Target");
  });

  it("outlines the hovered folder, and only a valid one", () => {
    render(<FileBrowser files={files} currentPath="/" onMoveItems={vi.fn()} />);

    const dataTransfer = makeDataTransfer();
    fireEvent.dragStart(rowFor("Target"), { dataTransfer });

    // Un fichier n'est pas une cible.
    fireEvent.dragOver(rowFor("a.png"), { dataTransfer });
    expect(rowFor("a.png").className).not.toContain("ring-black");

    // Le dossier déplacé lui-même non plus.
    fireEvent.dragOver(rowFor("Target"), { dataTransfer });
    expect(rowFor("Target").className).not.toContain("ring-black");

    // Un autre dossier, oui.
    fireEvent.dragOver(rowFor("Other"), { dataTransfer });
    expect(rowFor("Other").className).toContain("ring-black");

    fireEvent.dragLeave(rowFor("Other"), { dataTransfer });
    expect(rowFor("Other").className).not.toContain("ring-black");
  });

  it("does not move anything when dropping on a file", () => {
    const onMoveItems = vi.fn();
    render(<FileBrowser files={files} currentPath="/" onMoveItems={onMoveItems} />);

    const dataTransfer = makeDataTransfer();
    fireEvent.dragStart(rowFor("a.png"), { dataTransfer });
    fireEvent.drop(rowFor("b.png"), { dataTransfer });

    expect(onMoveItems).not.toHaveBeenCalled();
  });

  it("selects an unselected row before dragging it alone", () => {
    const onMoveItems = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <FileBrowser
        files={files}
        currentPath="/"
        onMoveItems={onMoveItems}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(rowFor("a.png"));
    onSelectionChange.mockClear();

    const dataTransfer = makeDataTransfer();
    fireEvent.dragStart(rowFor("b.png"), { dataTransfer });
    fireEvent.dragOver(rowFor("Target"), { dataTransfer });
    fireEvent.drop(rowFor("Target"), { dataTransfer });

    expect(onMoveItems.mock.calls[0][0].map((i: FileItem) => i.id)).toEqual(["b"]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([expect.objectContaining({ id: "b" })]);
  });
});

describe("FileBrowser — desktop import is not confused with a row drag", () => {
  // handleDrop appelait onFileDrop pour n'importe quel drop : un déplacement de
  // lignes relâché à côté d'un dossier était remonté comme un import externe.

  it("ignores an internal drop landing outside any folder row", () => {
    const onFileDrop = vi.fn();
    render(
      <FileBrowser
        files={files}
        currentPath="/"
        onMoveItems={vi.fn()}
        onFileDrop={onFileDrop}
      />,
    );

    const dataTransfer = makeDataTransfer();
    fireEvent.dragStart(rowFor("a.png"), { dataTransfer });
    fireEvent.drop(rowFor("b.png"), { dataTransfer });

    expect(onFileDrop).not.toHaveBeenCalled();
  });

  it("still forwards a real desktop drop", () => {
    const onFileDrop = vi.fn();
    render(<FileBrowser files={files} currentPath="/" onFileDrop={onFileDrop} />);

    fireEvent.drop(rowFor("a.png"), { dataTransfer: makeDataTransfer(["Files"]) });

    expect(onFileDrop).toHaveBeenCalledTimes(1);
  });

  it("keeps the import overlay working after an internal drag", () => {
    // dragLeave décrémentait un compteur que dragEnter n'avait pas incrémenté :
    // le compteur passait à -1 et l'overlay ne réapparaissait plus.
    render(<FileBrowser files={files} currentPath="/" onMoveItems={vi.fn()} onFileDrop={vi.fn()} />);

    const internal = makeDataTransfer([INTERNAL_DRAG_TYPE]);
    const container = rowFor("a.png").closest("div")!;
    fireEvent.dragEnter(container, { dataTransfer: internal });
    fireEvent.dragLeave(container, { dataTransfer: internal });

    fireEvent.dragEnter(container, { dataTransfer: makeDataTransfer(["Files"]) });

    expect(screen.getByText(/Déposer|Drop/i)).toBeInTheDocument();
  });
});
