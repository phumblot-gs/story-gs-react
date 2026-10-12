import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { TranslationProvider } from "@/contexts/TranslationContext";

afterEach(cleanup);

const arc = (container: HTMLElement) => container.querySelectorAll("circle")[1];

describe("Spinner", () => {
  it("seul : région de statut avec un nom accessible traduit", () => {
    const { unmount } = render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    unmount();
    render(
      <TranslationProvider defaultLanguage="FR">
        <Spinner />
      </TranslationProvider>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Chargement en cours");
  });

  it("label personnalisé", () => {
    render(<Spinner label="Analyse des visuels" />);
    expect(screen.getByRole("status")).toHaveTextContent("Analyse des visuels");
  });

  it("décoratif : masqué aux technologies d'assistance, sans région de statut", () => {
    const { container } = render(<Spinner decorative />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.textContent).toBe("");
  });

  it.each([
    [12, "1.5"],
    [16, "2"],
    [24, "2"],
    [32, "3"],
  ] as const)("taille %i px : épaisseur %s px, dimensions fixes", (size, stroke) => {
    const { container } = render(<Spinner size={size} decorative />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.width).toBe(`${size}px`);
    expect(root.style.height).toBe(`${size}px`);
    expect(root).toHaveClass("shrink-0");
    expect(arc(container)).toHaveAttribute("stroke-width", stroke);
  });

  it("16 px par défaut, couleur héritée (currentColor), arc de 270°", () => {
    const { container } = render(<Spinner decorative />);
    expect(container.firstElementChild).toHaveAttribute("data-size", "16");
    const circles = container.querySelectorAll("circle");
    expect(circles[0]).toHaveAttribute("stroke", "currentColor");
    expect(circles[0]).toHaveAttribute("opacity", "0.18");
    const r = 7; // (16 - 2) / 2
    const [visible] = arc(container).getAttribute("stroke-dasharray")!.split(" ").map(Number);
    expect(visible).toBeCloseTo(2 * Math.PI * r * 0.75, 3);
  });

  it("transmet className et les attributs", () => {
    render(<Spinner className="text-white" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("text-white");
  });
});

describe("Button — loading", () => {
  it("sans prop loading : rendu inchangé", () => {
    render(<Button>Importer</Button>);
    const button = screen.getByRole("button", { name: "Importer" });
    expect(button.querySelector("[data-spinner]")).toBeNull();
    expect(button).not.toHaveAttribute("aria-busy");
  });

  it("loading : disabled, aria-busy, spinner décoratif, libellé de chargement seul lisible", () => {
    const onClick = vi.fn();
    render(
      <Button loading loadingLabel="Import en cours…" onClick={onClick}>
        Importer les visuels
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Import en cours…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button.querySelector("[data-spinner]")).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading={false} : les deux libellés sont superposés (largeur stable), seul le normal est lisible", () => {
    render(
      <Button loading={false} loadingLabel="Import en cours…">
        Importer les visuels
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Importer les visuels" });
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");
    const layers = button.querySelectorAll(".gs-state-fade");
    expect(layers).toHaveLength(2);
    expect(layers[1]).toHaveAttribute("aria-hidden", "true");
    expect(layers[1]).toHaveClass("opacity-0");
  });

  it("spinner de 12 px en small, 16 px sinon", () => {
    const { rerender } = render(<Button size="small" loading>OK</Button>);
    expect(document.querySelector("[data-spinner]")).toHaveAttribute("data-size", "12");
    rerender(<Button size="large" loading>OK</Button>);
    expect(document.querySelector("[data-spinner]")).toHaveAttribute("data-size", "16");
  });

  it("le focus n'est pas déplacé par le passage en chargement", () => {
    function Demo() {
      const [loading, setLoading] = React.useState(false);
      return (
        <>
          <input aria-label="other" />
          <Button loading={loading} onClick={() => setLoading(true)}>Go</Button>
        </>
      );
    }
    render(<Demo />);
    const input = screen.getByLabelText("other");
    input.focus();
    fireEvent.click(screen.getByRole("button"));
    expect(input).toHaveFocus();
  });
});
