import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { SelectAutocomplete } from "@/components/ui/select-autocomplete";

afterEach(cleanup);

const OPTIONS = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
];

const input = () => screen.getByRole("combobox") as HTMLInputElement;
const selected = () => [input().selectionStart, input().selectionEnd];

describe("SelectAutocomplete — texte sélectionné au focus", () => {
  it("au focus clavier, tout le libellé de l'option choisie est sélectionné", () => {
    render(<SelectAutocomplete options={OPTIONS} defaultValue="1" />);
    expect(input().value).toBe("Option 1");
    fireEvent.focus(input());
    expect(selected()).toEqual([0, "Option 1".length]);
  });

  it("au clic qui donne le focus, la sélection est refaite après le clic", () => {
    render(<SelectAutocomplete options={OPTIONS} defaultValue="1" />);
    fireEvent.mouseDown(input());
    input().focus();
    // le navigateur place le curseur au clic, après le focus
    input().setSelectionRange(3, 3);
    fireEvent.click(input());
    expect(selected()).toEqual([0, "Option 1".length]);
  });

  it("un clic dans le champ déjà actif place le curseur sans tout resélectionner", () => {
    render(<SelectAutocomplete options={OPTIONS} defaultValue="1" />);
    fireEvent.mouseDown(input());
    input().focus();
    fireEvent.click(input());
    // second clic, champ déjà actif
    fireEvent.mouseDown(input());
    input().setSelectionRange(3, 3);
    fireEvent.click(input());
    expect(selected()).toEqual([3, 3]);
  });
});

describe("SelectAutocomplete — hauteur du menu", () => {
  it("par défaut, bornée par la hauteur disponible du côté où le menu s'ouvre", async () => {
    render(<SelectAutocomplete options={OPTIONS} />);
    fireEvent.click(input());
    expect(await screen.findByRole("listbox")).toHaveClass(
      "max-h-[min(calc(100vh-2rem),var(--radix-popover-content-available-height))]",
    );
  });

  it("menuMaxHeight fourni : gardé tel quel", async () => {
    render(<SelectAutocomplete options={OPTIONS} menuMaxHeight="max-h-[40vh]" />);
    fireEvent.click(input());
    const list = await screen.findByRole("listbox");
    expect(list).toHaveClass("max-h-[40vh]");
    expect(list.className).not.toContain("available-height");
  });
});
