import { describe, expect, it } from "vitest";
import {
  applyDrop,
  computeDropTarget,
  getSelectionRange,
  moveGroup,
  reorderSlots,
  type CellRect,
} from "@/lib/contact-sheet-reorder";
import { splitForMiddleTruncation } from "@/lib/middle-truncation";

// Deux lignes de 3 vignettes de 90px, interstice de 10px.
const cell = (col: number, row: number): CellRect => ({
  left: col * 100,
  right: col * 100 + 90,
  top: row * 100,
  bottom: row * 100 + 90,
});
const rects = [cell(0, 0), cell(1, 0), cell(2, 0), cell(0, 1), cell(1, 1), cell(2, 1)];
const opts = { gap: 10 };

describe("computeDropTarget", () => {
  it("permute sur le tiers central d'une autre vignette", () => {
    expect(computeDropTarget({ x: 245, y: 45 }, rects, 0, opts)).toEqual({ kind: "swap", index: 2 });
  });

  it("intercale sur les tiers gauche et droit", () => {
    expect(computeDropTarget({ x: 205, y: 45 }, rects, 0, opts)).toEqual({
      kind: "insert",
      anchor: 2,
      side: "before",
    });
    expect(computeDropTarget({ x: 285, y: 45 }, rects, 0, opts)).toEqual({
      kind: "insert",
      anchor: 2,
      side: "after",
    });
  });

  it("couvre l'interstice entre deux vignettes", () => {
    const target = computeDropTarget({ x: 195, y: 45 }, rects, 0, opts);
    expect(target?.kind).toBe("insert");
  });

  it("intercale avant la première / après la dernière vignette d'une ligne", () => {
    expect(computeDropTarget({ x: -4, y: 145 }, rects, 0, opts)).toEqual({
      kind: "insert",
      anchor: 3,
      side: "before",
    });
    expect(computeDropTarget({ x: 294, y: 145 }, rects, 0, opts)).toEqual({
      kind: "insert",
      anchor: 5,
      side: "after",
    });
  });

  it("ignore les drops qui ne changent rien", () => {
    // Sur elle-même
    expect(computeDropTarget({ x: 145, y: 45 }, rects, 1, opts)).toBeNull();
    // Juste avant ou juste après elle-même
    expect(computeDropTarget({ x: 105, y: 45 }, rects, 1, opts)).toBeNull();
    expect(computeDropTarget({ x: 85, y: 45 }, rects, 1, opts)).toBeNull();
  });

  it("ne cible rien hors des lignes", () => {
    expect(computeDropTarget({ x: 45, y: 400 }, rects, 0, opts)).toBeNull();
  });

  it("garde la cible courante tant que le pointeur reste dans sa zone élargie (aimant)", () => {
    const previous = { kind: "swap", index: 2 } as const;
    // 230-260 est la zone centrale ; 222 est dans le tiers gauche mais à moins de 12px.
    expect(computeDropTarget({ x: 222, y: 45 }, rects, 0, { ...opts, previous })).toEqual(previous);
    // Sans cible courante, 222 vaut insertion.
    expect(computeDropTarget({ x: 222, y: 45 }, rects, 0, opts)?.kind).toBe("insert");
  });
});

