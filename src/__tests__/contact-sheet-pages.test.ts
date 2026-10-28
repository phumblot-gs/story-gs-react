import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { useContactSheetPages, type ContactSheetPage, type ContactSheetPageRequest } from "@/hooks/useContactSheetPages";

afterEach(cleanup);
const data = (id: number): ContactSheetPage => ({ totalCount: 1000, exports: [{ id: "site", thumbnails: [{ picture_id: id, src: `/p${id}.jpg` }] }] });

describe("useContactSheetPages", () => {
  it("garde seulement les pages récentes, recharge une page évincée, invalide après mutation", async () => {
    const loadPage = vi.fn(async ({ page }: ContactSheetPageRequest) => data(page));
    const { result, rerender } = renderHook(({ page }) => useContactSheetPages({ page, maxCachedPages: 2, loadPage }), { initialProps: { page: 1 } });
    const ready = (id: number) => waitFor(() => expect(result.current.exports[0]?.thumbnails[0].picture_id).toBe(id));
    await ready(1);
    rerender({ page: 2 }); await ready(2);
    rerender({ page: 1 }); await ready(1); expect(loadPage).toHaveBeenCalledTimes(2);
    rerender({ page: 3 }); await ready(3);
    rerender({ page: 2 }); await ready(2); expect(loadPage).toHaveBeenCalledTimes(4);
    act(() => result.current.reload()); await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(5)); await ready(2);
  });

  it("annule les demandes obsolètes, ignore leurs réponses et vide le cache sur changement de filtres", async () => {
    const requests: { page: number; signal: AbortSignal; resolve: (value: ContactSheetPage) => void }[] = [];
    const loadPage = vi.fn(({ page, signal }: ContactSheetPageRequest) => new Promise<ContactSheetPage>((resolve) => requests.push({ page, signal, resolve })));
    const { result, rerender, unmount } = renderHook(({ page, cacheKey }) => useContactSheetPages({ page, cacheKey, loadPage }), { initialProps: { page: 1, cacheKey: "a" } });
    await waitFor(() => expect(requests).toHaveLength(1));
    rerender({ page: 2, cacheKey: "a" }); await waitFor(() => expect(requests).toHaveLength(2));
    expect(requests[0].signal.aborted).toBe(true);
    await act(async () => { requests[1].resolve(data(2)); requests[0].resolve(data(1)); });
    expect(result.current.exports[0].thumbnails[0].picture_id).toBe(2);
    rerender({ page: 2, cacheKey: "b" });
    expect(result.current.exports).toEqual([]);
    await waitFor(() => expect(requests).toHaveLength(3));
    unmount(); expect(requests[2].signal.aborted).toBe(true);
  });

  it("refuse une réponse qui dépasse le budget de données de la page", async () => {
    const loadPage = vi.fn(async () => ({ totalCount: 10, exports: [{ id: 1, thumbnails: [{ picture_id: 1 }, { picture_id: 2 }] }] }));
    const { result } = renderHook(() => useContactSheetPages({ page: 1, pageSize: 1, loadPage }));
    await waitFor(() => expect(result.current.error).toBeInstanceOf(RangeError));
    expect(result.current.exports).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
