import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { ButtonStatus } from "@/components/ButtonStatus";
import { Toggle } from "@/components/ui/toggle";
import { ButtonMenuSmall } from "@/components/ui/button-menu-small";
import { Stepper } from "@/components/ui/stepper";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * Règle homogène sur les boutons « actifs » : aria-pressed pour un interrupteur
 * (Toggle, ButtonStatus), aria-expanded pour un déclencheur de menu (sans
 * aria-pressed), aria-current pour la position dans une navigation (Stepper).
 */

afterEach(() => cleanup());

describe("états actifs — attributs ARIA", () => {
  it("ButtonStatus : aria-pressed suit isActive, aria-label surchargeable", () => {
    const { rerender } = render(<ButtonStatus status={MediaStatus.VALIDATED} icon="Check" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    rerender(<ButtonStatus status={MediaStatus.VALIDATED} icon="Check" isActive aria-label="Validate" />);
    expect(screen.getByRole("button", { name: "Validate" })).toHaveAttribute("aria-pressed", "true");
  });

  it("Toggle : aria-pressed (inchangé)", () => {
    render(<Toggle isActive>On</Toggle>);
    expect(screen.getByRole("button", { name: "On" })).toHaveAttribute("aria-pressed", "true");
  });

  it("déclencheur de menu : aria-expanded, sans aria-pressed", () => {
    render(<ButtonMenuSmall actions={[{ value: "a", label: "A", onClick: vi.fn() }]} aria-label="Menu" />);
    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-pressed");
  });

  it("Stepper : aria-current=step sur l'étape en cours", () => {
    render(
      <Stepper
        steps={[
          { label: "One", state: "completed" },
          { label: "Two", state: "active" },
          { label: "Three", state: "future" },
        ]}
      />,
    );
    const current = document.querySelectorAll("[aria-current='step']");
    expect(current).toHaveLength(1);
  });
});
