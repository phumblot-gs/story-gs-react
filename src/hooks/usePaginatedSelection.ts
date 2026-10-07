import * as React from "react";

/**
 * Selection of a paginated list, independent of the items: only their keys
 * (ids, paths…) are stored.
 *
 * - `include`: only the listed keys are selected;
 * - `exclude`: everything is selected except the listed keys ("all pages",
 *   without knowing every key — the server-side pagination case).
 */
export interface PaginatedSelectionValue<K> {
  mode: "include" | "exclude";
  keys: K[];
}

export interface UsePaginatedSelectionOptions {
  /** Number of items across all pages (after filters). */
  totalCount: number;
  /**
   * Any value describing the list (filters, search…). When it changes the
   * selection is cleared: "all except x" must never silently apply to another
   * set of items.
   */
  resetKey?: unknown;
}

export interface PaginatedSelection<K> {
  /** Serializable state, to send to an API (`{ mode, keys }`). */
  value: PaginatedSelectionValue<K>;
  /** Number of selected items. */
  count: number;
  totalCount: number;
  /** Every item is selected. */
  isAllSelected: boolean;
  isSelected: (key: K) => boolean;
  /** Selects or deselects one item. */
  toggle: (key: K) => void;
  /** Selects or deselects several items (a page, a Shift+click range…). */
  setMany: (keys: K[], selected: boolean) => void;
  /** Selects only these items (e.g. "current page"). */
  selectOnly: (keys: K[]) => void;
  /** Selects every item of every page. */
  selectAll: () => void;
  /** Deselects everything. */
  clear: () => void;
  /** Selection state of a page, for `CheckAll` / `CheckAllPages`. */
  pageState: (pageKeys: K[]) => { selectedCount: number; totalCount: number };
  /** Selected keys among `allKeys` — when every key is in memory. */
  resolve: (allKeys: K[]) => K[];
}

interface State<K> {
  mode: "include" | "exclude";
  keys: Set<K>;
}

const EMPTY = <K,>(): State<K> => ({ mode: "include", keys: new Set<K>() });

/**
 * Selection state for a paginated list, whatever its items and its pagination
 * (client or server side). Pairs with `CheckAll` (current page) and
 * `CheckAllPages` (scope menu), but works with any UI.
 *
 * @example
 * ```tsx
 * const selection = usePaginatedSelection<string>({ totalCount: total, resetKey: filters });
 * const pageKeys = pageItems.map((item) => item.id);
 *
 * <CheckAll {...selection.pageState(pageKeys)} onCheckedChange={(on) => selection.setMany(pageKeys, on)} />
 * <CheckAllPages
 *   selectedCount={selection.count}
 *   pageCount={pageKeys.length}
 *   pageSelectedCount={selection.pageState(pageKeys).selectedCount}
 *   totalCount={selection.totalCount}
 *   onSelectPage={() => selection.selectOnly(pageKeys)}
 *   onSelectAll={selection.selectAll}
 *   onDeselectAll={selection.clear}
 * />
 *
 * // Server side: send the description, the API applies it to its filter.
 * await api.bulkAction({ filters, selection: selection.value });
 * ```
 */
export function usePaginatedSelection<K = string>({
  totalCount,
  resetKey,
}: UsePaginatedSelectionOptions): PaginatedSelection<K> {
  const [state, setState] = React.useState<State<K>>(() => EMPTY<K>());

  // A different list (filters…) starts from an empty selection.
  const lastResetKey = React.useRef(resetKey);
  React.useEffect(() => {
    if (Object.is(lastResetKey.current, resetKey)) return;
    lastResetKey.current = resetKey;
    setState(EMPTY());
  }, [resetKey]);

  const isSelected = React.useCallback(
    (key: K) => (state.mode === "include" ? state.keys.has(key) : !state.keys.has(key)),
    [state],
  );

  const setMany = React.useCallback((keys: K[], selected: boolean) => {
    setState((current) => {
      const next = new Set(current.keys);
      // include: the set holds selected keys; exclude: it holds deselected ones.
      const addToSet = current.mode === "include" ? selected : !selected;
      for (const key of keys) {
        if (addToSet) next.add(key);
        else next.delete(key);
      }
      return { mode: current.mode, keys: next };
    });
  }, []);

  const toggle = React.useCallback(
    (key: K) => setMany([key], !isSelected(key)),
    [isSelected, setMany],
  );
  const selectOnly = React.useCallback((keys: K[]) => setState({ mode: "include", keys: new Set(keys) }), []);
  const selectAll = React.useCallback(() => setState({ mode: "exclude", keys: new Set<K>() }), []);
  const clear = React.useCallback(() => setState(EMPTY()), []);

  const count =
    state.mode === "include" ? state.keys.size : Math.max(0, totalCount - state.keys.size);

  const pageState = React.useCallback(
    (pageKeys: K[]) => ({
      selectedCount: pageKeys.filter(isSelected).length,
      totalCount: pageKeys.length,
    }),
    [isSelected],
  );

  const resolve = React.useCallback((allKeys: K[]) => allKeys.filter(isSelected), [isSelected]);

  const value = React.useMemo<PaginatedSelectionValue<K>>(
    () => ({ mode: state.mode, keys: [...state.keys] }),
    [state],
  );

  return {
    value,
    count,
    totalCount,
    isAllSelected: totalCount > 0 && count === totalCount,
    isSelected,
    toggle,
    setMany,
    selectOnly,
    selectAll,
    clear,
    pageState,
    resolve,
  };
}
