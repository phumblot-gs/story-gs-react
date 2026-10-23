import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import PageHeader from "@/components/PageHeader";

/** `titleContent` (après le titre, avant son bouton) et `titleButtonTooltip` (infobulle et libellé du bouton du titre). */

afterEach(() => cleanup());

describe("PageHeader — contenu du titre et infobulle du bouton", () => {
  it("sans les deux props, le bouton du titre n'a ni libellé ni infobulle", () => {
    render(<PageHeader title="T" />);
    const b = screen.getByTestId("page-title-button");
    expect(b).not.toHaveAttribute("aria-label");
    expect(b).not.toHaveAttribute("data-state");
  });

  it("titleContent est rendu entre le titre et le bouton du titre", () => {
    render(<PageHeader title="Mon titre" titleContent={<span>Très urgent</span>} />);
    const title = screen.getByRole("heading", { name: "Mon titre" });
    const badge = screen.getByText("Très urgent");
    const button = screen.getByTestId("page-title-button");
    expect(title.compareDocumentPosition(badge) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(badge.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("titleContent est rendu même sans bouton du titre", () => {
    render(<PageHeader title="T" showTitleButton={false} titleContent={<span>Badge</span>} />);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("titleButtonTooltip nomme le bouton, affiche l'infobulle au survol et garde le clic", async () => {
    const onClick = vi.fn();
    render(<PageHeader title="T" titleButtonIcon="Share" titleButtonTooltip="Ouvrir GS" onTitleButtonClick={onClick} />);
    const b = screen.getByRole("button", { name: "Ouvrir GS" });
    await userEvent.hover(b);
    expect((await screen.findAllByText("Ouvrir GS")).length).toBeGreaterThan(0);
    await userEvent.click(b);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
