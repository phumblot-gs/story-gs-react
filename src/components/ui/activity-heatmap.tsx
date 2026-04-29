"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslationSafe, TranslationMap } from "@/contexts/TranslationContext";
import { formatDateForLocale } from "@/utils/translations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ActivityColorScale = readonly [string, string, string, string, string];

export interface ActivityDataPoint {
  /** ISO date string (YYYY-MM-DD) or Date object */
  date: string | Date;
  /** Activity count for that day */
  count: number;
}

export interface ActivityHeatmapProps {
  /** List of dated activity points. Multiple entries on the same day are summed. */
  data: ActivityDataPoint[];
  /** Last day shown on the right edge (default: today) */
  endDate?: Date;
  /** Number of weeks (columns) to display (default: 53 — one year) */
  weeks?: number;
  /** First day of the week: 0 = Sunday (default), 1 = Monday */
  firstDayOfWeek?: 0 | 1;
  /**
   * Single base color (CSS color). When set, the four active intensities
   * are derived from it via opacity (0.25 / 0.5 / 0.75 / 1) and level 0
   * is a neutral grey. Ignored when `colorScale` is provided.
   */
  color?: string;
  /**
   * Explicit 5-step color scale: [empty, level1, level2, level3, level4].
   * Takes precedence over `color`.
   */
  colorScale?: ActivityColorScale;
  /**
   * Four ascending thresholds to map a count to levels 1–4.
   * If omitted, thresholds are computed from the data's max value.
   * Example: [1, 3, 6, 10] → count >= 1 ⇒ level 1, >= 3 ⇒ level 2, etc.
   */
  levels?: [number, number, number, number];
  /**
   * Translation key for the unit label (singular form).
   * The plural form must exist as `${unit}_plural` (handled automatically by t()).
   * Default: "activityHeatmap.unit.file".
   */
  unit?: string;
  /** Translation key (or literal text) for the bottom-left legend. Default: "activityHeatmap.legend". */
  legend?: string;
  /** If set, the legend is rendered as a link to this URL. */
  legendHref?: string;
  /** Show the weekday labels on the left (default: true) */
  showWeekdays?: boolean;
  /** Show the month labels on top (default: true) */
  showMonths?: boolean;
  /** Show the bottom legend (default: true) */
  showLegend?: boolean;
  /** Show the Less/More color scale (default: true) */
  showScale?: boolean;
  /** Cell size in px (default: 11) */
  cellSize?: number;
  /** Gap between cells in px (default: 3) */
  cellGap?: number;
  /** Additional className on the root */
  className?: string;
  // Translation props (optional - works without TranslationProvider)
  language?: string;                          // Language code (e.g., "fr", "en", "es", "it", "de")
  translations?: Partial<TranslationMap>;     // Custom translations to override defaults
}

