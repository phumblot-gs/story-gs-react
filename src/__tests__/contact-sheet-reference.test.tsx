import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import {
  ContactSheetReference,
  type ContactSheetExport,
  type ReferenceAttributeConfig,
  type ReferenceData,
} from "@/components/ContactSheetReference";
import { MediaStatus } from "@/utils/mediaStatus";

afterEach(() => cleanup());

const reference: ReferenceData = {
  reference_id: 1,
  ref: "7e0125de91",
  brand: "OLAPLEX",
  eans: ["810177861393", "810177861394"],
  extra: { supplier_ref: "HYDRATION HEROS" },
  tags: ["promo"],
};

const attributes: ReferenceAttributeConfig[] = [
  { key: "ref", label: "Référence" },
  { key: "eans", label: "EAN", editable: true },
  { key: "extra.supplier_ref", label: "Réf. fournisseur", editable: true },
  { key: "color", label: "Couleur" },
];

const makeExports = (selected: number[] = [], status = MediaStatus.SUBMITTED_FOR_APPROVAL): ContactSheetExport[] => [
  {
    id: "e1",
    name: "TEST HERMES",
    thumbnails: [1, 2].map((id) => ({
      picture_id: id,
      src: `/p${id}.jpg`,
      filename: `7E0125DE91_worn_${id}.tif`,
      selected: selected.includes(id),
      status,
    })),
  },
  {
    id: "e2",
    name: "SITE",
    thumbnails: [{ picture_id: 3, src: "/p3.jpg", filename: "p3.tif", selected: selected.includes(3), status }],
  },
];

const referenceCheckbox = () => screen.getByRole("checkbox", { name: /7e0125de91/ });

