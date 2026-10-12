import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Stepper, type StepperStep } from "@/components/ui/stepper";
import { FullFrame } from "@/components/layout/FullFrame";

afterEach(cleanup);

const steps: StepperStep[] = [
  { label: 1, title: "Images", state: "completed" },
  { label: 2, title: "Catalogue", state: "active" },
  { label: 3, title: "Rapprochement" },
];

describe("Stepper — layout inline", () => {
  it("titre à droite du rond, dans le même bouton ; ronds de 30 px (h-6 w-6)", () => {
    render(<Stepper layout="inline" steps={steps} />);
    const step = screen.getByRole("button", { name: "Catalogue" });
    const circle = step.querySelector(".stepper-step")!;
    expect(circle).toHaveClass("h-6", "w-6");
    expect(step).toHaveTextContent("2Catalogue");
    expect(step.lastElementChild).toHaveTextContent("Catalogue");
  });

  it("actif en gras et aria-current, à venir cerclé sans fond et gris, terminé avec une coche", () => {
    render(<Stepper layout="inline" steps={steps} />);
    const active = screen.getByRole("button", { name: "Catalogue" });
    expect(active).toHaveAttribute("aria-current", "step");
    expect(active.lastElementChild).toHaveClass("font-semibold");

    const future = screen.getByRole("button", { name: "Rapprochement" });
    const futureCircle = future.querySelector(".stepper-step") as HTMLElement;
    expect(futureCircle.style.backgroundColor).toBe("transparent");
    expect(futureCircle.style.border).toContain("1px solid");
    expect(future.lastElementChild).toHaveClass("text-grey-strongest");

    const done = screen.getByRole("button", { name: "Images" });
    expect(done.querySelector(".stepper-step svg")).not.toBeNull();
  });

  it("traits fins entre les étapes seulement", () => {
    const { container } = render(<Stepper layout="inline" steps={steps} />);
    const connectors = container.querySelectorAll('[data-layout="inline"] > [aria-hidden="true"]');
    expect(connectors).toHaveLength(2);
    expect(connectors[0]).toHaveClass("h-px", "w-6", "mx-3");
  });

  it("étape terminée cliquable avec allowCompletedClick", () => {
    const onStepClick = vi.fn();
    render(<Stepper layout="inline" steps={steps} allowCompletedClick onStepClick={onStepClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Images" }));
    expect(onStepClick).toHaveBeenCalledWith(0, steps[0]);
    expect(screen.getByRole("button", { name: "Rapprochement" })).toBeDisabled();
  });

  it("sans layout : rendu stacked inchangé (titre sous le rond de 40 px)", () => {
    const { container } = render(<Stepper steps={steps} />);
    expect(container.querySelector('[data-layout="inline"]')).toBeNull();
    expect(container.querySelector(".stepper-step")).toHaveClass("w-8", "h-8");
  });
});

describe("FullFrame — padding commun", () => {
  const header = () => screen.getByText("Projet").closest(".shrink-0") as HTMLElement;
  const body = () => screen.getByText("Body").parentElement as HTMLElement;

  it("padding={6} : px-6 sur le header, p-6 sur le body (contenus alignés)", () => {
    render(
      <FullFrame padding={6} headerContent={<span>Projet</span>}>
        <p>Body</p>
      </FullFrame>,
    );
    expect(header()).toHaveClass("px-6", "min-h-12");
    expect(header()).not.toHaveClass("px-3");
    expect(body()).toHaveClass("p-6");
  });

  it("sans padding : rendu historique (header px-3, body sans padding)", () => {
    render(
      <FullFrame headerContent={<span>Projet</span>}>
        <p>Body</p>
      </FullFrame>,
    );
    expect(header()).toHaveClass("px-3");
    expect(body().className).not.toMatch(/\bp-\d/);
  });
});
