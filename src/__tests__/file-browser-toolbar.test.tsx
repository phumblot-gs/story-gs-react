import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser, FileItem } from "@/components/ui/file-browser";

const item = (id: string, name: string, isDirectory = false): FileItem => ({
  id,
  file_name: name,
  parent_path: "/",
  file_size: isDirectory ? 0 : 1024,
  mime_type: isDirectory ? "" : "image/png",
  is_directory: isDirectory,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
});

// 2 dossiers + 3 fichiers.
const files: FileItem[] = [
  item("d1", "Folder A", true),
  item("d2", "Folder B", true),
  item("f1", "a.png"),
  item("f2", "b.png"),
  item("f3", "c.png"),
];

const row = (name: string) => screen.getByText(name).closest("tr")!;
const bulkBar = () => document.querySelector("[data-bulk-actions]") as HTMLElement | null;
const bulkButton = (action: string) => bulkBar()!.querySelector(`[data-action="${action}"]`) as HTMLButtonElement;

afterEach(() => cleanup());

describe("FileBrowser — en-tête", () => {
  it("plus de bouton Actualiser", () => {
    render(<FileBrowser files={files} currentPath="/" onRefresh={() => {}} />);
    expect(screen.queryByRole("button", { name: /refresh|actualiser/i })).toBeNull();
  });

  it("compte les fichiers et les sous-dossiers, sur la ligne du breadcrumb", () => {
    render(<FileBrowser files={files} currentPath="/" language="FR" />);
    const count = document.querySelector("[data-item-count]")!;
    expect(count).toHaveTextContent("5 éléments");
    // Même ligne que le breadcrumb (dossier courant).
    expect(count.closest(".border-b")).toContainElement(document.querySelector('[aria-current="page"]') as HTMLElement);
  });

  it("singulier, total connu et « Aucun élément »", () => {
    const { rerender } = render(<FileBrowser files={[files[0]]} currentPath="/" language="FR" />);
    expect(document.querySelector("[data-item-count]")).toHaveTextContent("1 élément");
    rerender(<FileBrowser files={files} totalFiles={1234} currentPath="/" language="FR" />);
    expect(document.querySelector("[data-item-count]")).toHaveTextContent("1 234 éléments");
    rerender(<FileBrowser files={[]} currentPath="/" language="FR" />);
    expect(document.querySelector("[data-item-count]")).toHaveTextContent("Aucun élément");
  });

  it("bouton « + Ajouter » à droite du compteur, menu avec les trois entrées", () => {
    const onCreateFolder = vi.fn();
    render(<FileBrowser files={files} currentPath="/" language="FR" showUploadButton onCreateFolder={onCreateFolder} />);
    const add = screen.getByRole("button", { name: "Ajouter" });
    const count = document.querySelector("[data-item-count]")!;
    expect(count.compareDocumentPosition(add) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.pointerDown(add, { button: 0, pointerType: "mouse" });
    fireEvent.click(add);
    const menu = screen.getByRole("menu");
    expect(within(menu).getAllByRole("menuitem").map((m) => m.textContent)).toEqual([
      "Nouveau dossier",
      "Importer des fichiers",
      "Importer des dossiers",
    ]);
    fireEvent.click(within(menu).getByText("Nouveau dossier"));
    expect(onCreateFolder).toHaveBeenCalledTimes(1);
  });

  it("showUploadButton={false} masque « Ajouter »", () => {
    render(<FileBrowser files={files} currentPath="/" showUploadButton={false} />);
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
  });
});

describe("FileBrowser — actions en masse", () => {
  it("masquées sans sélection, boutons additionnels compris", () => {
    const renderBulkActions = vi.fn(() => <button>Add to project</button>);
    render(<FileBrowser files={files} currentPath="/" renderBulkActions={renderBulkActions} />);
    expect(bulkBar()).toBeNull();
    expect(screen.queryByText("Add to project")).toBeNull();
  });

  it("mêmes boutons que les lignes ; Renommer désactivé avec plusieurs éléments", () => {
    const onDelete = vi.fn();
    render(<FileBrowser files={files} currentPath="/" onDelete={onDelete} />);
    fireEvent.click(row("a.png"));
    expect(bulkButton("rename")).toBeEnabled();
    fireEvent.click(row("b.png"), { metaKey: true });
    expect(screen.getByText("2 selected")).toBeInTheDocument();
    expect(bulkButton("rename")).toBeDisabled();
    for (const action of ["move", "download", "share", "delete"]) expect(bulkButton(action)).toBeEnabled();

    fireEvent.click(bulkButton("delete"));
    expect(onDelete).toHaveBeenCalledWith([files[2], files[3]]);

    // Survol d'une ligne : mêmes actions, dans le même ordre.
    fireEvent.mouseEnter(row("c.png"));
    const rowActions = Array.from(row("c.png").querySelectorAll("[data-action]")).map((b) => b.getAttribute("data-action"));
    const barActions = Array.from(bulkBar()!.querySelectorAll("[data-action]")).map((b) => b.getAttribute("data-action"));
    expect(barActions).toEqual(rowActions);
  });

  it("hiddenActions et disabledActions s'appliquent aussi à la barre", () => {
    render(<FileBrowser files={files} currentPath="/" hiddenActions={["share"]} disabledActions={["move"]} />);
    fireEvent.click(row("a.png"));
    expect(bulkBar()!.querySelector('[data-action="share"]')).toBeNull();
    expect(bulkButton("move")).toBeDisabled();
  });

  it("renderBulkActions reçoit la sélection, rendu à gauche des actions natives", () => {
    const renderBulkActions = vi.fn((items: FileItem[]) => <button data-testid="extra">Add {items.length}</button>);
    render(<FileBrowser files={files} currentPath="/" renderBulkActions={renderBulkActions} />);
    fireEvent.click(row("a.png"));
    fireEvent.click(row("Folder A"), { metaKey: true });
    const extra = screen.getByTestId("extra");
    expect(extra).toHaveTextContent("Add 2");
    expect(renderBulkActions).toHaveBeenLastCalledWith(expect.arrayContaining([files[0], files[2]]));
    expect(extra.compareDocumentPosition(bulkButton("rename")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("toutes les actions masquées : la barre reste pour les boutons additionnels", () => {
    render(
      <FileBrowser
        files={files}
        currentPath="/"
        hiddenActions={["rename", "move", "download", "share", "delete"]}
        renderBulkActions={() => <button>Add to project</button>}
      />,
    );
    fireEvent.click(row("a.png"));
    expect(screen.getByText("Add to project")).toBeInTheDocument();
    expect(bulkBar()!.querySelector("[data-action]")).toBeNull();
  });
});

describe("FileBrowser — ajustements", () => {
  it("libellé de la racine traduit par défaut, surchargeable", () => {
    // Une seule instance, langue ajoutée puis retirée : plantait avant la
    // correction de useTranslationSafe (ordre des hooks).
    const { rerender } = render(<FileBrowser files={files} currentPath="/" />);
    const label = () => document.querySelector('[aria-current="page"]');
    expect(label()).toHaveTextContent("My files");
    for (const [language, text] of [["FR", "Mes fichiers"], ["ES", "Mis archivos"], ["IT", "I miei file"], ["DE", "Meine Dateien"]]) {
      rerender(<FileBrowser files={files} currentPath="/" language={language} />);
      expect(label()).toHaveTextContent(text);
    }
    rerender(<FileBrowser files={files} currentPath="/" />);
    expect(label()).toHaveTextContent("My files");
    rerender(<FileBrowser files={files} currentPath="/" labelRootFolder="Mon espace" />);
    expect(label()).toHaveTextContent("Mon espace");
  });

  it("icône d'image pour les fichiers image (type MIME, ou extension à défaut)", () => {
    const list = [
      item("i1", "photo.jpg"),
      { ...item("i2", "scan.TIFF"), mime_type: null },
      { ...item("t1", "notes.txt"), mime_type: "text/plain" },
    ];
    render(<FileBrowser files={list} currentPath="/" />);
    expect(row("photo.jpg").querySelector(".lucide-file-image")).not.toBeNull();
    expect(row("scan.TIFF").querySelector(".lucide-file-image")).not.toBeNull();
    expect(row("notes.txt").querySelector(".lucide-file-image")).toBeNull();
  });

  it("actions en masse en variant secondary, actions des lignes en ghost", () => {
    render(<FileBrowser files={files} currentPath="/" />);
    fireEvent.click(row("a.png"));
    expect(bulkButton("delete")).toHaveClass("btn-secondary");
    fireEvent.mouseEnter(row("b.png"));
    expect(row("b.png").querySelector('[data-action="delete"]')).toHaveClass("btn-ghost");
  });

  it("en-tête de colonnes collant, décalé de stickyHeaderOffset quand la page défile", () => {
    const { rerender } = render(<FileBrowser files={files} currentPath="/" stickyHeaderOffset={60} />);
    const th = document.querySelector("thead th") as HTMLElement;
    expect(th).toHaveClass("sticky");
    expect(th.style.top).toBe("60px");
    rerender(<FileBrowser files={files} currentPath="/" heightMode="max-height" maxHeight="300px" stickyHeaderOffset={60} />);
    expect((document.querySelector("thead th") as HTMLElement).style.top).toBe("0px");
  });
});
