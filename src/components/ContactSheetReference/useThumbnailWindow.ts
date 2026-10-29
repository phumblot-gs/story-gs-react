import * as React from "react";
import { findScrollRoot } from "./useGroupedImageLoading";

export interface ThumbnailWindowRange {
  /** Premier index monté (début de ligne). */
  start: number;
  /** Fin exclusive. */
  end: number;
  /** Hauteur totale de la grille, toutes lignes comprises. */
  height: number;
}

/** Row-aligned window; `end` is exclusive. Two extra rows on each side. */
export function getThumbnailWindow(count: number, columns: number, rowHeight: number, gap: number, top: number, bottom: number) {
  const rows = Math.ceil(count / columns);
  const step = Math.max(1, rowHeight + gap);
  const first = Math.max(0, Math.min(rows, Math.floor(top / step) - 2));
  const last = Math.max(first, Math.min(rows, Math.ceil(bottom / step) + 2));
  return { start: first * columns, end: Math.min(count, last * columns), offset: first * step, height: Math.max(0, rows * step - gap) };
}

const sameRanges = (a: readonly ThumbnailWindowRange[], b: readonly ThumbnailWindowRange[]) =>
  a.length === b.length && a.every((r, i) => r.start === b[i].start && r.end === b[i].end);

/**
 * Only the viewport and two surrounding rows are mounted. No data copy.
 *
 * Plusieurs grilles (« segments ») sont fenêtrées ensemble : une seule en mode
 * "grouped", une par export en mode "separated". Chaque grille calcule sa
 * fenêtre par rapport à son propre haut, donc les en-têtes de section entre
 * elles n'entrent pas dans le calcul. Toutes les lignes ont la même hauteur
 * (mesurée sur les cellules montées) : la position d'une cellule se déduit de
 * son index, voir `getCellOffset`.
 */
export function useThumbnailWindow({ enabled, counts, columns, cellWidth, gap, containersRef }: {
  enabled: boolean;
  /** Nombre de cellules de chaque grille. */
  counts: readonly number[];
  columns: number;
  cellWidth: number | null;
  gap: number;
  /** Éléments des grilles, dans l'ordre de `counts`. */
  containersRef: React.MutableRefObject<(HTMLElement | null)[]>;
}) {
  // Avant la première mesure (layout effect, donc avant le premier affichage),
  // seule la première grille suppose qu'elle est à l'écran.
  const [viewports, setViewports] = React.useState<{ top: number; bottom: number }[]>([]);
  const [measurement, setMeasurement] = React.useState({ width: 0, height: 0 });
  // The first mounted row replaces this estimate before painting.
  const rowHeight = measurement.width === cellWidth && measurement.height > 0
    ? measurement.height : (cellWidth ?? 200) + 100;
  const step = Math.max(1, rowHeight + gap);
  const countsKey = counts.join(",");

  const computeRanges = (views: readonly { top: number; bottom: number }[]): ThumbnailWindowRange[] =>
    counts.map((count, i) => {
      const view = views[i] ?? (i === 0 ? { top: 0, bottom: 800 } : { top: -Infinity, bottom: -Infinity });
      return getThumbnailWindow(count, columns, rowHeight, gap, view.top, view.bottom);
    });
  const ranges = enabled ? computeRanges(viewports)
    : counts.map((count) => ({ start: 0, end: count, height: 0 }));

  React.useLayoutEffect(() => {
    if (!enabled || cellWidth === null) return;
    const first = containersRef.current.find(Boolean);
    if (!first) return;
    let frame = 0;
    const update = () => {
      const bounds = findScrollRoot(first)?.getBoundingClientRect();
      const viewTop = Math.max(0, bounds?.top ?? 0);
      const viewBottom = Math.min(window.innerHeight, bounds?.bottom ?? window.innerHeight);
      const next = counts.map((_, i) => {
        const grid = containersRef.current[i];
        if (!grid) return { top: -Infinity, bottom: -Infinity };
        const gridTop = grid.getBoundingClientRect().top;
        return { top: viewTop - gridTop, bottom: viewBottom - gridTop };
      });
      // Scrolling within the same rows needs no React render.
      setViewports((old) => (sameRanges(computeRanges(old), computeRanges(next)) ? old : next));
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; update(); });
    };
    update();
    // Capture also handles nested scroll containers, without one listener per ancestor.
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    containersRef.current.forEach((grid) => grid && observer?.observe(grid));
    return () => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
    // computeRanges ne dépend que des valeurs listées.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, containersRef, countsKey, columns, rowHeight, cellWidth, gap]);

  React.useLayoutEffect(() => {
    if (!enabled || cellWidth === null) return;
    const nodes = containersRef.current.flatMap((grid) =>
      grid ? Array.from(grid.querySelectorAll<HTMLElement>("[data-contact-sheet-cell]")) : []);
    if (!nodes.length) return;
    // At a given cell width the row height only grows: if the measure went back down, the rows would move, other
    // cells would mount, and a cell whose height depends on its state (image pending or loaded) could flip the
    // measure back and forth until React stops the render loop (#185).
    const measure = () => {
      const height = Math.max(...nodes.map((node) => node.getBoundingClientRect().height));
      if (height > 0) setMeasurement((old) => old.width === cellWidth && old.height >= height
        ? old : { width: cellWidth ?? 0, height });
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    nodes.forEach((node) => observer?.observe(node));
    return () => observer?.disconnect();
  });

  return { ranges, rowHeight, step };
}

/** Position d'une cellule dans sa grille fenêtrée (px, depuis le haut à gauche). */
export function getCellOffset(index: number, columns: number, step: number) {
  return { row: Math.floor(index / columns), column: index % columns, top: Math.floor(index / columns) * step };
}
