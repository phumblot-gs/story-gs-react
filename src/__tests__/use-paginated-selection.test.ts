import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { usePaginatedSelection } from "@/hooks/usePaginatedSelection";

const setup = (totalCount = 5, resetKey: unknown = "a") =>
  renderHook((props: { totalCount: number; resetKey: unknown }) => usePaginatedSelection<string>(props), {
    initialProps: { totalCount, resetKey },
  });

describe("usePaginatedSelection", () => {
  it("sélectionne des clés une à une ou par lot (mode include)", () => {
    const { result } = setup();
    act(() => result.current.toggle("a"));
    act(() => result.current.setMany(["b", "c"], true));
    expect(result.current.count).toBe(3);
    expect(result.current.isSelected("b")).toBe(true);
    act(() => result.current.setMany(["a"], false));
    expect(result.current.value).toEqual({ mode: "include", keys: ["b", "c"] });
  });

  it("« toutes les pages » sans connaître les clés, puis exclusions (mode exclude)", () => {
    const { result } = setup(100);
    act(() => result.current.selectAll());
    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.isSelected("anything")).toBe(true);
    act(() => result.current.toggle("x"));
    act(() => result.current.setMany(["y"], false));
    expect(result.current.count).toBe(98);
    expect(result.current.isSelected("x")).toBe(false);
    expect(result.current.value).toEqual({ mode: "exclude", keys: ["x", "y"] });
    act(() => result.current.setMany(["x"], true));
    expect(result.current.count).toBe(99);
  });

  it("état d'une page, sélection limitée à la page, résolution en mémoire", () => {
    const { result } = setup(5);
    act(() => result.current.selectOnly(["a", "b"]));
    expect(result.current.pageState(["a", "b", "c"])).toEqual({ selectedCount: 2, totalCount: 3 });
    act(() => result.current.selectAll());
    act(() => result.current.toggle("d"));
    expect(result.current.resolve(["a", "b", "c", "d", "e"])).toEqual(["a", "b", "c", "e"]);
    act(() => result.current.clear());
    expect(result.current.count).toBe(0);
  });

  it("vide la sélection quand la liste change (resetKey), pas quand le total change", () => {
    const { result, rerender } = setup(5, "filtre-1");
    act(() => result.current.selectAll());
    rerender({ totalCount: 6, resetKey: "filtre-1" });
    expect(result.current.count).toBe(6);
    rerender({ totalCount: 6, resetKey: "filtre-2" });
    expect(result.current.count).toBe(0);
  });

  it("compare resetKey par valeur : un objet recréé à chaque rendu ne vide pas la sélection", () => {
    let renders = 0;
    const { result, rerender } = renderHook(
      ({ status }: { status: string }) => {
        renders++;
        if (renders > 50) throw new Error("boucle de rendu");
        return usePaginatedSelection<string>({ totalCount: 5, resetKey: { status } });
      },
      { initialProps: { status: "open" } },
    );
    act(() => result.current.selectAll());
    rerender({ status: "open" });
    expect(result.current.count).toBe(5);
    rerender({ status: "closed" });
    expect(result.current.count).toBe(0);
  });

  it("toggle s'appuie sur l'état le plus récent", () => {
    const { result } = setup();
    act(() => {
      result.current.toggle("a");
      result.current.toggle("a");
      result.current.toggle("b");
    });
    expect(result.current.value).toEqual({ mode: "include", keys: ["b"] });
  });
});
