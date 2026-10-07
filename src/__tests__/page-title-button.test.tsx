import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import PageTitle from "@/components/PageHeader/PageTitle";

afterEach(() => cleanup());

// Le Button de la librairie porte une classe par variant (btn-secondary, btn-ghost…).

describe("PageTitle — bouton du titre", () => {
  it("est secondary sans bouton retour", () => {
    render(<PageTitle title="BRANDX" />);
    const button = screen.getByTestId("page-title-button");
    expect(button).toHaveClass("btn-secondary");
    expect(button).not.toHaveClass("btn-ghost");
  });

  it("passe en ghost quand le bouton retour est affiché", () => {
    render(<PageTitle title="BRANDX" showBackButton />);
    const button = screen.getByTestId("page-title-button");
    expect(button).toHaveClass("btn-ghost");
    expect(button).not.toHaveClass("btn-secondary");
  });
});
