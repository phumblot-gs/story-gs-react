import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { CheckAll } from "@/components/ui/check-all";
import { hasOpenOverlay, isEditableTarget, isSelectAllShortcut } from "@/lib/keyboard-shortcuts";

/**
 * `captureSelectAllShortcut` : Cmd+A (macOS) / Ctrl+A (ailleurs) coche le
 * CheckAll, sauf quand le focus est dans un champ, un select, une
 * autocomplétion… ou qu'une modale / un menu est ouvert.
 */

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

// happy-dom ne fait pas de layout : on simule une case affichée.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([{}] as unknown as DOMRectList);
});

const isMac = () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
const pressSelectAll = (target: Window | Element = window) => {
  const event = new KeyboardEvent("keydown", {
    key: "a",
    bubbles: true,
    cancelable: true,
    ...(isMac() ? { metaKey: true } : { ctrlKey: true }),
  });
  fireEvent(target, event);
  return event;
};

describe("isSelectAllShortcut", () => {
  const ev = (init: KeyboardEventInit) => new KeyboardEvent("keydown", { key: "a", ...init });
  it("Cmd+A sur macOS, Ctrl+A ailleurs, sans autre modificateur", () => {
    expect(isSelectAllShortcut(ev({ metaKey: true }), true)).toBe(true);
    expect(isSelectAllShortcut(ev({ ctrlKey: true }), true)).toBe(false);
    expect(isSelectAllShortcut(ev({ ctrlKey: true }), false)).toBe(true);
    expect(isSelectAllShortcut(ev({ ctrlKey: true, shiftKey: true }), false)).toBe(false);
    expect(isSelectAllShortcut(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }), false)).toBe(false);
  });
});

describe("isEditableTarget / hasOpenOverlay", () => {
  it("reconnaît les éléments où Ctrl+A a déjà un sens", () => {
    document.body.innerHTML = `
      <input id="text" type="text"><input id="box" type="checkbox"><textarea id="area"></textarea>
      <select id="sel"></select><div id="edit" contenteditable="true"></div>
      <button id="combo" role="combobox"></button><div role="listbox"><span id="opt">x</span></div>
      <button id="plain"></button>`;
    const $ = (id: string) => document.getElementById(id);
    for (const id of ["text", "area", "sel", "combo", "opt"]) expect(isEditableTarget($(id))).toBe(true);
    expect(isEditableTarget($("box"))).toBe(false);
    expect(isEditableTarget($("plain"))).toBe(false);
    expect(isEditableTarget(document.body)).toBe(false);
  });

  it("détecte une modale ou un menu ouvert", () => {
    document.body.innerHTML = `<div></div>`;
    expect(hasOpenOverlay()).toBe(false);
    document.body.innerHTML = `<div role="dialog" data-state="open"></div>`;
    expect(hasOpenOverlay()).toBe(true);
    document.body.innerHTML = `<div role="menu"></div>`;
    expect(hasOpenOverlay()).toBe(true);
  });
});

describe("CheckAll — captureSelectAllShortcut", () => {
  it("ne fait rien sans l'option", () => {
    const onCheckedChange = vi.fn();
    render(<CheckAll selectedCount={0} totalCount={5} onCheckedChange={onCheckedChange} />);
    expect(pressSelectAll().defaultPrevented).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("coche la case depuis décochée ou indéterminée", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <CheckAll selectedCount={0} totalCount={5} onCheckedChange={onCheckedChange} captureSelectAllShortcut />,
    );
    expect(pressSelectAll().defaultPrevented).toBe(true);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    rerender(<CheckAll selectedCount={2} totalCount={5} onCheckedChange={onCheckedChange} captureSelectAllShortcut />);
    pressSelectAll();
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("ne désélectionne jamais : sans effet quand tout est coché (mais bloque la sélection du texte)", () => {
    const onCheckedChange = vi.fn();
    render(<CheckAll selectedCount={5} totalCount={5} onCheckedChange={onCheckedChange} captureSelectAllShortcut />);
    expect(pressSelectAll().defaultPrevented).toBe(true);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("laisse le raccourci au navigateur dans un champ de saisie", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <div>
        <input aria-label="search" />
        <CheckAll selectedCount={0} totalCount={5} onCheckedChange={onCheckedChange} captureSelectAllShortcut />
      </div>,
    );
    const input = container.querySelector("input")!;
    input.focus();
    expect(pressSelectAll(input).defaultPrevented).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("laisse le raccourci au navigateur quand une modale est ouverte", () => {
    const onCheckedChange = vi.fn();
    render(
      <div>
        <div role="dialog" data-state="open" />
        <CheckAll selectedCount={0} totalCount={5} onCheckedChange={onCheckedChange} captureSelectAllShortcut />
      </div>,
    );
    expect(pressSelectAll().defaultPrevented).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("ne réagit pas quand la case est désactivée ou la liste vide", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <CheckAll selectedCount={0} totalCount={5} onCheckedChange={onCheckedChange} captureSelectAllShortcut disabled />,
    );
    expect(pressSelectAll().defaultPrevented).toBe(false);
    rerender(<CheckAll selectedCount={0} totalCount={0} onCheckedChange={onCheckedChange} captureSelectAllShortcut />);
    expect(pressSelectAll().defaultPrevented).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
