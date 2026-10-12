import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { Modal } from "@/components/layout/Modal";
import { SidePanel } from "@/components/layout/SidePanel";
import { useBgContext } from "@/components/layout/BgContext";

afterEach(cleanup);

// Radix n'écoute les clics extérieurs qu'au tick suivant l'ouverture.
const nextTick = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));
const pressEscape = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
const modalBody = () => document.querySelector("[data-modal-body]") as HTMLElement;

/** Rend un élément défilable aux yeux de react-remove-scroll (happy-dom n'a ni CSS ni layout). */
const makeScrollable = (element: HTMLElement) => {
  element.style.overflowY = "auto";
  Object.defineProperty(element, "scrollHeight", { value: 1000, configurable: true });
  Object.defineProperty(element, "clientHeight", { value: 300, configurable: true });
  Object.defineProperty(element, "scrollTop", { value: 100, configurable: true, writable: true });
};
const wheel = (target: Element) => {
  const event = new WheelEvent("wheel", { deltaY: 50, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};

/** SidePanel et Modal ouverts côte à côte, au niveau de la page (cas de mediagrade). */
function SiblingPage({ nested = false }: { nested?: boolean }) {
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(true);
  const modal = (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Fields" header={<span>Fields</span>}>
      <div data-testid="modal-content">content</div>
    </Modal>
  );
  return (
    <>
      <SidePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} title="Panel">
        <div data-testid="panel-content">panel</div>
        {nested && modal}
      </SidePanel>
      {!nested && modal}
      <output data-testid="state">{`panel:${panelOpen} modal:${modalOpen}`}</output>
    </>
  );
}
const state = () => screen.getByTestId("state").textContent;

describe("Modal — structure", () => {
  it("header et footer hors de la zone qui défile", () => {
    render(
      <Modal isOpen onClose={() => {}} header={<span>Head</span>} footer={<button>OK</button>}>
        <p>Body</p>
      </Modal>,
    );
    const header = document.querySelector("[data-modal-header]")!;
    const footer = document.querySelector("[data-modal-footer]")!;
    expect(modalBody()).toHaveClass("flex-1", "min-h-0", "overflow-y-auto");
    expect(modalBody()).toContainElement(screen.getByText("Body"));
    expect(modalBody()).not.toContainElement(header as HTMLElement);
    expect(modalBody()).not.toContainElement(footer as HTMLElement);
    expect(header).toHaveClass("shrink-0", "border-b");
    expect(footer).toHaveClass("shrink-0", "border-t");
    expect(header).toHaveTextContent("Head");
  });

  it("header et footer acceptent une fonction", () => {
    render(
      <Modal isOpen onClose={() => {}} header={() => "Head"} footer={() => "Foot"}>
        body
      </Modal>,
    );
    expect(document.querySelector("[data-modal-header]")).toHaveTextContent("Head");
    expect(document.querySelector("[data-modal-footer]")).toHaveTextContent("Foot");
  });

  it("fermée : rien n'est rendu", () => {
    render(<Modal isOpen={false} onClose={() => {}}>body</Modal>);
    expect(document.querySelector("[data-modal]")).toBeNull();
  });

  it("sans padding : le corps n'en a pas (rendu historique), header et footer gardent p-4", () => {
    render(
      <Modal isOpen onClose={() => {}} header="h" footer="f">
        body
      </Modal>,
    );
    expect(modalBody().className).not.toMatch(/\bp-\d/);
    expect(document.querySelector("[data-modal-header]")).toHaveClass("p-4");
    expect(document.querySelector("[data-modal-footer]")).toHaveClass("p-4");
  });

  it("padding commun au header, au corps et au footer", () => {
    render(
      <Modal isOpen onClose={() => {}} padding={8} header="h" footer="f">
        body
      </Modal>,
    );
    expect(modalBody()).toHaveClass("p-8");
    expect(document.querySelector("[data-modal-header]")).toHaveClass("p-8");
    expect(document.querySelector("[data-modal-footer]")).toHaveClass("p-8");
  });
});

describe("Modal — fond", () => {
  const BgProbe = ({ id }: { id: string }) => <span data-testid={id}>{useBgContext()}</span>;

  it("bg=black : fond, texte, séparateurs et contexte transmis aux trois zones", () => {
    render(
      <Modal isOpen onClose={() => {}} bg="black" header={<BgProbe id="h" />} footer={<BgProbe id="f" />}>
        <BgProbe id="b" />
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("bg-black", "text-white");
    expect(dialog).toHaveAttribute("data-bg", "black");
    expect(document.querySelector("[data-modal-header]")).toHaveClass("border-grey-strongest");
    expect(document.querySelector("[data-modal-footer]")).toHaveClass("border-grey-strongest");
    expect(screen.getByTestId("h")).toHaveTextContent("black");
    expect(screen.getByTestId("b")).toHaveTextContent("black");
    expect(screen.getByTestId("f")).toHaveTextContent("black");
  });

  it("bg=white par défaut", () => {
    render(<Modal isOpen onClose={() => {}} footer="f">body</Modal>);
    expect(screen.getByRole("dialog")).toHaveClass("bg-white");
    expect(document.querySelector("[data-modal-footer]")).toHaveClass("border-grey");
  });
});

describe("Modal — accessibilité", () => {
  it("titre accessible par défaut, sans avertissement Radix", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Modal isOpen onClose={() => {}}>body</Modal>);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Dialog");
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    error.mockRestore();
    warn.mockRestore();
  });

  it("title surcharge le titre accessible", () => {
    render(<Modal isOpen onClose={() => {}} title="Catalogue fields">body</Modal>);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Catalogue fields");
  });

  it("initialFocus reçoit le focus à l'ouverture", () => {
    function Page() {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <Modal isOpen onClose={() => {}} initialFocus={ref}>
          <button>first</button>
          <input ref={ref} aria-label="target" />
        </Modal>
      );
    }
    render(<Page />);
    expect(screen.getByLabelText("target")).toHaveFocus();
  });
});

