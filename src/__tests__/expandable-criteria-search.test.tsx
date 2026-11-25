import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ArticleSearchExample } from "@/stories/examples/ArticleSearchExample";
import { referenceListSample, parseSearchCriteria } from "@/stories/examples/reference-list";
import { articles, groupArticles, matchesArticle } from "@/stories/examples/article-search-data";

afterEach(cleanup);

describe("expandable criteria search", () => {
  it("opens a multiline editor and collapses to an obvious count without losing input", () => {
    render(<ArticleSearchExample referenceInput="keyboard" initialField="reference" initialView="articles" />);
    const input = screen.getByRole("searchbox", { name: "Votre recherche" });
    expect(input.getAttribute("placeholder")).toBe("Maj+Entrée pour une recherche multiple");
    fireEvent.change(input, { target: { value: "TSH-001" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    const editor = screen.getByRole("textbox", { name: "Critères de recherche — une valeur par ligne" }) as HTMLTextAreaElement;
    expect(document.activeElement).toBe(editor);
    expect(editor.value).toBe("TSH-001");
    fireEvent.change(editor, { target: { value: referenceListSample } });
    fireEvent.keyDown(editor, { key: "Escape" });
    const summary = screen.getByRole("button", { name: "5 critères de recherche, modifier" });
    expect(document.activeElement).toBe(summary);
    expect(screen.queryByRole("textbox", { name: "Critères de recherche — une valeur par ligne" })).toBeNull();
    expect(screen.getByRole("status").textContent).toContain("12 articles");
    fireEvent.keyDown(summary, { key: "Enter", shiftKey: true });
    expect((screen.getByRole("textbox", { name: "Critères de recherche — une valeur par ligne" }) as HTMLTextAreaElement).value).toBe(referenceListSample);
    fireEvent.click(screen.getByRole("button", { name: "Rechercher 5 critères" }));
    expect(screen.getByRole("status").textContent).toContain("4 articles sur 12");
    fireEvent.click(screen.getByRole("button", { name: "Voir tous les articles" }));
    expect(screen.queryByRole("textbox", { name: "Critères de recherche — une valeur par ligne" })).toBeNull();
    expect((screen.getByRole("searchbox", { name: "Votre recherche" }) as HTMLInputElement).value).toBe("");
  });

  it("collapses a single criterion back to an editable search field", () => {
    render(<ArticleSearchExample referenceInput="keyboard" initialField="reference" />);
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir la recherche multiple" }));
    const editor = screen.getByRole("textbox", { name: "Critères de recherche — une valeur par ligne" });
    fireEvent.change(editor, { target: { value: "TSH-001\n" } });
    fireEvent.keyDown(editor, { key: "Escape" });
    const input = screen.getByRole("searchbox", { name: "Votre recherche" }) as HTMLInputElement;
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("TSH-001");
  });

  it("shows a count immediately after pasting and keeps invalid columns correctable", () => {
    render(<ArticleSearchExample referenceInput="keyboard" initialField="reference" />);
    fireEvent.paste(screen.getByRole("searchbox", { name: "Votre recherche" }), { clipboardData: { getData: () => referenceListSample } });
    expect(screen.getByRole("button", { name: "5 critères de recherche, modifier" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("12 articles");
    fireEvent.click(screen.getByRole("button", { name: "Vider les critères" }));
    fireEvent.paste(screen.getByRole("searchbox", { name: "Votre recherche" }), { clipboardData: { getData: () => "TSH-001\t2\nSAC-001\t3" } });
    expect(screen.getByRole("alert").textContent).toContain("Plusieurs colonnes");
    expect(screen.getByRole("button", { name: "Rechercher 0 critère" }).hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Liste à corriger de recherche, modifier" }));
    expect(screen.getByRole("textbox", { name: "Critères de recherche — une valeur par ligne" })).toBeTruthy();
  });

  it("keeps the selected field for multiple criteria and offers Ctrl+Enter submission", () => {
    render(<ArticleSearchExample referenceInput="keyboard" initialField="zone" />);
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir la recherche multiple" }));
    const editor = screen.getByRole("textbox", { name: "Critères de recherche — une valeur par ligne" });
    fireEvent.change(editor, { target: { value: "Zone\nZone A\nZone B" } });
    fireEvent.keyDown(editor, { key: "Enter", ctrlKey: true });
    expect(screen.getByRole("status").textContent).toContain("10 articles sur 12");
    expect(screen.getByText("Zone : 2 critères")).toBeTruthy();
    expect(screen.getByText(/En-tête ignoré/)).toBeTruthy();
  });
});

describe("criteria follow the selected attribute", () => {
  it("uses reference equality and retains shelf/zone search semantics", () => {
    const referenceSearch = { field: "reference" as const, query: "", criteria: ["TSH", "SAC-001"] };
    expect(articles.filter(article => matchesArticle(article, referenceSearch)).map(article => article.reference)).toEqual(["SAC-001"]);
    expect(parseSearchCriteria("Rayon\nR-01\nR-04", "shelf").references).toEqual(["R-01", "R-04"]);
    const shelfSearch = { field: "shelf" as const, query: "", criteria: ["R-01", "R-04"] };
    const rows = articles.filter(article => matchesArticle(article, shelfSearch));
    expect(rows).toHaveLength(5);
    expect(groupArticles(rows, "shelf", shelfSearch, true).map(group => group.id)).toEqual(["R-01", "R-04"]);
  });
});