describe("applyDrop", () => {
  const ids = ["a", "b", "c", "d"];

  it("permute deux éléments", () => {
    expect(applyDrop(ids, 0, { kind: "swap", index: 2 })).toEqual(["c", "b", "a", "d"]);
  });

  it("intercale vers la droite en décalant les autres", () => {
    expect(applyDrop(ids, 0, { kind: "insert", anchor: 2, side: "after" })).toEqual(["b", "c", "a", "d"]);
  });

  it("intercale vers la gauche en décalant les autres", () => {
    expect(applyDrop(ids, 3, { kind: "insert", anchor: 0, side: "before" })).toEqual(["d", "a", "b", "c"]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    applyDrop(ids, 0, { kind: "swap", index: 1 });
    expect(ids).toEqual(["a", "b", "c", "d"]);
  });
});

describe("splitForMiddleTruncation", () => {
  it("garde l'extension et le dernier caractère du nom", () => {
    expect(splitForMiddleTruncation("7E0125DE91_worn_1.tif")).toEqual({
      head: "7E0125DE91_worn_",
      tail: "1.tif",
    });
  });

  it("garde la fin brute sans extension", () => {
    expect(splitForMiddleTruncation("README", 2)).toEqual({ head: "READ", tail: "ME" });
  });
});

describe("getSelectionRange", () => {
  const order = [10, 20, 30, 40, 50];

  it("prend la plage dans les deux sens, bornes incluses", () => {
    expect(getSelectionRange(order, 20, 40)).toEqual([20, 30, 40]);
    expect(getSelectionRange(order, 40, 20)).toEqual([20, 30, 40]);
  });

  it("se limite à la vignette cliquée sans ancre, ou si l'ancre a disparu", () => {
    expect(getSelectionRange(order, null, 30)).toEqual([30]);
    expect(getSelectionRange(order, 99, 30)).toEqual([30]);
  });
});

describe("emplacements vides", () => {
  // Ligne de 3 : [média, vide, média]
  const isEmpty = (i: number) => i === 1;

  it("autorise le drop au centre d'un emplacement vide", () => {
    expect(computeDropTarget({ x: 145, y: 45 }, rects, 2, { ...opts, isEmpty })).toEqual({ kind: "swap", index: 1 });
  });

  it("convertit l'insertion juste devant un emplacement vide en remplissage", () => {
    // Bord gauche de la vignette 1 (vide), depuis la 2.
    expect(computeDropTarget({ x: 105, y: 45 }, rects, 2, { ...opts, isEmpty })).toEqual({ kind: "swap", index: 1 });
    // Bord droit de la vignette 0 : même position d'insertion.
    expect(computeDropTarget({ x: 85, y: 45 }, rects, 2, { ...opts, isEmpty })).toEqual({ kind: "swap", index: 1 });
    // Juste devant l'emplacement vide qui suit la vignette déplacée : ce n'est plus un no-op.
    expect(computeDropTarget({ x: 85, y: 45 }, rects, 0, { ...opts, isEmpty })).toEqual({ kind: "swap", index: 1 });
  });

  it("remplit l'emplacement : le média prend sa vue, l'origine devient vide à la vue de sa position", () => {
    const items = [{ id: 1, view: "F" }, { view: "B" }, { id: 2, view: "D" }];
    expect(reorderSlots(items, [2], { kind: "swap", index: 1 }, (t) => !("id" in t))).toEqual([
      { id: 1, view: "F" },
      { id: 2, view: "B" },
      { view: "D" },
    ]);
  });
});

describe("moveGroup (plusieurs vignettes) — ordre seul, vues inchangées", () => {
  type Item = { id?: string; view: string };
  const isEmpty = (t: Item) => !t.id;
  const order = (list: Item[]) => list.map((t) => t.id ?? "∅").join(" ");

  it("insère le groupe d'un bloc, dans l'ordre, en décalant les autres", () => {
    const items: Item[] = ["a", "b", "c", "d", "e"].map((id, i) => ({ id, view: String(i) }));
    expect(order(moveGroup(items, [1, 3], 0, isEmpty))).toBe("b d a c e");
    expect(order(moveGroup(items, [0, 2], 5, isEmpty))).toBe("b d e a c");
  });

  it("remplit les emplacements vides rencontrés, puis insère les suivants", () => {
    const items: Item[] = [
      { id: "a", view: "F" }, { view: "B" }, { view: "L" }, { id: "b", view: "D" }, { id: "c", view: "Z" }, { id: "d", view: "P" },
    ];
    // a, c, d (ordre d'affichage) déposés devant B : a et c remplissent B et L
    // (leurs origines deviennent vides), d s'insère devant b.
    expect(order(moveGroup(items, [0, 4, 5], 1, isEmpty))).toBe("∅ a c d b ∅");
  });
});

describe("reorderSlots — les vues restent attachées aux positions", () => {
  type Item = { file?: string; view: string };
  const isEmpty = (t: Item) => !t.file;
  const show = (list: Item[]) => list.map((t) => `${t.file ?? "∅"}:${t.view}`).join(" ");

  it("permutation : A.jpg prend la vue B, B.jpg la vue A", () => {
    const items: Item[] = [{ file: "A.jpg", view: "A" }, { file: "B.jpg", view: "B" }];
    expect(show(reorderSlots(items, [0], { kind: "swap", index: 1 }, isEmpty))).toBe("B.jpg:A A.jpg:B");
  });

  it("image P déposée sur l'emplacement vide L : elle prend L, la position P devient vide", () => {
    const items: Item[] = [{ file: "x.jpg", view: "P" }, { view: "L" }];
    expect(show(reorderSlots(items, [0], { kind: "swap", index: 1 }, isEmpty))).toBe("∅:P x.jpg:L");
  });

  it("insertion : les images décalées prennent la vue de leur nouvelle position", () => {
    const items: Item[] = [
      { file: "1.jpg", view: "F" }, { file: "2.jpg", view: "B" }, { file: "3.jpg", view: "L" },
    ];
    // 3.jpg insérée avant 1.jpg
    expect(show(reorderSlots(items, [2], { kind: "insert", anchor: 0, side: "before" }, isEmpty))).toBe(
      "3.jpg:F 1.jpg:B 2.jpg:L",
    );
  });

  it("groupe : la suite des codes de vue reste identique, seules les images bougent", () => {
    const items: Item[] = [
      { file: "a", view: "F" }, { view: "B" }, { view: "L" }, { file: "b", view: "D" }, { file: "c", view: "Z" }, { file: "d", view: "P" },
    ];
    const result = reorderSlots(items, [0, 4, 5], { kind: "swap", index: 1 }, isEmpty);
    expect(result.map((t) => t.view)).toEqual(items.map((t) => t.view));
    expect(show(result)).toBe("∅:F a:B c:L d:D b:Z ∅:P");
  });
});