describe("Modal — fermeture", () => {
  it("Échap et clic sur l'overlay appellent onClose", async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose}>body</Modal>);
    pressEscape();
    expect(onClose).toHaveBeenCalledTimes(1);
    await nextTick();
    fireEvent.pointerDown(document.querySelector("[data-modal-overlay]")!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("un clic dans la fenêtre ne ferme pas", async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose}>body</Modal>);
    await nextTick();
    fireEvent.pointerDown(modalBody());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closeOnEscape={false} et closeOnOverlayClick={false}", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnEscape={false} closeOnOverlayClick={false}>
        body
      </Modal>,
    );
    pressEscape();
    await nextTick();
    fireEvent.pointerDown(document.querySelector("[data-modal-overlay]")!);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe.each([
  ["à côté du SidePanel (niveau page)", false],
  ["dans l'arbre React du SidePanel", true],
])("Modal au-dessus d'un SidePanel — %s", (_label, nested) => {
  it("Échap ferme la modale seule, un second Échap ferme le SidePanel", () => {
    render(<SiblingPage nested={nested} />);
    pressEscape();
    expect(state()).toBe("panel:true modal:false");
    pressEscape();
    expect(state()).toBe("panel:false modal:false");
  });

  it("un clic sur l'overlay de la modale ne ferme que la modale", async () => {
    render(<SiblingPage nested={nested} />);
    await nextTick();
    fireEvent.pointerDown(document.querySelector("[data-modal-overlay]")!);
    expect(state()).toBe("panel:true modal:false");
  });

  it("un clic dans la modale ne ferme ni la modale ni le SidePanel", async () => {
    render(<SiblingPage nested={nested} />);
    await nextTick();
    fireEvent.pointerDown(screen.getByTestId("modal-content"));
    expect(state()).toBe("panel:true modal:true");
  });

  it("le focus est dans la modale", () => {
    render(<SiblingPage nested={nested} />);
    expect(document.querySelector("[data-modal]")).toContainElement(document.activeElement as HTMLElement);
  });

  it("le corps de la modale n'est pas bloqué : seul le dernier verrou de défilement s'applique", () => {
    render(<SiblingPage nested={nested} />);
    makeScrollable(modalBody());
    const content = screen.getByTestId("modal-content");
    expect(wheel(content).defaultPrevented).toBe(false);
    // Hors de la modale (SidePanel compris), la molette reste bloquée.
    expect(wheel(screen.getByTestId("panel-content")).defaultPrevented).toBe(true);
  });

  it("la modale est rendue après le SidePanel (devant, à z-index égal)", () => {
    render(<SiblingPage nested={nested} />);
    // Le SidePanel est masqué aux technologies d'assistance (aria-hidden) : requête DOM directe.
    const dialogs = document.querySelectorAll('[role="dialog"]');
    expect(dialogs).toHaveLength(2);
    expect(dialogs[dialogs.length - 1]).toHaveAttribute("data-modal");
    expect(document.querySelector("[data-modal-overlay]")).toHaveClass("z-50");
  });
});
