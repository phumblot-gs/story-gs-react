import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { MultiSelect, type MultiSelectProps } from "@/components/ui/multi-select";
import type { SelectAutocompleteOption } from "@/components/ui/select-autocomplete";
import { Layout } from "@/components/layout/Layout";
import { Modal } from "@/components/layout/Modal";
import { SidePanel } from "@/components/layout/SidePanel";
import { FullFrame } from "@/components/layout/FullFrame";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const OPTIONS: SelectAutocompleteOption[] = [
  { value: "pe27", label: "PE27" },
  { value: "ah26", label: "AH26" },
  { value: "pe26", label: "PE26" },
  { value: "pe25", label: "PE25", disabled: true },
  { value: "ah25", label: "AH25" },
];

const trigger = () => screen.getByRole("combobox");
const listbox = () => screen.queryByRole("listbox");
const search = () => screen.getByRole("textbox", { name: "Search…" });
const option = (name: string) => screen.getByRole("option", { name });
const openMenu = () => fireEvent.pointerDown(trigger(), { button: 0 });
const key = (target: Element, k: string, init: Partial<KeyboardEventInit> = {}) =>
  fireEvent.keyDown(target, { key: k, ...init });
const type = (text: string) => fireEvent.change(search(), { target: { value: text } });
const activeId = () => search().getAttribute("aria-activedescendant");
/** Radix rend le focus au déclencheur au tick suivant la fermeture. */
const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));
const activeLabel = () => document.getElementById(activeId() ?? "")?.textContent;

function setup(props: Partial<MultiSelectProps> = {}) {
  const onChange = vi.fn();
  const utils = render(<MultiSelect options={OPTIONS} onChange={onChange} {...props} />);
  return { onChange, ...utils };
}

/** Wrapper contrôlé, pour vérifier l'affichage après chaque changement. */
function Controlled(props: Partial<MultiSelectProps> & { initial?: string[] }) {
  const { initial = [], onChange, ...rest } = props;
  const [value, setValue] = React.useState<string[]>(initial);
  return (
    <MultiSelect
      options={OPTIONS}
      value={value}
      onChange={(values, selected) => {
        setValue(values);
        onChange?.(values, selected);
      }}
      {...rest}
    />
  );
}

