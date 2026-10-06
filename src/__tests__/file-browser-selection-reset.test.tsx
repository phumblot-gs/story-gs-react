import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser, FileItem } from "@/components/ui/file-browser";

// Classe portée par les <tr> sélectionnées (cf. file-browser.tsx).
const SELECTED_ROW_CLASS = "bg-blue-primary";

const makeFiles = (n: number): FileItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `f${i}`,
    file_name: `file-${i}.png`,
    parent_path: "/",
    file_size: 1024,
    mime_type: "image/png",
    is_directory: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }));

const rowFor = (fileName: string) => {
  const row = screen.getByText(fileName).closest("tr");
  if (!row) throw new Error(`No row found for ${fileName}`);
  return row;
};

const selectedRows = () =>
  Array.from(document.querySelectorAll("tbody tr")).filter((row) =>
    row.classList.contains(SELECTED_ROW_CLASS),
  );

afterEach(() => cleanup());

describe("FileBrowser — selectionResetKey", () => {
  // La sélection est un état interne. `selectionResetKey` laisse un parent la
  // vider depuis l'extérieur (bouton « Tout désélectionner ») sans rendre la
  // sélection contrôlée.

  it("clears the selection and reports [] when the key changes", () => {
    const files = makeFiles(3);
    const onSelectionChange = vi.fn();

    const { rerender } = render(
      <FileBrowser
        files={files}
        currentPath="/"
        selectionResetKey={0}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(rowFor("file-0.png"));
    fireEvent.click(rowFor("file-1.png"), { ctrlKey: true });
    expect(selectedRows()).toHaveLength(2);

    onSelectionChange.mockClear();

    rerender(
      <FileBrowser
        files={files}
        currentPath="/"
        selectionResetKey={1}
        onSelectionChange={onSelectionChange}
      />,
    );

    expect(selectedRows()).toHaveLength(0);
    expect(onSelectionChange).toHaveBeenCalledWith([]);
    // L'effet de notification existant suffit : pas de second appel ajouté.
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the selection when the key is re-rendered unchanged", () => {
    const files = makeFiles(3);
    const onSelectionChange = vi.fn();

    const { rerender } = render(
      <FileBrowser
        files={files}
        currentPath="/"
        selectionResetKey={7}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(rowFor("file-0.png"));
    expect(selectedRows()).toHaveLength(1);

    onSelectionChange.mockClear();

    rerender(
      <FileBrowser
        files={files}
        currentPath="/"
        selectionResetKey={7}
        onSelectionChange={onSelectionChange}
      />,
    );

    expect(selectedRows()).toHaveLength(1);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("does not clear anything on the first render", () => {
    const files = makeFiles(3);
    const onSelectionChange = vi.fn();

    render(
      <FileBrowser
        files={files}
        currentPath="/"
        selectionResetKey={3}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(rowFor("file-0.png"));

    expect(selectedRows()).toHaveLength(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ id: "f0" }),
    ]);
  });

  it("works without the prop — selection is untouched across re-renders", () => {
    const files = makeFiles(3);

    const { rerender } = render(<FileBrowser files={files} currentPath="/" />);

    fireEvent.click(rowFor("file-0.png"));
    expect(selectedRows()).toHaveLength(1);

    rerender(<FileBrowser files={files} currentPath="/" />);
    expect(selectedRows()).toHaveLength(1);
  });
});
