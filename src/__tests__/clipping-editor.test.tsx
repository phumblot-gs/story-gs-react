import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent, act, waitFor, within } from "@testing-library/react";
import { useEffect, useState } from "react";
import "@testing-library/jest-dom/vitest";
import { ClippingEditor } from "@/components/ui/clipping-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

afterEach(() => cleanup());

const renderEditor = (props = {}) => render(<ClippingEditor src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" onSegment={vi.fn()} language="en" {...props} />);

function StatefulAccessory({ onMount, onUnmount }: { onMount: () => void; onUnmount: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => { onMount(); return onUnmount; }, [onMount, onUnmount]);
  return <Button onClick={() => setCount(v => v + 1)}>Accessory {count}</Button>;
}

function deferred() {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

describe("ClippingEditor", () => {
  it("détache les handlers et la source des images à chaque nouvelle session", () => {
    const original = globalThis.Image;
    const images: { src: string; onload: unknown; onerror: unknown }[] = [];
    class FakeImage {
      src = "";
      onload: unknown = null;
      onerror: unknown = null;
      constructor() { images.push(this); }
      removeAttribute() { this.src = ""; }
    }
    globalThis.Image = FakeImage as unknown as typeof Image;
    try {
      const { rerender, unmount } = renderEditor({ src: "one.png" });
      expect(images[0].src).toBe("one.png");
      expect(images[0].onload).toBeTypeOf("function");
      rerender(<ClippingEditor src="one.png" imageKey="revision-2" onSegment={vi.fn()} />);
      expect(images).toHaveLength(2);
      expect(images[0]).toMatchObject({ src: "", onload: null, onerror: null });
      unmount();
      expect(images[1]).toMatchObject({ src: "", onload: null, onerror: null });
    } finally { globalThis.Image = original; }
  });

  it("conserve la structure du header sans les nouvelles props", () => {
    renderEditor({ fileName: "photo.png", onClose: vi.fn() });
    const header = screen.getByRole("toolbar", { name: "Clipping display" });
    expect(header.className).toBe("gs-clipping-header");
    expect([...header.children].map(node => node.className)).toEqual(["gs-clipping-heading", "gs-clipping-control-group", "gs-clipping-control-group"]);
    expect([...header.children[0].children].map(node => node.tagName)).toEqual(["H2", "SPAN"]);
    expect(header.querySelector(".gs-clipping-title-accessory, .gs-clipping-primary-action")).toBeNull();
    expect(header.querySelector("[aria-keyshortcuts]")).toBeNull();
    expect(header.querySelectorAll("button").item(7)).toBe(screen.getByRole("button", { name: "Close" }));
  });

  it("rend les emplacements dans l'ordre titre, accessoire, zoom, réglages, action, fermeture", () => {
    const onClick = vi.fn();
    renderEditor({ titleAccessory: <Button>Material</Button>, primaryAction: { label: <span>Validate next</span>, onClick, 'data-testid': 'validate' }, onClose: vi.fn() });
    const header = screen.getByRole("toolbar", { name: "Clipping display" });
    expect(header.querySelector(".gs-clipping-heading")).toContainElement(screen.getByRole("button", { name: "Material" }));
    const buttons = within(header).getAllByRole("button");
    expect(buttons.filter(button => button !== screen.getByTestId("validate")).map(button => button.textContent || button.getAttribute("aria-label"))).toEqual([
      "Material", "Zoom out", "Zoom in", "Fit", "1:1", "Single pane view (keyboard: 1)", "Split view (keyboard: 2)", "Settings and information", "Close",
    ]);
    expect(buttons.at(-2)).toBe(screen.getByTestId("validate"));
    expect(buttons.every(button => button.tabIndex === 0)).toBe(true);
    expect(screen.getByTestId("validate")).toHaveAttribute("aria-keyshortcuts", "Meta+Enter Control+Enter");
    expect(screen.getByTestId("validate")).toHaveClass("btn-normal");
    fireEvent.click(screen.getByTestId("validate"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("garde l'accessoire monté et son état sans réinitialiser les marques ni l'historique", () => {
    const onMount = vi.fn(), onUnmount = vi.fn(), onMarksChange = vi.fn();
    const mark = { id: "selection", tool: "pencil" as const, mode: "replace" as const, closed: true, size: 2, points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 20, y: 30 }] };
    const props = { src: "same.png", onSegment: vi.fn(), language: "en", onMarksChange, defaultMarks: [mark], defaultTool: "pencil" as const };
    const { rerender } = render(<ClippingEditor {...props} titleAccessory={<StatefulAccessory onMount={onMount} onUnmount={onUnmount} />} />);
    const accessory = screen.getByRole("button", { name: "Accessory 0" });
    fireEvent.click(accessory);
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    fireEvent.click(screen.getByRole("button", { name: "Invert selection" }));
    fireEvent.click(screen.getByRole("button", { name: "Undo (Z)" }));
    expect(screen.getByRole("button", { name: "Redo (Y)" })).toBeEnabled();
    const calls = onMarksChange.mock.calls.length;
    rerender(<ClippingEditor {...props} titleAccessory={<StatefulAccessory onMount={onMount} onUnmount={onUnmount} />} primaryAction={{ label: "Next", onClick: vi.fn() }} />);
    expect(screen.getByRole("button", { name: "Accessory 1" })).toBe(accessory);
    expect(onMount).toHaveBeenCalledOnce();
    expect(onUnmount).not.toHaveBeenCalled();
    expect(onMarksChange).toHaveBeenCalledTimes(calls);
    fireEvent.click(screen.getByRole("button", { name: "Redo (Y)" }));
    expect(onMarksChange.mock.calls.at(-1)![0][0]).toEqual(mark);
    expect(onMarksChange.mock.calls.at(-1)![0].map((item: { tool: string }) => item.tool)).toEqual(["pencil", "invert"]);
  });

  it("charge pendant la promesse, bloque les doubles déclenchements puis réactive le bouton", async () => {
    const action = deferred();
    const onClick = vi.fn(() => action.promise);
    renderEditor({ primaryAction: { label: "Next", onClick, loadingLabel: "Saving", 'data-testid': 'next' } });
    const button = screen.getByTestId("next");
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Saving");
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter", ctrlKey: true });
    expect(onClick).toHaveBeenCalledOnce();
    await act(async () => action.resolve());
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");
    expect(button).toHaveTextContent("Next");
  });

  it("absorbe un rejet, libère le chargement et permet de réessayer", async () => {
    const action = deferred();
    const onClick = vi.fn<() => void | Promise<void>>().mockReturnValueOnce(action.promise).mockReturnValue(undefined);
    renderEditor({ primaryAction: { label: "Retry", onClick } });
    const button = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(button);
    await act(async () => action.reject(new Error("Host failure")));
    await waitFor(() => expect(button).toBeEnabled());
    expect(button).not.toHaveAttribute("aria-busy");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("absorbe aussi une exception synchrone sans bloquer l'action", () => {
    renderEditor({ primaryAction: { label: "Next", onClick: () => { throw new Error("Host failure"); } } });
    const button = screen.getByRole("button", { name: "Next" });
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(button).toBeEnabled();
  });

  it.each(["ctrlKey", "metaKey"])("%s + Entrée déclenche l'action une fois sans répétition ni composition", (modifier) => {
    const onClick = vi.fn();
    renderEditor({ primaryAction: { label: "Next", onClick } });
    const root = document.querySelector("[data-gs-clipping-editor]")!;
    expect(fireEvent.keyDown(root, { key: "Enter", [modifier]: true })).toBe(false);
    fireEvent.keyDown(root, { key: "Enter", [modifier]: true, repeat: true });
    fireEvent.keyDown(root, { key: "Enter", [modifier]: true, isComposing: true });
    fireEvent.keyDown(root, { key: "Enter" });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("respecte disabled, loading contrôlé et les événements déjà traités", () => {
    const onClick = vi.fn();
    const { rerender } = renderEditor({ primaryAction: { label: "Next", onClick, disabled: true } });
    const root = document.querySelector("[data-gs-clipping-editor]")!;
    fireEvent.keyDown(root, { key: "Enter", ctrlKey: true });
    expect(onClick).not.toHaveBeenCalled();
    rerender(<ClippingEditor src="same.png" onSegment={vi.fn()} language="en" primaryAction={{ label: "Next", onClick, loading: true }} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    fireEvent.keyDown(root, { key: "Enter", metaKey: true });
    expect(onClick).not.toHaveBeenCalled();
    rerender(<ClippingEditor src="same.png" onSegment={vi.fn()} language="en" primaryAction={{ label: "Next", onClick }} onKeyDown={event => event.preventDefault()} />);
    fireEvent.keyDown(root, { key: "Enter", ctrlKey: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("laisse les champs, le contenu éditable, les menus et les sliders gérer leurs touches", () => {
    const onClick = vi.fn();
    renderEditor({ primaryAction: { label: "Next", onClick }, titleAccessory: <>
      <Input aria-label="Input" /><Textarea aria-label="Text" />
      <div contentEditable role="textbox" aria-label="Editable" />
      <Button role="combobox">Select</Button><div role="menu" tabIndex={0}>Menu</div>
    </> });
    for (const target of [screen.getByLabelText("Input"), screen.getByLabelText("Text"), screen.getByLabelText("Editable"), screen.getByRole("combobox"), screen.getByRole("menu"), screen.getByRole("slider")]) {
      fireEvent.keyDown(target, { key: "Enter", ctrlKey: true });
      fireEvent.keyDown(target, { key: "v" });
    }
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Keep (keyboard: Spacebar)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("une promesse peut se terminer après démontage sans erreur", async () => {
    const action = deferred();
    const { unmount } = renderEditor({ primaryAction: { label: "Next", onClick: () => action.promise } });
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    unmount();
    await act(async () => action.resolve());
  });

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
    for (const [key, name] of [["v", "Hair (keyboard: V)"], ["x", "Eraser (keyboard: X)"], ["s", "Pencil (selection) (keyboard: S)"], ["a", "Pencil + (add to selection) (keyboard: A)"], ["d", "Pencil − (subtract from selection) (keyboard: D)"], ["c", "Pan (keyboard: C)"]]) {
      fireEvent.keyDown(root, { key });
      expect(screen.getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");
    }
  });

  it("inverser, supprimer et désélectionner n'agissent que sur une sélection", () => {
    renderEditor();
    expect(screen.queryByRole("group", { name: "Selection actions" })).not.toBeInTheDocument();
    for (const name of ["Pencil (selection) (keyboard: S)", "Pencil + (add to selection) (keyboard: A)", "Pencil − (subtract from selection) (keyboard: D)"]) {
      fireEvent.click(screen.getByRole("button", { name }));
      for (const action of ["Invert selection", "Delete selection", "Deselect"]) expect(screen.getByRole("button", { name: action })).toBeDisabled();
    }
    fireEvent.click(screen.getByRole("button", { name: "Pan (keyboard: C)" }));
    expect(screen.queryByRole("group", { name: "Selection actions" })).not.toBeInTheDocument();
  });

  it("une sélection active active les actions et envoie des marques sans trait", () => {
    const onMarksChange = vi.fn();
    const poly = { id: "p", tool: "pencil" as const, mode: "replace" as const, size: 2, closed: true, points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 20, y: 30 }] };
    renderEditor({ defaultMarks: [poly], onMarksChange, defaultTool: "pencil" });
    fireEvent.click(screen.getByRole("button", { name: "Invert selection" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete selection" }));
    expect(onMarksChange.mock.calls.at(-1)![0].map((m: { tool: string }) => m.tool)).toEqual(["pencil", "invert", "delete"]);
    fireEvent.click(screen.getByRole("button", { name: "Deselect" }));
    expect(screen.getByRole("button", { name: "Delete selection" })).toBeDisabled();
  });

  it("affiche le niveau de zoom, 1:1 et la touche 0 passent à 100 %", () => {
    renderEditor();
    const root = document.querySelector("[data-gs-clipping-editor]") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: "Actual size (100%) (0)" }));
    expect(screen.getByTestId("clipping-zoom")).toHaveTextContent("100%");
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByTestId("clipping-zoom")).not.toHaveTextContent(/^100%$/);
    fireEvent.keyDown(root, { key: "0" });
    expect(screen.getByTestId("clipping-zoom")).toHaveTextContent("100%");
    expect(screen.getByRole("button", { name: "Actual size (100%) (0)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("sur un écran Retina, 100 % est un pixel image par pixel écran (et non par pixel CSS)", () => {
    const original = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", { value: 2, configurable: true });
    try {
      renderEditor();
      fireEvent.click(screen.getByRole("button", { name: "Actual size (100%) (0)" }));
      expect(screen.getByTestId("clipping-zoom")).toHaveTextContent("100%");
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      expect(screen.getByTestId("clipping-zoom")).toHaveTextContent("120%"); // 1,2 × 100 % : l'échelle est en pixels écran
    } finally {
      Object.defineProperty(window, "devicePixelRatio", { value: original, configurable: true });
    }
  });

  it("le bouton d'action principale a la même hauteur (40 px) que les autres boutons de l'en-tête", () => {
    renderEditor({ primaryAction: { label: "Next", onClick: vi.fn(), "data-testid": "next" } });
    const fit = screen.getByRole("button", { name: /Ajuster|Zoom to fit/ });
    const next = screen.getByTestId("next");
    expect(next.className).toContain("gs-clipping-primary-action");
    // same height classes as « Ajuster » (h-[40px])
    const heightClasses = (el: HTMLElement) => el.className.split(" ").filter((c) => /^(h-|py-)/.test(c)).sort().join(" ");
    expect(heightClasses(next)).toBe(heightClasses(fit));
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

  it("le bandeau de travail expose les réglages contextuels sans panneau et conserve leurs valeurs", () => {
    const onMarksChange = vi.fn();
    renderEditor({ defaultSettingsOpen: false, onMarksChange });
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hair (keyboard: V)" }));
    const brush = screen.getByRole("slider", { name: "Brush size" });
    expect(brush.closest(".gs-clipping-pane-header")).toHaveTextContent("Workspace");
    expect(brush).toHaveAttribute("aria-valuenow", "20");
    fireEvent.keyDown(brush, { key: "ArrowRight" });
    expect(brush).toHaveAttribute("aria-valuenow", "21");
    expect(screen.queryByRole("slider", { name: "Alpha" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Eraser (keyboard: X)" }));
    expect(screen.getByRole("slider", { name: "Brush size" })).toHaveAttribute("aria-valuenow", "21");
    const names = ["Pencil (selection) (keyboard: S)", "Pencil + (add to selection) (keyboard: A)", "Pencil − (subtract from selection) (keyboard: D)"];
    for (const [index, name] of names.entries()) {
      fireEvent.click(screen.getByRole("button", { name }));
      const feather = screen.getByRole("slider", { name: "Feather" });
      expect(feather).toHaveAttribute("aria-valuenow", String(index));
      fireEvent.keyDown(feather, { key: "ArrowRight" });
    }
    expect(onMarksChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: names[2] }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Settings and information" }));
    expect(screen.getByRole("complementary", { name: "Settings and information" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Feather" })).toHaveAttribute("aria-valuenow", "3");
  });

  it("signale l'ouverture et la fermeture du panneau Réglages et informations, pas le montage, et repart de l'état fourni", () => {
    const onSettingsOpenChange = vi.fn();
    const first = renderEditor({ onSettingsOpenChange });
    expect(onSettingsOpenChange).not.toHaveBeenCalled(); // not on mount
    const toggle = screen.getByRole("button", { name: "Settings and information" });
    fireEvent.click(toggle);
    expect(onSettingsOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByLabelText("Settings and information", { selector: "aside" })).toBeNull();
    fireEvent.click(toggle);
    expect(onSettingsOpenChange).toHaveBeenLastCalledWith(true);
    expect(onSettingsOpenChange).toHaveBeenCalledTimes(2);
    first.unmount();
    // reopened later with the remembered state: closed, and no callback at mount
    const again = vi.fn();
    renderEditor({ defaultSettingsOpen: false, onSettingsOpenChange: again });
    expect(screen.queryByLabelText("Settings and information", { selector: "aside" })).toBeNull();
    expect(again).not.toHaveBeenCalled();
  });

  it("mémorise aussi le bloc Informations du fichier (replié par défaut)", () => {
    const onFileInfoOpenChange = vi.fn();
    const first = renderEditor({ onFileInfoOpenChange });
    let details = document.querySelector("details.gs-clipping-file-info") as HTMLDetailsElement;
    expect(details.open).toBe(false);
    details.open = true;
    fireEvent(details, new Event("toggle"));
    expect(onFileInfoOpenChange).toHaveBeenLastCalledWith(true);
    first.unmount();
    renderEditor({ defaultFileInfoOpen: true, onFileInfoOpenChange });
    details = document.querySelector("details.gs-clipping-file-info") as HTMLDetailsElement;
    expect(details.open).toBe(true);
    expect(onFileInfoOpenChange).toHaveBeenCalledTimes(1); // the restored state is not reported again
  });

  describe("initialMask", () => {
    // jsdom has no canvas and never loads images: minimal stand-ins so that the editor reaches the segmentation step
    const W = 2, H = 2;
    const restore: Array<() => void> = [];
    const stubCanvas = () => {
      const original = (globalThis as { Image?: unknown }).Image;
      class FakeImage { onload?: () => void; naturalWidth = W; naturalHeight = H; crossOrigin = ""; set src(_v: string) { setTimeout(() => this.onload?.(), 0); } }
      (globalThis as { Image: unknown }).Image = FakeImage;
      const hadImageData = "ImageData" in globalThis;
      (globalThis as { ImageData?: unknown }).ImageData = class { constructor(public data: Uint8ClampedArray, public width: number, public height: number) {} };
      const spy = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
        const noop = () => undefined;
        const ctx: Record<string, unknown> = new Proxy({ canvas: this }, {
          get: (t, k) => {
            if (k in t) return (t as Record<string | symbol, unknown>)[k];
            if (k === "getImageData") return () => ({ data: new Uint8ClampedArray(W * H * 4).fill(255), width: W, height: H });
            if (k === "getTransform") return () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
            return noop;
          },
          set: () => true,
        });
        return ctx as unknown as CanvasRenderingContext2D;
      });
      restore.push(() => { (globalThis as { Image?: unknown }).Image = original; if (!hadImageData) delete (globalThis as { ImageData?: unknown }).ImageData; spy.mockRestore(); });
    };
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); while (restore.length) restore.pop()!(); });
    const keep = { id: "k", tool: "keep" as const, size: 10, points: [{ x: 1, y: 1 }] };
    const known = { width: W, height: H, alpha: new Uint8ClampedArray([255, 255, 0, 0]) };
    // two steps: the image « loads » first, React renders the loaded editor, then the debounce of the segmentation elapses
    const wait = async (ms: number) => { await act(async () => { await vi.advanceTimersByTimeAsync(10); }); await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); };

    it("sans masque initial, l'éditeur demande le calcul à l'ouverture (autoSegment)", async () => {
      stubCanvas();
      const onSegment = vi.fn(() => new Promise<never>(() => undefined));
      renderEditor({ onSegment, autoSegment: true, defaultMarks: [keep] });
      await wait(400);
      expect(onSegment).toHaveBeenCalledTimes(1);
    });

    it("libère les canvas, annule le moteur et réinitialise les marques au changement d'image", async () => {
      stubCanvas();
      const canvases: HTMLCanvasElement[] = [];
      const original = document.createElement.bind(document);
      const create = vi.spyOn(document, "createElement").mockImplementation(((tag: string, options?: ElementCreationOptions) => {
        const node = original(tag, options);
        if (tag === "canvas") canvases.push(node as HTMLCanvasElement);
        return node;
      }) as typeof document.createElement);
      restore.push(() => create.mockRestore());
      const pending: { signal: AbortSignal; resolve: (mask: typeof known) => void; marks: unknown[] }[] = [];
      const onSegment = vi.fn(({ signal, marks }) => new Promise<typeof known>((resolve) => pending.push({ signal, resolve, marks })));
      const { rerender, unmount } = renderEditor({ src: "first.png", onSegment, autoSegment: true, defaultMarks: [keep] });
      await wait(400);
      expect(pending).toHaveLength(1);
      fireEvent.click(screen.getByRole("button", { name: "Undo (Z)" })); // no history yet
      const old = [...canvases];
      rerender(<ClippingEditor src="second.png" onSegment={onSegment} autoSegment defaultMarks={[]} language="en" />);
      expect(pending[0].signal.aborted).toBe(true);
      expect(old.every((canvas) => canvas.width === 0 && canvas.height === 0)).toBe(true);
      expect(screen.getByRole("button", { name: "Undo (Z)" })).toBeDisabled();
      await wait(400);
      expect(pending).toHaveLength(2);
      expect(pending[1].marks).toEqual([]);
      await act(async () => pending[0].resolve(known));
      expect(screen.queryByText("Preview up to date")).not.toBeInTheDocument();
      unmount();
      expect(pending[1].signal.aborted).toBe(true);
      expect(canvases.every((canvas) => canvas.width === 0 && canvas.height === 0)).toBe(true);
    });

    it("affiche le masque initial tout de suite et n'appelle pas onSegment tant que les traits ne changent pas", async () => {
      stubCanvas();
      const onSegment = vi.fn(() => new Promise<never>(() => undefined));
      renderEditor({ onSegment, autoSegment: true, defaultMarks: [keep], initialMask: known });
      await wait(400);
      expect(screen.getByText("Preview up to date")).toBeInTheDocument();
      expect(onSegment).not.toHaveBeenCalled();
    });

    it("reprend le calcul normal dès qu'un trait est ajouté, et ignore un masque aux mauvaises dimensions", async () => {
      stubCanvas();
      const onSegment = vi.fn(() => new Promise<never>(() => undefined));
      const first = renderEditor({ onSegment, autoSegment: true, defaultMarks: [keep], initialMask: known });
      await wait(400);
      expect(screen.getByText("Preview up to date")).toBeInTheDocument();
      expect(onSegment).not.toHaveBeenCalled();
      const canvas = screen.getAllByRole("img", { name: /Workspace|Original/ })[0];
      fireEvent.pointerDown(canvas, { button: 0, pointerId: 1, clientX: 1, clientY: 1 });
      fireEvent.pointerUp(canvas, { button: 0, pointerId: 1, clientX: 1, clientY: 1 });
      await wait(400);
      expect(onSegment).toHaveBeenCalledTimes(1); // the new stroke is computed
      expect((onSegment.mock.calls[0] as unknown as [{ marks: unknown[] }])[0].marks).toHaveLength(2);
      first.unmount();
      const wrong = vi.fn(() => new Promise<never>(() => undefined));
      renderEditor({ onSegment: wrong, autoSegment: true, defaultMarks: [keep], initialMask: { width: 9, height: 9, alpha: new Uint8ClampedArray(81) } });
      await wait(400);
      expect(wrong).toHaveBeenCalledTimes(1);
    });
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

  it("sépare les outils de l'affichage et réserve le téléchargement au résultat", () => {
    renderEditor();
    const tools = screen.getByRole("toolbar", { name: "Clipping tools" });
    expect(tools).toHaveAttribute("aria-orientation", "vertical");
    expect(tools.querySelector("button")).toBe(screen.getByRole("button", { name: "Pan (keyboard: C)" }));
    const display = screen.getByRole("toolbar", { name: "Clipping display" });
    expect(display).not.toContainElement(screen.getByRole("button", { name: "Download" }));
    fireEvent.click(screen.getByRole("button", { name: "Single pane view (keyboard: 1)" }));
    expect(screen.queryByRole("button", { name: "Download" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
  });
});
