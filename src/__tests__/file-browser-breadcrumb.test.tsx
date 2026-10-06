import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser } from "@/components/ui/file-browser";

const ROOT_LABEL = "My files";

afterEach(() => cleanup());

describe("FileBrowser — breadcrumb current folder", () => {
  // Le dossier courant était rendu en texte nu, sans le padding horizontal des
  // segments navigables : à la racine, le libellé se décalait donc quand on
  // entrait dans un sous-dossier, où il devenait un bouton. Il occupe
  // maintenant la même boîte, dans un bouton outline non interactif.

  it("renders the root label in an outline box, not as a plain span", () => {
    render(
      <FileBrowser files={[]} currentPath="/" labelRootFolder={ROOT_LABEL} />,
    );

    const label = screen.getByText(ROOT_LABEL);
    expect(label).toHaveClass("btn-outline");
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveAttribute("aria-current", "page");
    // Les couleurs outline sont sélectionnées sur data-bg, porté par le span.
    expect(label).toHaveAttribute("data-bg", "white");
    // Le `!` est nécessaire : `.font-regular` du bouton est déclarée après
    // `.font-medium` dans la feuille compilée et gagnerait sans lui.
    expect(label).toHaveClass("!font-medium");
  });

  it("does not navigate when the current folder is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <FileBrowser
        files={[]}
        currentPath="/"
        labelRootFolder={ROOT_LABEL}
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByText(ROOT_LABEL));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("puts the last folder of a sub-path in an outline box too", () => {
    render(
      <FileBrowser
        files={[]}
        currentPath="/FOLDER4"
        labelRootFolder={ROOT_LABEL}
      />,
    );

    const current = screen.getByText("FOLDER4");
    expect(current).toHaveClass("btn-outline");
    expect(current.tagName).toBe("SPAN");
  });

  it("keeps the root label navigable from a sub-folder", () => {
    const onNavigate = vi.fn();
    render(
      <FileBrowser
        files={[]}
        currentPath="/FOLDER4"
        labelRootFolder={ROOT_LABEL}
        onNavigate={onNavigate}
      />,
    );

    const root = screen.getByRole("button", { name: ROOT_LABEL });
    expect(root).toHaveClass("btn-secondary");

    fireEvent.click(root);
    expect(onNavigate).toHaveBeenCalledWith("/");
  });

  it("gives the root label the same box at the root and in a sub-folder", () => {
    // La cause du décalage horizontal signalé : padding identique des deux côtés.
    const { unmount } = render(
      <FileBrowser files={[]} currentPath="/" labelRootFolder={ROOT_LABEL} />,
    );
    const atRoot = screen.getByText(ROOT_LABEL).className;
    unmount();

    render(
      <FileBrowser
        files={[]}
        currentPath="/FOLDER4"
        labelRootFolder={ROOT_LABEL}
      />,
    );
    const inSubFolder = screen.getByRole("button", { name: ROOT_LABEL }).className;

    // py-1 (secondaire) et py-[4px] (outline, qui compense sa bordure) valent
    // tous deux 4px : seul le padding horizontal décide du décalage signalé.
    for (const boxClass of ["px-4", "text-base", "h-6", "rounded-full"]) {
      expect(atRoot).toContain(boxClass);
      expect(inSubFolder).toContain(boxClass);
    }
  });

  it("still elides the middle of a deep path", () => {
    const onNavigate = vi.fn();
    render(
      <FileBrowser
        files={[]}
        currentPath="/A/B/C"
        labelRootFolder={ROOT_LABEL}
        onNavigate={onNavigate}
      />,
    );

    // Parent navigable + dossier courant en outline.
    const parent = screen.getByRole("button", { name: "B" });
    fireEvent.click(parent);
    expect(onNavigate).toHaveBeenCalledWith("/A/B");

    expect(screen.getByText("C")).toHaveClass("btn-outline");
    expect(screen.queryByText(ROOT_LABEL)).not.toBeInTheDocument();
  });
});
