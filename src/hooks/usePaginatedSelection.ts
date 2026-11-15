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
   * set of items. Compared by value (objects through their JSON form), so an
   * object rebuilt on every render with the same content does not reset it.
   */
  resetKey?: unknown;
}

/**
 * Selection change of a contact sheet (`ThumbnailChange` of type `"selection"`), or any
 * change with the same shape. See `applySelectionChange` for the meaning of `mode`.
 */
export interface SelectionChangeLike {
  mode?: "single" | "toggle" | "range" | "clear";
  selected: boolean;
  pictureId: number;
  pictureIds: number[];
  deselectPictureIds?: number[];
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
  /**
   * Applies a contact sheet selection change: `single` keeps only the clicked item (or
   * empties the selection if it was the only one), `toggle` adds or removes it, `range`
   * adds the range and removes `deselectPictureIds`, `clear` empties everything.
   * `toKey` maps a `picture_id` to a key (default: the id itself); `undefined` ignores it.
   *
   * ```tsx
   * onThumbnailChange={(change) => change.type === "selection" && selection.applyChange(change)}
   * ```
   */
  applyChange: (change: SelectionChangeLike, toKey?: (pictureId: number) => K | undefined) => void;
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
 * Valeur comparable de `resetKey` : un objet est comparé par son contenu (forme
 * JSON) et non par sa référence. Sinon un objet recréé à chaque rendu
 * (`resetKey: { status, search }`) viderait la sélection à chaque rendu — et,
 * le vidage provoquant un nouveau rendu, bouclerait sans fin.
 */
function resetSignature(resetKey: unknown): unknown {
  if (resetKey === null || typeof resetKey !== "object") return resetKey;
  try {
    return JSON.stringify(resetKey);
  } catch {
    return resetKey; // structure circulaire : repli sur la référence
  }
}

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
  const signature = resetSignature(resetKey);
  const lastSignature = React.useRef(signature);
  React.useEffect(() => {
    if (Object.is(lastSignature.current, signature)) return;
    lastSignature.current = signature;
    setState(EMPTY());
  }, [signature]);

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

  // Calculé sur l'état le plus récent (mise à jour fonctionnelle) : deux
  // bascules dans le même lot ne lisent pas un état périmé.
  const toggle = React.useCallback((key: K) => {
    setState((current) => {
      const next = new Set(current.keys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { mode: current.mode, keys: next };
    });
  }, []);
  const selectOnly = React.useCallback((keys: K[]) => setState({ mode: "include", keys: new Set(keys) }), []);
  const selectAll = React.useCallback(() => setState({ mode: "exclude", keys: new Set<K>() }), []);
  const clear = React.useCallback(() => setState(EMPTY()), []);

  const totalCountRef = React.useRef(totalCount);
  totalCountRef.current = totalCount;
  const applyChange = React.useCallback(
    (change: SelectionChangeLike, toKey: (pictureId: number) => K | undefined = (id) => id as unknown as K) => {
      const keys = (ids: readonly number[] = []) => ids.map(toKey).filter((k): k is K => k !== undefined);
      setState((current) => {
        const isOn = (key: K) => (current.mode === "include" ? current.keys.has(key) : !current.keys.has(key));
        const setOn = (next: Set<K>, key: K, on: boolean) => {
          // include: the set holds selected keys; exclude: it holds deselected ones.
          if ((current.mode === "include") === on) next.add(key);
          else next.delete(key);
        };
        switch (change.mode) {
          case "clear":
            return EMPTY<K>();
          case "single": {
            const key = toKey(change.pictureId);
            if (key === undefined) return current;
            const count =
              current.mode === "include" ? current.keys.size : totalCountRef.current - current.keys.size;
            return count === 1 && isOn(key) ? EMPTY<K>() : { mode: "include", keys: new Set([key]) };
          }
          case "range": {
            const next = new Set(current.keys);
            keys(change.deselectPictureIds).forEach((key) => setOn(next, key, false));
            keys(change.pictureIds).forEach((key) => setOn(next, key, true));
            return { mode: current.mode, keys: next };
          }
          default: {
            const next = new Set(current.keys);
            keys(change.pictureIds).forEach((key) => setOn(next, key, change.selected));
            return { mode: current.mode, keys: next };
          }
        }
      });
    },
    [],
  );

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
    applyChange,
    pageState,
    resolve,
  };
}