describe("ContactSheetReference", () => {
  it("affiche les attributs configurés, même absents des données", () => {
    const { container } = render(<ContactSheetReference reference={reference} attributes={attributes} />);

    expect(screen.getByText("Couleur")).toBeInTheDocument();
    const color = container.querySelector('[data-attribute="color"] dd');
    expect(color).toHaveTextContent("");
    expect(container.querySelector('[data-attribute="extra.supplier_ref"] dd')).toHaveTextContent(
      "HYDRATION HEROS",
    );
    expect(container.querySelector('[data-attribute="eans"] dd')).toHaveTextContent(
      "810177861393, 810177861394",
    );
  });

  it("affiche les badges d'export dans l'ordre reçu", () => {
    render(<ContactSheetReference reference={reference} exports={makeExports()} />);
    const badges = screen.getAllByText(/TEST HERMES|SITE/).map((n) => n.textContent);
    expect(badges).toEqual(["TEST HERMES", "SITE"]);
  });

  it("dérive l'état de la case : vide, intermédiaire, cochée", () => {
    const props = { reference, onSelectionChange: vi.fn() };
    const { rerender } = render(<ContactSheetReference {...props} exports={makeExports()} />);
    expect(referenceCheckbox()).toHaveAttribute("data-state", "unchecked");

    rerender(<ContactSheetReference {...props} selected exports={makeExports([1, 3])} />);
    expect(referenceCheckbox()).toHaveAttribute("data-state", "indeterminate");

    rerender(<ContactSheetReference {...props} selected exports={makeExports([1, 2, 3])} />);
    expect(referenceCheckbox()).toHaveAttribute("data-state", "checked");
  });

  it("transmet toutes les vignettes avec la sélection de la référence", async () => {
    const onSelectionChange = vi.fn();
    render(
      <ContactSheetReference reference={reference} exports={makeExports()} onSelectionChange={onSelectionChange} />,
    );
    await userEvent.click(referenceCheckbox());
    expect(onSelectionChange).toHaveBeenCalledWith(true, [1, 2, 3]);
  });

  it("se met à jour quand les données changent (composant contrôlé)", () => {
    const { rerender, container } = render(
      <ContactSheetReference reference={reference} attributes={attributes} exports={makeExports()} />,
    );
    rerender(
      <ContactSheetReference
        reference={{ ...reference, extra: { supplier_ref: "NOUVELLE REF" } }}
        attributes={attributes}
        exports={makeExports([], MediaStatus.VALIDATED)}
        onThumbnailChange={vi.fn()}
      />,
    );
    expect(container.querySelector('[data-attribute="extra.supplier_ref"] dd')).toHaveTextContent("NOUVELLE REF");
    // Médias validés : le bouton ✓ est désactivé par le statut.
    for (const button of screen.getAllByRole("button", { name: /^Approve/i })) {
      expect(button).toBeDisabled();
    }
  });

  it("remonte les changements de vignette avec leur identifiant et leur export", async () => {
    const onThumbnailChange = vi.fn();
    render(
      <ContactSheetReference reference={reference} exports={makeExports()} onThumbnailChange={onThumbnailChange} />,
    );
    await userEvent.click(screen.getAllByRole("button", { name: /^Approve/i })[2]);
    expect(onThumbnailChange).toHaveBeenCalledWith({ type: "validate", pictureId: 3, exportId: "e2" });
  });

  it("bascule l'urgence", async () => {
    const onUrgentChange = vi.fn();
    render(<ContactSheetReference reference={reference} isUrgent onUrgentChange={onUrgentChange} />);
    const toggle = screen.getByRole("button", { name: /urgent/i });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(toggle);
    expect(onUrgentChange).toHaveBeenCalledWith(false);
  });

  it("rend les vignettes glissables dès que onReorder est fourni, sans mode dédié", () => {
    const { container, rerender } = render(
      <ContactSheetReference reference={reference} exports={makeExports()} onThumbnailChange={vi.fn()} />,
    );
    container.querySelectorAll("[data-picture-id]").forEach((cell) =>
      expect(cell).toHaveAttribute("draggable", "false"),
    );

    rerender(
      <ContactSheetReference
        reference={reference}
        exports={makeExports()}
        onThumbnailChange={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    const cells = container.querySelectorAll("[data-picture-id]");
    expect(cells).toHaveLength(3);
    cells.forEach((cell) => expect(cell).toHaveAttribute("draggable", "true"));
    // Les interactions restent actives.
    expect(screen.getAllByRole("button", { name: /^Approve/i })[0]).toBeEnabled();
  });

  it("neutralise le survol après un drop jusqu'au prochain mouvement de souris", () => {
    const { container } = render(
      <ContactSheetReference reference={reference} exports={makeExports()} onReorder={vi.fn()} />,
    );
    const cells = container.querySelectorAll("[data-picture-id]");
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn(), effectAllowed: "", dropEffect: "" };
    const content = () => Array.from(cells).map((cell) => cell.firstElementChild);

    fireEvent.dragStart(cells[0], { dataTransfer });
    fireEvent.drop(cells[1], { dataTransfer });
    // Chrome garderait :hover sur la vignette arrivée sous la position de départ.
    content().forEach((node) => expect(node).toHaveClass("pointer-events-none"));

    fireEvent.pointerMove(window);
    content().forEach((node) => expect(node).not.toHaveClass("pointer-events-none"));
  });

  it("Maj+clic sélectionne toute la plage depuis la dernière vignette cliquée, tous exports confondus", async () => {
    const onThumbnailChange = vi.fn();
    render(
      <ContactSheetReference reference={reference} exports={makeExports()} onThumbnailChange={onThumbnailChange} />,
    );
    const boxes = () => screen.getAllByRole("checkbox");
    const user = userEvent.setup();

    await user.click(boxes()[0]);
    expect(onThumbnailChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "selection", selected: true, pictureId: 1, pictureIds: [1] }),
    );

    await user.keyboard("{Shift>}");
    await user.click(boxes()[2]);
    await user.keyboard("{/Shift}");
    expect(onThumbnailChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "selection", selected: true, pictureId: 3, exportId: "e2", pictureIds: [1, 2, 3] }),
    );
  });

  it("masque le bouton Modifier avec showEditButton={false}", () => {
    render(
      <ContactSheetReference reference={reference} onReferenceUpdate={vi.fn()} showEditButton={false} />,
    );
    expect(screen.queryByRole("button", { name: /Edit/ })).not.toBeInTheDocument();
  });

  it("affiche les actions d'en-tête à côté du bouton Modifier, et peut ouvrir le formulaire", async () => {
    const onArchive = vi.fn();
    render(
      <ContactSheetReference
        reference={reference}
        attributes={attributes}
        onReferenceUpdate={vi.fn()}
        headerActions={({ openEdit }) => (
          <>
            <button onClick={onArchive}>Archiver</button>
            <button onClick={openEdit}>Éditer la fiche</button>
          </>
        )}
      />,
    );
    const edit = screen.getByRole("button", { name: /Edit/ });
    const archive = screen.getByRole("button", { name: "Archiver" });
    expect(edit.parentElement).toBe(archive.parentElement);

    await userEvent.click(archive);
    expect(onArchive).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Éditer la fiche" }));
    expect(screen.getByLabelText("Réf. fournisseur")).toBeInTheDocument();
  });

  it("soumet seulement les valeurs modifiées et les tags", async () => {
    const onReferenceUpdate = vi.fn().mockResolvedValue(undefined);
    render(
      <ContactSheetReference reference={reference} attributes={attributes} onReferenceUpdate={onReferenceUpdate} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Edit/ }));

    // Seuls les attributs `editable` sont dans le formulaire.
    expect(screen.queryByLabelText("Couleur")).not.toBeInTheDocument();
    const supplier = screen.getByLabelText("Réf. fournisseur");
    await userEvent.clear(supplier);
    await userEvent.type(supplier, "NEW");

    await userEvent.type(screen.getByPlaceholderText(/New tag/), "soldes{Enter}");
    const tags = screen.getByTestId("reference-tags");
    expect(within(tags).getByText("soldes")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onReferenceUpdate).toHaveBeenCalledWith({
      values: { "extra.supplier_ref": "NEW" },
      tags: ["promo", "soldes"],
    });
    expect(screen.queryByLabelText("Réf. fournisseur")).not.toBeInTheDocument();
  });

  it("garde le formulaire ouvert et affiche l'erreur si l'enregistrement échoue", async () => {
    const onReferenceUpdate = vi.fn().mockRejectedValue(new Error("Conflit"));
    render(
      <ContactSheetReference reference={reference} attributes={attributes} onReferenceUpdate={onReferenceUpdate} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Edit/ }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Conflit");
    expect(screen.getByLabelText("Réf. fournisseur")).toBeInTheDocument();
  });
});

