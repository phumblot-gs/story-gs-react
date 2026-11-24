import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { Thumbnail, type ThumbnailStatusButton } from "@/components/Thumbnail";
import { MediaStatus } from "@/utils/mediaStatus";
import { filterRejectionReasons } from "@/components/Thumbnail/rejection-reasons";

/**
 * Boutons de statut génériques : l'application passe la liste des boutons en
 * données (`statusButtons`) et reçoit la clé du bouton cliqué
 * (`onStatusButtonClick`). Aucune règle de statut codée en dur.
 */

afterEach(() => cleanup());

const baseProps = { picture_id: 1, src: "/photo.jpg", filename: "photo.jpg", status: MediaStatus.SUBMITTED_FOR_APPROVAL };
const select: ThumbnailStatusButton = { key: "select", icon: "Check", status: MediaStatus.SELECTED, label: "Select" };
const refuse: ThumbnailStatusButton = { key: "refuse", icon: "X", status: MediaStatus.REFUSED_1, label: "Refuse" };
const validate: ThumbnailStatusButton = { key: "validate", icon: "Check", status: MediaStatus.VALIDATED, label: "Validate" };
const statusRow = (container: HTMLElement) => container.querySelector(".min-h-\\[40px\\]");
const bench = { config: { validation: { rejection_options: { active: true, main: ["Blurry"], secondary: ["Other"] } } } };

