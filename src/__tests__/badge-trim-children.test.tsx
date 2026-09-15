import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Badge } from "@/components/ui/badge";

/**
 * Le Badge enveloppe ses enfants textuels dans un `<span class="gs-text-trim">`
 * qui applique `text-box: trim-both cap alphabetic`, seul moyen de rogner la
 * boîte de texte : la règle n'est pas héritée et n'atteint pas l'élément flex
 * anonyme d'un `inline-flex`.
 *
 * Ce fichier verrouille les cas limites de ce découpage, dont deux qui ont un
 * effet visuel direct :
 *  - deux enfants textuels adjacents doivent donner UN seul span, sinon le
 *    `gap-1` du Badge s'insère au milieu du texte (+2,7px mesurés) ;
 *  - un enfant textuel vide ne doit produire AUCUN span, sinon on obtient un
 *    élément flex vide qui compte lui aussi dans le `gap-1`.
 */

afterEach(() => cleanup());

const spans = (c: HTMLElement) => c.querySelectorAll(".gs-text-trim");

describe("Badge — rognage des enfants textuels", () => {
  it("enveloppe une chaîne simple", () => {
    const { container } = render(<Badge>BADGE</Badge>);
    expect(spans(container)).toHaveLength(1);
    expect(spans(container)[0]).toHaveTextContent("BADGE");
  });

  it("enveloppe le nombre 0 (ne le traite pas comme falsy)", () => {
    const { container } = render(<Badge>{0}</Badge>);
    expect(spans(container)).toHaveLength(1);
    expect(spans(container)[0]).toHaveTextContent("0");
    expect(container.textContent).toBe("0");
  });

  it("ne produit aucun span pour une chaîne vide", () => {
    const { container } = render(<Badge>{""}</Badge>);
    expect(spans(container)).toHaveLength(0);
  });

  it.each([
    ["false", false],
    ["null", null],
    ["undefined", undefined],
  ])("ne produit aucun span et ne casse pas pour %s", (_nom, valeur) => {
    const { container } = render(<Badge>{valeur as React.ReactNode}</Badge>);
    expect(spans(container)).toHaveLength(0);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("ne produit aucun span sans enfant", () => {
    const { container } = render(<Badge />);
    expect(spans(container)).toHaveLength(0);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("regroupe deux chaînes adjacentes dans UN SEUL span", () => {
    const code = "AB";
    const { container } = render(<Badge>Vue {code}</Badge>);
    expect(spans(container)).toHaveLength(1);
    expect(container.textContent).toBe("Vue AB");
  });

  it("mélange number et string dans un seul span", () => {
    const { container } = render(
      <Badge>
        {3}
        {" sur "}
        {10}
      </Badge>
    );
    expect(spans(container)).toHaveLength(1);
    expect(container.textContent).toBe("3 sur 10");
  });

  it("coupe en deux runs quand un élément sépare deux textes", () => {
    const { container } = render(
      <Badge>
        avant
        <svg data-testid="ico" />
        après
      </Badge>
    );
    expect(spans(container)).toHaveLength(2);
    expect(spans(container)[0]).toHaveTextContent("avant");
    expect(spans(container)[1]).toHaveTextContent("après");
    expect(container.querySelector("[data-testid=ico]")).toBeInTheDocument();
  });

  it("laisse l'élément enfant hors du span (frère, pour préserver gap-1)", () => {
    const { container } = render(
      <Badge>
        <svg data-testid="ico" />
        texte
      </Badge>
    );
    const ico = container.querySelector("[data-testid=ico]")!;
    expect(ico.closest(".gs-text-trim")).toBeNull();
    expect(spans(container)).toHaveLength(1);
  });

  it("aplatit les tableaux imbriqués", () => {
    const { container } = render(<Badge>{["a", ["b", "c"]]}</Badge>);
    expect(container.textContent).toBe("abc");
    expect(spans(container).length).toBeGreaterThanOrEqual(1);
  });

  it("ne rogne PAS le texte niché dans un élément enfant (limite documentée)", () => {
    const { container } = render(
      <Badge>
        <span data-testid="interne">niché</span>
      </Badge>
    );
    expect(spans(container)).toHaveLength(0);
    expect(container.textContent).toBe("niché");
  });

  it("ne rogne PAS le texte d'un fragment (limite documentée)", () => {
    const { container } = render(
      <Badge>
        <>fragment</>
      </Badge>
    );
    expect(spans(container)).toHaveLength(0);
    expect(container.textContent).toBe("fragment");
  });

  it("préserve textContent à l'identique", () => {
    const { container } = render(
      <Badge>
        <svg />
        Vue {"AB"} fin
      </Badge>
    );
    expect(container.textContent).toBe("Vue AB fin");
  });

  it("n'émet aucun avertissement de clé React", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <Badge>
        a<svg />b<svg />c
      </Badge>
    );
    const messages = spy.mock.calls.map((c) => String(c[0])).join("\n");
    expect(messages).not.toMatch(/unique "key"|key prop/i);
    spy.mockRestore();
  });

  it("conserve les classes de base sur la racine, pas sur le span", () => {
    const { container } = render(<Badge>x</Badge>);
    const racine = container.firstChild as HTMLElement;
    expect(racine.className).toContain("text-badge-label");
    expect(racine.className).toContain("leading-tight");
    expect(racine.className).toContain("min-h-4");
    expect(spans(container)[0].className).toBe("gs-text-trim");
  });
});
