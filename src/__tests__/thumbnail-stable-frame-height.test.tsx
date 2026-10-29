import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Thumbnail } from "@/components/Thumbnail";

afterEach(cleanup);

/**
 * Avec une taille fixe, le cadre de l'image garde la même hauteur (bordures comprises) quel que soit l'état de
 * l'image : une grille virtualisée mesure ses lignes, et une différence de 2 px entre une image en attente et une
 * image chargée la faisait osciller jusqu'à la boucle de rendu (React #185).
 */
describe("Thumbnail with a fixed size", () => {
  const frameOf = (container: HTMLElement) => container.querySelector<HTMLElement>("img")?.parentElement
    ?? container.querySelector<HTMLElement>("[data-image-pending]")
    ?? container.querySelector<HTMLElement>("[data-image-error]")?.parentElement;

  it("gives the frame the size as its height, image pending or shown", () => {
    const pending = render(<Thumbnail picture_id={1} src="/a.jpg" size="239px" imagePending />);
    expect(frameOf(pending.container)).toHaveStyle({ height: "239px" });
    cleanup();
    const shown = render(<Thumbnail picture_id={1} src="/a.jpg" size="239px" />);
    const img = shown.container.querySelector("img");
    expect(frameOf(shown.container)).toHaveStyle({ height: "239px" });
    // the image fits inside the frame, its borders included
    expect(img).toHaveStyle({ maxHeight: "100%" });
  });

  it("keeps the size as the image's maximum height in auto size", () => {
    const { container } = render(<Thumbnail picture_id={1} src="/a.jpg" size="auto" />);
    expect(container.querySelector("img")?.style.maxHeight).toBe("");
  });
});
