import * as React from "react";
import { findScrollRoot } from "./useGroupedImageLoading";

/** Row-aligned window; `end` is exclusive. Two extra rows on each side. */
export function getThumbnailWindow(count: number, columns: number, rowHeight: number, gap: number, top: number, bottom: number) {
  const rows = Math.ceil(count / columns);
  const step = Math.max(1, rowHeight + gap);
  const first = Math.max(0, Math.min(rows, Math.floor(top / step) - 2));
  const last = Math.max(first, Math.min(rows, Math.ceil(bottom / step) + 2));
  return { start: first * columns, end: Math.min(count, last * columns), offset: first * step, height: Math.max(0, rows * step - gap) };
}

/** Only the viewport and two surrounding rows are mounted. No data copy. */
export function useThumbnailWindow({ enabled, count, columns, cellWidth, gap, containerRef }: {
  enabled: boolean;
  count: number;
  columns: number;
  cellWidth: number | null;
  gap: number;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [viewport, setViewport] = React.useState({ top: 0, bottom: 800 });
  const [measurement, setMeasurement] = React.useState({ width: 0, height: 0 });
  // The first mounted row replaces this estimate before painting.
  const rowHeight = measurement.width === cellWidth && measurement.height > 0
    ? measurement.height : (cellWidth ?? 200) + 100;
  const range = enabled ? getThumbnailWindow(count, columns, rowHeight, gap, viewport.top, viewport.bottom)
    : { start: 0, end: count, offset: 0, height: 0 };

  React.useLayoutEffect(() => {
    if (!enabled || cellWidth === null) return;
    const grid = containerRef.current;
    if (!grid) return;
    let frame = 0;
    const update = () => {
      const root = findScrollRoot(grid);
      const bounds = root?.getBoundingClientRect();
      const gridTop = grid.getBoundingClientRect().top;
      const top = Math.max(0, bounds?.top ?? 0) - gridTop;
      const bottom = Math.min(window.innerHeight, bounds?.bottom ?? window.innerHeight) - gridTop;
      setViewport((old) => {
        const before = getThumbnailWindow(count, columns, rowHeight, gap, old.top, old.bottom);
        const after = getThumbnailWindow(count, columns, rowHeight, gap, top, bottom);
        // Scrolling within the same rows needs no React render.
        return before.start === after.start && before.end === after.end ? old : { top, bottom };
      });
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
    observer?.observe(grid);
    return () => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [enabled, containerRef, count, columns, rowHeight, cellWidth, gap]);

  React.useLayoutEffect(() => {
    if (!enabled || cellWidth === null) return;
    const nodes = containerRef.current?.querySelectorAll<HTMLElement>("[data-contact-sheet-cell]");
    if (!nodes?.length) return;
    const measure = () => {
      const height = Math.max(...Array.from(nodes, (node) => node.getBoundingClientRect().height));
      if (height > 0) setMeasurement((old) => old.width === cellWidth && old.height === height
        ? old : { width: cellWidth ?? 0, height });
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    nodes.forEach((node) => observer?.observe(node));
    return () => observer?.disconnect();
  });

  return range;
}
