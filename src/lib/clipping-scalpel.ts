/**
 * Géométrie du scalpel : un tracé est une chaîne de nœuds (ouverte ou fermée)
 * reliés par des courbes de Bézier cubiques. Un nœud lisse prolonge la courbe
 * de part et d'autre ; un nœud `corner` fait un angle vif. Tout est pur : les
 * fonctions renvoient de nouveaux tracés.
 */
import type { ClippingMark, ClippingNode, ClippingPoint, ClippingSelectionMode } from "./clipping";

export interface ScalpelCut {
  nodes: ClippingNode[];
  closed: boolean;
}

/** Épaisseur de coupe transmise au moteur (px image) : un trait fin. */
export const SCALPEL_MARK_SIZE = 2;

const dist = (a: ClippingPoint, b: ClippingPoint) => Math.hypot(a.x - b.x, a.y - b.y);

export const isScalpelMark = (mark: ClippingMark): mark is ClippingMark & { nodes: ClippingNode[] } =>
  (mark.tool === "pencil" || mark.tool === "scalpel") && Array.isArray(mark.nodes);

export const markToCut = (mark: ClippingMark & { nodes: ClippingNode[] }): ScalpelCut => ({ nodes: mark.nodes, closed: !!mark.closed });

export const segmentCount = (cut: ScalpelCut) => (cut.nodes.length < 2 ? 0 : cut.closed ? cut.nodes.length : cut.nodes.length - 1);
export const isEndNode = (cut: ScalpelCut, index: number) => !cut.closed && (index === 0 || index === cut.nodes.length - 1);

function tangent(cut: ScalpelCut, i: number): ClippingPoint | null {
  const { nodes, closed } = cut;
  const n = nodes.length;
  if (nodes[i].corner) return null;
  const prev = i > 0 ? nodes[i - 1] : closed ? nodes[n - 1] : null;
  const next = i < n - 1 ? nodes[i + 1] : closed ? nodes[0] : null;
  if (!prev || !next) return null;
  const dx = next.x - prev.x;
  const dy = next.y - prev.y;
  const l = Math.hypot(dx, dy);
  return l < 1e-9 ? null : { x: dx / l, y: dy / l };
}

/** Points de contrôle de la courbe qui relie le nœud `i` au suivant : [p0, c1, c2, p1]. */
export function segmentBezier(cut: ScalpelCut, i: number): [ClippingPoint, ClippingPoint, ClippingPoint, ClippingPoint] {
  const n = cut.nodes.length;
  const a = cut.nodes[i];
  const j = (i + 1) % n;
  const b = cut.nodes[j];
  const len = dist(a, b);
  const ta = tangent(cut, i);
  const tb = tangent(cut, j);
  const c1 = ta ? { x: a.x + (ta.x * len) / 3, y: a.y + (ta.y * len) / 3 } : { x: a.x + (b.x - a.x) / 3, y: a.y + (b.y - a.y) / 3 };
  const c2 = tb ? { x: b.x - (tb.x * len) / 3, y: b.y - (tb.y * len) / 3 } : { x: b.x - (b.x - a.x) / 3, y: b.y - (b.y - a.y) / 3 };
  return [{ x: a.x, y: a.y }, c1, c2, { x: b.x, y: b.y }];
}

export function bezierPoint([p0, c1, c2, p1]: ReturnType<typeof segmentBezier>, t: number): ClippingPoint {
  const u = 1 - t;
  const w0 = u * u * u, w1 = 3 * u * u * t, w2 = 3 * u * t * t, w3 = t * t * t;
  return { x: w0 * p0.x + w1 * c1.x + w2 * c2.x + w3 * p1.x, y: w0 * p0.y + w1 * c1.y + w2 * c2.y + w3 * p1.y };
}

