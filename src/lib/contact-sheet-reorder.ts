/**
 * Logique du drag & drop de ContactSheetReference : à partir de la
 * position du pointeur et des rectangles des vignettes d'un même export, on
 * déduit la cible du drop (permutation ou insertion) puis le nouvel ordre.
 *
 * Isolée du composant pour être testable sans navigateur : happy-dom ne fait
 * pas de layout, seul ce qui est pur peut être vérifié en test.
 */

/** Rectangle d'une vignette, en coordonnées viewport (getBoundingClientRect). */
export interface CellRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Cible d'un drop :
 * - `swap` : permuter la vignette déplacée avec celle d'index `index` ;
 * - `insert` : intercaler la vignette déplacée. `anchor` / `side` disent où
 *   dessiner la barre (à gauche ou à droite de la vignette `anchor`), ce qui
 *   distingue « fin de ligne » de « début de la ligne suivante » quand la
 *   grille passe à la ligne, alors que les deux donnent le même ordre.
 */
export type DropTarget =
  | { kind: "swap"; index: number }
  | { kind: "insert"; anchor: number; side: "before" | "after" };

export interface DropTargetOptions {
  /**
   * Part de la largeur d'une vignette, de chaque côté, qui vaut « insertion ».
   * Le reste (au centre) vaut « permutation ». 1/3 par défaut : tiers gauche,
   * tiers central, tiers droit.
   */
  edgeRatio?: number;
  /** Interstice entre deux vignettes (px) : la zone d'insertion le couvre. */
  gap?: number;
  /**
   * Cible courante. Tant que le pointeur reste dans sa zone élargie de
   * `magnet` px, elle est conservée : c'est l'effet « magnétique », qui évite
   * que la cible clignote à la frontière entre deux zones.
   */
  previous?: DropTarget | null;
  /** Marge d'attraction de la cible courante (px). */
  magnet?: number;
  /**
   * Emplacements vides (vue attendue sans média). Insérer juste devant l'un
   * d'eux revient à le remplir : la cible devient une permutation avec lui.
   */
  isEmpty?: (index: number) => boolean;
}

const DEFAULT_EDGE_RATIO = 1 / 3;

/** Zone (en px) qui déclenche une cible donnée. */
export function getTargetZone(
  target: DropTarget,
  rects: readonly CellRect[],
  { edgeRatio = DEFAULT_EDGE_RATIO, gap = 0 }: Pick<DropTargetOptions, "edgeRatio" | "gap"> = {},
): CellRect | null {
  const index = target.kind === "swap" ? target.index : target.anchor;
  const rect = rects[index];
  if (!rect) return null;
  const edge = (rect.right - rect.left) * edgeRatio;
  const vertical = { top: rect.top - gap / 2, bottom: rect.bottom + gap / 2 };

  if (target.kind === "swap") {
    return { left: rect.left + edge, right: rect.right - edge, ...vertical };
  }
  if (target.side === "before") {
    return { left: rect.left - gap / 2, right: rect.left + edge, ...vertical };
  }
  return { left: rect.right - edge, right: rect.right + gap / 2, ...vertical };
}

function contains(zone: CellRect, point: Point, margin = 0): boolean {
  return (
    point.x >= zone.left - margin &&
    point.x <= zone.right + margin &&
    point.y >= zone.top - margin &&
    point.y <= zone.bottom + margin
  );
}

/** Position d'insertion (0..n) dans l'ordre courant, avant retrait. */
export function insertionPosition(target: Extract<DropTarget, { kind: "insert" }>): number {
  return target.side === "before" ? target.anchor : target.anchor + 1;
}

/**
 * Une cible qui ne changerait rien à l'ordre n'est pas une cible. `from < 0`
 * (déplacement de plusieurs éléments) : pas de détection ici, l'appelant
 * compare le résultat à l'ordre courant.
 */
export function isNoOp(target: DropTarget, from: number): boolean {
  if (from < 0) return false;
  if (target.kind === "swap") return target.index === from;
  const position = insertionPosition(target);
  return position === from || position === from + 1;
}

/**
 * Cible du drop pour un pointeur en `point`, la vignette d'index `from` étant
 * en cours de déplacement. `rects` sont ceux des vignettes du même export, dans
 * l'ordre d'affichage. Renvoie `null` hors de toute zone ou si le drop ne
 * changerait rien.
 */
export function computeDropTarget(
  point: Point,
  rects: readonly CellRect[],
  from: number,
  { edgeRatio = DEFAULT_EDGE_RATIO, gap = 0, previous = null, magnet = 12, isEmpty }: DropTargetOptions = {},
): DropTarget | null {
  const raw = rawDropTarget(point, rects, { edgeRatio, gap, previous, magnet });
  if (raw?.kind === "insert" && isEmpty) {
    const position = insertionPosition(raw);
    if (position < rects.length && position !== from && isEmpty(position)) {
      return { kind: "swap", index: position };
    }
  }
  return raw && !isNoOp(raw, from) ? raw : null;
}

