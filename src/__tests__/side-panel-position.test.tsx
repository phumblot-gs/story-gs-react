import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { SidePanel } from "@/components/layout/SidePanel";

/**
 * Le contenu du SidePanel est `fixed` dans un portail en fin de <body>. Sans
 * `top`, il se plaçait sous tout le contenu de la page : invisible dès que la
 * page dépasse la hauteur de la fenêtre. Il doit être ancré en haut (`top-0`),
 * `topOffset` restant prioritaire — y compris `topOffset={0}`.
 */

afterEach(() => cleanup());

const renderPanel = (topOffset?: string | number) =>
  render(
    <SidePanel isOpen onClose={vi.fn()} topOffset={topOffset} title="Panel">
      <p>Contenu</p>
    </SidePanel>,
  );

const panel = () => screen.getByRole("dialog");

describe("SidePanel — position verticale", () => {
  it("est ancré en haut de la fenêtre sans topOffset", () => {
    renderPanel();
    expect(panel()).toHaveClass("fixed", "top-0");
    expect(panel().style.top).toBe("");
  });

  it.each([
    ["50px", "50px"],
    [50, "50px"],
  ])("applique topOffset=%s en style inline (prioritaire sur top-0)", (offset, expected) => {
    renderPanel(offset);
    expect(panel()).toHaveStyle({ top: expected });
    expect(panel().style.height).toBe(`calc(100% - ${expected})`);
  });

  it("prend en compte topOffset={0}", () => {
    renderPanel(0);
    expect(panel()).toHaveStyle({ top: "0px" });
    expect(panel().style.height).toBe("calc(100% - 0px)");
  });

  it("garde l'animation d'entrée et de sortie", () => {
    renderPanel();
    expect(panel()).toHaveClass(
      "data-[state=open]:slide-in-from-right",
      "data-[state=closed]:slide-out-to-right",
      "data-[state=open]:animate-in",
      "data-[state=closed]:animate-out",
    );
  });
});
