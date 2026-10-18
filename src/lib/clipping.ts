/**
 * Logique pure de l'éditeur de détourage (ClippingEditor) : marques, historique,
 * viewport et application du masque. Sans DOM, pour rester testable.
 *
 * Toutes les coordonnées des marques sont en pixels de l'image source.
 */

/**
 * Outils de la barre. `pencil` trace une sélection (`pencilAdd` : union, `pencilSub` : soustraction) ; `scalpel` est l'ancien
 * nom de `pencil`, accepté pour les anciennes sessions. `pan` ne produit pas de marque.
 */
export type ClippingTool = "keep" | "remove" | "hair" | "eraser" | "pencil" | "pencilAdd" | "pencilSub" | "scalpel" | "pan";
/**
 * Marques transmises au moteur de détourage. `pencil` construit la sélection, `invert` / `deselect` la modifient, `delete`
 * supprime la zone sélectionnée, `erase` gomme l'effet des marques précédentes (dans la sélection). `scalpel` : ancien tracé.
 */
export type ClippingMarkTool = "keep" | "remove" | "hair" | "scalpel" | "pencil" | "invert" | "deselect" | "delete" | "erase";
/** Mode d'un tracé de sélection : remplace la sélection, s'y ajoute (Pencil+) ou en soustrait (Pencil−). */
export type ClippingSelectionMode = "replace" | "add" | "subtract";

export interface ClippingPoint {
  x: number;
  y: number;
}

/** Nœud d'un tracé de scalpel : lisse (courbe) par défaut, `corner` pour un angle vif. */
export interface ClippingNode extends ClippingPoint {
  corner?: boolean;
}

export interface ClippingMark {
  id: string;
  tool: ClippingMarkTool;
  /** Diamètre du pinceau, en pixels de l'image source. */
  size: number;
  /** Trait échantillonné : ce que le moteur de détourage lit. Pour un scalpel, la courbe aplatie. */
  points: ClippingPoint[];
  /** Scalpel : nœuds éditables du tracé (les `points` en sont dérivés). */
  nodes?: ClippingNode[];
  /** Scalpel : le tracé se referme sur son premier nœud. */
  closed?: boolean;
  /** Pencil : remplace la sélection (défaut), s'y ajoute ou en soustrait. */
  mode?: ClippingSelectionMode;
  /** Delete : adoucissement du bord de la zone supprimée, en pixels de l'image source. */
  feather?: number;
}

/** Masque alpha d'une image : 1 octet par pixel (0 = fond, 255 = sujet), ligne par ligne. */
export interface ClippingMask {
  width: number;
  height: number;
  alpha: Uint8ClampedArray;
}

export interface ClippingSegmentRequest {
  marks: ClippingMark[];
  width: number;
  height: number;
  /** Annulé dès qu'une nouvelle marque rend la demande obsolète. */
  signal: AbortSignal;
}

/** Moteur de détourage fourni par l'application hôte (backend, WASM, simulateur…). */
export type ClippingSegmenter = (request: ClippingSegmentRequest) => Promise<ClippingMask>;

/** Outils au pinceau : leur trait devient une marque. */
export type ClippingBrushTool = "keep" | "remove" | "hair";
export const isBrushTool = (tool: ClippingTool): tool is ClippingBrushTool => tool === "keep" || tool === "remove" || tool === "hair";
/** Outils qui tracent un contour de sélection (Pencil, Pencil+, Pencil−, et l'ancien scalpel). */
export const isPencilTool = (tool: ClippingTool): boolean => tool === "pencil" || tool === "pencilAdd" || tool === "pencilSub" || tool === "scalpel";
export const pencilMode = (tool: ClippingTool): ClippingSelectionMode => (tool === "pencilAdd" ? "add" : tool === "pencilSub" ? "subtract" : "replace");
/** Marques sans trait au pinceau : elles agissent sur la sélection ou la zone sélectionnée, la gomme ne les efface pas. */
const NON_ERASABLE: ClippingMarkTool[] = ["pencil", "invert", "deselect", "delete", "erase", "scalpel"];
const HAS_NO_POINTS: ClippingMarkTool[] = ["invert", "deselect", "delete"];

/**
 * Marques de sélection en vigueur : celles qui suivent le dernier `deselect`. `active` est faux quand il n'y a pas de tracé
 * (les marques `invert` et `delete` seules n'ont rien à agir). Un ancien scalpel n'est pas une sélection.
 */
export function selectionState(marks: ClippingMark[]): { ops: ClippingMark[]; active: boolean } {
  let ops: ClippingMark[] = [];
  for (const m of marks) {
    if (m.tool === "deselect") ops = [];
    else if (m.tool === "pencil" || m.tool === "invert") ops = [...ops, m];
  }
  return { ops, active: ops.some((m) => m.tool === "pencil" && m.points.length >= 3) };
}

// ---------------------------------------------------------------------------
// Historique (annuler / rétablir)
// ---------------------------------------------------------------------------

export interface ClippingHistory {
  past: ClippingMark[][];
  present: ClippingMark[];
  future: ClippingMark[][];
}

export type ClippingHistoryAction =
  | { type: "add"; mark: ClippingMark }
  | { type: "erase"; points: ClippingPoint[]; size: number }
  /** Remplace tous les traits en une seule entrée d'historique (édition du scalpel). */
  | { type: "set"; marks: ClippingMark[] }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset"; marks?: ClippingMark[] };

