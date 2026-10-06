import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser, FileItem } from "@/components/ui/file-browser";

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

// Le conteneur scrollable du tableau porte le cadre (border-t / border-b).
const scrollContainer = () => {
  const table = document.querySelector("table");
  if (!table?.parentElement) throw new Error("No table container found");
  return table.parentElement;
};

afterEach(() => cleanup());

describe("FileBrowser — empty folder message", () => {
  // Le message vivait dans un bloc à part, sous le tableau, avec ses propres
  // border-t/border-b : il apparaissait donc sous une ligne horizontale, collé
  // en bas du composant. Il est maintenant dans le conteneur du tableau, où il
  // occupe la hauteur restante sous l'en-tête.

  it("renders the message inside the table container, not in a bordered block below", () => {
    render(<FileBrowser files={[]} currentPath="/" heightMode="fill-container" />);

    const message = screen.getByText("No files in this folder");
    const messageBox = message.parentElement!;

    expect(scrollContainer()).toContainElement(message);
    expect(messageBox.className).not.toMatch(/border-t|border-b/);
  });

  it("gives the message the leftover height and centres it", () => {
    render(<FileBrowser files={[]} currentPath="/" heightMode="fill-container" />);

    const messageBox = screen.getByText("No files in this folder").parentElement!;

    expect(messageBox).toHaveClass("flex-1", "flex", "items-center", "justify-center");
    expect(scrollContainer()).toHaveClass("flex", "flex-col");
  });

  it("leaves the container layout untouched when there are files", () => {
    render(<FileBrowser files={makeFiles(3)} currentPath="/" heightMode="fill-container" />);

    expect(screen.queryByText("No files in this folder")).not.toBeInTheDocument();
    expect(scrollContainer()).not.toHaveClass("flex-col");
  });
});
