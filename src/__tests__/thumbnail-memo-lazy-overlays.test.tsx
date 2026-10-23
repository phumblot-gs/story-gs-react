import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import {
  ContactSheetReference,
  type ContactSheetExport,
  type ThumbnailChange,
} from "@/components/ContactSheetReference";
import { Thumbnail, type ThumbnailStatusButton } from "@/components/Thumbnail";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * Rendus des vignettes comptés via le nom de fichier : MiddleTruncatedText
 * (troncature de la grille) n'est rendu que lorsque sa vignette l'est.
 */
const renders = vi.hoisted(() => ({} as Record<string, number>));
vi.mock("@/components/ui/middle-truncated-text", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/components/ui/middle-truncated-text")>();
  return {
    ...original,
    MiddleTruncatedText: (props: Parameters<typeof original.MiddleTruncatedText>[0]) => {
      renders[props.text] = (renders[props.text] ?? 0) + 1;
      return original.MiddleTruncatedText(props);
    },
  };
});

const resetRenders = () => Object.keys(renders).forEach((key) => delete renders[key]);

afterEach(() => {
  cleanup();
  resetRenders();
});

const validate: ThumbnailStatusButton = { key: "validate", icon: "Check", status: MediaStatus.VALIDATED, label: "Validate" };

const makeExports = (selected: number[], active: number[] = []): ContactSheetExport[] => [
  {
    id: "e1",
    thumbnails: [1, 2, 3].map((id) => ({
      picture_id: id,
      src: `/p${id}.jpg`,
      filename: `f${id}.tif`,
      selected: selected.includes(id),
      statusButtons: [{ ...validate, isActive: active.includes(id) }],
    })),
  },
];

describe("Thumbnail mémoïsé dans la grille", () => {
  it("sélectionner une vignette ne redessine pas ses voisines", () => {
    const Harness = () => {
      const [selected, setSelected] = useState<number[]>([]);
      // Données reconstruites à chaque rendu, comme dans une application.
      const onThumbnailChange = (change: ThumbnailChange) => {
        if (change.type === "selection") setSelected((s) => (change.selected ? [...s, ...change.pictureIds] : s));
      };
      return (
        <ContactSheetReference
          reference={{ reference_id: 1, ref: "REF" }}
          exports={makeExports(selected)}
          onThumbnailChange={onThumbnailChange}
        />
      );
    };
    const { container } = render(<Harness />);
    resetRenders();

    const hitArea = container.querySelector('[data-picture-id="1"] [data-testid="thumbnail-checkbox-hit-area"]')!;
    fireEvent.click(hitArea);

    expect(container.querySelector('[data-picture-id="1"] .thumbnail-checkbox')).toHaveAttribute("data-state", "checked");
    expect(renders["f1.tif"]).toBeGreaterThan(0);
    expect(renders["f2.tif"]).toBeUndefined();
    expect(renders["f3.tif"]).toBeUndefined();
  });

  it("un changement de boutons de statut redessine la vignette concernée, et elle seule", () => {
    const props = { reference: { reference_id: 1, ref: "REF" }, onThumbnailChange: () => {} };
    const { rerender } = render(<ContactSheetReference {...props} exports={makeExports([])} />);
    resetRenders();
    rerender(<ContactSheetReference {...props} exports={makeExports([], [2])} />);
    expect(renders["f2.tif"]).toBeGreaterThan(0);
    expect(renders["f1.tif"]).toBeUndefined();
    expect(renders["f3.tif"]).toBeUndefined();
  });

  it("des actions reconstruites à l'identique ne redessinent pas ; l'action appelle la dernière version", async () => {
    const calls: number[] = [];
    const exportsWithActions = (version: number): ContactSheetExport[] => [
      {
        id: "e1",
        thumbnails: [
          {
            picture_id: 1,
            src: "/p1.jpg",
            filename: "f1.tif",
            actions: [{ key: "download", label: "Download", action: () => calls.push(version) }],
          },
        ],
      },
    ];
    const props = { reference: { reference_id: 1, ref: "REF" }, onThumbnailChange: () => {} };
    const { rerender } = render(<ContactSheetReference {...props} exports={exportsWithActions(1)} />);
    resetRenders();
    rerender(<ContactSheetReference {...props} exports={exportsWithActions(2)} />);
    expect(renders["f1.tif"]).toBeUndefined();

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Download" }));
    expect(calls).toEqual([2]);
  });
});

describe("Thumbnail : menus et infobulles montés à la demande", () => {
  const props = {
    picture_id: 1,
    src: "/p1.jpg",
    filename: "f1.tif",
    statusButtons: [validate],
    onStatusButtonClick: () => {},
    onRatingChange: () => {},
  };
  const deferred = (container: HTMLElement) => container.querySelectorAll("[data-deferred-overlay]");

  it("rien n'est monté d'avance ; les déclencheurs sont rendus à l'identique", () => {
    const { container } = render(<Thumbnail {...props} />);
    // Menu des étoiles et infobulle du bouton de statut : différés.
    expect(deferred(container)).toHaveLength(2);
    const stars = container.querySelector('[aria-haspopup="menu"]')!;
    expect(stars).toHaveAttribute("aria-expanded", "false");
    expect(stars).toHaveAttribute("data-state", "closed");
    expect(screen.getByRole("button", { name: "Validate" })).toBeInTheDocument();

    // Premier survol de la vignette : la machinerie se monte.
    fireEvent.pointerOver(container.querySelector("img")!);
    expect(deferred(container)).toHaveLength(0);
    expect(container.querySelector('[aria-haspopup="menu"]')).toHaveAttribute("aria-expanded", "false");
  });

  it("le focus clavier monte la machinerie, garde le focus et montre l'infobulle", async () => {
    render(<Thumbnail {...props} />);
    act(() => screen.getByRole("button", { name: "Validate" }).focus());
    const focused = document.activeElement as HTMLElement;
    expect(focused.isConnected).toBe(true);
    expect(focused).toHaveAttribute("aria-label", "Validate");
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Validate");
  });

  it("un appui direct sur un déclencheur encore différé ouvre son menu", async () => {
    const onRatingChange = vi.fn();
    const { container } = render(<Thumbnail {...props} onRatingChange={onRatingChange} />);
    await userEvent.click(container.querySelector('[aria-haspopup="menu"]')!);
    const items = await screen.findAllByRole("menuitem");
    await userEvent.click(items[3]);
    expect(onRatingChange).toHaveBeenCalledWith(3);
  });
});
