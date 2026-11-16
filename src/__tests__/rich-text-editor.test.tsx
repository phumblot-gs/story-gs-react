import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import type { Editor } from "@tiptap/react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { richTextValidate, type RichTextNode, type RichTextVariable } from "@/lib/rich-text";

// Seul le sélecteur d'émojis (lourd, chargé à la demande) est remplacé ; l'éditeur est réel.
vi.mock("@/components/ui/comment-emoji-picker", () => ({ default: ({ onSelect }: { onSelect: (text: string) => void }) => <button onClick={() => onSelect("🙌")}>Choose emoji</button> }));
afterEach(cleanup);

const VARIABLES: RichTextVariable[] = [
  { id: "fournisseur", label: "Fournisseur" },
  { id: "marketplace", label: "Marketplace" },
  { id: "lien_depot", label: "Lien de dépôt", kind: "url" },
  { id: "references", label: "Références en attente", kind: "list" },
];
const text = (t: string, marks?: RichTextNode["marks"]): RichTextNode => ({ type: "text", text: t, ...(marks ? { marks } : {}) });
const p = (...content: RichTextNode[]): RichTextNode => ({ type: "paragraph", content });
const doc = (...content: RichTextNode[]): RichTextNode => ({ type: "doc", content });

async function setup(props: Partial<React.ComponentProps<typeof RichTextEditor>> = {}) {
  const onChange = vi.fn();
  const view = render(<RichTextEditor onChange={onChange} variables={VARIABLES} {...props} />);
  const field = await screen.findByRole("textbox");
  const editor = (field as HTMLElement & { editor: Editor }).editor;
  const last = () => onChange.mock.calls.at(-1)?.[0] as RichTextNode;
  const details = () => onChange.mock.calls.at(-1)?.[1] as { isEmpty: boolean; text: string };
  return { ...view, field, editor, onChange, last, details };
}
const selectAll = (editor: Editor) => act(() => { editor.commands.selectAll(); });
const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true };

