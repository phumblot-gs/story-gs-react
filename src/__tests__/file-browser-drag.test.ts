import { describe, expect, it } from "vitest";

import {
  INTERNAL_DRAG_TYPE,
  canDropOnItem,
  computeAutoScrollSpeed,
  getDraggedItems,
  isExternalFileDrag,
  isInternalItemsDrag,
} from "@/lib/file-browser-drag";
import type { FileItem } from "@/components/ui/file-browser";

const item = (id: string, overrides: Partial<FileItem> = {}): FileItem => ({
  id,
  file_name: `${id}.png`,
  parent_path: "/",
  file_size: 1024,
  mime_type: "image/png",
  is_directory: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  ...overrides,
});

const folder = (id: string, overrides: Partial<FileItem> = {}): FileItem =>
  item(id, { is_directory: true, mime_type: "", ...overrides });

describe("drag type discrimination", () => {
  // Import depuis le bureau et déplacement de lignes déclenchent les mêmes
  // événements sur le même conteneur : seul le type les distingue.

  it("recognises a desktop file drag", () => {
    expect(isExternalFileDrag(["Files"])).toBe(true);
    expect(isExternalFileDrag([INTERNAL_DRAG_TYPE])).toBe(false);
    expect(isExternalFileDrag(undefined)).toBe(false);
  });

  it("recognises an internal row drag", () => {
    expect(isInternalItemsDrag([INTERNAL_DRAG_TYPE])).toBe(true);
    expect(isInternalItemsDrag(["Files"])).toBe(false);
    expect(isInternalItemsDrag(undefined)).toBe(false);
  });
});

describe("canDropOnItem", () => {
  const dragged = new Set(["dragged-folder", "f1"]);

  it("accepts a folder outside the dragged rows", () => {
    expect(canDropOnItem(folder("target"), dragged)).toBe(true);
  });

  it("rejects a file", () => {
    expect(canDropOnItem(item("doc"), dragged)).toBe(false);
  });

  it("rejects a folder being dragged — no folder into itself", () => {
    expect(canDropOnItem(folder("dragged-folder"), dragged)).toBe(false);
  });

  it("rejects a disabled folder", () => {
    expect(canDropOnItem(folder("target", { disabled: true }), dragged)).toBe(false);
  });
});

describe("getDraggedItems", () => {
  const files = [item("a"), folder("b"), item("c"), item("d")];

  it("drags the whole selection when the row is part of it", () => {
    const selected = new Set(["a", "c"]);
    expect(getDraggedItems(item("a"), selected, files).map(f => f.id)).toEqual(["a", "c"]);
  });

  it("keeps the displayed order, not the click order", () => {
    const selected = new Set(["d", "a"]);
    expect(getDraggedItems(item("d"), selected, files).map(f => f.id)).toEqual(["a", "d"]);
  });

  it("drags only the row when it is outside the selection", () => {
    // Sinon le geste déplacerait une sélection invisible, faite plus haut.
    const selected = new Set(["a", "c"]);
    expect(getDraggedItems(item("d"), selected, files).map(f => f.id)).toEqual(["d"]);
  });

  it("skips disabled rows inside the selection", () => {
    const withDisabled = [item("a"), item("b", { disabled: true }), item("c")];
    const selected = new Set(["a", "b", "c"]);
    expect(getDraggedItems(item("a"), selected, withDisabled).map(f => f.id)).toEqual(["a", "c"]);
  });

  it("falls back to the dragged row if the selection yields nothing", () => {
    const disabled = item("a", { disabled: true });
    expect(getDraggedItems(disabled, new Set(["a"]), [disabled]).map(f => f.id)).toEqual(["a"]);
  });
});

describe("computeAutoScrollSpeed", () => {
  const rect = { top: 100, bottom: 500 }; // 400px de haut

  it("does not scroll in the middle of the list", () => {
    expect(computeAutoScrollSpeed(rect, 300)).toBe(0);
  });

  it("scrolls up near the top and down near the bottom", () => {
    expect(computeAutoScrollSpeed(rect, 110)).toBeLessThan(0);
    expect(computeAutoScrollSpeed(rect, 490)).toBeGreaterThan(0);
  });

  it("accelerates as the cursor approaches the edge", () => {
    const far = computeAutoScrollSpeed(rect, 140);
    const near = computeAutoScrollSpeed(rect, 105);
    expect(Math.abs(near)).toBeGreaterThan(Math.abs(far));
  });

  it("stays at full speed once the cursor leaves the container", () => {
    // Pendant un drag, le curseur sort volontiers de la liste.
    const atEdge = computeAutoScrollSpeed(rect, 100);
    expect(computeAutoScrollSpeed(rect, 20)).toBe(atEdge);
    expect(computeAutoScrollSpeed(rect, -300)).toBe(atEdge);
    expect(computeAutoScrollSpeed(rect, 900)).toBe(-atEdge);
  });

  it("caps the speed at maxSpeed", () => {
    const speed = computeAutoScrollSpeed(rect, 0, { maxSpeed: 10 });
    expect(speed).toBe(-10);
  });

  it("shrinks the zones so they never overlap in a short container", () => {
    // Conteneur de 40px : sans réduction, haut et bas se disputeraient le curseur.
    const short = { top: 0, bottom: 40 };
    expect(computeAutoScrollSpeed(short, 19)).toBeLessThan(0);
    expect(computeAutoScrollSpeed(short, 21)).toBeGreaterThan(0);
  });

  it("returns 0 for a degenerate container", () => {
    expect(computeAutoScrollSpeed({ top: 10, bottom: 10 }, 10)).toBe(0);
  });
});