describe("Thumbnail — statusButtons", () => {
  it("1 bouton : le clic remonte sa clé", async () => {
    const onStatusButtonClick = vi.fn();
    render(<Thumbnail {...baseProps} statusButtons={[select]} onStatusButtonClick={onStatusButtonClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Select" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("select", undefined);
  });

  it("un bouton actif mais non désactivé reste cliquable (aria-pressed)", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail {...baseProps} statusButtons={[{ ...select, isActive: true }]} onStatusButtonClick={onStatusButtonClick} />,
    );
    const button = screen.getByRole("button", { name: "Select" });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(onStatusButtonClick).toHaveBeenCalledWith("select", undefined);
  });

  it("2 boutons : ordre respecté, disabled bloque le clic", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        statusButtons={[refuse, { ...validate, disabled: true }]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    const labels = screen.getAllByRole("button").map((b) => b.getAttribute("aria-label")).filter((l) => l === "Refuse" || l === "Validate");
    expect(labels).toEqual(["Refuse", "Validate"]);
    await userEvent.click(screen.getByRole("button", { name: "Validate" }));
    expect(onStatusButtonClick).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", undefined);
  });

  it("désactivé inactif : grisé ; désactivé actif : aspect normal", () => {
    render(
      <Thumbnail
        {...baseProps}
        statusButtons={[{ ...refuse, disabled: true }, { ...validate, disabled: true, isActive: true }]}
      />,
    );
    const greyed = screen.getByRole("button", { name: "Refuse" });
    const normal = screen.getByRole("button", { name: "Validate" });
    expect(greyed).toBeDisabled();
    expect(greyed).toHaveClass("disabled:opacity-50");
    expect(greyed.closest("span")).toHaveClass("cursor-not-allowed");
    expect(normal).toBeDisabled();
    expect(normal).not.toHaveClass("disabled:opacity-50");
    expect(normal.closest("span")).not.toHaveClass("cursor-not-allowed");
  });

  it("[] : aucun bouton, mais la ligne garde sa hauteur", () => {
    const { container } = render(<Thumbnail {...baseProps} statusButtons={[]} />);
    expect(statusRow(container)).toBeInTheDocument();
    expect(statusRow(container)!.querySelectorAll("button")).toHaveLength(0);
  });

  it("statusButtons défini remplace onValidate / onReject", () => {
    render(<Thumbnail {...baseProps} statusButtons={[select]} onValidate={vi.fn()} onReject={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Approve/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Reject/ })).not.toBeInTheDocument();
  });

  it("rejectionReasons ouvre le menu des motifs ; le motif choisi est remonté", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        bench={bench}
        statusButtons={[{ ...refuse, rejectionReasons: true }, validate]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(onStatusButtonClick).not.toHaveBeenCalled();
    await userEvent.click(await screen.findByRole("button", { name: "Blurry" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", "Blurry");
  });

  // CR-511: a long reason list overflowed the viewport and could not be scrolled.
  it("les listes de motifs sont isolées dans un conteneur défilant borné, l'en-tête hors liste", async () => {
    const many = (prefix: string) => Array.from({ length: 30 }, (_, i) => `${prefix} ${i + 1}`);
    const longBench = { config: { validation: { rejection_options: { active: true, main: many("Main"), secondary: many("Secondary") } } } };
    render(<Thumbnail {...baseProps} bench={longBench} statusButtons={[{ ...refuse, rejectionReasons: true }]} onStatusButtonClick={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));

    const mainList = await screen.findByTestId("rejection-reasons-list");
    const content = mainList.closest("[data-radix-popper-content-wrapper] > *") as HTMLElement;
    expect(content).toHaveClass("max-h-[var(--radix-popover-content-available-height)]", "flex", "flex-col", "overflow-hidden");
    expect(mainList).toHaveClass("min-h-0", "overflow-y-auto", "overscroll-contain");
    expect(mainList).toContainElement(screen.getByRole("button", { name: "Main 30" }));
    expect(mainList).not.toContainElement(screen.getByText("Choose a reason"));

    await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
    const secondaryList = await screen.findByTestId("rejection-reasons-list");
    expect(secondaryList).toHaveClass("min-h-0", "overflow-y-auto", "overscroll-contain");
    expect(secondaryList).toContainElement(screen.getByRole("button", { name: "Secondary 30" }));
  });

  describe("recherche dans les motifs (CR-510)", () => {
    const searchBench = {
      config: {
        validation: {
          rejection_options: {
            active: true,
            main: ["Détourage imprécis", "Reflet gênant", "Flou"],
            secondary: ["Étiquette visible", "Reflet gênant", "Retouche peau"],
          },
        },
      },
    };
    const renderSearch = (onStatusButtonClick = vi.fn()) => {
      render(
        <Thumbnail
          {...baseProps}
          bench={searchBench}
          statusButtons={[{ ...refuse, rejectionReasons: true }]}
          onStatusButtonClick={onStatusButtonClick}
        />,
      );
      return onStatusButtonClick;
    };
    const openMenu = async () => {
      await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
      return screen.findByRole("combobox", { name: "Search..." });
    };
    const listedReasons = () =>
      Array.from(screen.getByTestId("rejection-reasons-list").querySelectorAll("button")).map((b) => b.textContent);

    it("filterRejectionReasons : sous-chaîne insensible à la casse et aux accents, main puis secondary sans doublon", () => {
      const { main, secondary } = searchBench.config.validation.rejection_options;
      expect(filterRejectionReasons(main, secondary, "ETIQ")).toEqual(["Étiquette visible"]);
      expect(filterRejectionReasons(main, secondary, "  detourage ")).toEqual(["Détourage imprécis"]);
      expect(filterRejectionReasons(main, secondary, "re")).toEqual(["Détourage imprécis", "Reflet gênant", "Retouche peau"]);
      expect(filterRejectionReasons(main, secondary, "")).toEqual([
        "Détourage imprécis",
        "Reflet gênant",
        "Flou",
        "Étiquette visible",
        "Retouche peau",
      ]);
      expect(filterRejectionReasons(undefined, undefined, "x")).toEqual([]);
    });

    // Bench config comes from the API untyped: a null or numeric entry must not crash the menu.
    it("filterRejectionReasons ignore les valeurs non textuelles", () => {
      expect(filterRejectionReasons(["Flou", null, 42] as unknown[], [undefined, "Reflet"] as unknown[], "")).toEqual(["Flou", "Reflet"]);
      expect(filterRejectionReasons([null, 42] as unknown[], undefined, "4")).toEqual([]);
    });

    it("le champ a le focus à l'ouverture, en type text (raccourci Shift+V de gs_w)", async () => {
      renderSearch();
      const input = await openMenu();
      expect(input).toHaveFocus();
      expect(input).toHaveAttribute("type", "text");
    });

    // Same light field as the thumbnail's tag and comment menus, not the dark black-context variant.
    it("le champ prend le style clair des champs tags / commentaires", async () => {
      renderSearch();
      const input = await openMenu();
      expect(input).toHaveClass("bg-grey-lighter", "text-black");
      expect(input).not.toHaveClass("bg-black-secondary");
    });

    it("cherche dans main + secondary sans casse ni accents, « Autre raison » masqué", async () => {
      renderSearch();
      const input = await openMenu();
      expect(screen.getByRole("button", { name: "Other reason" })).toBeInTheDocument();
      await userEvent.type(input, "ETIQ");
      expect(listedReasons()).toEqual(["Étiquette visible"]);
      expect(screen.queryByRole("button", { name: "Other reason" })).not.toBeInTheDocument();
      await userEvent.clear(input);
      await userEvent.type(input, "reflet");
      expect(listedReasons()).toEqual(["Reflet gênant"]);
      await userEvent.clear(input);
      expect(listedReasons()).toEqual(["Détourage imprécis", "Reflet gênant", "Flou"]);
      expect(screen.getByRole("button", { name: "Other reason" })).toBeInTheDocument();
    });

    it("aucun résultat : message dédié, la saisie ne ferme pas le menu", async () => {
      renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "zzz");
      expect(screen.getByText("No results")).toBeInTheDocument();
      expect(listedReasons()).toEqual([]);
      expect(input).toBeInTheDocument();
    });

    it("Entrée sans flèche ni survol choisit le premier résultat et émet le motif", async () => {
      const onStatusButtonClick = renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "e{Enter}");
      expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", "Détourage imprécis");
      expect(screen.queryByRole("combobox", { name: "Search..." })).not.toBeInTheDocument();
    });

    it("la recherche est vidée à la réouverture", async () => {
      renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "flou");
      await userEvent.keyboard("{Escape}{Escape}");
      expect(screen.queryByRole("combobox", { name: "Search..." })).not.toBeInTheDocument();
      const reopened = await openMenu();
      expect(reopened).toHaveValue("");
      expect(listedReasons()).toEqual(["Détourage imprécis", "Reflet gênant", "Flou"]);
    });

    describe("parcours sans recherche (non-régression)", () => {
      const secondaryReasons = ["Étiquette visible", "Reflet gênant", "Retouche peau"];
      const mainReasons = ["Détourage imprécis", "Reflet gênant", "Flou"];

      it("un motif secondaire choisi remonte au parent", async () => {
        const onStatusButtonClick = renderSearch();
        await openMenu();
        await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
        expect(listedReasons()).toEqual(secondaryReasons);
        await userEvent.click(screen.getByRole("button", { name: "Retouche peau" }));
        expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", "Retouche peau");
        expect(screen.queryByRole("combobox", { name: "Search..." })).not.toBeInTheDocument();
      });

      it("le chevron de retour ramène à la vue principale", async () => {
        renderSearch();
        await openMenu();
        await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
        await userEvent.click(screen.getByRole("button", { name: "Previous" }));
        expect(listedReasons()).toEqual(mainReasons);
        expect(screen.getByRole("button", { name: "Other reason" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
      });

      // The clicked view-switch button unmounts: without refocus, focus fell back to body.
      it("le focus revient dans le champ en passant en vue secondaire puis au retour", async () => {
        renderSearch();
        const input = await openMenu();
        await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
        expect(listedReasons()).toEqual(secondaryReasons);
        expect(input).toHaveFocus();
        await userEvent.click(screen.getByRole("button", { name: "Previous" }));
        expect(listedReasons()).toEqual(mainReasons);
        expect(input).toHaveFocus();
      });

      it("X puis réouverture : vue principale et champ vide", async () => {
        renderSearch();
        const input = await openMenu();
        await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
        await userEvent.type(input, "zzz");
        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(screen.queryByRole("combobox", { name: "Search..." })).not.toBeInTheDocument();
        const reopened = await openMenu();
        expect(reopened).toHaveValue("");
        expect(listedReasons()).toEqual(mainReasons);
        expect(screen.getByRole("button", { name: "Other reason" })).toBeInTheDocument();
      });

      it("recherche lancée depuis la vue secondaire puis effacée : retour en vue secondaire", async () => {
        renderSearch();
        const input = await openMenu();
        await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
        await userEvent.type(input, "flou");
        expect(listedReasons()).toEqual(["Flou"]);
        expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
        await userEvent.clear(input);
        expect(listedReasons()).toEqual(secondaryReasons);
        expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
      });
    });

    // jsdom has no layout: offsetWidth/offsetHeight are stubbed to stand for the measured menu size.
    describe("taille du menu figée pendant la recherche", () => {
      let size = { width: 0, height: 0 };
      beforeEach(() => {
        size = { width: 0, height: 0 };
      });
      afterEach(() => vi.restoreAllMocks());
      const stubLayout = () => {
        vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(() => size.width);
        vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => size.height);
      };
      const menuContent = () =>
        screen.getByTestId("rejection-reasons-list").closest("[data-radix-popper-content-wrapper] > *") as HTMLElement;
      const frozenStyle = () => ({ width: menuContent().style.width, height: menuContent().style.height });

      // Product decision (CR-510, option A): the box keeps its size while typing, as in 1.45.x.
      it("fige largeur et hauteur au premier caractère, les garde quand les résultats changent, les relâche quand la requête est vidée", async () => {
        stubLayout();
        renderSearch();
        const input = await openMenu();
        expect(frozenStyle()).toEqual({ width: "", height: "" });

        size = { width: 230, height: 310 };
        await userEvent.type(input, "e");
        expect(frozenStyle()).toEqual({ width: "230px", height: "310px" });

        size = { width: 200, height: 120 };
        await userEvent.type(input, "tiq");
        expect(listedReasons()).toEqual(["Étiquette visible"]);
        expect(frozenStyle()).toEqual({ width: "230px", height: "310px" });

        await userEvent.type(input, "zzz");
        expect(listedReasons()).toEqual([]);
        expect(screen.getByText("No results")).toBeInTheDocument();
        expect(frozenStyle()).toEqual({ width: "230px", height: "310px" });

        await userEvent.clear(input);
        expect(frozenStyle()).toEqual({ width: "", height: "" });
      });

      it("reste bornée par la hauteur disponible, la liste défile au-delà", async () => {
        stubLayout();
        renderSearch();
        const input = await openMenu();
        size = { width: 230, height: 310 };
        await userEvent.type(input, "e");
        expect(menuContent()).toHaveClass("max-h-[var(--radix-popover-content-available-height)]");
        expect(screen.getByTestId("rejection-reasons-list")).toHaveClass("min-h-0", "flex-1", "overflow-y-auto");
      });

      it("une requête faite uniquement d'espaces ne fige pas la taille", async () => {
        stubLayout();
        renderSearch();
        const input = await openMenu();
        size = { width: 230, height: 310 };
        await userEvent.type(input, "   ");
        expect(frozenStyle()).toEqual({ width: "", height: "" });
      });

      // Menu not laid out yet (e.g. still animating in): freezing at 0 would collapse it.
      it("une mesure à 0 ne fige pas la taille", async () => {
        stubLayout();
        renderSearch();
        const input = await openMenu();
        await userEvent.type(input, "e");
        expect(frozenStyle()).toEqual({ width: "", height: "" });
      });

      it("depuis la vue secondaire, fige la taille de cette vue ; réinitialisée à la réouverture", async () => {
        stubLayout();
        renderSearch();
        await openMenu();
        await userEvent.click(screen.getByRole("button", { name: "Other reason" }));

        size = { width: 260, height: 180 };
        const input = screen.getByRole("combobox", { name: "Search..." });
        await userEvent.type(input, "reflet");
        expect(frozenStyle()).toEqual({ width: "260px", height: "180px" });

        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        await openMenu();
        expect(frozenStyle()).toEqual({ width: "", height: "" });
      });
    });

    describe("option active (comportement du menu gs_node)", () => {
      const activeOption = () => screen.getByRole("option", { selected: true });

      it("la première option est active par défaut, exposée par aria-activedescendant", async () => {
        renderSearch();
        const input = await openMenu();
        expect(input).not.toHaveAttribute("aria-activedescendant");
        expect(input).toHaveAttribute("aria-expanded", "false");
        expect(input).toHaveAttribute("aria-autocomplete", "list");
        await userEvent.type(input, "re");
        expect(input).toHaveAttribute("aria-expanded", "true");
        const listbox = screen.getByRole("listbox");
        expect(within(listbox).getAllByRole("option").map((o) => o.textContent)).toEqual([
          "Détourage imprécis",
          "Reflet gênant",
          "Retouche peau",
        ]);
        expect(activeOption()).toHaveTextContent("Détourage imprécis");
        expect(input).toHaveAttribute("aria-activedescendant", activeOption().id);
        expect(input).toHaveAttribute("aria-controls", listbox.id);
        expect(screen.getByRole("option", { name: "Retouche peau" })).toHaveAttribute("aria-selected", "false");
      });

      it("les flèches déplacent l'option active et bouclent en bout de liste, sans remonter à la page", async () => {
        const windowKeys: string[] = [];
        const onWindowKeyDown = (event: KeyboardEvent) => windowKeys.push(event.key);
        window.addEventListener("keydown", onWindowKeyDown);
        const scrollIntoView = vi.fn();
        Element.prototype.scrollIntoView = scrollIntoView;
        try {
          renderSearch();
          const input = await openMenu();
          await userEvent.type(input, "e");
          expect(activeOption()).toHaveTextContent("Détourage imprécis");
          await userEvent.keyboard("{ArrowDown}");
          expect(activeOption()).toHaveTextContent("Reflet gênant");
          expect(scrollIntoView).toHaveBeenLastCalledWith({ block: "nearest" });
          await userEvent.keyboard("{ArrowUp}{ArrowUp}");
          expect(activeOption()).toHaveTextContent("Retouche peau");
          await userEvent.keyboard("{ArrowDown}");
          expect(activeOption()).toHaveTextContent("Détourage imprécis");
          expect(input).toHaveAttribute("aria-activedescendant", activeOption().id);
          expect(windowKeys).toEqual([]);
        } finally {
          window.removeEventListener("keydown", onWindowKeyDown);
          delete (Element.prototype as Partial<Element>).scrollIntoView;
        }
      });

      it("le survol définit l'option active, Entrée la valide (pas la première)", async () => {
        const onStatusButtonClick = renderSearch();
        const input = await openMenu();
        await userEvent.type(input, "e");
        fireEvent.mouseMove(screen.getByRole("option", { name: "Étiquette visible" }));
        expect(activeOption()).toHaveTextContent("Étiquette visible");
        await userEvent.keyboard("{Enter}");
        expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", "Étiquette visible");
      });

      // gs_node's react-select cleared it on mouse leave; the user asked not to reproduce that.
      it("l'option survolée reste active quand la souris quitte la liste", async () => {
        renderSearch();
        const input = await openMenu();
        await userEvent.type(input, "e");
        const option = screen.getByRole("option", { name: "Retouche peau" });
        fireEvent.mouseMove(option);
        fireEvent.mouseLeave(option);
        fireEvent.mouseLeave(screen.getByRole("listbox"));
        expect(activeOption()).toHaveTextContent("Retouche peau");
      });

      it("garde l'option active si elle reste dans les résultats, sinon revient à la première", async () => {
        renderSearch();
        const input = await openMenu();
        await userEvent.type(input, "e");
        fireEvent.mouseMove(screen.getByRole("option", { name: "Retouche peau" }));
        await userEvent.type(input, "t");
        expect(activeOption()).toHaveTextContent("Retouche peau");
        await userEvent.type(input, "iq");
        expect(activeOption()).toHaveTextContent("Étiquette visible");
        await userEvent.type(input, "{Backspace}{Backspace}");
        expect(activeOption()).toHaveTextContent("Détourage imprécis");
      });
    });

    describe("Échap", () => {
      it("avec une requête : la vide, revient à la vue principale et garde le menu ouvert", async () => {
        const windowKeys: string[] = [];
        const onWindowKeyDown = (event: KeyboardEvent) => windowKeys.push(event.key);
        window.addEventListener("keydown", onWindowKeyDown);
        try {
          renderSearch();
          await openMenu();
          await userEvent.click(screen.getByRole("button", { name: "Other reason" }));
          const input = screen.getByRole("combobox", { name: "Search..." });
          await userEvent.type(input, "reflet");
          await userEvent.keyboard("{Escape}");
          expect(screen.getByRole("combobox", { name: "Search..." })).toHaveValue("");
          expect(screen.getByRole("combobox", { name: "Search..." })).toHaveFocus();
          expect(listedReasons()).toEqual(["Détourage imprécis", "Reflet gênant", "Flou"]);
          expect(windowKeys).toEqual([]);
        } finally {
          window.removeEventListener("keydown", onWindowKeyDown);
        }
      });

      // Only the field stopped propagation: from an option or Close, Escape used to reach host shortcuts.
      it.each([
        ["une option", () => userEvent.tab()],
        ["le bouton Fermer", () => userEvent.tab({ shift: true })],
      ])("avec une requête, focus sur %s : la vide, garde le menu ouvert, ne remonte pas à la page", async (target, focusTarget) => {
        const windowKeys: string[] = [];
        const onWindowKeyDown = (event: KeyboardEvent) => windowKeys.push(event.key);
        window.addEventListener("keydown", onWindowKeyDown);
        try {
          renderSearch();
          const input = await openMenu();
          await userEvent.type(input, "reflet");
          await focusTarget();
          const focused = document.activeElement as HTMLElement;
          expect(focused).not.toBe(input);
          if (target === "une option") expect(focused).toHaveAttribute("role", "option");
          else expect(focused).toHaveAccessibleName("Close");
          windowKeys.length = 0;
          await userEvent.keyboard("{Escape}");
          const field = screen.getByRole("combobox", { name: "Search..." });
          expect(field).toHaveValue("");
          expect(field).toHaveFocus();
          expect(listedReasons()).toEqual(["Détourage imprécis", "Reflet gênant", "Flou"]);
          expect(windowKeys).toEqual([]);
        } finally {
          window.removeEventListener("keydown", onWindowKeyDown);
        }
      });

      it("requête vide : ferme le menu", async () => {
        renderSearch();
        const input = await openMenu();
        await userEvent.type(input, "flou");
        await userEvent.keyboard("{Escape}");
        expect(input).toBeInTheDocument();
        await userEvent.keyboard("{Escape}");
        expect(screen.queryByRole("combobox", { name: "Search..." })).not.toBeInTheDocument();
      });
    });

    it("aucun résultat annoncé par une région live", async () => {
      renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "zzz");
      expect(within(screen.getByTestId("rejection-reasons-list")).getByRole("status")).toHaveTextContent("No results");
    });

    it("Entrée pendant une composition IME ne choisit rien", async () => {
      const onStatusButtonClick = renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "e");
      fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
      expect(onStatusButtonClick).not.toHaveBeenCalled();
      expect(input).toBeInTheDocument();
    });

    it("↑ / ↓ pendant une composition IME ne déplacent pas l'option active", async () => {
      renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "e");
      fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 229 });
      expect(screen.getByRole("option", { selected: true })).toHaveTextContent("Détourage imprécis");
      fireEvent.keyDown(input, { key: "ArrowUp", isComposing: true });
      expect(screen.getByRole("option", { selected: true })).toHaveTextContent("Détourage imprécis");
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(screen.getByRole("option", { selected: true })).toHaveTextContent("Reflet gênant");
    });

    // Tab and Escape must still bubble: the popover's FocusScope (Tab loop) and its dismiss layer (Escape) need them.
    it("les touches saisies ne remontent pas aux raccourcis de la page, Tab et Échap si", async () => {
      const windowKeys: string[] = [];
      const onWindowKeyDown = (event: KeyboardEvent) => windowKeys.push(event.key);
      window.addEventListener("keydown", onWindowKeyDown);
      try {
        renderSearch();
        const input = await openMenu();
        await userEvent.type(input, "dv");
        expect(windowKeys).toEqual([]);
        await userEvent.tab();
        expect(windowKeys).toEqual(["Tab"]);
        input.focus();
        await userEvent.tab({ shift: true });
        expect(windowKeys).toEqual(["Tab", "Tab"]);
        input.focus();
        await userEvent.keyboard("{Escape}");
        expect(windowKeys).toEqual(["Tab", "Tab"]);
        await userEvent.keyboard("{Escape}");
        expect(windowKeys).toEqual(["Tab", "Tab", "Escape"]);
      } finally {
        window.removeEventListener("keydown", onWindowKeyDown);
      }
    });

    // Review of 1.45.0: with no result, Tab from the field (last tabbable) left the portal and focusOutside closed the menu.
    it("aucun résultat : Tab depuis le champ boucle dans le menu, la requête est conservée", async () => {
      renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "zzz");
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
      await userEvent.tab({ shift: true });
      expect(input).toHaveFocus();
      expect(input).toHaveValue("zzz");
    });

    it("avec résultats : Tab depuis le champ atteint le premier résultat", async () => {
      renderSearch();
      const input = await openMenu();
      await userEvent.type(input, "reflet");
      await userEvent.tab();
      expect(screen.getByRole("option", { name: "Reflet gênant" })).toHaveFocus();
    });
  });

  it("rejectionReasons sans motifs configurés : clic direct", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail {...baseProps} statusButtons={[{ ...refuse, rejectionReasons: true }]} onStatusButtonClick={onStatusButtonClick} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", undefined);
  });

  it("le menu des motifs reste fermé sur un bouton désactivé", async () => {
    render(
      <Thumbnail {...baseProps} bench={bench} statusButtons={[{ ...refuse, rejectionReasons: true, disabled: true }]} onStatusButtonClick={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(screen.queryByRole("button", { name: "Blurry" })).not.toBeInTheDocument();
  });

  it("label donne l'aria-label ; sans label, celui de ButtonStatus", () => {
    render(<Thumbnail {...baseProps} statusButtons={[select, { ...validate, label: undefined }]} />);
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Approve - / })).toBeInTheDocument();
  });

  it("pas de boutons sans picture_id (emplacement vide), comme avant", () => {
    const { container } = render(<Thumbnail view="F" statusButtons={[select]} />);
    expect(statusRow(container)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Select" })).not.toBeInTheDocument();
  });
});