/** Courbe aplatie en points espacés d'environ `step` pixels image. */
export function sampleCut(cut: ScalpelCut, step = 2): ClippingPoint[] {
  const n = cut.nodes.length;
  if (n === 0) return [];
  const out: ClippingPoint[] = [{ x: cut.nodes[0].x, y: cut.nodes[0].y }];
  for (let i = 0; i < segmentCount(cut); i++) {
    const bez = segmentBezier(cut, i);
    const approx = dist(bez[0], bez[1]) + dist(bez[1], bez[2]) + dist(bez[2], bez[3]);
    const steps = Math.max(8, Math.ceil(approx / step));
    for (let k = 1; k <= steps; k++) out.push(bezierPoint(bez, k / steps));
  }
  return out;
}

/** Trait prêt pour l'historique et le moteur : `points` dérivés des nœuds. */
export function cutToMark(id: string, cut: ScalpelCut, mode: ClippingSelectionMode = "replace", tool: "pencil" | "scalpel" = "pencil"): ClippingMark {
  return { id, tool, size: SCALPEL_MARK_SIZE, nodes: cut.nodes, closed: cut.closed, points: sampleCut(cut), ...(tool === "pencil" ? { mode } : {}) };
}

// ---------------------------------------------------------------------------
// Détection sous le pointeur
// ---------------------------------------------------------------------------

/** Rayons en pixels image (rayons écran divisés par le zoom). */
export interface ScalpelRadii {
  node: number;
  /** Anneau autour d'un nœud d'extrémité ou isolé. */
  ring: number;
  /** Anneau autour d'un nœud intérieur, plus serré pour ne pas gêner les nœuds voisins. */
  ringInterior: number;
  segment: number;
}

export type ScalpelHit =
  | { zone: "node"; index: number }
  | { zone: "ring"; index: number }
  | { zone: "segment"; index: number; point: ClippingPoint };

export interface ScalpelTarget<Id = string> {
  id: Id;
  cut: ScalpelCut;
}

/**
 * Cherche sous le pointeur, dans cet ordre de priorité : un nœud, l'anneau d'un
 * nœud, puis le chemin entre deux nœuds. À priorité égale, le tracé le plus
 * récent (dernier de la liste) l'emporte.
 */
export function hitTestCuts<Id>(targets: ScalpelTarget<Id>[], p: ClippingPoint, r: ScalpelRadii): { id: Id; hit: ScalpelHit } | null {
  for (let t = targets.length - 1; t >= 0; t--) {
    const { nodes } = targets[t].cut;
    for (let i = nodes.length - 1; i >= 0; i--) if (dist(nodes[i], p) <= r.node) return { id: targets[t].id, hit: { zone: "node", index: i } };
  }
  for (let t = targets.length - 1; t >= 0; t--) {
    const cut = targets[t].cut;
    for (let i = cut.nodes.length - 1; i >= 0; i--) {
      const ring = isEndNode(cut, i) || cut.nodes.length === 1 ? r.ring : r.ringInterior;
      if (dist(cut.nodes[i], p) <= ring) return { id: targets[t].id, hit: { zone: "ring", index: i } };
    }
  }
  let best: { id: Id; index: number; point: ClippingPoint; d: number } | null = null;
  for (let t = targets.length - 1; t >= 0; t--) {
    const cut = targets[t].cut;
    for (let i = 0; i < segmentCount(cut); i++) {
      const bez = segmentBezier(cut, i);
      let prev = bez[0];
      for (let k = 1; k <= 24; k++) {
        const cur = bezierPoint(bez, k / 24);
        const q = closestOnSegment(prev, cur, p);
        const d = dist(q, p);
        if (d <= r.segment && (!best || d < best.d)) best = { id: targets[t].id, index: i, point: q, d };
        prev = cur;
      }
    }
  }
  return best ? { id: best.id, hit: { zone: "segment", index: best.index, point: best.point } } : null;
}

