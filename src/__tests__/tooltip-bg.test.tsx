import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Layout } from "@/components/layout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBgContext } from "@/components/layout/BgContext";

/**
 * Le Tooltip s'adapte au fond sur lequel il s'affiche : noir (texte blanc,
 * bordure black-secondary) sur fond blanc, gris ou inconnu ; inversé (blanc,
 * texte noir, bordure grise) sur fond noir.
 */

afterEach(() => cleanup());

function BgProbe() {
  return <span data-testid="probe" data-probe-bg={useBgContext()} />;
}

const renderTooltip = (layoutBg?: "white" | "grey" | "black", bg?: "white" | "grey" | "black") => {
  const tooltip = (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent bg={bg}>
          Tip <BgProbe />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  const utils = render(layoutBg ? <Layout bg={layoutBg}>{tooltip}</Layout> : tooltip);
  const content = utils.baseElement.querySelector("[data-surface]") as HTMLElement;
  return { ...utils, content };
};

describe("Tooltip — apparence selon le fond", () => {
  it.each([undefined, "white", "grey"] as const)("est noir sur fond %s", (layoutBg) => {
    const { content } = renderTooltip(layoutBg);
    expect(content).toHaveAttribute("data-surface", "dark");
    expect(content).toHaveClass("bg-black", "text-white", "border-black-secondary", "rounded-[2px]");
  });

  it("est inversé sur fond noir", () => {
    const { content } = renderTooltip("black");
    expect(content).toHaveAttribute("data-surface", "light");
    expect(content).toHaveClass("bg-white", "text-black", "border-grey-strong", "rounded-[2px]");
    expect(content).not.toHaveClass("bg-black");
  });

  it("suit la prop bg plutôt que le contexte", () => {
    expect(renderTooltip("white", "black").content).toHaveAttribute("data-surface", "light");
    cleanup();
    expect(renderTooltip("black", "white").content).toHaveAttribute("data-surface", "dark");
  });

  it("transmet sa propre surface à son contenu", () => {
    const dark = renderTooltip("white");
    expect(dark.content).toHaveAttribute("data-bg", "black");
    expect(dark.getAllByTestId("probe")[0]).toHaveAttribute("data-probe-bg", "black");
    cleanup();
    const light = renderTooltip("black");
    expect(light.content).toHaveAttribute("data-bg", "white");
    expect(light.getAllByTestId("probe")[0]).toHaveAttribute("data-probe-bg", "white");
  });

  it("garde les classes passées en className", () => {
    const { baseElement } = render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent className="max-w-[200px]">Tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(baseElement.querySelector("[data-surface]")).toHaveClass("max-w-[200px]", "bg-black");
  });
});
