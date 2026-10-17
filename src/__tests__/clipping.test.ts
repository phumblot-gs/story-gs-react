import { describe, expect, it } from "vitest";
import {
  shouldSegment, applyAlphaMask, clippingHistoryReducer, createClippingHistory, densifyPoints, fitViewport, imageToScreen, panViewport,
  screenToImage, zoomViewport, CLIPPING_MAX_SCALE, type ClippingMark,
} from "@/lib/clipping";
import { createColorClippingSegmenter } from "@/lib/clipping-color-segmenter";

const mark = (id: string, x: number, tool: ClippingMark["tool"] = "keep", size = 10): ClippingMark => ({ id, tool, size, points: [{ x, y: 0 }] });

describe("historique des traits", () => {
  it("ajoute, annule et rétablit", () => {
    let h = createClippingHistory();
    h = clippingHistoryReducer(h, { type: "add", mark: mark("a", 0) });
    h = clippingHistoryReducer(h, { type: "add", mark: mark("b", 50) });
    expect(h.present.map((m) => m.id)).toEqual(["a", "b"]);
    h = clippingHistoryReducer(h, { type: "undo" });
    expect(h.present.map((m) => m.id)).toEqual(["a"]);
    h = clippingHistoryReducer(h, { type: "redo" });
    expect(h.present.map((m) => m.id)).toEqual(["a", "b"]);
  });

  it("un nouveau trait vide la pile de rétablissement", () => {
    let h = createClippingHistory([mark("a", 0)]);
    h = clippingHistoryReducer(h, { type: "add", mark: mark("b", 50) });
    h = clippingHistoryReducer(h, { type: "undo" });
    h = clippingHistoryReducer(h, { type: "add", mark: mark("c", 90) });
    expect(h.future).toEqual([]);
    expect(clippingHistoryReducer(h, { type: "redo" })).toBe(h);
  });

  it("annuler sans historique ne change rien", () => {
    const h = createClippingHistory();
    expect(clippingHistoryReducer(h, { type: "undo" })).toBe(h);
  });

  it("ignore un trait sans point", () => {
    const h = createClippingHistory();
    expect(clippingHistoryReducer(h, { type: "add", mark: { id: "x", tool: "keep", size: 5, points: [] } })).toBe(h);
  });

  it("la gomme retire les traits touchés, tient compte de leur épaisseur, et n'écrit rien si rien n'est touché", () => {
    const h = createClippingHistory([mark("near", 12, "keep", 10), mark("far", 100)]);
    // gomme de rayon 5 en x=0 : portée 5 + 10/2 = 10 < 12 → rien touché
    expect(clippingHistoryReducer(h, { type: "erase", points: [{ x: 0, y: 0 }], size: 10 })).toBe(h);
    const erased = clippingHistoryReducer(h, { type: "erase", points: [{ x: 4, y: 0 }], size: 10 });
    expect(erased.present.map((m) => m.id)).toEqual(["far"]);
    expect(clippingHistoryReducer(erased, { type: "undo" }).present).toHaveLength(2);
  });

  it("reset vide les traits, annulable", () => {
    let h = createClippingHistory([mark("a", 0)]);
    h = clippingHistoryReducer(h, { type: "reset" });
    expect(h.present).toEqual([]);
    expect(clippingHistoryReducer(h, { type: "undo" }).present).toHaveLength(1);
  });
});

describe("densifyPoints", () => {
  it("garantit un écart maximal entre points", () => {
    const out = densifyPoints([{ x: 0, y: 0 }, { x: 100, y: 0 }], 10);
    expect(out).toHaveLength(11);
    for (let i = 1; i < out.length; i++) expect(Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y)).toBeLessThanOrEqual(10.0001);
    expect(out[out.length - 1]).toEqual({ x: 100, y: 0 });
  });
  it("laisse un point unique", () => {
    const pts = [{ x: 3, y: 4 }];
    expect(densifyPoints(pts, 5)).toBe(pts);
  });
});