const DEFAULT_GREEN_SCALE: ActivityColorScale = [
  "#ebedf0",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

const EMPTY_FALLBACK = "#ebedf0";

const toIsoDay = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const startOfDay = (d: Date): Date => {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
};

const addDays = (d: Date, days: number): Date => {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
};

/** Hex (#rgb / #rrggbb) → "r,g,b" channels. Returns null for non-hex inputs. */
const hexToRgbChannels = (hex: string): string | null => {
  const m = hex.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const buildScaleFromColor = (color: string): ActivityColorScale => {
  const channels = hexToRgbChannels(color);
  if (channels) {
    return [
      EMPTY_FALLBACK,
      `rgba(${channels}, 0.25)`,
      `rgba(${channels}, 0.5)`,
      `rgba(${channels}, 0.75)`,
      `rgba(${channels}, 1)`,
    ];
  }
  // Non-hex (e.g. "green", "hsl(...)"): fall back to color-mix when supported,
  // otherwise pile up the same color at varying alphas via CSS opacity.
  return [
    EMPTY_FALLBACK,
    `color-mix(in srgb, ${color} 25%, transparent)`,
    `color-mix(in srgb, ${color} 50%, transparent)`,
    `color-mix(in srgb, ${color} 75%, transparent)`,
    color,
  ] as ActivityColorScale;
};

const computeAutoLevels = (max: number): [number, number, number, number] => {
  if (max <= 0) return [1, 2, 3, 4];
  if (max <= 4) return [1, 2, 3, 4];
  const q = max / 4;
  return [
    Math.max(1, Math.ceil(q * 0.25)),
    Math.max(2, Math.ceil(q)),
    Math.max(3, Math.ceil(q * 2)),
    Math.max(4, Math.ceil(q * 3)),
  ];
};

const levelFor = (count: number, levels: [number, number, number, number]): 0 | 1 | 2 | 3 | 4 => {
  if (count <= 0) return 0;
  if (count >= levels[3]) return 4;
  if (count >= levels[2]) return 3;
  if (count >= levels[1]) return 2;
  if (count >= levels[0]) return 1;
  return 0;
};

export const ActivityHeatmap = React.forwardRef<HTMLDivElement, ActivityHeatmapProps>(
  function ActivityHeatmap(
    {
      data,
      endDate,
      weeks = 53,
      firstDayOfWeek = 0,
      color,
      colorScale,
      levels,
      unit = "activityHeatmap.unit.file",
      legend = "activityHeatmap.legend",
      legendHref,
      showWeekdays = true,
      showMonths = true,
      showLegend = true,
      showScale = true,
      cellSize = 11,
      cellGap = 3,
      className,
      language,
      translations,
    },
    ref
  ) {
    const { t, currentLanguage } = useTranslationSafe(translations, language);
    const langCode = currentLanguage.code;

    const scale: ActivityColorScale = React.useMemo(() => {
      if (colorScale) return colorScale;
      if (color) return buildScaleFromColor(color);
      return DEFAULT_GREEN_SCALE;
    }, [color, colorScale]);

    // Build the date grid.
    const { grid, monthLabels } = React.useMemo(() => {
      const today = startOfDay(endDate ?? new Date());

      // Index data by ISO day (sum duplicates).
      const counts = new Map<string, number>();
      for (const point of data) {
        const dateObj = typeof point.date === "string" ? new Date(point.date) : point.date;
        if (Number.isNaN(dateObj.getTime())) continue;
        const key = toIsoDay(dateObj);
        counts.set(key, (counts.get(key) ?? 0) + (point.count ?? 0));
      }

      // Find the start of the rightmost column (the week containing `today`).
      const todayDow = today.getDay(); // 0=Sun..6=Sat
      const offsetFromWeekStart = (todayDow - firstDayOfWeek + 7) % 7;
      const lastColStart = addDays(today, -offsetFromWeekStart);
      const firstColStart = addDays(lastColStart, -(weeks - 1) * 7);

      const cols: Array<Array<{ date: Date; count: number; future: boolean }>> = [];
      const monthFirstSeen = new Map<number, number>(); // month index → column index

      for (let w = 0; w < weeks; w++) {
        const colStart = addDays(firstColStart, w * 7);
        const week: Array<{ date: Date; count: number; future: boolean }> = [];
        for (let r = 0; r < 7; r++) {
          const d = addDays(colStart, r);
          const key = toIsoDay(d);
          const future = d.getTime() > today.getTime();
          week.push({ date: d, count: future ? 0 : counts.get(key) ?? 0, future });
        }
        cols.push(week);
        // Use the first cell of the week to decide month label position.
        const firstCellMonth = colStart.getMonth();
        if (!monthFirstSeen.has(firstCellMonth)) {
          monthFirstSeen.set(firstCellMonth, w);
        }
      }

      const monthLabels: Array<{ col: number; label: string }> = [];
      let lastLabelCol = -Infinity;
      for (let w = 0; w < weeks; w++) {
        const colStart = cols[w][0].date;
        const monthIdx = colStart.getMonth();
        if (monthFirstSeen.get(monthIdx) === w) {
          // Avoid stacking labels too close together (need ~3 columns gap).
          if (w - lastLabelCol >= 3) {
            monthLabels.push({
              col: w,
              label: formatDateForLocale(colStart, "MMM", langCode),
            });
            lastLabelCol = w;
          }
        }
      }

      return { grid: cols, monthLabels };
    }, [data, endDate, firstDayOfWeek, weeks, langCode]);

    const effectiveLevels = React.useMemo<[number, number, number, number]>(() => {
      if (levels) return levels;
      let max = 0;
      for (const col of grid) {
        for (const cell of col) if (cell.count > max) max = cell.count;
      }
      return computeAutoLevels(max);
    }, [grid, levels]);

    // Weekday labels — show 3 of them (offset 1, 3, 5 in the column = Mon, Wed, Fri when week starts Sunday).
    const weekdayLabels: Array<{ row: number; label: string }> = React.useMemo(() => {
      if (!grid.length) return [];
      const rows = firstDayOfWeek === 1 ? [0, 2, 4] : [1, 3, 5];
      const refColumn = grid[grid.length - 1];
      return rows.map((row) => ({
        row,
        label: formatDateForLocale(refColumn[row].date, "EEE", langCode),
      }));
    }, [grid, langCode, firstDayOfWeek]);

    // Layout numbers
    const colStep = cellSize + cellGap;
    const gridHeight = 7 * cellSize + 6 * cellGap;
    const gridWidth = weeks * cellSize + (weeks - 1) * cellGap;
    const weekdayColumnWidth = showWeekdays ? 28 : 0;
    const monthRowHeight = showMonths ? 16 : 0;

    const renderCell = (
      cell: { date: Date; count: number; future: boolean },
      level: 0 | 1 | 2 | 3 | 4
    ) => {
      const dateLabel = formatDateForLocale(cell.date, "PP", langCode);
      const tooltipText = cell.future
        ? dateLabel
        : cell.count > 0
        ? t("activityHeatmap.tooltip", {
            count: cell.count,
            unit: t(unit, { count: cell.count }),
            date: dateLabel,
          })
        : t("activityHeatmap.tooltipEmpty", {
            unit: t(unit, { count: 0 }),
            date: dateLabel,
          });

      return (
        <Tooltip key={toIsoDay(cell.date)} delayDuration={150}>
          <TooltipTrigger asChild>
            <div
              role="gridcell"
              aria-label={tooltipText}
              data-level={level}
              data-future={cell.future || undefined}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 2,
                backgroundColor: cell.future ? "transparent" : scale[level],
                border: cell.future ? `1px dashed ${scale[0]}` : undefined,
              }}
            />
          </TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      );
    };

    const legendText = t(legend);
    const lessText = t("activityHeatmap.less");
    const moreText = t("activityHeatmap.more");

    return (
      <TooltipProvider delayDuration={150}>
        <div
          ref={ref}
          className={cn("inline-flex flex-col gap-2 text-xs text-grey-stronger", className)}
          role="figure"
          aria-label={legendText}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `${weekdayColumnWidth}px ${gridWidth}px`,
              gridTemplateRows: `${monthRowHeight}px ${gridHeight}px`,
              columnGap: 4,
            }}
          >
            {/* Top-left empty cell */}
            {showMonths && <div />}
            {/* Month labels row */}
            {showMonths && (
              <div className="relative" style={{ height: monthRowHeight }}>
                {monthLabels.map((m) => (
                  <span
                    key={`${m.col}-${m.label}`}
                    className="absolute capitalize"
                    style={{ left: m.col * colStep, top: 0 }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            )}
            {/* Weekday labels column */}
            {showWeekdays ? (
              <div className="relative" style={{ width: weekdayColumnWidth, height: gridHeight }}>
                {weekdayLabels.map((wl) => (
                  <span
                    key={wl.row}
                    className="absolute capitalize"
                    style={{
                      top: wl.row * colStep,
                      lineHeight: `${cellSize}px`,
                      right: 4,
                    }}
                  >
                    {wl.label}
                  </span>
                ))}
              </div>
            ) : (
              <div />
            )}
            {/* Heatmap grid */}
            <div
              role="grid"
              aria-label={legendText}
              className="flex"
              style={{ gap: cellGap, height: gridHeight }}
            >
              {grid.map((week, wi) => (
                <div
                  key={wi}
                  role="row"
                  className="flex flex-col"
                  style={{ gap: cellGap }}
                >
                  {week.map((cell) => renderCell(cell, levelFor(cell.count, effectiveLevels)))}
                </div>
              ))}
            </div>
          </div>

          {(showLegend || showScale) && (
            <div
              className="flex items-center justify-between"
              style={{ paddingLeft: weekdayColumnWidth + 4 }}
            >
              <div>
                {showLegend &&
                  (legendHref ? (
                    <a
                      href={legendHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-grey-stronger hover:text-blue-primary underline-offset-2 hover:underline"
                    >
                      {legendText}
                    </a>
                  ) : (
                    <span>{legendText}</span>
                  ))}
              </div>
              {showScale && (
                <div className="flex items-center gap-1">
                  <span>{lessText}</span>
                  {([0, 1, 2, 3, 4] as const).map((lvl) => (
                    <span
                      key={lvl}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 2,
                        backgroundColor: scale[lvl],
                        display: "inline-block",
                      }}
                    />
                  ))}
                  <span>{moreText}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }
);