describe("ContactSheetReference — exports", () => {
  it("fonce le badge de l'export de la vignette survolée", () => {
    const { container } = render(<ContactSheetReference reference={reference} exports={makeExports()} />);
    const badge = (id: string) => container.querySelector(`[data-export-badge="${id}"]`);
    const cell = container.querySelector('[data-picture-id="3"]')!;

    fireEvent.mouseEnter(cell);
    expect(badge("e2")).toHaveClass("brightness-90");
    expect(badge("e1")).not.toHaveClass("brightness-90");

    fireEvent.mouseLeave(cell);
    expect(badge("e2")).not.toHaveClass("brightness-90");
  });

  it("s'affiche sans export ni attribut", () => {
    const { container } = render(<ContactSheetReference reference={{ reference_id: 9, ref: "5238694" }} />);
    expect(screen.getByRole("heading", { name: "5238694" })).toBeInTheDocument();
    expect(container.querySelector("dl")).toBeNull();
    expect(container.querySelector("[data-picture-id]")).toBeNull();
  });
});

describe("ContactSheetReference — emplacements vides (vue attendue sans média)", () => {
  const mixed: ContactSheetExport[] = [
    {
      id: "e",
      thumbnails: [
        { picture_id: 1, src: "/p1.jpg", filename: "p1.tif", selected: true },
        { view: "B" },
        { picture_id: 2, src: "/p2.jpg", filename: "p2.tif", selected: true },
      ],
    },
  ];

  it("affiche les emplacements vides, non déplaçables", () => {
    const { container } = render(
      <ContactSheetReference reference={reference} exports={mixed} onReorder={vi.fn()} />,
    );
    const empty = container.querySelector('[data-empty-view="B"]');
    expect(empty).toBeInTheDocument();
    expect(empty).toHaveAttribute("draggable", "false");
    expect(container.querySelectorAll('[data-picture-id][draggable="true"]')).toHaveLength(2);
  });

  it("les ignore pour la sélection de la référence", async () => {
    const onSelectionChange = vi.fn();
    render(
      <ContactSheetReference reference={reference} selected exports={mixed} onSelectionChange={onSelectionChange} />,
    );
    // Les deux médias sont sélectionnés : la case est cochée malgré l'emplacement vide.
    expect(referenceCheckbox()).toHaveAttribute("data-state", "checked");
    await userEvent.click(referenceCheckbox());
    expect(onSelectionChange).toHaveBeenCalledWith(false, [1, 2]);
  });
});

