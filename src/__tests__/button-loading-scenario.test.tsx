import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { ButtonLoadingDemo } from "@/stories/ButtonLoadingDemo";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const button = () => screen.getByRole("button");
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe("Button — scénario clic → chargement → succès", () => {
  it("un clic déclenche une seule action ; disabled et busy pendant l'action ; clics répétés ignorés", () => {
    const onAction = vi.fn();
    render(<ButtonLoadingDemo onAction={onAction} />);
    expect(button()).toHaveAccessibleName("Importer les visuels");
    fireEvent.click(button());
    fireEvent.click(button());
    fireEvent.click(button());
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(button()).toBeDisabled();
    expect(button()).toHaveAttribute("aria-busy", "true");
    expect(button()).toHaveAccessibleName("Import en cours…");
  });

  it("le succès remplace le chargement et réactive le bouton, puis retour au libellé initial", () => {
    render(<ButtonLoadingDemo />);
    fireEvent.click(button());
    advance(3000);
    expect(button()).toBeEnabled();
    expect(button()).not.toHaveAttribute("aria-busy");
    expect(button()).toHaveAccessibleName("Import terminé");
    expect(button().querySelector("[data-spinner]")).toHaveAttribute("aria-hidden", "true");
    advance(1500);
    expect(button()).toHaveAccessibleName("Importer les visuels");
  });

  it("le scénario peut être rejoué", () => {
    const onAction = vi.fn();
    render(<ButtonLoadingDemo onAction={onAction} />);
    fireEvent.click(button());
    advance(4500);
    fireEvent.click(button());
    expect(onAction).toHaveBeenCalledTimes(2);
    expect(button()).toHaveAttribute("aria-busy", "true");
  });

  it("un redémarrage pendant le succès n'est pas interrompu par l'ancienne temporisation", () => {
    render(<ButtonLoadingDemo />);
    fireEvent.click(button());
    advance(3000); // succès
    advance(1000);
    fireEvent.click(button()); // nouvelle action, 500 ms avant l'ancien retour automatique
    advance(600);
    expect(button()).toHaveAttribute("aria-busy", "true");
    expect(button()).toHaveAccessibleName("Import en cours…");
  });

  it("l'échec réactive le bouton, avec un message accessible, et permet de réessayer", () => {
    const onAction = vi.fn();
    render(<ButtonLoadingDemo fail onAction={onAction} />);
    fireEvent.click(button());
    advance(3000);
    expect(button()).toBeEnabled();
    expect(button()).toHaveAccessibleName("Réessayer l'import");
    expect(screen.getByRole("status")).toHaveTextContent("L'import a échoué.");
    fireEvent.click(button());
    expect(onAction).toHaveBeenCalledTimes(2);
  });

  it("les temporisations sont nettoyées au démontage", () => {
    const { unmount } = render(<ButtonLoadingDemo />);
    const baseline = vi.getTimerCount(); // temporisations internes de React / happy-dom
    fireEvent.click(button());
    expect(vi.getTimerCount()).toBe(baseline + 1);
    unmount();
    expect(vi.getTimerCount()).toBeLessThanOrEqual(baseline);
  });
});
