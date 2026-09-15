import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import PageHeader from "@/components/PageHeader";

/**
 * `onLogoClick` enveloppe la zone de marque dans un vrai `<button>`. Le modèle
 * de contenu de `<button>` n'accepte que du *phrasing content*, donc ni la zone
 * de marque ni `BrandLogo` ne doivent produire de `<div>`.
 */

afterEach(() => cleanup());

const bouton = () => screen.getByRole("button", { name: /accueil|home/i });

describe("PageHeader — logo cliquable", () => {
  it("sans onLogoClick, aucun bouton de logo n'est rendu", () => {
    render(<PageHeader title="T" />);
    expect(
      screen.queryByRole("button", { name: /accueil|home/i })
    ).not.toBeInTheDocument();
  });

  it("avec onLogoClick, rend un <button type=button> et l'appelle au clic", async () => {
    const onLogoClick = vi.fn();
    render(<PageHeader title="T" onLogoClick={onLogoClick} />);
    const b = bouton();
    expect(b).toHaveAttribute("type", "button");
    await userEvent.click(b);
    expect(onLogoClick).toHaveBeenCalledTimes(1);
  });

  it("le libellé accessible vient de l'i18n, pas d'une chaîne en dur", () => {
    render(<PageHeader title="T" onLogoClick={() => {}} />);
    // La clé pageHeader.home doit être résolue : ni la clé brute, ni "home" minuscule
    const label = bouton().getAttribute("aria-label")!;
    expect(label).not.toBe("home");
    expect(label).not.toContain("pageHeader.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("ne contient aucun <div> dans le bouton (BrandLogo par défaut)", () => {
    render(<PageHeader title="T" onLogoClick={() => {}} />);
    expect(bouton().querySelectorAll("div")).toHaveLength(0);
  });

  it("ne contient aucun <div> dans le bouton avec un logo personnalisé", () => {
    render(
      <PageHeader
        title="T"
        onLogoClick={() => {}}
        logo={<img src="/l.png" alt="l" />}
      />
    );
    expect(bouton().querySelectorAll("div")).toHaveLength(0);
  });
});
