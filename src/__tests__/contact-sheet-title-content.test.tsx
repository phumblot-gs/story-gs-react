import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { ContactSheetReference } from "@/components/ContactSheetReference";

/** `titleContent`: slot right after the title, before grade and actions (gs_w vedette indicator, CR-684). */

afterEach(() => cleanup());

const reference = { reference_id: 1, ref: "5238694" };
const follows = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

describe("ContactSheetReference — titleContent", () => {
  it("est rendu après le titre, avant le grade et les actions", () => {
    render(
      <ContactSheetReference
        reference={reference}
        titleContent={<span>Vedette</span>}
        grade="B"
        onReferenceUpdate={vi.fn()}
      />,
    );
    const title = screen.getByRole("heading", { level: 3 });
    const slot = screen.getByText("Vedette");
    const edit = screen.getByRole("button", { name: /Edit/ });
    expect(follows(title, slot)).toBe(true);
    expect(follows(slot, edit)).toBe(true);
    expect(title).not.toContainElement(slot);
    const grade = document.querySelector("[data-title-content]")!.nextElementSibling!;
    expect(grade).not.toContainElement(edit);
    expect(follows(slot, grade)).toBe(true);
  });

  it("est aussi rendu pour une référence manquante", () => {
    render(<ContactSheetReference reference={null} titleContent={<span>Vedette</span>} />);
    expect(follows(screen.getByRole("heading", { level: 3 }), screen.getByText("Vedette"))).toBe(true);
  });

  it("sans titleContent, aucun conteneur n'est ajouté", () => {
    const { container } = render(<ContactSheetReference reference={reference} />);
    expect(container.querySelector("[data-title-content]")).not.toBeInTheDocument();
  });
});
