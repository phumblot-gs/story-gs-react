"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslationSafe, TranslationMap } from "@/contexts/TranslationContext";
import { useBgContext, BgProvider } from "@/components/layout/BgContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/pagination";
import { ActionBar } from "@/components/layout/ActionBar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DataTableAlign = "left" | "center" | "right";
export type DataTableSortDirection = "asc" | "desc";

export interface DataTableSortState {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface TableColumn<T> {
  /** Stable identifier — used for sort state, not displayed. */
  id: string;
  /** Header text or custom React content. */
  header: React.ReactNode;
  /** Cell renderer — receives the row, must return a ReactNode. */
  cell: (row: T) => React.ReactNode;
  /** Enables click-to-sort on the header. Default: false. */
  sortable?: boolean;
  /**
   * How to sort. If a function, it returns the sort value for the row.
   * If a key string, the value at `row[key]` is used.
   * Falls back to `row[id]` if not provided.
   */
  sortAccessor?: ((row: T) => string | number | Date | null | undefined) | keyof T;
  /**
   * Custom compare for the sortAccessor return values.
   * Default: localeCompare for strings, numeric for numbers, time for Dates.
   */
  sortCompare?: (a: unknown, b: unknown) => number;
  /** Cell content alignment. Default: 'left'. */
  align?: DataTableAlign;
  /** Tailwind classes appended to the cell. */
  className?: string;
  /** Tailwind classes appended to the header cell. */
  headerClassName?: string;
  /**
   * When true, clicks inside this cell don't trigger the row's `onRowClick`.
   * Required for cells that contain interactive widgets (Select, Button,
   * Checkbox other than the row selector, dropdown menus...). Default: false.
   */
  interactive?: boolean;
}

export interface DataTableProps<T> {
  /** The already-filtered data to render. The DataTable never filters itself. */
  data: T[];
  /** Column definitions in display order. */
  columns: TableColumn<T>[];
  /** Stable row id used for selection state and React keys. */
  getRowId: (row: T) => string;
  /** Click on a row (anywhere except cells flagged `interactive=true`). */
  onRowClick?: (row: T) => void;
  /** Empty-state content when data.length === 0. Defaults to a localized string. */
  emptyState?: React.ReactNode;
  /** Optional className computed per row — useful for highlighting urgent / validated rows. */
  rowClassName?: (row: T, ctx: { isSelected: boolean }) => string;
  /** Additional className for the root container. */
  className?: string;
  /** Show debug logs in the console. */
  debug?: boolean;

  // === Selection ===
  /** When true, renders a checkbox column on the left and emits onSelectionChange. */
  selectable?: boolean;
  /** Controlled selection. If omitted while selectable=true, the table manages its own state. */
  selectedIds?: Set<string>;
  /** Selection change callback. Called with the new Set. */
  onSelectionChange?: (selectedIds: Set<string>) => void;
  /**
   * Slot rendered as the ActionBar children when at least one row is selected.
   * The DataTable handles wrapping in `<ActionBar selectedCount onDeselectAll />` automatically.
   */
  actionBar?: (ctx: {
    selectedRows: T[];
    selectedCount: number;
    clearSelection: () => void;
  }) => React.ReactNode;

  // === Pagination ===
  /** Default 50. Set to 0 / Infinity to disable pagination. */
  pageSize?: number;
  /**
   * Page-size choices shown in the footer's "Rows per page" Select.
   * When omitted, the page size is fixed (driven by `pageSize` only).
   */
  pageSizeOptions?: number[];
  /** Controlled current page (1-indexed). Omitted → internal state. */
  currentPage?: number;
  /** Page change callback. */
  onPageChange?: (page: number) => void;

  // === Sorting ===
  /** Initial sort. */
  defaultSort?: DataTableSortState;
  /** Controlled sort. Omitted → internal state. */
  sort?: DataTableSortState | null;
  /** Sort change callback. */
  onSortChange?: (sort: DataTableSortState | null) => void;

  // === i18n ===
  /**
   * Translation key for the noun used in the footer counter
   * (e.g. `"dataTable.item"` → "1–25 of 247 items"). Plural form (with `_plural` suffix)
   * is picked automatically based on the total count.
   */
  itemLabel?: string;
  /** Language override (e.g. "FR"). Defaults to TranslationProvider context. */
  language?: string;
  /** Custom translations to merge over the defaults. */
  translations?: Partial<TranslationMap>;
}

const DEFAULT_PAGE_SIZE = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const alignToClass: Record<DataTableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const getSortValue = <T,>(row: T, column: TableColumn<T>): unknown => {
  if (typeof column.sortAccessor === "function") {
    return column.sortAccessor(row);
  }
  const key = (column.sortAccessor ?? column.id) as keyof T;
  return row[key];
};

const defaultCompare = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
};

