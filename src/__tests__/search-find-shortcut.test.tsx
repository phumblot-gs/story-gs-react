import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Search } from "@/components/ui/search";
import { isFindShortcut } from "@/lib/keyboard-shortcuts";

/**
 * `captureFindShortcut` : Cmd+F (macOS) / Ctrl+F (ailleurs) donne le focus au
 * Search au lieu d'ouvrir la recherche du navigateur. Second appui, champ déjà
 * focalisé : le raccourci est laissé au navigateur.
 */

afterEach(() => cleanup());

// happy-dom ne fait pas de layout : getClientRects() est vide. On simule un
// champ affiché.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([{}] as unknown as DOMRectList);
});

const pressFind = (init: KeyboardEventInit) => {
  const event = new KeyboardEvent("keydown", { key: "f", bubbles: true, cancelable: true, ...init });
  fireEvent(window, event);
  return event;
};
const modifier = () => (/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent) ? { metaKey: true } : { ctrlKey: true });

describe("isFindShortcut", () => {
  const ev = (init: KeyboardEventInit) => new KeyboardEvent("keydown", { key: "f", ...init });
  it("Cmd+F sur macOS, Ctrl+F ailleurs", () => {
    expect(isFindShortcut(ev({ metaKey: true }), true)).toBe(true);
    expect(isFindShortcut(ev({ ctrlKey: true }), true)).toBe(false);
    expect(isFindShortcut(ev({ ctrlKey: true }), false)).toBe(true);
    expect(isFindShortcut(ev({ metaKey: true }), false)).toBe(false);
  });
  it("ignore les autres touches et modificateurs", () => {
    expect(isFindShortcut(new KeyboardEvent("keydown", { key: "g", ctrlKey: true }), false)).toBe(false);
    expect(isFindShortcut(ev({ ctrlKey: true, shiftKey: true }), false)).toBe(false);
    expect(isFindShortcut(ev({ ctrlKey: true, altKey: true }), false)).toBe(false);
    expect(isFindShortcut(new KeyboardEvent("keydown", { key: "F", ctrlKey: true }), false)).toBe(true);
  });
});

describe("Search — captureFindShortcut", () => {
  it("ne fait rien sans l'option", () => {
    render(<Search placeholder="Search" />);
    const event = pressFind(modifier());
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByPlaceholderText("Search")).not.toHaveFocus();
  });

  it("donne le focus au champ et bloque la recherche du navigateur", () => {
    render(<Search placeholder="Search" captureFindShortcut defaultValue="robe" />);
    const field = screen.getByPlaceholderText("Search") as HTMLInputElement;
    const event = pressFind(modifier());
    expect(event.defaultPrevented).toBe(true);
    expect(field).toHaveFocus();
    expect([field.selectionStart, field.selectionEnd]).toEqual([0, 4]);
  });

  it("laisse passer un second appui quand le champ a déjà le focus", () => {
    render(<Search placeholder="Search" captureFindShortcut />);
    pressFind(modifier());
    const second = pressFind(modifier());
    expect(second.defaultPrevented).toBe(false);
  });

  it("ne réagit pas quand le champ est désactivé", () => {
    render(<Search placeholder="Search" captureFindShortcut disabled />);
    expect(pressFind(modifier()).defaultPrevented).toBe(false);
  });

  it("cesse d'écouter une fois démonté", () => {
    const { unmount } = render(<Search placeholder="Search" captureFindShortcut />);
    unmount();
    expect(pressFind(modifier()).defaultPrevented).toBe(false);
  });
});
