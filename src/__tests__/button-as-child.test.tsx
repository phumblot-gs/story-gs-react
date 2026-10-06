import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Button } from "@/components/ui/button";

afterEach(() => cleanup());

describe("Button — asChild", () => {
  // Le bouton rend le libellé et deux décorations (indicateur, étiquette de
  // debug) : Slot n'accepte qu'un enfant, et levait « React.Children.only »
  // pour tout usage de asChild, y compris les stories qui le documentent.

  it("renders the child element instead of a button", () => {
    render(
      <Button asChild variant="normal">
        <a href="/page">Aller à la page</a>
      </Button>,
    );

    const link = screen.getByText("Aller à la page");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/page");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies the button classes and the bg context to the child", () => {
    render(
      <Button asChild variant="secondary" size="medium" className="h-6">
        <span>Segment</span>
      </Button>,
    );

    const child = screen.getByText("Segment");
    expect(child).toHaveClass("btn-secondary", "rounded-full", "h-6");
  });

  it("forwards handlers and props to the child", () => {
    const onClick = vi.fn();
    render(
      <Button asChild onClick={onClick} aria-label="ouvrir">
        <a href="#x">Lien</a>
      </Button>,
    );

    fireEvent.click(screen.getByText("Lien"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Lien")).toHaveAttribute("aria-label", "ouvrir");
  });

  it("keeps the child's own content when decorations are added", () => {
    render(
      <Button asChild indicator>
        <a href="#y">
          <span>Libellé</span>
        </a>
      </Button>,
    );

    const link = screen.getByText("Libellé").closest("a")!;
    expect(link).toHaveClass("relative");
    // L'indicateur est injecté dans l'enfant, pas rendu à côté de lui.
    expect(link.querySelector("div.rounded-full")).toBeTruthy();
  });

  it("still renders decorations normally without asChild", () => {
    render(
      <Button indicator debug variant="ghost">
        Libellé
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Libellé");
    expect(button).toHaveTextContent("ghost/medium");
    expect(button.querySelector("div.rounded-full")).toBeTruthy();
  });
});
