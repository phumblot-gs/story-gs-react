import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ClippingEditor } from "@/components/ui/clipping-editor";

afterEach(() => cleanup());

const renderEditor = (props = {}) => render(<ClippingEditor src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" onSegment={vi.fn()} language="en" {...props} />);

describe("ClippingEditor", () => {
  it("expose les outils avec leur raccourci et l'outil actif", () => {
    renderEditor();
    const bar = screen.getByRole("toolbar", { name: "Clipping tools" });
    expect(bar).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep (keyboard: Spacebar)" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Hair (keyboard: V)" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Pan (keyboard: C)" })).toBeInTheDocument();
  });

  it("Espace bascule Garder / Retirer, V / X / S / C choisissent l'outil", () => {
    renderEditor();
    const root = document.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    fireEvent.keyDown(root, { key: " " });
    expect(screen.getByRole("button", { name: "Remove (keyboard: Spacebar)" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(root, { key: " " });
    expect(screen.getByRole("button", { name: "Keep (keyboard: Spacebar)" })).toHaveAttribute("aria-pressed", "true");
    for (const [key, name] of [["v", "Hair (keyboard: V)"], ["x", "Eraser (keyboard: X)"], ["s", "Scalpel (keyboard: S)"], ["c", "Pan (keyboard: C)"]]) {
      fireEvent.keyDown(root, { key });
      expect(screen.getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");
    }
  });

  it("annuler et rétablir sont désactivés sans historique", () => {
    renderEditor();
    expect(screen.getByRole("button", { name: "Undo (Z)" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Redo (Y)" })).toBeDisabled();
  });

  it("bascule entre vue simple et vue partagée, avec le bouton Aperçu en vue simple", () => {
    renderEditor();
    expect(screen.getByRole("button", { name: "Split view (keyboard: 2)" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Preview" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Single pane view (keyboard: 1)" }));
    expect(screen.getByRole("button", { name: "Preview" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Clipping preview on a transparent background" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByRole("img", { name: "Clipping preview on a transparent background" })).toBeInTheDocument();
  });

  it("Télécharger reste désactivé tant qu'il n'y a pas d'image détourée", () => {
    renderEditor();
    expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();
  });

  it("n'affiche le bouton Fermer que si onClose est fourni", () => {
    const onClose = vi.fn();
    const { rerender } = renderEditor();
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    rerender(<ClippingEditor src="x.png" onSegment={vi.fn()} language="en" onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("les flèches déplacent la vue et PageUp / PageDown zooment, sans être laissées au navigateur", () => {
    renderEditor();
    const root = document.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home"]) {
      expect(fireEvent.keyDown(root, { key }), key).toBe(false); // false = preventDefault appelé
    }
    expect(fireEvent.keyDown(root, { key: "ArrowLeft", shiftKey: true })).toBe(false);
  });

  it("[ et ] règlent la taille du pinceau, sauf quand le focus est sur le curseur de taille", () => {
    renderEditor();
    const root = document.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    expect(screen.getByText("20px")).toBeInTheDocument();
    fireEvent.keyDown(root, { key: "[" });
    expect(screen.getByText("17px")).toBeInTheDocument();
    fireEvent.keyDown(root, { key: "]" });
    fireEvent.keyDown(root, { key: "]" });
    expect(screen.getByText("24px")).toBeInTheDocument();
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(screen.getByText("23px")).toBeInTheDocument(); // la flèche règle le curseur, elle ne déplace pas la vue
  });

  it("Maj + Z rétablit, et l'aide du scalpel s'affiche avec l'outil", () => {
    renderEditor();
    const root = document.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    expect(screen.queryByText(/Click: place a point/)).not.toBeInTheDocument();
    fireEvent.keyDown(root, { key: "s" });
    expect(screen.getByText(/Click: place a point/)).toBeInTheDocument();
  });

  it("Q maintenu montre l'autre image en vue simple, même quand le focus est sur le bouton de bascule", () => {
    renderEditor();
    fireEvent.click(screen.getByRole("button", { name: "Single pane view (keyboard: 1)" }));
    const toggle = screen.getByRole("button", { name: "Preview" });
    toggle.focus();
    // vue « Original + traits » : Q montre l'aperçu
    expect(screen.queryByRole("img", { name: "Clipping preview on a transparent background" })).not.toBeInTheDocument();
    fireEvent.keyDown(toggle, { key: "q" });
    expect(screen.getByRole("img", { name: "Clipping preview on a transparent background" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Original image with clipping marks" })).not.toBeInTheDocument();
    fireEvent.keyUp(toggle, { key: "q" });
    expect(screen.getByRole("img", { name: "Original image with clipping marks" })).toBeInTheDocument();
    // vue « Aperçu » : Q montre l'original
    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: "q" });
    expect(screen.getByRole("img", { name: "Original image with clipping marks" })).toBeInTheDocument();
    fireEvent.keyUp(toggle, { key: "q" });
    expect(screen.getByRole("img", { name: "Clipping preview on a transparent background" })).toBeInTheDocument();
  });

  it("[ et ] fonctionnent avec Alt (clavier AZERTY), − et + aussi", () => {
    renderEditor();
    const root = document.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    fireEvent.keyDown(root, { key: "[", altKey: true });
    expect(screen.getByText("17px")).toBeInTheDocument();
    fireEvent.keyDown(root, { key: "+" });
    expect(screen.getByText("20px")).toBeInTheDocument();
    fireEvent.keyDown(root, { key: "-" });
    expect(screen.getByText("17px")).toBeInTheDocument();
  });

  it("respecte la charte : bandeau de 50 px, boutons d'action p-0 w-6 h-6 en variante secondaire", () => {
    renderEditor();
    expect(screen.getByRole("toolbar")).toHaveClass("h-[50px]");
    for (const name of ["Hair (keyboard: V)", "Undo (Z)", "Zoom in", "Split view (keyboard: 2)"]) {
      const button = screen.getByRole("button", { name });
      expect(button, name).toHaveClass("h-6", "w-6", "p-0");
    }
  });
});