describe("MultiSelect — cocher et décocher", () => {
  it("coche puis décoche une option ; le menu reste ouvert", () => {
    const { onChange } = setup();
    openMenu();
    expect(listbox()).toBeInTheDocument();
    expect(listbox()).toHaveAttribute("aria-multiselectable", "true");

    fireEvent.click(option("PE27"));
    expect(onChange).toHaveBeenLastCalledWith(["pe27"], [{ value: "pe27", label: "PE27" }]);
    expect(listbox()).toBeInTheDocument();
    expect(option("PE27")).toHaveAttribute("aria-selected", "true");

    fireEvent.click(option("AH26"));
    expect(onChange).toHaveBeenLastCalledWith(
      ["pe27", "ah26"],
      [
        { value: "pe27", label: "PE27" },
        { value: "ah26", label: "AH26" },
      ]
    );

    fireEvent.click(option("PE27"));
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], [{ value: "ah26", label: "AH26" }]);
    expect(option("PE27")).toHaveAttribute("aria-selected", "false");
  });

  it("une option désactivée ne se coche pas", () => {
    const { onChange } = setup();
    openMenu();
    expect(option("PE25")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(option("PE25"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("le déclencheur affiche les valeurs cochées en tags", () => {
    render(<Controlled initial={["pe27", "ah26"]} />);
    const tags = screen.getByTestId("multi-select-tags");
    expect(within(tags).getByTitle("PE27")).toBeInTheDocument();
    expect(within(tags).getByTitle("AH26")).toBeInTheDocument();
  });
});

describe("MultiSelect — valeurs passées à onChange", () => {
  it("renvoie les value, jamais les labels, même quand deux options ont le même label", () => {
    const options = [
      { value: "c-1", label: "Collection" },
      { value: "c-2", label: "Collection" },
    ];
    const { onChange } = setup({ options });
    openMenu();
    fireEvent.click(screen.getAllByRole("option", { name: "Collection" })[1]);
    expect(onChange).toHaveBeenLastCalledWith(["c-2"], [{ value: "c-2", label: "Collection" }]);
  });

  it("mode contrôlé : ne change rien sans mise à jour de value", () => {
    const { onChange } = setup({ value: ["pe27"] });
    openMenu();
    fireEvent.click(option("AH26"));
    expect(onChange).toHaveBeenLastCalledWith(
      ["pe27", "ah26"],
      [
        { value: "pe27", label: "PE27" },
        { value: "ah26", label: "AH26" },
      ]
    );
    expect(option("AH26")).toHaveAttribute("aria-selected", "false");
  });

  it("une valeur absente des options s'affiche et est renvoyée avec sa propre valeur comme label", () => {
    const { onChange } = setup({ defaultValue: ["legacy-42"] });
    expect(within(screen.getByTestId("multi-select-tags")).getByTitle("legacy-42")).toBeInTheDocument();
    openMenu();
    fireEvent.click(option("PE27"));
    expect(onChange).toHaveBeenLastCalledWith(
      ["legacy-42", "pe27"],
      [
        { value: "legacy-42", label: "legacy-42" },
        { value: "pe27", label: "PE27" },
      ]
    );
  });

  it("filtre sur searchText quand il est fourni", () => {
    setup({
      options: [
        { value: "1", label: "Printemps-été 2027", searchText: "PE27 printemps" },
        { value: "2", label: "Automne-hiver 2026" },
      ],
    });
    openMenu();
    type("pe27");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Select all",
      "Printemps-été 2027",
    ]);
  });
});

describe("MultiSelect — « Tout sélectionner » sur une liste filtrée", () => {
  it("ne coche que les options visibles et actives, puis les décoche seules", () => {
    const onChange = vi.fn();
    render(<Controlled initial={["ah26"]} onChange={onChange} />);
    openMenu();
    type("pe");
    // visibles : PE27, PE26, PE25 (désactivée)
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Select all", "PE27", "PE26", "PE25"]);

    fireEvent.click(option("Select all"));
    expect(onChange).toHaveBeenLastCalledWith(
      ["ah26", "pe27", "pe26"],
      [
        { value: "ah26", label: "AH26" },
        { value: "pe27", label: "PE27" },
        { value: "pe26", label: "PE26" },
      ]
    );

    // toutes les visibles sont cochées : le libellé s'inverse
    fireEvent.click(option("Deselect all"));
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], [{ value: "ah26", label: "AH26" }]);
  });

  it("est désactivé s'il dépasserait maxSelected ; « Maximum atteint » bloque les autres cases", () => {
    const onChange = vi.fn();
    render(<Controlled initial={["ah26"]} maxSelected={2} onChange={onChange} />);
    openMenu();
    expect(option("Select all")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(option("Select all"));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(option("PE27"));
    expect(onChange).toHaveBeenLastCalledWith(["ah26", "pe27"], expect.any(Array));
    expect(screen.getByRole("status")).toHaveTextContent("Maximum reached (2)");
    expect(option("PE26")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(option("PE26"));
    expect(onChange).toHaveBeenCalledTimes(1);

    // une case cochée se décoche toujours
    fireEvent.click(option("PE27"));
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], expect.any(Array));
  });

  it("aucun résultat : message, pas de « Tout sélectionner »", () => {
    setup();
    openMenu();
    type("zz");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(screen.getByText("No results")).toBeInTheDocument();
  });
});

