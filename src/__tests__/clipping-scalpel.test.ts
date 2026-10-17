import { describe, expect, it } from "vitest";
import {
  canSnap, closeCut, cutToMark, deleteNode, extendCut, hitTestCuts, insertNode, isEndNode, joinCuts, moveNode, sampleCut,
  segmentBezier, toggleCorner, type ScalpelCut, type ScalpelRadii,
} from "@/lib/clipping-scalpel";
import { clippingHistoryReducer, createClippingHistory } from "@/lib/clipping";

const line = (...xs: number[]): ScalpelCut => ({ nodes: xs.map((x) => ({ x, y: 0 })), closed: false });
const R: ScalpelRadii = { node: 5, ring: 12, ringInterior: 8, segment: 4 };

describe("courbes du scalpel", () => {
  it("deux nœuds en angle donnent une droite", () => {
    const cut: ScalpelCut = { nodes: [{ x: 0, y: 0, corner: true }, { x: 30, y: 0, corner: true }], closed: false };
    const [, c1, c2] = segmentBezier(cut, 0);
    expect(c1).toEqual({ x: 10, y: 0 }); expect(c2).toEqual({ x: 20, y: 0 });
  });

  it("un nœud lisse reste tangent à la direction de ses voisins, un angle non", () => {
    const smooth: ScalpelCut = { nodes: [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 0 }], closed: false };
    const [, c1] = segmentBezier(smooth, 0);
    const [, , c2] = segmentBezier(smooth, 0);
    // tangente au sommet = horizontale : le contrôle entrant est à la même hauteur que le sommet
    expect(c2.y).toBeCloseTo(10);
    expect(c1.x).toBeGreaterThan(0);
    const sharp = toggleCorner(smooth, 1);
    expect(segmentBezier(sharp, 0)[2].y).toBeLessThan(10);
  });

  it("échantillonne de la première à la dernière extrémité, points espacés", () => {
    const pts = sampleCut(line(0, 100), 2);
    expect(pts[0]).toEqual({ x: 0, y: 0 });
    expect(pts[pts.length - 1].x).toBeCloseTo(100);
    for (let i = 1; i < pts.length; i++) expect(Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)).toBeLessThanOrEqual(3);
  });

  it("un tracé fermé revient à son point de départ", () => {
    const tri: ScalpelCut = { nodes: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 20, y: 30 }], closed: true };
    const pts = sampleCut(tri);
    expect(pts[pts.length - 1].x).toBeCloseTo(0); expect(pts[pts.length - 1].y).toBeCloseTo(0);
  });

  it("cutToMark expose des points pour le moteur", () => {
    const mark = cutToMark("c", line(0, 50));
    expect(mark.tool).toBe("pencil"); expect(mark.mode).toBe("replace"); expect(cutToMark("c", line(0, 50), "add").mode).toBe("add");
    expect(cutToMark("c", line(0, 50), "replace", "scalpel").mode).toBeUndefined(); expect(mark.points.length).toBeGreaterThan(2); expect(mark.nodes).toHaveLength(2);
  });
});

describe("détection sous le pointeur", () => {
  const targets = [{ id: "a", cut: line(0, 100) }];
  it("priorité : nœud, puis anneau, puis chemin", () => {
    expect(hitTestCuts(targets, { x: 2, y: 1 }, R)?.hit).toEqual({ zone: "node", index: 0 });
    expect(hitTestCuts(targets, { x: 9, y: 0 }, R)?.hit).toEqual({ zone: "ring", index: 0 });
    const seg = hitTestCuts(targets, { x: 50, y: 3 }, R)?.hit;
    expect(seg).toMatchObject({ zone: "segment", index: 0 });
    expect(seg && seg.zone === "segment" && seg.point.x).toBeCloseTo(50);
    expect(hitTestCuts(targets, { x: 50, y: 30 }, R)).toBeNull();
  });
  it("l'anneau d'un nœud intérieur est plus serré que celui d'une extrémité", () => {
    const t = [{ id: "a", cut: line(0, 50, 100) }];
    expect(hitTestCuts(t, { x: 50, y: 10 }, { ...R, segment: 1 })).toBeNull();
    expect(hitTestCuts(t, { x: 50, y: 7 }, { ...R, segment: 1 })?.hit).toEqual({ zone: "ring", index: 1 });
    expect(hitTestCuts(t, { x: 10, y: 0 }, { ...R, segment: 1 })?.hit).toEqual({ zone: "ring", index: 0 });
  });
  it("le tracé le plus récent gagne à priorité égale", () => {
    const t = [{ id: "old", cut: line(0, 10) }, { id: "new", cut: line(0, 10) }];
    expect(hitTestCuts(t, { x: 0, y: 0 }, R)?.id).toBe("new");
  });
});