export const createClippingHistory = (marks: ClippingMark[] = []): ClippingHistory => ({
  past: [],
  present: marks,
  future: [],
});

const commit = (state: ClippingHistory, present: ClippingMark[]): ClippingHistory => ({
  past: [...state.past, state.present],
  present,
  future: [],
});

export function clippingHistoryReducer(state: ClippingHistory, action: ClippingHistoryAction): ClippingHistory {
  switch (action.type) {
    case "add":
      return action.mark.points.length === 0 && !HAS_NO_POINTS.includes(action.mark.tool) ? state : commit(state, [...state.present, action.mark]);
    case "erase": {
      const kept = state.present.filter((mark) => NON_ERASABLE.includes(mark.tool) || !markTouched(mark, action.points, action.size / 2));
      // Rien d'effacé : pas d'entrée d'historique.
      return kept.length === state.present.length ? state : commit(state, kept);
    }
    case "set":
      return action.marks === state.present ? state : commit(state, action.marks);
    case "undo": {
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    }
    case "reset":
      return state.present.length === 0 && !action.marks?.length ? state : commit(state, action.marks ?? []);
  }
}

/** Une marque est touchée quand un de ses points passe à portée de la gomme. */
export function markTouched(mark: ClippingMark, eraser: ClippingPoint[], eraserRadius: number): boolean {
  const reach = eraserRadius + mark.size / 2;
  const reach2 = reach * reach;
  return mark.points.some((p) =>
    eraser.some((e) => (p.x - e.x) ** 2 + (p.y - e.y) ** 2 <= reach2),
  );
}

/**
 * Ajoute des points intermédiaires pour qu'aucun écart ne dépasse `step` : la
 * gomme et le moteur travaillent sur des points, pas sur des segments.
 */
export function densifyPoints(points: ClippingPoint[], step: number): ClippingPoint[] {
  if (points.length < 2 || step <= 0) return points;
  const out: ClippingPoint[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step);
    for (let k = 1; k <= n; k++) out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Viewport (zoom / déplacement)
// ---------------------------------------------------------------------------

/** `center` est le point de l'image affiché au centre du volet ; `scale` = pixels écran par pixel image. */
export interface ClippingViewport {
  scale: number;
  center: ClippingPoint;
}

export const CLIPPING_MIN_SCALE = 0.05;
export const CLIPPING_MAX_SCALE = 32;
export const CLIPPING_FIT_MARGIN = 1;

export const clampScale = (scale: number) => Math.min(CLIPPING_MAX_SCALE, Math.max(CLIPPING_MIN_SCALE, scale));

export function fitViewport(pane: { width: number; height: number }, image: { width: number; height: number }): ClippingViewport {
  const scale = clampScale(Math.min(pane.width / image.width, pane.height / image.height) * CLIPPING_FIT_MARGIN);
  return { scale, center: { x: image.width / 2, y: image.height / 2 } };
}

export function screenToImage(vp: ClippingViewport, pane: { width: number; height: number }, x: number, y: number): ClippingPoint {
  return { x: (x - pane.width / 2) / vp.scale + vp.center.x, y: (y - pane.height / 2) / vp.scale + vp.center.y };
}

export function imageToScreen(vp: ClippingViewport, pane: { width: number; height: number }, p: ClippingPoint): ClippingPoint {
  return { x: (p.x - vp.center.x) * vp.scale + pane.width / 2, y: (p.y - vp.center.y) * vp.scale + pane.height / 2 };
}

/** Zoom qui garde fixe le point d'image situé sous le curseur (`x`, `y` en pixels du volet). */
export function zoomViewport(vp: ClippingViewport, pane: { width: number; height: number }, factor: number, x = pane.width / 2, y = pane.height / 2): ClippingViewport {
  const scale = clampScale(vp.scale * factor);
  const anchor = screenToImage(vp, pane, x, y);
  return {
    scale,
    center: { x: anchor.x - (x - pane.width / 2) / scale, y: anchor.y - (y - pane.height / 2) / scale },
  };
}

export function panViewport(vp: ClippingViewport, dxScreen: number, dyScreen: number): ClippingViewport {
  return { scale: vp.scale, center: { x: vp.center.x - dxScreen / vp.scale, y: vp.center.y - dyScreen / vp.scale } };
}

// ---------------------------------------------------------------------------
// Masque
// ---------------------------------------------------------------------------

/**
 * Copie des pixels RGBA dont l'alpha est multiplié par le masque. Les pixels
 * déjà transparents le restent.
 */
export function applyAlphaMask(rgba: Uint8ClampedArray, mask: ClippingMask): Uint8ClampedArray {
  if (rgba.length !== mask.alpha.length * 4) {
    throw new RangeError(`Masque ${mask.alpha.length} px incompatible avec une image de ${rgba.length / 4} px`);
  }
  const out = new Uint8ClampedArray(rgba);
  for (let i = 0; i < mask.alpha.length; i++) out[i * 4 + 3] = Math.round((rgba[i * 4 + 3] * mask.alpha[i]) / 255);
  return out;
}

export const newMarkId = (() => {
  let n = 0;
  return () => `mark-${Date.now().toString(36)}-${(n++).toString(36)}`;
})();

/**
 * Whether the editor must ask the engine for a mask. With no marks there is nothing to compute, unless the
 * engine can produce an automatic cut-out (`autoSegment`), which is then the starting point to correct.
 */
export const shouldSegment = (marks: ClippingMark[], autoSegment: boolean): boolean => marks.length > 0 || autoSegment;