describe("MultiSelect — suppression d'un tag", () => {
  it("la croix d'un tag retire la valeur sans ouvrir le menu", () => {
    const onChange = vi.fn();
    render(<Controlled initial={["pe27", "ah26"]} onChange={onChange} />);
    const tag = within(screen.getByTestId("multi-select-tags")).getByTitle("PE27");
    const cross = within(tag).getByRole("button");
    fireEvent.pointerDown(cross, { button: 0 });
    fireEvent.click(cross);
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], [{ value: "ah26", label: "AH26" }]);
    expect(listbox()).not.toBeInTheDocument();
    expect(within(screen.getByTestId("multi-select-tags")).queryByTitle("PE27")).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it("allowClear : la croix du déclencheur efface tout", () => {
    const onChange = vi.fn();
    render(<Controlled initial={["pe27", "ah26"]} allowClear onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenLastCalledWith([], []);
    expect(trigger()).toHaveTextContent("Select…");
    expect(screen.queryByRole("button", { name: "Clear all" })).not.toBeInTheDocument();
  });

  it("désactivé : ne s'ouvre pas, tags non supprimables", () => {
    const { onChange } = setup({ defaultValue: ["pe27"], disabled: true });
    expect(trigger()).toHaveAttribute("aria-disabled", "true");
    expect(trigger()).toHaveAttribute("tabindex", "-1");
    openMenu();
    key(trigger(), "Enter");
    expect(listbox()).not.toBeInTheDocument();
    fireEvent.click(within(within(screen.getByTestId("multi-select-tags")).getByTitle("PE27")).getByRole("button"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("MultiSelect — clavier", () => {
  it("flèches, Entrée, Espace, Retour arrière et Tab", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    trigger().focus();
    key(trigger(), "ArrowDown");
    expect(listbox()).toBeInTheDocument();
    expect(search()).toHaveFocus();
    expect(activeLabel()).toBe("PE27");

    key(search(), "ArrowDown");
    expect(activeLabel()).toBe("AH26");
    key(search(), "Enter");
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], expect.any(Array));

    // l'option désactivée est sautée
    key(search(), "ArrowDown");
    key(search(), "ArrowDown");
    expect(activeLabel()).toBe("AH25");
    key(search(), " ");
    expect(onChange).toHaveBeenLastCalledWith(["ah26", "ah25"], expect.any(Array));

    // « Tout sélectionner » est au-dessus de la première option
    for (let i = 0; i < 5; i++) key(search(), "ArrowUp");
    expect(activeLabel()).toBe("Select all");

    // Retour arrière dans une recherche vide retire la dernière valeur
    key(search(), "Backspace");
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], expect.any(Array));

    // Tab ferme et rend le focus au déclencheur
    key(search(), "Tab");
    expect(listbox()).not.toBeInTheDocument();
    await tick();
    expect(trigger()).toHaveFocus();
  });

  it("Espace s'écrit dans une recherche non vide ; Entrée coche l'option en surbrillance", () => {
    const { onChange } = setup();
    trigger().focus();
    key(trigger(), "Enter");
    type("ah");
    expect(activeLabel()).toBe("AH26");
    const notPrevented = key(search(), " ");
    expect(notPrevented).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    key(search(), "Enter");
    expect(onChange).toHaveBeenLastCalledWith(["ah26"], expect.any(Array));
    // Retour arrière avec du texte : efface le texte, pas une valeur
    key(search(), "Backspace");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("Retour arrière sur le déclencheur fermé retire la dernière valeur", () => {
    const onChange = vi.fn();
    render(<Controlled initial={["pe27", "ah26"]} onChange={onChange} />);
    trigger().focus();
    key(trigger(), "Backspace");
    expect(onChange).toHaveBeenLastCalledWith(["pe27"], expect.any(Array));
  });

  it("Échap ferme le menu et rend le focus au déclencheur", async () => {
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    trigger().focus();
    key(trigger(), "Enter");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    key(search(), "Escape");
    expect(listbox()).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await tick();
    expect(trigger()).toHaveFocus();
  });
});

describe.each([
  [
    "Modal",
    (onClose: () => void, children: React.ReactNode) => (
      <Modal isOpen onClose={onClose} title="Catalogue" header={<span>Catalogue</span>}>
        {children}
      </Modal>
    ),
  ],
  [
    "SidePanel",
    (onClose: () => void, children: React.ReactNode) => (
      <SidePanel isOpen onClose={onClose} title="Catalogue">
        {children}
      </SidePanel>
    ),
  ],
  [
    "FullFrame",
    (onClose: () => void, children: React.ReactNode) => <FullFrame onClose={onClose}>{children}</FullFrame>,
  ],
])("MultiSelect — Échap dans un %s", (_name, wrap) => {
  it("le premier Échap ferme le menu seul, le second ferme le conteneur", async () => {
    const onClose = vi.fn();
    const onChange = vi.fn();
    render(wrap(onClose, <MultiSelect options={OPTIONS} onChange={onChange} aria-label="Collections" />));
    // Radix n'écoute les interactions extérieures qu'au tick suivant l'ouverture.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    trigger().focus();
    key(trigger(), "Enter");
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(search()).toHaveFocus();

    fireEvent.click(option("PE27"));
    expect(onChange).toHaveBeenLastCalledWith(["pe27"], expect.any(Array));

    key(search(), "Escape");
    expect(listbox()).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    await tick();
    expect(trigger()).toHaveFocus();

    key(document.activeElement ?? document.body, "Escape");
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("MultiSelect — affichage", () => {
  it("taille small : résumé « N sélectionné(s) » au lieu des tags", () => {
    render(<Controlled initial={["pe27", "ah26"]} size="small" />);
    expect(screen.queryByTestId("multi-select-tags")).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent("2 selected");
  });

  it("traductions : français, singulier et pluriel", () => {
    const { rerender } = render(
      <MultiSelect options={OPTIONS} language="fr" size="small" defaultValue={["pe27"]} />
    );
    expect(trigger()).toHaveTextContent("1 sélectionné");
    rerender(<MultiSelect options={OPTIONS} language="fr" size="small" value={["pe27", "ah26"]} />);
    expect(trigger()).toHaveTextContent("2 sélectionnés");
    openMenu();
    expect(screen.getByRole("textbox", { name: "Rechercher…" })).toBeInTheDocument();
    expect(option("Tout sélectionner")).toBeInTheDocument();
  });

  it("placeholder et attributs d'accessibilité", () => {
    render(
      <MultiSelect options={OPTIONS} id="collections" aria-labelledby="label-id" aria-invalid placeholder="Collections" />
    );
    expect(trigger()).toHaveTextContent("Collections");
    expect(trigger()).toHaveAttribute("id", "collections");
    expect(trigger()).toHaveAttribute("aria-labelledby", "label-id");
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveAttribute("data-placeholder", "");
  });

  it.each([
    ["white", "grey", "bg-black"],
    ["grey", "white", "bg-black"],
    ["black", "black", "bg-black-secondary"],
  ] as const)(
    "fond %s : tags sur le fond du déclencheur (%s), menu %s avec texte blanc",
    (page, tagsBg, menuBg) => {
      render(
        <Layout bg={page}>
          <MultiSelect options={OPTIONS} defaultValue={["pe27"]} />
        </Layout>
      );
      expect(screen.getByTestId("multi-select-tags")).toHaveAttribute("data-bg", tagsBg);
      openMenu();
      const menu = document.querySelector("[data-multi-select-menu]")!;
      expect(menu).toHaveClass(menuBg, "text-white");
    }
  );

  it("sans contexte : menu blanc, texte noir", () => {
    setup();
    openMenu();
    expect(document.querySelector("[data-multi-select-menu]")).toHaveClass("bg-white", "text-black");
  });

  it("« +N » quand les tags ne tiennent plus sur une ligne", () => {
    // happy-dom ne calcule pas de mise en page : largeurs simulées (tag 60 px, « +N » 20 px, zone 150 px).
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      if (this.hasAttribute("data-measure-tag")) return 60;
      if (this.hasAttribute("data-measure-plus")) return 20;
      return 0;
    });
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.querySelector("[data-testid='multi-select-tags']") ? 150 : 0;
    });
    render(<Controlled initial={["pe27", "ah26", "pe26", "ah25"]} />);
    // 60 + 4 + 60 + 4 + 20 = 148 ≤ 150 : deux tags et « +2 »
    const tags = screen.getByTestId("multi-select-tags");
    expect(within(tags).getByTitle("PE27")).toBeInTheDocument();
    expect(within(tags).getByTitle("AH26")).toBeInTheDocument();
    expect(within(tags).queryByTitle("PE26")).not.toBeInTheDocument();
    expect(screen.getByTestId("multi-select-more")).toHaveTextContent("+2");
    expect(screen.getByTestId("multi-select-more")).toHaveAttribute("title", "2 more: PE26, AH25");
  });

  it("1 000 options : tout est rendu, la recherche filtre", () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));
    const { onChange } = setup({ options: many });
    openMenu();
    expect(screen.getAllByRole("option")).toHaveLength(1001);
    type("Option 99");
    // Option 99, 990…999
    expect(screen.getAllByRole("option")).toHaveLength(12);
    fireEvent.click(option("Select all"));
    expect(onChange.mock.calls.at(-1)![0]).toHaveLength(11);
  });
});
