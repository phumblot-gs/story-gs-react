import * as React from "react";
import type { ContactSheetExport } from "@/components/ContactSheetReference/types";

export interface ContactSheetPage {
  exports: ContactSheetExport[];
  totalCount: number;
}
export interface ContactSheetPageRequest {
  /** 1-indexed page number. */
  page: number;
  pageSize: number;
  signal: AbortSignal;
}
export interface UseContactSheetPagesOptions {
  page: number;
  /** Maximum slots returned per page (all exports combined). Default 60. */
  pageSize?: number;
  /** LRU page cache, including the current page. Default 3. */
  maxCachedPages?: number;
  /** Stable function; must honor signal and return at most pageSize slots. */
  loadPage: (request: ContactSheetPageRequest) => Promise<ContactSheetPage>;
  /** Change when filters, sorting or the dataset change. Also reset page to 1. */
  cacheKey?: string;
}

const positive = (value: number, fallback: number) => Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback;

/** Bounded server data for either contact sheet. Selection belongs to the parent.
 * Obsolete requests are aborted and late responses ignored. reload invalidates
 * every cached page after a mutation. No global cache survives unmounting.
 */
export function useContactSheetPages({ page, pageSize = 60, maxCachedPages = 3, loadPage, cacheKey = "" }: UseContactSheetPagesOptions) {
  const size = positive(pageSize, 60);
  const capacity = positive(maxCachedPages, 3);
  const currentPage = positive(page, 1);
  const cache = React.useRef(new Map<number, ContactSheetPage>());
  const activeRequest = React.useRef<AbortController | null>(null);
  const identity = React.useRef({ loadPage, cacheKey, size });
  const [generation, invalidate] = React.useReducer((n: number) => n + 1, 0);
  const [state, setState] = React.useState<{
    page: number; key: string; load: typeof loadPage; size: number; generation: number;
    data: ContactSheetPage; loading: boolean; error: Error | null;
  }>(() => ({ page: currentPage, key: cacheKey, load: loadPage, size, generation,
    data: { exports: [], totalCount: 0 }, loading: true, error: null }));

  React.useEffect(() => {
    const previous = identity.current;
    if (previous.loadPage !== loadPage || previous.cacheKey !== cacheKey || previous.size !== size) cache.current.clear();
    identity.current = { loadPage, cacheKey, size };
    const trim = () => {
      while (cache.current.size > capacity) cache.current.delete(cache.current.keys().next().value!);
    };
    const controller = new AbortController();
    activeRequest.current = controller;
    const base = { page: currentPage, key: cacheKey, load: loadPage, size, generation };
    const cached = cache.current.get(currentPage);
    if (cached) {
      cache.current.delete(currentPage); cache.current.set(currentPage, cached); trim();
      setState({ ...base, data: cached, loading: false, error: null });
    } else {
      trim();
      setState((old) => ({ ...base, data: { exports: [], totalCount: old.key === cacheKey ? old.data.totalCount : 0 }, loading: true, error: null }));
      void Promise.resolve().then(() => {
        if (controller.signal.aborted) return;
        return loadPage({ page: currentPage, pageSize: size, signal: controller.signal });
      }).then((data) => {
        if (!data || controller.signal.aborted) return;
        if (data.exports.reduce((count, group) => count + group.thumbnails.length, 0) > size) {
          throw new RangeError("loadPage returned more slots than pageSize");
        }
        cache.current.set(currentPage, data); trim();
        setState({ ...base, data, loading: false, error: null });
      }).catch((cause) => {
        if (!controller.signal.aborted) setState({ ...base, data: { exports: [], totalCount: 0 }, loading: false,
          error: cause instanceof Error ? cause : new Error(String(cause)) });
      });
    }
    return () => {
      controller.abort();
      if (activeRequest.current === controller) activeRequest.current = null;
    };
  }, [currentPage, size, capacity, loadPage, cacheKey, generation]);

  React.useEffect(() => () => cache.current.clear(), []);
  const reload = React.useCallback(() => { activeRequest.current?.abort(); cache.current.clear(); invalidate(); }, []);
  const current = state.page === currentPage && state.key === cacheKey && state.load === loadPage && state.size === size && state.generation === generation;
  return {
    exports: current ? state.data.exports : [],
    totalCount: state.key === cacheKey ? state.data.totalCount : 0,
    loading: !current || state.loading,
    error: current ? state.error : null,
    reload,
  };
}
