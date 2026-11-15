import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { ContactSheetReference } from "@/components/ContactSheetReference/ContactSheetReference";
import { applySelectionChange } from "@/components/ContactSheetReference/selection";
import type { ContactSheetExport, ThumbnailChange } from "@/components/ContactSheetReference/types";
import { usePaginatedSelection } from "@/hooks/usePaginatedSelection";

afterEach(() => cleanup());

type SelectionChange = Extract<ThumbnailChange, { type: "selection" }>;

const makeExports = (ids: number[], selected: number[] = []): ContactSheetExport[] => [
  {
    id: "e1",
    thumbnails: ids.map((id) => ({ picture_id: id, src: `/p${id}.jpg`, filename: `p${id}.tif`, selected: selected.includes(id) })),
  },
];

/** Une référence par entrée de `refs` ; renvoie les événements `selection` reçus. */
function renderSheets(refs: number[][], props: Partial<React.ComponentProps<typeof ContactSheetReference>> = {}, selected: number[] = []) {
  const changes: SelectionChange[] = [];
  const onThumbnailChange = vi.fn((change: ThumbnailChange) => {
    if (change.type === "selection") changes.push(change);
  });
  const view = render(
    <>
      {refs.map((ids, i) => (
        <div key={i} data-testid={`ref-${i}`}>
          <ContactSheetReference
            reference={{ reference_id: i + 1, ref: `REF${i}` }}
            exports={makeExports(ids, selected)}
            onThumbnailChange={onThumbnailChange}
            {...props}
          />
        </div>
      ))}
    </>,
  );
  const footers = () => Array.from(view.container.querySelectorAll<HTMLElement>('[data-testid="thumbnail-footer"]'));
  const footerOf = (pictureId: number) => {
    const ids = refs.flat();
    return footers()[ids.indexOf(pictureId)];
  };
  return { ...view, changes, footerOf, last: () => changes[changes.length - 1] };
}

describe("ContactSheetReference — modes de sélection", () => {
  it("clic sur le pied : sélection simple", () => {
    const { footerOf, last } = renderSheets([[1, 2, 3]]);
    fireEvent.click(footerOf(2));
    expect(last()).toMatchObject({ mode: "single", pictureId: 2, pictureIds: [2], selected: true });
  });

  it("case à cocher : bascule", () => {
    const { container, last } = renderSheets([[1, 2, 3]]);
    fireEvent.click(container.querySelectorAll('[data-testid="thumbnail-checkbox-hit-area"]')[1]);
    expect(last()).toMatchObject({ mode: "toggle", pictureId: 2, pictureIds: [2] });
  });

  it.each([
    ["Ctrl+clic", { ctrlKey: true }],
    ["Cmd+clic (Mac)", { metaKey: true }],
  ])("%s sur le pied : bascule", (_label, keys) => {
    const { footerOf, last } = renderSheets([[1, 2, 3]]);
    fireEvent.click(footerOf(3), keys);
    expect(last()).toMatchObject({ mode: "toggle", pictureId: 3, pictureIds: [3], selected: true });
  });

  it("Maj+clic : plage depuis l'ancre ; un second Maj+clic ajuste la même plage", () => {
    const { footerOf, last } = renderSheets([[1, 2, 3, 4, 5]]);
    fireEvent.click(footerOf(2));
    fireEvent.click(footerOf(5), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "range", selected: true, pictureIds: [2, 3, 4, 5], deselectPictureIds: [] });
    // L'ancre reste 2 : la plage se réduit, 4 et 5 sont à désélectionner.
    fireEvent.click(footerOf(3), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "range", pictureIds: [2, 3], deselectPictureIds: [4, 5] });
    // Vers l'autre côté de l'ancre.
    fireEvent.click(footerOf(1), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "range", pictureIds: [1, 2], deselectPictureIds: [3] });
  });

  it("Ctrl+clic déplace l'ancre de la plage", () => {
    const { footerOf, last } = renderSheets([[1, 2, 3, 4, 5]]);
    fireEvent.click(footerOf(1));
    fireEvent.click(footerOf(4), { ctrlKey: true });
    fireEvent.click(footerOf(5), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "range", pictureIds: [4, 5] });
  });

  it("Maj+clic dans une autre référence que l'ancre : sélection simple, et nouvelle ancre", () => {
    const { footerOf, last } = renderSheets([[1, 2], [11, 12, 13]]);
    fireEvent.click(footerOf(1));
    fireEvent.click(footerOf(12), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "single", pictureId: 12, pictureIds: [12] });
    fireEvent.click(footerOf(13), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "range", pictureIds: [12, 13] });
  });

  it("Maj+clic sans ancre : sélection simple", () => {
    const { footerOf, last } = renderSheets([[1, 2, 3]]);
    fireEvent.click(footerOf(3), { shiftKey: true });
    expect(last()).toMatchObject({ mode: "single", pictureIds: [3] });
  });
});