describe("RichTextEditor — barre d'outils", () => {
  it("gras, italique, souligné : boutons à état pressé", async () => {
    const { editor, last } = await setup({ defaultValue: doc(p(text("Bonjour"))) });
    selectAll(editor);
    for (const name of ["Bold", "Italic", "Underline"]) fireEvent.click(screen.getByRole("button", { name }));
    expect(last()).toEqual(doc(p(text("Bonjour", [{ type: "bold" }, { type: "italic" }, { type: "underline" }]))));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("listes à puces et numérotée", async () => {
    const { editor, last } = await setup({ defaultValue: doc(p(text("a"))) });
    selectAll(editor);
    fireEvent.click(screen.getByRole("button", { name: "Bulleted list" }));
    expect(last()).toEqual(doc({ type: "bulletList", content: [{ type: "listItem", content: [p(text("a"))] }] }));
    fireEvent.click(screen.getByRole("button", { name: "Numbered list" }));
    expect(last().content?.[0].type).toBe("orderedList");
    // Pas d'attribut start / type dans la valeur émise : le schéma est fermé.
    expect(last().content?.[0].attrs).toBeUndefined();
  });

  it("raccourcis ⌘/Ctrl+B, I, U", async () => {
    const { editor, field, last } = await setup({ defaultValue: doc(p(text("x"))) });
    selectAll(editor);
    fireEvent.keyDown(field, { key: "b", ...mod });
    fireEvent.keyDown(field, { key: "i", ...mod });
    fireEvent.keyDown(field, { key: "u", ...mod });
    expect(last()).toEqual(doc(p(text("x", [{ type: "bold" }, { type: "italic" }, { type: "underline" }]))));
  });

  it("émoji inséré comme texte Unicode", async () => {
    const { last } = await setup();
    fireEvent.click(screen.getByRole("button", { name: "Insert emoji" }));
    fireEvent.click(await screen.findByText("Choose emoji"));
    expect(last()).toEqual(doc(p(text("🙌"))));
  });

  it("role=toolbar : un seul arrêt Tab, flèches pour passer d'un bouton à l'autre", async () => {
    await setup();
    const toolbar = screen.getByRole("toolbar", { name: "Formatting" });
    const buttons = Array.from(toolbar.querySelectorAll<HTMLButtonElement>("button[data-rte-tool]"));
    expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1);
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[1]);
    fireEvent.keyDown(buttons[1], { key: "End" });
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
    fireEvent.keyDown(buttons[buttons.length - 1], { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[0]);
    await waitFor(() => expect(buttons.filter((b) => b.tabIndex === 0)).toEqual([buttons[0]]));
  });

  it("désactivé : boutons désactivés, champ non modifiable", async () => {
    const { field } = await setup({ disabled: true });
    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
    expect(field).toHaveAttribute("contenteditable", "false");
  });
});

describe("RichTextEditor — liens", () => {
  it("URL sans schéma : https:// ajouté ; javascript: refusé", async () => {
    const { editor, last } = await setup({ defaultValue: doc(p(text("dépôt"))) });
    selectAll(editor);
    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    const input = await screen.findByRole("textbox", { name: "URL" });
    fireEvent.change(input, { target: { value: "javascript:alert(1)" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Only https, http and mailto");
    expect(JSON.stringify(last() ?? {})).not.toContain("javascript");
    fireEvent.change(input, { target: { value: "gs.com/depot" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(last()).toEqual(doc(p(text("dépôt", [{ type: "link", attrs: { href: "https://gs.com/depot" } }]))));
  });

  it("lien vers une variable url, puis modifié et supprimé", async () => {
    const { editor, last } = await setup({ defaultValue: doc(p(text("Déposer"))) });
    selectAll(editor);
    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    fireEvent.click(await screen.findByRole("radio", { name: "Variable" }));
    // Seules les variables url sont proposées.
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Lien de dépôt"]);
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(last()).toEqual(doc(p(text("Déposer", [{ type: "link", attrs: { variableId: "lien_depot" } }]))));

    // Curseur dans le lien : la saisie reprend la cible, « Retirer le lien » le supprime.
    act(() => { editor.commands.setTextSelection(3); });
    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    expect(await screen.findByRole("radio", { name: "Variable" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("button", { name: "Remove link" }));
    expect(last()).toEqual(doc(p(text("Déposer"))));
  });

  it("⌘/Ctrl+K ouvre la saisie ; sans sélection, l'URL est insérée comme texte du lien", async () => {
    const { field, last } = await setup();
    fireEvent.keyDown(field, { key: "k", ...mod });
    const input = await screen.findByRole("textbox", { name: "URL" });
    fireEvent.change(input, { target: { value: "contact@gs.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(last()).toEqual(doc(p(text("contact@gs.com", [{ type: "link", attrs: { href: "mailto:contact@gs.com" } }]))));
  });

  it("pas d'ouverture au clic dans l'éditeur", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const { field } = await setup({ defaultValue: doc(p(text("lien", [{ type: "link", attrs: { href: "https://a.test/" } }]))) });
    fireEvent.click(field.querySelector("a")!);
    expect(open).not.toHaveBeenCalled();
    open.mockRestore();
  });
});

describe("RichTextEditor — variables", () => {
  it("bouton « Insérer une variable » : puce en ligne ; variable liste en bloc", async () => {
    const user = userEvent.setup();
    const { last } = await setup();
    await user.click(screen.getByRole("button", { name: "Insert a variable" }));
    await user.click(await screen.findByRole("menuitem", { name: /Fournisseur/ }));
    expect(last().content?.[0]).toEqual(p({ type: "variable", attrs: { id: "fournisseur", label: "Fournisseur" } }, text(" ")));
    await user.click(screen.getByRole("button", { name: "Insert a variable" }));
    await user.click(await screen.findByRole("menuitem", { name: /Références en attente/ }));
    expect(last().content?.some((n) => n.type === "variableBlock" && n.attrs?.id === "references")).toBe(true);
    expect(richTextValidate(last(), { variables: VARIABLES })).toEqual([]);
  });

  it("{{ ouvre la liste filtrée, Entrée insère la variable", async () => {
    const { editor, field, last } = await setup();
    act(() => { editor.commands.insertContent("Bonjour {{four"); });
    await screen.findByRole("option", { name: "Fournisseur" });
    expect(screen.queryByRole("option", { name: "Marketplace" })).toBeNull();
    fireEvent.keyDown(field, { key: "Enter" });
    await waitFor(() => expect(last().content?.[0].content?.[1]).toEqual({ type: "variable", attrs: { id: "fournisseur", label: "Fournisseur" } }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("{{id}} tapé en entier : converti en puce (inconnu : reste du texte)", async () => {
    const { editor, last } = await setup();
    // Tiptap applique les règles de saisie simulées au tick suivant.
    act(() => { editor.commands.insertContent("Bonjour {{fournisseur}}", { applyInputRules: true }); });
    await waitFor(() => expect(last()).toEqual(doc(p(text("Bonjour "), { type: "variable", attrs: { id: "fournisseur", label: "Fournisseur" } }))));
    act(() => { editor.commands.insertContent(" {{prenom}}", { applyInputRules: true }); });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(JSON.stringify(last())).toContain("{{prenom}}");
  });

  it("{{id}} collé : converti en puce", async () => {
    const { editor, last } = await setup();
    act(() => { editor.view.pasteText("Relance {{marketplace}} pour {{fournisseur}}"); });
    expect(last()).toEqual(doc(p(
      text("Relance "), { type: "variable", attrs: { id: "marketplace", label: "Marketplace" } },
      text(" pour "), { type: "variable", attrs: { id: "fournisseur", label: "Fournisseur" } },
    )));
  });

  it("variable inconnue : gardée, avec un style d'avertissement et une explication", async () => {
    const { field } = await setup({ defaultValue: doc(p({ type: "variable", attrs: { id: "prenom", label: "Prénom" } })) });
    const chip = field.querySelector('[data-variable-id="prenom"]')!;
    expect(chip).toHaveTextContent("{{Prénom}}");
    expect(chip).toHaveAttribute("data-unknown");
    expect(chip).toHaveAttribute("title", "Unknown variable: it will be refused when sending.");
    expect(field.querySelector('[data-variable-id="fournisseur"]')).toBeNull();
  });
});

describe("RichTextEditor — collage et valeur", () => {
  it("collage riche nettoyé : le résultat respecte le schéma", async () => {
    const { editor, last } = await setup();
    act(() => {
      editor.view.pasteHTML(
        '<h1 style="color:red">Titre</h1><p><span style="font-size:30px">Texte</span> <s>barré</s> <img src="x.png"></p>' +
          '<table><tr><td>cellule</td></tr></table><ul><li>un<ul><li>deux</li></ul></li></ul>' +
          '<p><a href="javascript:alert(1)">piège</a> <a href="https://gs.com" target="_blank" class="x">ok</a></p>',
      );
    });
    const value = last();
    expect(richTextValidate(value)).toEqual([]);
    const json = JSON.stringify(value);
    for (const banned of ["heading", "strike", "image", "table", "javascript", "target", "color"]) expect(json).not.toContain(banned);
    expect(json).toContain("Titre");
    expect(json).toContain("cellule");
    expect(json).toContain('"href":"https://gs.com/"');
  });

  it("onChange : isEmpty et texte brut", async () => {
    const { editor, details } = await setup();
    act(() => { editor.commands.insertContent("   "); });
    expect(details()).toEqual({ isEmpty: true, text: "" });
    act(() => { editor.commands.insertContent({ type: "variable", attrs: { id: "fournisseur", label: "Fournisseur" } }); });
    expect(details()).toEqual({ isEmpty: false, text: "{{Fournisseur}}" });
  });

  it("valeur contrôlée : remplacée sans émettre de changement, null vide l'éditeur", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<RichTextEditor value={doc(p(text("Brouillon")))} onChange={onChange} />);
    const field = await screen.findByRole("textbox");
    expect(field.textContent).toBe("Brouillon");
    rerender(<RichTextEditor value={null} onChange={onChange} />);
    await waitFor(() => expect(field.textContent).toBe(""));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("RichTextEditor — singleLine (sujet)", () => {
  it("pas de barre d'outils, Entrée bloquée, collage sur une ligne avec puces", async () => {
    const { editor, field, last } = await setup({ singleLine: true });
    expect(screen.queryByRole("toolbar")).toBeNull();
    expect(field).toHaveAttribute("aria-multiline", "false");
    act(() => { editor.commands.insertContent("Relance"); });
    fireEvent.keyDown(field, { key: "Enter" });
    fireEvent.keyDown(field, { key: "Enter", shiftKey: true });
    expect(last().content).toHaveLength(1);
    const paste = new Event("paste", { bubbles: true, cancelable: true }) as Event & { clipboardData: unknown };
    paste.clipboardData = { getData: (type: string) => (type === "text/plain" ? " {{fournisseur}}\nsuite" : ""), types: ["text/plain"] };
    act(() => { field.dispatchEvent(paste); });
    expect(last()).toEqual(doc(p(text("Relance "), { type: "variable", attrs: { id: "fournisseur", label: "Fournisseur" } }, text(" suite"))));
  });

  it("menu des variables sans les variables liste", async () => {
    const user = userEvent.setup();
    await setup({ singleLine: true });
    await user.click(screen.getByRole("button", { name: "Insert a variable" }));
    await screen.findByRole("menuitem", { name: /Fournisseur/ });
    expect(screen.queryByRole("menuitem", { name: /Références/ })).toBeNull();
  });

  it("une valeur multi-ligne est ramenée sur une ligne", async () => {
    const { field } = await setup({ singleLine: true, defaultValue: doc(p(text("a")), p(text("b"))) });
    expect(field.textContent).toBe("a b");
  });
});

describe("RichTextEditor — français", () => {
  it("libellés traduits", async () => {
    await setup({ locale: "fr" });
    expect(screen.getByRole("toolbar", { name: "Mise en forme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Liste numérotée" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Insérer une variable" })).toBeInTheDocument();
  });
});
