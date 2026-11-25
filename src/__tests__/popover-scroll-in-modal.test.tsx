import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { Modal } from "@/components/layout/Modal";
import { SidePanel } from "@/components/layout/SidePanel";
import { SelectAutocomplete } from "@/components/ui/select-autocomplete";
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

/*
 * Un SidePanel ou un Dialog Radix verrouille le défilement avec react-remove-scroll : un écouteur wheel / touchmove
 * sur document annule tout évènement qui ne vient ni de l'overlay (où le verrou est posé) ni de la fenêtre. Un menu
 * non modal rendu dans un Portal (sous <body>) n'est ni l'un ni l'autre : sa liste ne défilait plus. La Modal de la
 * librairie y échappait dans un navigateur (sa fenêtre est rendue dans l'overlay, l'évènement remonte donc par lui
 * dans l'arbre React), pas ici : sans mise en page, happy-dom voit une liste qui ne défile pas.
 * Les menus de la librairie arrêtent la propagation de ces évènements, qui n'atteignent plus le verrou : le
 * défilement natif de la liste reprend, et le verrou reste actif partout ailleurs.
 */

afterEach(cleanup);

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

const wheel = (target: Element) => {
  const event = new WheelEvent("wheel", { deltaY: 50, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};
const touchMove = (target: Element) => {
  const event = new Event("touchmove", { bubbles: true, cancelable: true });
  // react-remove-scroll lit le premier point de contact
  const touches = [{ clientX: 0, clientY: 0 }];
  Object.defineProperties(event, { touches: { value: touches }, changedTouches: { value: touches } });
  target.dispatchEvent(event);
  return event;
};

/** La molette faite dans le menu atteint-elle l'écouteur du verrou, sur document ? */
const reachesDocument = (target: Element) => {
  let reached = false;
  const spy = () => { reached = true; };
  document.addEventListener("wheel", spy);
  wheel(target);
  document.removeEventListener("wheel", spy);
  return reached;
};

const OPTIONS = Array.from({ length: 40 }, (_, i) => ({ value: `s${i}`, label: `Fournisseur ${i}` }));

const containers = [
  ["Modal", (children: React.ReactNode) => (
    <Modal isOpen onClose={() => {}} title="Projet" header={<span>Projet</span>}>
      {children}
    </Modal>
  )],
  ["SidePanel", (children: React.ReactNode) => (
    <SidePanel isOpen onClose={() => {}} title="Projet">
      {children}
    </SidePanel>
  )],
] as const;

describe.each(containers)("défilement des menus dans un %s", (_name, wrap) => {
  it("SelectAutocomplete : la molette et le doigt ne sont pas annulés sur la liste", async () => {
    render(wrap(<SelectAutocomplete options={OPTIONS} placeholder="Fournisseur" />));
    await tick();
    fireEvent.click(screen.getByRole("combobox"));
    const list = await screen.findByRole("listbox");
    expect(wheel(list).defaultPrevented).toBe(false);
    expect(touchMove(list).defaultPrevented).toBe(false);
    // la propagation s'arrête dans le menu : le verrou sur document ne voit rien
    let reached = false;
    const spy = () => { reached = true; };
    document.addEventListener("wheel", spy);
    wheel(list);
    document.removeEventListener("wheel", spy);
    expect(reached).toBe(false);
  });

  it("PopoverContent : le contenu défile", async () => {
    render(
      wrap(
        <Popover open>
          <PopoverTrigger>Ouvrir</PopoverTrigger>
          <PopoverContent>
            <div data-testid="popover-body">contenu</div>
          </PopoverContent>
        </Popover>
      )
    );
    await tick();
    expect(wheel(screen.getByTestId("popover-body")).defaultPrevented).toBe(false);
    expect(touchMove(screen.getByTestId("popover-body")).defaultPrevented).toBe(false);
  });

  it("DropdownMenu non modal : le menu défile", async () => {
    render(
      wrap(
        <DropdownMenu modal={false} open>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Label</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    );
    await tick();
    expect(wheel(screen.getByRole("menuitem")).defaultPrevented).toBe(false);
  });

  it("ContextMenu non modal : la molette ne remonte pas au verrou", async () => {
    render(
      wrap(
        <ContextMenu modal={false}>
          <ContextMenuTrigger>Zone</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copier</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    );
    await tick();
    fireEvent.contextMenu(screen.getByText("Zone"));
    const item = await screen.findByRole("menuitem", { name: "Copier" });
    expect(reachesDocument(item)).toBe(false);
  });

  it("Menubar : la molette ne remonte pas au verrou", async () => {
    render(
      wrap(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Fichier</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Ouvrir</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
    );
    await tick();
    const trigger = screen.getByRole("menuitem", { name: "Fichier" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const item = await screen.findByRole("menuitem", { name: "Ouvrir" });
    expect(reachesDocument(item)).toBe(false);
  });

  it("MultiSelect (Popover modal) : la liste défile toujours", async () => {
    render(wrap(<MultiSelect options={OPTIONS} aria-label="Fournisseurs" />));
    await tick();
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    await tick();
    expect(wheel(screen.getByRole("listbox")).defaultPrevented).toBe(false);
  });

  it("hors des menus, le verrou de la fenêtre reste actif", async () => {
    render(
      <>
        {wrap(<SelectAutocomplete options={OPTIONS} />)}
        <div data-testid="page">page</div>
      </>
    );
    await tick();
    expect(wheel(screen.getByTestId("page")).defaultPrevented).toBe(true);
  });
});
