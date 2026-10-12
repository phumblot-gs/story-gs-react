import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ButtonMenuSmall } from "@/components/ui/button-menu-small";
import { Layout } from "@/components/layout/Layout";

afterEach(cleanup);

const tokensCss = readFileSync(resolve(__dirname, "../styles/figma-tokens.css"), "utf8");

describe("variant inverse", () => {
  it("Button et les composants qui en dérivent posent btn-inverse", () => {
    render(
      <Layout bg="white">
        <Button variant="inverse">B</Button>
        <Toggle variant="inverse">T</Toggle>
        <ButtonMenuSmall variant="inverse" actions={[{ label: "A" }]}>M</ButtonMenuSmall>
      </Layout>,
    );
    for (const name of ["B", "T", "M"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveClass("btn-inverse");
      expect(button).toHaveAttribute("data-bg", "white");
    }
  });

  it.each([
    ["w", "#292828", "#ffffff"],
    ["g", "#292828", "#ffffff"],
    ["b", "#ffffff", "#292828"],
  ])("jetons fond %s : repos %s / %s, survol et appui bleu / noir", (bg, restBg, restFg) => {
    const token = (name: string) => tokensCss.match(new RegExp(`--button-${bg}-inverse-${name}: ([^;]+);`))?.[1];
    expect(token("bg-default")).toBe(restBg);
    expect(token("fg-default")).toBe(restFg);
    expect(token("bg-hover")).toBe("#cdedff");
    expect(token("fg-hover")).toBe("#292828");
    expect(token("bg-pressed")).toBe("#cdedff");
    expect(token("fg-pressed")).toBe("#292828");
  });

  it("classes générées pour les trois fonds et les quatre états", () => {
    for (const bg of ["white", "grey", "black"]) {
      expect(tokensCss).toContain(`[data-bg="${bg}"].btn-inverse {`);
      expect(tokensCss).toContain(`[data-bg="${bg}"].btn-inverse:hover:not(:disabled) {`);
      expect(tokensCss).toContain(`[data-bg="${bg}"].btn-inverse:active:not(:disabled) {`);
      expect(tokensCss).toContain(`[data-bg="${bg}"].btn-inverse:disabled {`);
    }
  });
});