describe("édition", () => {
  it("insère un nœud sur le chemin", () => {
    const { cut, index } = insertNode(line(0, 100), 0, { x: 40, y: 0 });
    expect(index).toBe(1); expect(cut.nodes.map((n) => n.x)).toEqual([0, 40, 100]);
  });
  it("déplace un nœud sans toucher les autres", () => {
    const cut = line(0, 50, 100);
    expect(moveNode(cut, 1, { x: 50, y: 20 }).nodes.map((n) => n.y)).toEqual([0, 20, 0]);
    expect(cut.nodes[1].y).toBe(0);
  });
  it("supprime un nœud ; sous deux nœuds le tracé disparaît", () => {
    expect(deleteNode(line(0, 50, 100), 1)?.nodes.map((n) => n.x)).toEqual([0, 100]);
    expect(deleteNode(line(0, 100), 0)).toBeNull();
  });
  it("supprimer un nœud d'un tracé fermé l'ouvre à cet endroit", () => {
    const loop: ScalpelCut = { nodes: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }], closed: true };
    const opened = deleteNode(loop, 1)!;
    expect(opened.closed).toBe(false);
    expect(opened.nodes.map((n) => [n.x, n.y])).toEqual([[10, 10], [0, 10], [0, 0]]);
  });
  it("prolonge par l'une ou l'autre extrémité", () => {
    const cut = line(0, 50);
    expect(extendCut(cut, 1, { x: 80, y: 0 })).toMatchObject({ index: 2 });
    const front = extendCut(cut, 0, { x: -30, y: 0 });
    expect(front.index).toBe(0); expect(front.cut.nodes[0].x).toBe(-30);
    expect(extendCut({ nodes: [{ x: 1, y: 1 }], closed: false }, 0, { x: 5, y: 5 }).cut.nodes).toHaveLength(2);
  });
  it("seules des extrémités peuvent se rejoindre ; la fermeture exige assez de nœuds", () => {
    const a = line(0, 50, 100);
    expect(isEndNode(a, 1)).toBe(false);
    expect(canSnap(a, 0, a, 2)).toBe(false); // 3 nœuds : triangle dégénéré une fois fusionné
    expect(canSnap(a, 0, a, 2, 1)).toBe(true);
    expect(canSnap(a, 1, line(0, 10), 0)).toBe(false);
    expect(canSnap(a, 0, line(200, 300), 0)).toBe(true);
    expect(canSnap(a, 0, a, 0)).toBe(false);
  });
  it("ferme un tracé en absorbant l'extrémité déplacée", () => {
    const path: ScalpelCut = { nodes: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 1, y: 1 }], closed: false };
    const closed = closeCut(path, 3, 0);
    expect(closed.closed).toBe(true); expect(closed.nodes).toHaveLength(3); expect(closed.nodes[0]).toMatchObject({ x: 0, y: 0 });
  });
  it("soude deux tracés bout à bout, quel que soit leur sens", () => {
    const joined = joinCuts(line(0, 10), 1, line(30, 20), 1); // a finit en 10, b finit en 20 → b est retourné
    expect(joined.nodes.map((n) => n.x)).toEqual([0, 20, 30]);
    // l'extrémité en 10 est absorbée par le nœud en 20
    expect(joinCuts(line(10, 0), 0, line(20, 30), 0).nodes.map((n) => n.x)).toEqual([0, 20, 30]);
  });
});

describe("historique et scalpel", () => {
  it("« set » remplace tous les traits en une entrée annulable", () => {
    let h = createClippingHistory([cutToMark("c", line(0, 50))]);
    h = clippingHistoryReducer(h, { type: "set", marks: [cutToMark("c", line(0, 50, 100))] });
    expect(h.present[0].nodes).toHaveLength(3);
    expect(clippingHistoryReducer(h, { type: "undo" }).present[0].nodes).toHaveLength(2);
    expect(clippingHistoryReducer(h, { type: "set", marks: h.present })).toBe(h);
  });
});