describe("ContactSheetReference — Échap", () => {
  const escape = (target: EventTarget = document.body, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true, ...init });
    act(() => {
      target.dispatchEvent(event);
    });
    return event;
  };

  it("vide la sélection : un événement « clear » par référence qui a des vues sélectionnées", () => {
    const { changes } = renderSheets([[1, 2], [11, 12], [21]], {}, [2, 11, 12]);
    const event = escape();
    expect(changes).toHaveLength(2);
    expect(changes[0]).toMatchObject({ mode: "clear", selected: false, pictureIds: [2] });
    expect(changes[1]).toMatchObject({ mode: "clear", selected: false, pictureIds: [11, 12] });
    // La touche n'est pas consommée : les autres écouteurs la reçoivent normalement.
    expect(event.defaultPrevented).toBe(false);
  });

  it("rien quand aucune vue n'est sélectionnée", () => {
    const { changes } = renderSheets([[1, 2]]);
    escape();
    expect(changes).toHaveLength(0);
  });

  it("touche déjà traitée (preventDefault : menu Radix, raccourci de l'application) : rien", () => {
    const { changes } = renderSheets([[1, 2]], {}, [1]);
    // Comme Mediagrade qui efface d'abord la surbrillance de texte.
    const consume = (e: KeyboardEvent) => e.key === "Escape" && e.preventDefault();
    document.addEventListener("keydown", consume);
    try {
      escape();
    } finally {
      document.removeEventListener("keydown", consume);
    }
    expect(changes).toHaveLength(0);
    // Échap suivant, non traité : la sélection est vidée.
    escape();
    expect(changes).toHaveLength(1);
  });

  it("rien dans un champ de saisie ni avec une touche de modification", () => {
    const { changes } = renderSheets([[1, 2]], {}, [1]);
    const input = document.createElement("input");
    document.body.appendChild(input);
    try {
      escape(input);
      escape(document.body, { shiftKey: true });
      escape(document.body, { metaKey: true });
    } finally {
      input.remove();
    }
    expect(changes).toHaveLength(0);
  });

  it("clearSelectionOnEscape={false} : rien", () => {
    const { changes } = renderSheets([[1, 2]], { clearSelectionOnEscape: false }, [1]);
    escape();
    expect(changes).toHaveLength(0);
  });

  it("sélection désactivée (thumbnailFeatures) : rien", () => {
    const { changes } = renderSheets([[1, 2]], { thumbnailFeatures: { selection: false } }, [1]);
    escape();
    expect(changes).toHaveLength(0);
  });

  it("plus d'écouteur après le démontage", () => {
    const { changes, unmount } = renderSheets([[1, 2]], {}, [1]);
    unmount();
    escape();
    expect(changes).toHaveLength(0);
  });
});

const change = (patch: Partial<SelectionChange>): SelectionChange => ({
  type: "selection",
  mode: "single",
  selected: true,
  modifiers: { shiftKey: false, ctrlKey: false, metaKey: false },
  pictureId: 1,
  exportId: "e1",
  pictureIds: [1],
  ...patch,
});

