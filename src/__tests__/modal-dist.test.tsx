import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";

/**
 * SidePanel et Modal ouverts depuis le bundle construit (dist/index.mjs, ce que
 * publie npm). La pile de calques de Radix ne fonctionne que si les deux
 * composants partagent la même copie de @radix-ui/react-dialog : Échap ne doit
 * fermer que la modale. Lancé quand dist/ existe (après `npm run build:lib`).
 */
const DIST = resolve(__dirname, "../../dist/index.mjs");

afterEach(cleanup);

describe.skipIf(!existsSync(DIST))("bundle publié — Modal au-dessus d'un SidePanel", () => {
  it("Échap ferme la modale seule, puis le SidePanel", async () => {
    const { Modal, SidePanel } = await import(/* @vite-ignore */ DIST);

    function Page() {
      const [panelOpen, setPanelOpen] = React.useState(true);
      const [modalOpen, setModalOpen] = React.useState(true);
      return (
        <>
          <SidePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)}>panel</SidePanel>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>modal</Modal>
          <output data-testid="state">{`panel:${panelOpen} modal:${modalOpen}`}</output>
        </>
      );
    }

    render(<Page />);
    const escape = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    escape();
    expect(screen.getByTestId("state")).toHaveTextContent("panel:true modal:false");
    escape();
    expect(screen.getByTestId("state")).toHaveTextContent("panel:false modal:false");
  });
});