function closestOnSegment(a: ClippingPoint, b: ClippingPoint, p: ClippingPoint): ClippingPoint {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

// ---------------------------------------------------------------------------
// Édition
// ---------------------------------------------------------------------------

export function moveNode(cut: ScalpelCut, index: number, to: ClippingPoint): ScalpelCut {
  return { ...cut, nodes: cut.nodes.map((n, i) => (i === index ? { ...n, x: to.x, y: to.y } : n)) };
}

/** Bascule un nœud entre courbe (rond) et angle vif (carré). */
export function toggleCorner(cut: ScalpelCut, index: number): ScalpelCut {
  return { ...cut, nodes: cut.nodes.map((n, i) => (i === index ? { ...n, corner: !n.corner } : n)) };
}

/** Crée un nœud sur le chemin entre le nœud `segment` et le suivant. */
export function insertNode(cut: ScalpelCut, segment: number, at: ClippingPoint): { cut: ScalpelCut; index: number } {
  const index = segment + 1;
  const nodes = [...cut.nodes.slice(0, index), { x: at.x, y: at.y }, ...cut.nodes.slice(index)];
  return { cut: { ...cut, nodes }, index };
}

/**
 * Supprime un nœud. Dans un tracé fermé, le tracé s'ouvre à cet endroit ; un
 * tracé réduit à moins de deux nœuds disparaît (`null`).
 */
export function deleteNode(cut: ScalpelCut, index: number): ScalpelCut | null {
  const nodes = cut.closed
    ? [...cut.nodes.slice(index + 1), ...cut.nodes.slice(0, index)]
    : cut.nodes.filter((_, i) => i !== index);
  return nodes.length < 2 ? null : { nodes, closed: false };
}

/** Prolonge un tracé depuis son extrémité `index` (0 ou dernier) avec un nouveau nœud. */
export function extendCut(cut: ScalpelCut, index: number, at: ClippingPoint): { cut: ScalpelCut; index: number } {
  const node: ClippingNode = { x: at.x, y: at.y, corner: cut.nodes[index]?.corner };
  if (cut.nodes.length === 1 || index === cut.nodes.length - 1) return { cut: { ...cut, nodes: [...cut.nodes, node] }, index: cut.nodes.length };
  return { cut: { ...cut, nodes: [node, ...cut.nodes] }, index: 0 };
}

/**
 * Deux extrémités peuvent se rejoindre si ce sont bien des extrémités distinctes,
 * et, dans un même tracé, si la fermeture laisse au moins trois nœuds.
 * `extraNodes` compte les nœuds qui vont s'ajouter avant la fermeture.
 */
export function canSnap(a: ScalpelCut, ai: number, b: ScalpelCut, bi: number, extraNodes = 0): boolean {
  if (!isEndNode(a, ai) || !isEndNode(b, bi)) return false;
  if (a === b) return ai !== bi && a.nodes.length + extraNodes >= 4;
  return true;
}

/** Referme un tracé : l'extrémité `from` est absorbée par l'extrémité `into`. */
export function closeCut(cut: ScalpelCut, from: number, into: number): ScalpelCut {
  const target = cut.nodes[into];
  const nodes = cut.nodes
    .map((n, i) => (i === into ? { ...target, corner: target.corner || cut.nodes[from].corner } : n))
    .filter((_, i) => i !== from);
  return { nodes, closed: true };
}

/** Soude deux tracés distincts : l'extrémité `ai` de `a` est absorbée par l'extrémité `bi` de `b`. */
export function joinCuts(a: ScalpelCut, ai: number, b: ScalpelCut, bi: number): ScalpelCut {
  const left = ai === 0 && a.nodes.length > 1 ? [...a.nodes].reverse() : a.nodes;
  const right = bi === b.nodes.length - 1 && b.nodes.length > 1 ? [...b.nodes].reverse() : b.nodes;
  const joint = { ...right[0], corner: right[0].corner || left[left.length - 1].corner };
  return { nodes: [...left.slice(0, -1), joint, ...right.slice(1)], closed: false };
}