describe("applySelectionChange", () => {
  it("single : seule la vue cliquée reste, ou la sélection se vide si elle était seule", () => {
    expect([...applySelectionChange(new Set([5, 6]), change({ pictureId: 1 }))]).toEqual([1]);
    expect([...applySelectionChange(new Set([1, 6]), change({ pictureId: 1 }))]).toEqual([1]);
    expect(applySelectionChange(new Set([1]), change({ pictureId: 1 })).size).toBe(0);
  });

  it("toggle : ajoute ou retire, le reste est gardé", () => {
    expect([...applySelectionChange(new Set([5]), change({ mode: "toggle", selected: true }))]).toEqual([5, 1]);
    expect([...applySelectionChange(new Set([5, 1]), change({ mode: "toggle", selected: false }))]).toEqual([5]);
  });

  it("range : ajoute la plage, retire deselectPictureIds", () => {
    const next = applySelectionChange(new Set([9, 4, 5]), change({ mode: "range", pictureIds: [2, 3], deselectPictureIds: [4, 5] }));
    expect([...next].sort()).toEqual([2, 3, 9]);
  });

  it("clear : vide tout", () => {
    expect(applySelectionChange(new Set([1, 2, 3]), change({ mode: "clear", pictureIds: [1] })).size).toBe(0);
  });

  it("toId : identifiants de l'application, médias inconnus ignorés", () => {
    const toId = (n: number) => (n === 99 ? undefined : `img-${n}`);
    expect([...applySelectionChange(new Set(["img-5"]), change({ mode: "toggle", pictureIds: [2, 99] }), toId)]).toEqual(["img-5", "img-2"]);
    expect([...applySelectionChange(new Set(["img-5"]), change({ pictureId: 2 }), toId)]).toEqual(["img-2"]);
  });

  it("sans mode (événement d'une version précédente) : selected appliqué à pictureIds", () => {
    const legacy = { ...change({ pictureIds: [1, 2], selected: true }), mode: undefined } as unknown as SelectionChange;
    expect([...applySelectionChange(new Set([7]), legacy)]).toEqual([7, 1, 2]);
  });
});

describe("usePaginatedSelection — applyChange", () => {
  it("modes single, toggle, range et clear", () => {
    const { result } = renderHook(() => usePaginatedSelection<number>({ totalCount: 10 }));
    act(() => result.current.applyChange(change({ pictureId: 3 })));
    expect(result.current.value).toEqual({ mode: "include", keys: [3] });
    act(() => result.current.applyChange(change({ mode: "toggle", pictureIds: [5] })));
    act(() => result.current.applyChange(change({ mode: "range", pictureIds: [7, 8], deselectPictureIds: [3] })));
    expect(result.current.value.keys.sort()).toEqual([5, 7, 8]);
    act(() => result.current.applyChange(change({ pictureId: 5 })));
    expect(result.current.value.keys).toEqual([5]);
    // Seule sélectionnée : un clic simple la désélectionne.
    act(() => result.current.applyChange(change({ pictureId: 5 })));
    expect(result.current.count).toBe(0);
    act(() => result.current.applyChange(change({ mode: "toggle", pictureIds: [1, 2] })));
    act(() => result.current.applyChange(change({ mode: "clear" })));
    expect(result.current.count).toBe(0);
  });

  it("depuis « tout sélectionné » (mode exclude)", () => {
    const { result } = renderHook(() => usePaginatedSelection<number>({ totalCount: 10 }));
    act(() => result.current.selectAll());
    act(() => result.current.applyChange(change({ mode: "toggle", selected: false, pictureIds: [4] })));
    expect(result.current.count).toBe(9);
    expect(result.current.isSelected(4)).toBe(false);
    act(() => result.current.applyChange(change({ mode: "range", pictureIds: [4, 5], deselectPictureIds: [6] })));
    expect(result.current.count).toBe(9);
    expect(result.current.isSelected(6)).toBe(false);
    act(() => result.current.applyChange(change({ pictureId: 2 })));
    expect(result.current.value).toEqual({ mode: "include", keys: [2] });
  });
});