/** Cible brute, avant conversion « devant un emplacement vide » et filtrage des no-ops. */
function rawDropTarget(
  point: Point,
  rects: readonly CellRect[],
  { edgeRatio = DEFAULT_EDGE_RATIO, gap = 0, previous = null, magnet = 12 }: DropTargetOptions,
): DropTarget | null {
  if (previous) {
    const zone = getTargetZone(previous, rects, { edgeRatio, gap });
    if (zone && contains(zone, point, magnet)) return previous;
  }

  // Ligne survolée : les vignettes dont la bande verticale (interstice compris)
  // contient le pointeur.
  const row = rects
    .map((rect, index) => ({ rect, index }))
    .filter(({ rect }) => point.y >= rect.top - gap / 2 && point.y <= rect.bottom + gap / 2);
  if (row.length === 0) return null;

  let target: DropTarget | null = null;
  const first = row[0];
  const last = row[row.length - 1];

  if (point.x < first.rect.left) {
    target = { kind: "insert", anchor: first.index, side: "before" };
  } else if (point.x > last.rect.right) {
    target = { kind: "insert", anchor: last.index, side: "after" };
  } else {
    // Vignette la plus proche horizontalement : couvre aussi les interstices.
    const nearest = row.reduce((best, cell) => {
      const distance = (r: CellRect) =>
        point.x < r.left ? r.left - point.x : point.x > r.right ? point.x - r.right : 0;
      return distance(cell.rect) < distance(best.rect) ? cell : best;
    });
    const { rect, index } = nearest;
    const ratio = (point.x - rect.left) / (rect.right - rect.left);
    if (ratio < edgeRatio) target = { kind: "insert", anchor: index, side: "before" };
    else if (ratio > 1 - edgeRatio) target = { kind: "insert", anchor: index, side: "after" };
    else target = { kind: "swap", index };
  }

  return target;
}

/** Nouvel ordre après un drop de l'élément d'index `from` sur `target`. */
export function applyDrop<T>(items: readonly T[], from: number, target: DropTarget): T[] {
  const next = [...items];
  if (target.kind === "swap") {
    [next[from], next[target.index]] = [next[target.index], next[from]];
    return next;
  }
  const position = insertionPosition(target);
  const [moved] = next.splice(from, 1);
  next.splice(position > from ? position - 1 : position, 0, moved);
  return next;
}

/**
 * Plage d'un Maj+clic : les identifiants de `anchor` à `clicked` inclus, dans
 * l'ordre d'affichage. Sans ancre (ou ancre disparue), la vignette seule.
 */
export function getSelectionRange(
  order: readonly number[],
  anchor: number | null,
  clicked: number,
): number[] {
  const end = order.indexOf(clicked);
  const start = anchor === null ? -1 : order.indexOf(anchor);
  if (start === -1 || end === -1) return [clicked];
  return order.slice(Math.min(start, end), Math.max(start, end) + 1);
}

/**
 * Déplace plusieurs éléments à la fois (`groupIndexes`, dans l'ordre
 * d'affichage) vers la position `cursor` (insertion avant l'élément d'index
 * `cursor`, ou fin de liste). Les éléments sont posés un à un, avec les mêmes
 * règles qu'au déplacement d'un seul :
 * - si l'emplacement sous le curseur est vide, l'élément l'échange avec lui (il
 *   prend sa place, sa position de départ devient l'emplacement vide) ;
 * - sinon l'élément est inséré à cet endroit et décale les suivants.
 * Le curseur avance après chaque élément posé. Ne touche pas aux vues : voir
 * `reorderSlots`, qui les réattribue par position.
 */
export function moveGroup<T>(
  items: readonly T[],
  groupIndexes: readonly number[],
  cursor: number,
  isEmpty: (item: T) => boolean,
): T[] {
  const list = [...items];
  let c = cursor;
  for (const index of groupIndexes) {
    const item = items[index];
    const at = list.indexOf(item);
    if (at === -1) continue;
    if (c < list.length && list[c] !== item && isEmpty(list[c])) {
      [list[c], list[at]] = [item, list[c]];
      c += 1;
    } else if (at === c) {
      c += 1;
    } else {
      list.splice(at, 1);
      if (at < c) c -= 1;
      list.splice(c, 0, item);
      c += 1;
    }
  }
  return list;
}

/**
 * Réordonnancement d'un export où **les vues sont attachées aux positions** :
 * les codes de vue ne bougent jamais, ce sont les médias (et les emplacements
 * vides) qui changent de place, et chacun prend la vue de sa nouvelle position.
 * - permutation de A (vue A) et B (vue B) : A prend la vue B, B la vue A ;
 * - média déposé sur un emplacement vide L : il prend la vue L, sa position de
 *   départ devient un emplacement vide (à la vue de cette position) ;
 * - insertion : les médias décalés prennent la vue de leur nouvelle position.
 *
 * Un élément (`indexes` de longueur 1) : `applyDrop` — une cible « swap » sur un
 * emplacement vide vaut remplissage. Plusieurs : `moveGroup` depuis le point de
 * dépôt (une cible « swap » n'y désigne qu'un emplacement vide à remplir).
 */
export function reorderSlots<T extends { view?: string }>(
  items: readonly T[],
  indexes: readonly number[],
  target: DropTarget,
  isEmpty: (item: T) => boolean,
): T[] {
  const moved =
    indexes.length > 1
      ? moveGroup(items, indexes, target.kind === "swap" ? target.index : insertionPosition(target), isEmpty)
      : applyDrop(items, indexes[0], target);
  return moved.map((item, i) => ({ ...item, view: items[i].view }));
}