describe("viewport", () => {
  const pane = { width: 800, height: 600 };
  it("ajuste l'image avec une marge et la centre", () => {
    const vp = fitViewport(pane, { width: 1100, height: 1200 });
    expect(vp.scale).toBeCloseTo((600 / 1200) * 0.92);
    expect(vp.center).toEqual({ x: 550, y: 600 });
  });
  it("écran ↔ image sont réciproques", () => {
    const vp = { scale: 2.5, center: { x: 120, y: 80 } };
    const p = screenToImage(vp, pane, 333, 222);
    const back = imageToScreen(vp, pane, p);
    expect(back.x).toBeCloseTo(333); expect(back.y).toBeCloseTo(222);
  });
  it("le zoom garde fixe le point sous le curseur", () => {
    const vp = { scale: 1, center: { x: 500, y: 500 } };
    const before = screenToImage(vp, pane, 100, 50);
    const zoomed = zoomViewport(vp, pane, 3, 100, 50);
    const after = screenToImage(zoomed, pane, 100, 50);
    expect(zoomed.scale).toBe(3);
    expect(after.x).toBeCloseTo(before.x); expect(after.y).toBeCloseTo(before.y);
  });
  it("borne le zoom", () => {
    expect(zoomViewport({ scale: 30, center: { x: 0, y: 0 } }, pane, 10).scale).toBe(CLIPPING_MAX_SCALE);
  });
  it("déplacer vers la droite recule le centre", () => {
    expect(panViewport({ scale: 2, center: { x: 100, y: 100 } }, 20, -10).center).toEqual({ x: 90, y: 105 });
  });
});

describe("applyAlphaMask", () => {
  it("multiplie l'alpha existant par le masque sans modifier la source", () => {
    const rgba = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 128]);
    const out = applyAlphaMask(rgba, { width: 2, height: 1, alpha: new Uint8ClampedArray([128, 255]) });
    expect([out[3], out[7]]).toEqual([128, 128]);
    expect(rgba[3]).toBe(255);
    expect(Array.from(out.slice(0, 3))).toEqual([10, 20, 30]);
  });
  it("refuse un masque de taille différente", () => {
    expect(() => applyAlphaMask(new Uint8ClampedArray(8), { width: 1, height: 1, alpha: new Uint8ClampedArray(1) })).toThrow(RangeError);
  });
});

describe("createColorClippingSegmenter", () => {
  // 40×20 : moitié gauche rouge (sujet), moitié droite blanche (fond).
  const w = 40, h = 20;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data.set(x < 20 ? [200, 30, 30, 255] : [255, 255, 255, 255], (y * w + x) * 4);
  const run = (marks: ClippingMark[]) => createColorClippingSegmenter({ width: w, height: h, data })({ marks, width: w, height: h, signal: new AbortController().signal });

  it("sépare le sujet du fond d'après les traits", async () => {
    const mask = await run([{ id: "k", tool: "keep", size: 6, points: [{ x: 8, y: 10 }] }, { id: "r", tool: "remove", size: 6, points: [{ x: 32, y: 10 }] }]);
    expect(mask.width).toBe(w); expect(mask.alpha).toHaveLength(w * h);
    expect(mask.alpha[10 * w + 5]).toBeGreaterThan(200);
    expect(mask.alpha[10 * w + 35]).toBeLessThan(55);
  });
  it("prend le pourtour comme fond sans trait « Retirer »", async () => {
    const mask = await run([{ id: "k", tool: "keep", size: 6, points: [{ x: 8, y: 10 }] }]);
    expect(mask.alpha[10 * w + 38]).toBeLessThan(120);
    expect(mask.alpha[10 * w + 8]).toBe(255);
  });
  it("s'arrête quand la demande est annulée", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(createColorClippingSegmenter({ width: w, height: h, data })({ marks: [], width: w, height: h, signal: controller.signal })).rejects.toThrow();
  });
});


describe("shouldSegment", () => {
  it("asks the engine for marks, and for the automatic cut-out only when autoSegment is on", () => {
    const m = [mark("a", 0)];
    expect(shouldSegment([], false)).toBe(false);
    expect(shouldSegment([], true)).toBe(true);
    expect(shouldSegment(m, false)).toBe(true);
    expect(shouldSegment(m, true)).toBe(true);
  });
});
