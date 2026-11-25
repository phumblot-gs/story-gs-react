import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ArticleSearchExample } from "@/stories/examples/ArticleSearchExample";
import { parseReferenceList, referenceListSample } from "@/stories/examples/reference-list";
import { articles, groupArticles, matchesArticle } from "@/stories/examples/article-search-data";

afterEach(cleanup);

describe("reference list parsing", () => {
  it("accepts a single Excel column, removes its optional header, blanks and duplicate identifiers", () => {
    const parsed = parseReferenceList("Référence\r\n00123\r\n\r\nTSH-001\r\ntsh-001\r\n00123\r\n");
    expect(parsed).toEqual({ references: ["00123", "TSH-001"], duplicates: 2, headerRemoved: true, error: null });
  });

  it("rejects ambiguous spreadsheets rather than treating names or quantities as references", () => {
    const parsed = parseReferenceList("Référence\tNom\nTSH-001\tT-shirt");
    expect(parsed.error).toContain("Plusieurs colonnes");
    expect(parsed.references).toEqual([]);
  });

  it("matches whole identifiers with OR semantics and excludes empty locations", () => {
    const search = { query: "", field: "reference" as const, references: ["tsh-001", "SAC-001", "TSH"] };
    const results = articles.filter(article => matchesArticle(article, search));
    expect(results.map(article => article.reference)).toEqual(["TSH-001", "SAC-001"]);
    expect(groupArticles(results, "shelf", search, true).some(group => !group.total)).toBe(false);
  });
});

describe("two reference-list proposals", () => {
  it("detects a pasted list, waits for submission and reports missing references", () => {
    render(<ArticleSearchExample referenceInput="smart" initialView="articles" />);
    const input = screen.getByRole("searchbox", { name: "Votre recherche" });
    fireEvent.paste(input, { clipboardData: { getData: () => referenceListSample } });
    expect(screen.getByText("Liste de références détectée")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("12 articles");
    expect(screen.getByText(/1 doublon ignoré/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Rechercher 5 références" }));
    expect(screen.getByRole("status").textContent).toContain("4 articles sur 12");
    expect(screen.getByText("5 références recherchées · 4 trouvées · 1 introuvable.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Voir les références introuvables (1)" }));
    expect((screen.getByRole("textbox", { name: "Références sans résultat" }) as HTMLTextAreaElement).value).toBe("REF-ABSENTE");
    fireEvent.click(screen.getByRole("button", { name: "Voir tous les articles" }));
    expect(screen.getByRole("status").textContent).toContain("12 articles");
    expect(screen.getByRole("searchbox", { name: "Votre recherche" })).toBeTruthy();
  });

  it("keeps normal text searches available without creating a list", () => {
    render(<ArticleSearchExample referenceInput="smart" />);
    fireEvent.paste(screen.getByRole("searchbox", { name: "Votre recherche" }), { clipboardData: { getData: () => "TSH-001" } });
    expect(screen.queryByText("Liste de références détectée")).toBeNull();
  });

  it("offers an explicit editable list mode and prevents empty or multi-column submissions", () => {
    render(<ArticleSearchExample referenceInput="explicit" initialView="articles" />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Liste de références" }), { button: 0, ctrlKey: false });
    const editor = screen.getByRole("textbox", { name: "Références" });
    expect(screen.getByRole("button", { name: "Rechercher 0 référence" }).hasAttribute("disabled")).toBe(true);
    fireEvent.change(editor, { target: { value: "TSH-001\t2\nSAC-001\t1" } });
    expect(screen.getByRole("alert").textContent).toContain("Plusieurs colonnes");
    expect(screen.getByRole("button", { name: "Rechercher 0 référence" }).hasAttribute("disabled")).toBe(true);
    fireEvent.change(editor, { target: { value: "TSH-001\nSAC-001" } });
    fireEvent.click(screen.getByRole("button", { name: "Rechercher 2 références" }));
    expect(screen.getByRole("status").textContent).toContain("2 articles sur 12");
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Par zone" }), { button: 0, ctrlKey: false });
    expect(screen.getByRole("status").textContent).toContain("2 articles sur 12");
  });
});
