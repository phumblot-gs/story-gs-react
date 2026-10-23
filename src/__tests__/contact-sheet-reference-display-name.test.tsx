import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import {
  ContactSheetReference,
  getReferenceDisplayName,
  type ReferenceData,
} from "@/components/ContactSheetReference";

/** Reference title: trimmed `smalltext` when non-empty, otherwise `ref`. */

afterEach(() => cleanup());

const withSmalltext: ReferenceData = { reference_id: 1, ref: "5238694", smalltext: "Hydration heroes set" };

describe("getReferenceDisplayName", () => {
  it("prend smalltext s'il est renseigné (espaces retirés), sinon ref", () => {
    expect(getReferenceDisplayName(withSmalltext)).toBe("Hydration heroes set");
    expect(getReferenceDisplayName({ ref: "R1", smalltext: "  Set  " })).toBe("Set");
    expect(getReferenceDisplayName({ ref: "R1", smalltext: "   " })).toBe("R1");
    expect(getReferenceDisplayName({ ref: "R1", smalltext: null })).toBe("R1");
    expect(getReferenceDisplayName({ ref: "R1" })).toBe("R1");
  });

  // Checked by tsc: an `interface` has no implicit index signature, it must still be accepted.
  it("accepte ReferenceData et une interface applicative", () => {
    interface AppReference {
      reference_id: number;
      ref: string;
      smalltext: string | null;
      brand: string;
    }
    const app: AppReference = { reference_id: 2, ref: "R2", smalltext: null, brand: "B" };
    expectTypeOf(getReferenceDisplayName).toBeCallableWith(withSmalltext);
    expectTypeOf(getReferenceDisplayName).toBeCallableWith(app);
    expect(getReferenceDisplayName(app)).toBe("R2");
  });

  it("rend une chaîne vide sans référence", () => {
    expect(getReferenceDisplayName(null)).toBe("");
    expect(getReferenceDisplayName(undefined)).toBe("");
  });
});

describe("ContactSheetReference — titre de la référence", () => {
  it("affiche smalltext en titre, avec « smalltext — ref » en infobulle", () => {
    render(<ContactSheetReference reference={withSmalltext} />);
    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("Hydration heroes set");
    expect(title).toHaveAttribute("title", "Hydration heroes set — 5238694");
  });

  it("sans smalltext, garde ref en titre et en infobulle (comportement inchangé)", () => {
    render(<ContactSheetReference reference={{ reference_id: 1, ref: "5238694", smalltext: "" }} />);
    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("5238694");
    expect(title).toHaveAttribute("title", "5238694");
  });

  it("nomme la case de sélection et le formulaire Modifier avec le titre affiché", async () => {
    render(
      <ContactSheetReference reference={withSmalltext} onSelectionChange={vi.fn()} onReferenceUpdate={vi.fn()} />,
    );
    expect(screen.getByRole("checkbox", { name: "Select reference Hydration heroes set" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Edit/ }));
    expect(screen.getAllByRole("heading", { name: "Edit reference Hydration heroes set" }).length).toBeGreaterThan(0);
  });

  it("title remplace le titre ; titleText sert à l'infobulle, à la case et au formulaire", async () => {
    render(
      <ContactSheetReference
        reference={withSmalltext}
        title={<span data-testid="custom-title">Custom</span>}
        titleText="Custom title"
        onSelectionChange={vi.fn()}
        onReferenceUpdate={vi.fn()}
      />,
    );
    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toContainElement(screen.getByTestId("custom-title"));
    expect(title).toHaveAttribute("title", "Custom title");
    expect(screen.getByRole("checkbox", { name: "Select reference Custom title" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Edit/ }));
    expect(screen.getAllByRole("heading", { name: "Edit reference Custom title" }).length).toBeGreaterThan(0);
  });

  it("un title texte sert aussi de texte accessible sans titleText", () => {
    render(<ContactSheetReference reference={withSmalltext} title="Plain" onSelectionChange={vi.fn()} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("title", "Plain");
    expect(screen.getByRole("checkbox", { name: "Select reference Plain" })).toBeInTheDocument();
  });
});
