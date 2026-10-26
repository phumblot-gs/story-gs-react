import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Layout } from "@/components/layout";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

/**
 * HoverCard used to render inside the trigger's Layout bg, where bg-popover resolved to an invalid
 * colour: a transparent card. It now has charter defaults and is portalled (CR-684 vedette preview).
 */

afterEach(() => cleanup());

const renderCard = (surface?: "light" | "dark") =>
  render(
    <Layout bg="grey">
      <HoverCard defaultOpen>
        <HoverCardTrigger asChild>
          <button type="button">Trigger</button>
        </HoverCardTrigger>
        <HoverCardContent surface={surface}>Card</HoverCardContent>
      </HoverCard>
    </Layout>,
  );

describe("HoverCardContent — valeurs par défaut de la charte", () => {
  it("surface claire, bordure grey-strong, rayon 2px, padding 10px, sans bg-popover", () => {
    renderCard();
    const card = screen.getByText("Card").closest("[data-surface]")!;
    expect(card).toHaveAttribute("data-surface", "light");
    expect(card).toHaveAttribute("data-bg", "white");
    expect(card).toHaveClass("bg-white", "text-black", "border", "border-grey-strong", "rounded-sm", "p-2", "shadow-md");
    expect(card.className).not.toMatch(/bg-popover|rounded-md|w-64/);
  });

  it("est rendue dans document.body, hors du Layout du déclencheur", () => {
    const { container } = renderCard();
    expect(container).not.toContainElement(screen.getByText("Card"));
    expect(screen.getByText("Card").closest("[data-bg='grey']")).toBeNull();
  });

  it("surface sombre sur demande", () => {
    renderCard("dark");
    const card = screen.getByText("Card").closest("[data-surface]")!;
    expect(card).toHaveAttribute("data-bg", "black");
    expect(card).toHaveClass("bg-black", "text-white");
  });
});
