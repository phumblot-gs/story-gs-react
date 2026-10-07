import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import PageSearch from "@/components/PageSearch";

afterEach(() => cleanup());

const left = () => screen.getByText("Left").parentElement!;

describe("PageSearch", () => {
  it("a un padding de 20px en haut et en bas (py-4), sans padding propre à gauche", () => {
    const { container } = render(<PageSearch leftContent={<span>Left</span>} />);
    expect(container.firstElementChild).toHaveClass("px-4", "py-4");
    expect(left()).not.toHaveClass("py-2");
  });

  it("n'impose plus de largeur maximale au contenu de gauche", () => {
    render(<PageSearch leftContent={<span>Left</span>} />);
    expect(left().className).not.toMatch(/max-w-/);
    cleanup();
    render(<PageSearch leftContent={<span>Left</span>} leftContentMaxWidth="max-w-md" />);
    expect(left()).toHaveClass("max-w-md");
  });

  it("décale le contenu de gauche de 3px avec alignWithContactSheet", () => {
    render(<PageSearch leftContent={<span>Left</span>} />);
    expect(left()).not.toHaveClass("-ml-[3px]");
    cleanup();
    render(<PageSearch leftContent={<span>Left</span>} alignWithContactSheet />);
    expect(left()).toHaveClass("-ml-[3px]");
  });
});