describe("ContactSheetReference — grade", () => {
  it("affiche le grade entre le titre et les actions", () => {
    const { container } = render(
      <ContactSheetReference reference={reference} grade="A" onReferenceUpdate={vi.fn()} />,
    );
    const grade = container.querySelector(".grade-a")!;
    const title = screen.getByRole("heading", { name: reference.ref });
    const edit = screen.getByRole("button", { name: /Edit/ });
    expect(title.compareDocumentPosition(grade) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(grade.compareDocumentPosition(edit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("ContactSheetReference — drag de plusieurs vignettes", () => {
  const dataTransfer = () => ({ setData: vi.fn(), setDragImage: vi.fn(), effectAllowed: "", dropEffect: "" });

  it("emporte la sélection de l'export avec un aperçu en pile et le nombre d'images", async () => {
    const { container } = render(
      <ContactSheetReference reference={reference} exports={makeExports([1, 2, 3])} onReorder={vi.fn()} />,
    );
    const dt = dataTransfer();
    fireEvent.dragStart(container.querySelector('[data-picture-id="1"]')!, { dataTransfer: dt });

    // 1 et 2 sont dans l'export e1 ; 3, sélectionnée mais dans e2, ne part pas.
    const [image] = dt.setDragImage.mock.calls[0];
    expect((image as HTMLElement).querySelector("[data-drag-count]")).toHaveTextContent("2");

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const faded = (id: number) =>
      container.querySelector(`[data-picture-id="${id}"]`)!.firstElementChild!.classList.contains("opacity-30");
    expect([faded(1), faded(2), faded(3)]).toEqual([true, true, false]);
  });

  it("ne déplace que la vignette saisie si elle n'est pas sélectionnée", () => {
    const { container } = render(
      <ContactSheetReference reference={reference} exports={makeExports([2])} onReorder={vi.fn()} />,
    );
    const dt = dataTransfer();
    const cell = container.querySelector('[data-picture-id="1"]')!;
    fireEvent.dragStart(cell, { dataTransfer: dt });
    expect(dt.setDragImage.mock.calls[0][0]).toBe(cell);
  });
});

describe("ContactSheetReference — exportsLayout", () => {
  it("regroupe par défaut : badges côte à côte, une seule grille", () => {
    const { container } = render(<ContactSheetReference reference={reference} exports={makeExports()} />);
    expect(container.querySelector('[data-exports-layout="grouped"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-export-section]")).toHaveLength(0);
    const badges = container.querySelectorAll("[data-export-badge]");
    expect(badges[0].parentElement).toBe(badges[1].parentElement);
  });

  it("sépare les exports : une section par export, avec son badge et ses vignettes", () => {
    const { container } = render(
      <ContactSheetReference reference={reference} exports={makeExports()} exportsLayout="separated" />,
    );
    const sections = container.querySelectorAll("[data-export-section]");
    expect(sections).toHaveLength(2);
    expect(sections[0].querySelector('[data-export-badge="e1"]')).toBeInTheDocument();
    expect(sections[0].querySelectorAll("[data-picture-id]")).toHaveLength(2);
    expect(sections[1].querySelector('[data-export-badge="e2"]')).toBeInTheDocument();
    expect(sections[1].querySelectorAll("[data-picture-id]")).toHaveLength(1);
  });
});
