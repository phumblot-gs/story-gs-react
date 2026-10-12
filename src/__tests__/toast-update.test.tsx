import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Toaster, toast, dismissToast } from "@/components/ui/sonner";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  act(() => {
    dismissToast();
    vi.runAllTimers();
  });
  cleanup();
  vi.useRealTimers();
});

const toasts = () => document.querySelectorAll("[data-sonner-toast]");
// Sonner publie ses changements au tick suivant.
const show = (props: Parameters<typeof toast>[0]) =>
  act(() => {
    toast(props);
    vi.advanceTimersByTime(0);
  });
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe("toast — mise à jour par id", () => {
  it("même id : un seul toast, texte mis à jour, même élément", () => {
    render(<Toaster />);
    show({ id: "sort", type: "loading", title: "Analyse des visuels en cours (1 référence)" });
    const first = toasts()[0];
    show({ id: "sort", type: "loading", title: "Analyse des visuels en cours (2 références)" });
    show({ id: "sort", type: "loading", title: "Analyse des visuels en cours (3 références)" });
    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toBe(first);
    expect(first).toHaveTextContent("(3 références)");
  });

  it("une mise à jour partielle garde la description", () => {
    render(<Toaster />);
    show({ id: "x", title: "A", description: "Détail" });
    show({ id: "x", title: "B" });
    expect(toasts()[0]).toHaveTextContent("B");
    expect(toasts()[0]).toHaveTextContent("Détail");
  });

  it("chargement → succès : même toast, type et icône changés", () => {
    render(<Toaster />);
    show({ id: "sort", type: "loading", title: "Tri automatique des visuels" });
    const first = toasts()[0];
    expect(first).toHaveAttribute("data-type", "loading");
    expect(first.querySelector("[data-spinner]")).not.toBeNull();
    show({ id: "sort", type: "success", title: "Tri des visuels terminé" });
    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toBe(first);
    expect(first).toHaveAttribute("data-type", "success");
    expect(first.querySelector("[data-spinner]")).toBeNull();
    expect(first).toHaveTextContent("Tri des visuels terminé");
  });

  it("chargement → erreur : même toast", () => {
    render(<Toaster />);
    show({ id: "sort", type: "loading", title: "Tri" });
    const first = toasts()[0];
    show({ id: "sort", type: "error", title: "Échec du tri" });
    expect(toasts()[0]).toBe(first);
    expect(first).toHaveAttribute("data-type", "error");
  });

  it("un toast loading ne disparaît pas avant la fin d'une action longue ; le délai du succès commence après", () => {
    render(<Toaster />);
    show({ id: "long", type: "loading", title: "Import" });
    advance(60_000);
    expect(toasts()).toHaveLength(1);

    show({ id: "long", type: "success", title: "Import terminé" });
    advance(2_500);
    expect(toasts()).toHaveLength(1);
    advance(1_000);
    advance(1_000); // animation de sortie
    expect(toasts()).toHaveLength(0);
  });

  it("duration: Infinity : reste affiché, même après une mise à jour sans durée", () => {
    render(<Toaster />);
    show({ id: "inf", type: "info", title: "1", duration: Infinity });
    show({ id: "inf", type: "info", title: "2" });
    advance(60_000);
    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toHaveTextContent("2");
  });

  it("dismissToast(id) ferme ce toast seulement", () => {
    render(<Toaster />);
    show({ id: "a", title: "A", duration: Infinity });
    show({ id: "b", title: "B", duration: Infinity });
    act(() => void dismissToast("a"));
    advance(1_000);
    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toHaveTextContent("B");
  });

  it("sans id : comportement inchangé (un toast par appel, 3 s par défaut)", () => {
    render(<Toaster />);
    show({ title: "A" });
    show({ title: "B" });
    expect(toasts()).toHaveLength(2);
    advance(5_000);
    expect(toasts()).toHaveLength(0);
  });

  it("le spinner du toast est décoratif (pas d'annonce en double dans la zone live)", () => {
    render(<Toaster />);
    show({ id: "s", type: "loading", title: "Tri" });
    expect(toasts()[0].querySelector("[role=status]")).toBeNull();
    expect(toasts()[0].querySelector("[data-spinner]")).toHaveAttribute("aria-hidden", "true");
  });
});
