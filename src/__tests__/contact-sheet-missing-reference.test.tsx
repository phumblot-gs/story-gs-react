import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { ContactSheetReference, type ContactSheetExport } from "@/components/ContactSheetReference";

/** `reference={null}`: block of the pictures that have no reference (CR-684, gs_w validation screen). */

afterEach(() => cleanup());

const exports: ContactSheetExport[] = [
  {
    id: "e1",
    name: "SITE",
    thumbnails: [1, 2].map((id) => ({ picture_id: id, src: `/p${id}.jpg`, filename: `orphan_${id}.tif` })),
  },
];

const renderMissing = (props: Partial<React.ComponentProps<typeof ContactSheetReference>> = {}) =>
  render(
    <ContactSheetReference
      reference={null}
      attributes={[{ key: "ref", label: "Reference", editable: true }]}
      exports={exports}
      onSelectionChange={vi.fn()}
      onUrgentChange={vi.fn()}
      onReferenceUpdate={vi.fn()}
      onThumbnailChange={vi.fn()}
      {...props}
    />,
  );

describe("ContactSheetReference — référence manquante", () => {
  it("affiche un badge d'erreur à la place du titre", () => {
    const { container } = renderMissing();
    const title = screen.getByRole("heading", { level: 3, name: "Missing reference" });
    expect(title.querySelector(".badge-destructive")).toHaveTextContent("Missing reference");
    expect(container.querySelector("[data-missing-reference]")).toBe(title);
  });

  it("n'affiche ni urgence, ni bouton Modifier, ni attributs", () => {
    const { container } = renderMissing();
    expect(screen.queryByRole("button", { name: "Mark as urgent" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Edit/ })).not.toBeInTheDocument();
    expect(container.querySelector("[data-attribute]")).not.toBeInTheDocument();
  });

  it("openEdit ne fait rien depuis les actions d'en-tête", async () => {
    renderMissing({ headerActions: ({ openEdit }) => <button onClick={openEdit}>Open form</button> });
    await userEvent.click(screen.getByRole("button", { name: "Open form" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("garde les badges d'export, les vignettes et la sélection", async () => {
    const onSelectionChange = vi.fn();
    const onThumbnailChange = vi.fn();
    renderMissing({ onSelectionChange, onThumbnailChange });
    expect(screen.getByText("SITE")).toBeInTheDocument();
    expect(document.querySelectorAll("[data-picture-id]")).toHaveLength(2);

    await userEvent.click(screen.getByRole("checkbox", { name: "Select pictures without reference" }));
    expect(onSelectionChange).toHaveBeenCalledWith(true, [1, 2]);

    await userEvent.click(screen.getAllByRole("button", { name: /^Approve/i })[1]);
    expect(onThumbnailChange).toHaveBeenCalledWith({ type: "validate", pictureId: 2, exportId: "e1" });
  });

  it("title remplace le badge si l'application le fournit", () => {
    renderMissing({ title: "Unsorted pictures" });
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Unsorted pictures");
    expect(screen.getByRole("checkbox", { name: "Select reference Unsorted pictures" })).toBeInTheDocument();
  });
});