const sortData = <T,>(
  data: T[],
  columns: TableColumn<T>[],
  sort: DataTableSortState | null,
): T[] => {
  if (!sort) return data;
  const column = columns.find((c) => c.id === sort.columnId);
  if (!column) return data;
  const compare = column.sortCompare ?? defaultCompare;
  const direction = sort.direction === "asc" ? 1 : -1;
  // Decorate-sort-undecorate to keep `sort` stable on equal keys (Array.prototype.sort
  // is stable since ES2019, but adding the original index makes the intent explicit).
  return data
    .map((row, index) => ({ row, index, value: getSortValue(row, column) }))
    .sort((a, b) => {
      const cmp = compare(a.value, b.value);
      if (cmp !== 0) return cmp * direction;
      return a.index - b.index;
    })
    .map((entry) => entry.row);
};

const formatCounter = (start: number, end: number, total: number, label: string): string =>
  `${start.toLocaleString()}–${end.toLocaleString()} / ${total.toLocaleString()} ${label}`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DataTableInner<T>(props: DataTableProps<T>): React.ReactElement {
  const {
    data,
    columns,
    getRowId,
    onRowClick,
    emptyState,
    rowClassName,
    className,
    debug = false,
    selectable = false,
    selectedIds: controlledSelectedIds,
    onSelectionChange,
    actionBar,
    pageSize: pageSizeProp,
    pageSizeOptions,
    currentPage: controlledPage,
    onPageChange,
    defaultSort,
    sort: controlledSort,
    onSortChange,
    itemLabel = "dataTable.item",
    language,
    translations,
  } = props;

  const { t } = useTranslationSafe(translations, language);
  const bg = useBgContext();

  // ---- Sort state (controlled / uncontrolled)
  const [internalSort, setInternalSort] = React.useState<DataTableSortState | null>(
    defaultSort ?? null,
  );
  const sort = controlledSort !== undefined ? controlledSort : internalSort;
  const setSort = React.useCallback(
    (next: DataTableSortState | null) => {
      if (controlledSort === undefined) setInternalSort(next);
      onSortChange?.(next);
    },
    [controlledSort, onSortChange],
  );

  const handleHeaderSortClick = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    if (sort?.columnId === column.id) {
      setSort({ columnId: column.id, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      setSort({ columnId: column.id, direction: "asc" });
    }
  };

  // ---- Page size state (driven by select if pageSizeOptions provided)
  const initialPageSize = React.useMemo(() => {
    if (pageSizeProp !== undefined) return pageSizeProp;
    return DEFAULT_PAGE_SIZE;
  }, [pageSizeProp]);

  const [internalPageSize, setInternalPageSize] = React.useState<number>(initialPageSize);
  // When the prop changes, follow it.
  React.useEffect(() => {
    setInternalPageSize(initialPageSize);
  }, [initialPageSize]);

  const effectivePageSize = internalPageSize <= 0 || !Number.isFinite(internalPageSize)
    ? data.length || 1
    : internalPageSize;
  const paginationEnabled = internalPageSize > 0 && Number.isFinite(internalPageSize);

  // ---- Sorted view
  const sortedData = React.useMemo(
    () => sortData(data, columns, sort),
    [data, columns, sort],
  );

  // ---- Page state (controlled / uncontrolled)
  const [internalPage, setInternalPage] = React.useState<number>(1);
  const totalPages = paginationEnabled
    ? Math.max(1, Math.ceil(sortedData.length / effectivePageSize))
    : 1;
  const rawCurrentPage = controlledPage !== undefined ? controlledPage : internalPage;
  const currentPage = Math.min(Math.max(rawCurrentPage, 1), totalPages);

  React.useEffect(() => {
    // Auto-clamp uncontrolled page when data shrinks below its index.
    if (controlledPage === undefined && internalPage > totalPages) {
      setInternalPage(totalPages);
    }
  }, [controlledPage, internalPage, totalPages]);

  const setPage = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 1), totalPages);
      if (controlledPage === undefined) setInternalPage(clamped);
      onPageChange?.(clamped);
    },
    [controlledPage, onPageChange, totalPages],
  );

  const pageStart = paginationEnabled ? (currentPage - 1) * effectivePageSize : 0;
  const pageEnd = paginationEnabled
    ? Math.min(pageStart + effectivePageSize, sortedData.length)
    : sortedData.length;
  const pageData = sortedData.slice(pageStart, pageEnd);

  // ---- Selection state (controlled / uncontrolled)
  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(new Set());
  const selectedIds =
    controlledSelectedIds !== undefined ? controlledSelectedIds : internalSelected;
  const setSelected = React.useCallback(
    (next: Set<string>) => {
      if (controlledSelectedIds === undefined) setInternalSelected(next);
      onSelectionChange?.(next);
    },
    [controlledSelectedIds, onSelectionChange],
  );

  // Selected rows visible in current data (auto-pruned for display & action targets;
  // never mutates the underlying selectedIds Set).
  const selectedRowsAll = React.useMemo(
    () => data.filter((r) => selectedIds.has(getRowId(r))),
    [data, getRowId, selectedIds],
  );
  const selectedCountVisible = selectedRowsAll.length;

  const pageRowIds = React.useMemo(() => pageData.map(getRowId), [pageData, getRowId]);
  const pageSelectedCount = pageRowIds.reduce(
    (acc, id) => (selectedIds.has(id) ? acc + 1 : acc),
    0,
  );
  const headerCheckboxState: boolean | "indeterminate" =
    pageRowIds.length === 0 || pageSelectedCount === 0
      ? false
      : pageSelectedCount === pageRowIds.length
      ? true
      : "indeterminate";

  const togglePage = (select: boolean) => {
    const next = new Set(selectedIds);
    if (select) pageRowIds.forEach((id) => next.add(id));
    else pageRowIds.forEach((id) => next.delete(id));
    setSelected(next);
  };

  const toggleAllPages = () => {
    const next = new Set(selectedIds);
    sortedData.forEach((row) => next.add(getRowId(row)));
    setSelected(next);
  };

  const clearSelection = () => setSelected(new Set());

  // ---- Shift-click range selection (anchor + snapshot model)
  // - Click without shift → toggle the row, set it as the anchor, snapshot the
  //   resulting selection.
  // - Click with shift while an anchor exists on the current page → recompute
  //   selection = `selectionAtAnchor` with all rows in the [anchor, target]
  //   range (current-page order) set to the anchor's state. Range narrowing
  //   automatically deselects rows that were extended by a previous shift-click
  //   but no longer fall in the new range.
  // - Anchor is reset when the page changes (option A: range never crosses page
  //   boundaries; users only act on what they see).
  const [anchorId, setAnchorId] = React.useState<string | null>(null);
  const [selectionAtAnchor, setSelectionAtAnchor] = React.useState<Set<string>>(
    () => new Set(),
  );
  const shiftKeyRef = React.useRef(false);

  React.useEffect(() => {
    setAnchorId(null);
  }, [currentPage]);

  const handleRowCheckboxClick = (id: string) => {
    const wantShift = shiftKeyRef.current;
    shiftKeyRef.current = false;

    if (wantShift && anchorId !== null) {
      const anchorIdx = pageRowIds.indexOf(anchorId);
      const targetIdx = pageRowIds.indexOf(id);
      if (anchorIdx !== -1 && targetIdx !== -1) {
        const [start, end] =
          anchorIdx <= targetIdx ? [anchorIdx, targetIdx] : [targetIdx, anchorIdx];
        const rangeIds = pageRowIds.slice(start, end + 1);
        const anchorWasSelected = selectionAtAnchor.has(anchorId);
        const next = new Set(selectionAtAnchor);
        rangeIds.forEach((rid) => {
          if (anchorWasSelected) next.add(rid);
          else next.delete(rid);
        });
        setSelected(next);
        // Don't update the anchor — keep it for further shift-clicks so the
        // user can re-extend or re-narrow from the same starting point.
        return;
      }
      // Anchor not on the current page → fall through to regular toggle.
    }

    // Regular path: toggle, then update anchor and snapshot.
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    setAnchorId(id);
    setSelectionAtAnchor(next);
  };

  if (debug) {
    console.log("DataTable", {
      bg,
      total: data.length,
      sortedTotal: sortedData.length,
      page: currentPage,
      totalPages,
      pageSize: effectivePageSize,
      sort,
      selected: selectedIds.size,
      selectedVisible: selectedCountVisible,
    });
  }

  // ---- Header / sort indicator
  const renderSortIcon = (col: TableColumn<T>) => {
    if (!col.sortable) return null;
    const active = sort?.columnId === col.id;
    if (!active) {
      return <Icon name="ArrowDown" size={10} className="ml-1 inline-block opacity-30" />;
    }
    return (
      <Icon
        name={sort.direction === "asc" ? "ArrowUp" : "ArrowDown"}
        size={10}
        className="ml-1 inline-block"
      />
    );
  };

  // ---- Selection column
  const selectionHeader = selectable ? (
    <TableHead
      scope="col"
      className="w-[56px] px-2"
    >
      <div className="flex items-center gap-1">
        <Checkbox
          checked={headerCheckboxState}
          onCheckedChange={(next) => togglePage(next === true)}
          aria-label={t("dataTable.selectPage")}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center w-4 h-4 text-grey-strongest hover:text-black"
              aria-label={t("dataTable.selectionMenu")}
            >
              <Icon name="ArrowDown" size={8} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => togglePage(true)}>
              {t("dataTable.selectPage")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={toggleAllPages}>
              {t("dataTable.selectAllPages")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={clearSelection}
              disabled={selectedIds.size === 0}
            >
              {t("dataTable.clearSelection")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableHead>
  ) : null;

  // ---- Table head
  const headRow = (
    <TableRow>
      {selectionHeader}
      {columns.map((col) => {
        const align = col.align ?? "left";
        const isSorted = sort?.columnId === col.id;
        return (
          <TableHead
            key={col.id}
            scope="col"
            aria-sort={
              isSorted
                ? sort.direction === "asc"
                  ? "ascending"
                  : "descending"
                : col.sortable
                ? "none"
                : undefined
            }
            className={cn(
              "text-xs font-semibold uppercase tracking-wider text-grey-strongest",
              alignToClass[align],
              col.headerClassName,
            )}
          >
            {col.sortable ? (
              <button
                type="button"
                onClick={() => handleHeaderSortClick(col)}
                className={cn(
                  // Browsers reset `text-transform` on <button>, so we re-apply it
                  // here even though the parent <th> already has `uppercase`.
                  "inline-flex items-center gap-1 cursor-pointer uppercase tracking-wider hover:text-black transition-colors",
                  align === "right" && "ml-auto",
                  align === "center" && "mx-auto",
                )}
              >
                <span>{col.header}</span>
                {renderSortIcon(col)}
              </button>
            ) : (
              col.header
            )}
          </TableHead>
        );
      })}
    </TableRow>
  );

  // ---- Body rows
  const totalCols = columns.length + (selectable ? 1 : 0);
  const isClickable = Boolean(onRowClick);

  const renderEmptyRow = () => (
    <TableRow>
      <TableCell colSpan={totalCols} className="text-center py-8 text-grey-strongest">
        {emptyState ?? t("dataTable.empty")}
      </TableCell>
    </TableRow>
  );

  const renderRow = (row: T) => {
    const id = getRowId(row);
    const isSelected = selectedIds.has(id);
    const extraRowClass = rowClassName?.(row, { isSelected }) ?? "";
    return (
      <TableRow
        key={id}
        data-selected={isSelected || undefined}
        className={cn(
          // Stronger hover than the primitive's default `hover:bg-muted/50`.
          // Always applied, regardless of `onRowClick`.
          "hover:bg-grey-light transition-colors",
          isClickable && "cursor-pointer",
          extraRowClass,
        )}
        onClick={isClickable ? () => onRowClick?.(row) : undefined}
      >
        {selectable && (
          <TableCell
            className="w-[56px] px-2 py-2.5"
            onClick={(e) => e.stopPropagation()}
            // mousedown fires before click → onCheckedChange, so we capture the
            // shift modifier here and read it from the ref in the handler. We
            // intentionally only wire shift-click for mouse interactions; the
            // Space-key path keeps regular toggle semantics.
            onMouseDown={(e) => {
              shiftKeyRef.current = e.shiftKey;
            }}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleRowCheckboxClick(id)}
              aria-label={t("dataTable.selectRow")}
            />
          </TableCell>
        )}
        {columns.map((col) => {
          const align = col.align ?? "left";
          const stopProp = col.interactive
            ? (e: React.MouseEvent) => e.stopPropagation()
            : undefined;
          return (
            <TableCell
              key={col.id}
              // Body cell padding: 10px vertical (the user's request) +
              // 16px horizontal (kept matching the primitive's `px-4` so columns
              // align with the header).
              className={cn("py-2.5 px-4", alignToClass[align], col.className)}
              onClick={stopProp}
            >
              {col.cell(row)}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  // ---- Footer (counter + pagination + page size)
  const labelKey = selectedCountVisible > 1 ? `${itemLabel}_plural` : itemLabel;
  const pluralKey =
    sortedData.length === 1 ? itemLabel : `${itemLabel}_plural`;
  const counterText = paginationEnabled && sortedData.length > 0
    ? formatCounter(pageStart + 1, pageEnd, sortedData.length, t(pluralKey))
    : sortedData.length > 0
    ? `${sortedData.length.toLocaleString()} ${t(pluralKey)}`
    : "";

  // unused but kept to satisfy strict no-unused: returning labelKey to keep hook order trivial
  void labelKey;

  const showFooter =
    sortedData.length > 0 &&
    (paginationEnabled && (totalPages > 1 || pageSizeOptions !== undefined));

  // ---- ActionBar
  const showActionBar =
    selectable && actionBar !== undefined && selectedCountVisible > 0;

  // ---- Surface adaptation
  // The DataTable creates its own "white card" surface when sitting on a grey
  // or black parent — header, rows and footer share one continuous bg, only
  // the area outside the component keeps the parent context's color.
  const wrapperSurface =
    bg === "grey"
      ? "bg-white"
      : bg === "black"
      ? "bg-black-secondary"
      : "";
  // Children inside the card now perceive a different bg context than the parent.
  const innerBg: "white" | "grey" | "black" =
    bg === "grey" ? "white" : bg === "black" ? "black" : "white";

  // Header background:
  // - on white parent → subtle grey-lighter to separate from the row body
  // - on grey parent → white (the surrounding white card already separates the
  //   table from the grey outside; a coloured header would add noise)
  // - on black parent → solid black (matches the dark card surface)
  const headerSurface =
    bg === "grey" ? "bg-white" : bg === "black" ? "bg-black" : "bg-grey-lighter";

  return (
    <BgProvider value={innerBg}>
      <div
        className={cn(
          "w-full overflow-hidden",
          wrapperSurface && "rounded-md",
          wrapperSurface,
          className,
        )}
      >
      <Table>
        <TableHeader className={headerSurface}>{headRow}</TableHeader>
        <TableBody>
          {pageData.length === 0 ? renderEmptyRow() : pageData.map(renderRow)}
        </TableBody>
      </Table>

      {showFooter && (
        // 3-column grid: counter | pagination (auto width) | rows per page.
        // Side columns share the remaining space equally (1fr / 1fr), which
        // guarantees the pagination stays exactly centered in the footer
        // regardless of the counter or "Rows per page" widths.
        // `whitespace-nowrap` everywhere so labels never wrap mid-word.
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 px-4 text-sm text-grey-strongest border-t border-grey-light">
          <span className="whitespace-nowrap justify-self-start">{counterText}</span>
          <div className="flex justify-center">
            {totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                size="small"
              />
            ) : null}
          </div>
          {pageSizeOptions !== undefined ? (
            <div className="flex items-center gap-2 justify-self-end whitespace-nowrap">
              <span>{t("dataTable.rowsPerPage")}</span>
              <Select
                size="small"
                value={String(internalPageSize)}
                onValueChange={(v) => {
                  const next = Number(v);
                  setInternalPageSize(next);
                  // Reset to page 1 to avoid landing on an empty page.
                  if (controlledPage === undefined) setInternalPage(1);
                  onPageChange?.(1);
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span />
          )}
        </div>
      )}

      {showActionBar && (
        <ActionBar
          selectedCount={selectedCountVisible}
          onDeselectAll={clearSelection}
        >
          {actionBar?.({
            selectedRows: selectedRowsAll,
            selectedCount: selectedCountVisible,
            clearSelection,
          })}
        </ActionBar>
      )}
      </div>
    </BgProvider>
  );
}

// React.forwardRef can't preserve generics, so we type-assert to keep `<T>` callable.
export const DataTable = DataTableInner as <T>(props: DataTableProps<T>) => React.ReactElement;
