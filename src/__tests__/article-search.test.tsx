import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ArticleSearchExample } from "@/stories/examples/ArticleSearchExample";
import { articles, groupArticles, matchesArticle } from "@/stories/examples/article-search-data";

afterEach(cleanup);

describe("article search and grouping", () => {
  it("searches all attributes by default while reference search remains exact in scope", () => {
    expect(articles.filter(article => matchesArticle(article, { field: "all", query: "ÉCHARPE" })).map(article => article.reference)).toEqual(["ECH-001"]);
    expect(articles.filter(article => matchesArticle(article, { field: "reference", query: "écharpe" }))).toEqual([]);
    expect(articles.filter(article => matchesArticle(article, { field: "zone", query: "zone a" }))).toHaveLength(8);
  });

  it("preserves totals and every status when grouping by shelf or zone", () => {
    for (const view of ["shelf", "zone"] as const) {
      const groups = groupArticles(articles, view, { field: "all", query: "" }, false);
      expect(groups.reduce((sum, group) => sum + group.total, 0)).toBe(articles.length);
      expect(groups.every(group => group.total === group.todo + group.planned + group.progress + group.done)).toBe(true);
    }
  });

  it("only includes genuinely empty locations and respects the search field", () => {
    const search = { field: "all" as const, query: "TSH" };
    const rows = articles.filter(article => matchesArticle(article, search));
    expect(groupArticles(rows, "shelf", search, true).map(group => group.id)).toEqual(["R-01"]);
    expect(groupArticles([], "shelf", { field: "reference", query: "R-04" }, true)).toEqual([]);
    const empty = groupArticles([], "shelf", { field: "shelf", query: "R-04" }, true);
    expect(empty).toHaveLength(1);
    expect(empty[0].total).toBe(0);
    expect(groupArticles([], "shelf", { field: "zone", query: "Zone A" }, true)).toEqual([]);
  });
});

describe("article search composition", () => {
  it("applies search on submit and preserves it when the presentation changes", () => {
    render(<ArticleSearchExample />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Votre recherche" }), { target: { value: "TSH" } });
    expect(screen.getByRole("status").textContent).toContain("12 articles");
    fireEvent.click(screen.getByRole("button", { name: "Rechercher" }));
    expect(screen.getByRole("status").textContent).toContain("2 articles sur 12");
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Articles" }), { button: 0, ctrlKey: false });
    expect(screen.getByRole("status").textContent).toContain("2 articles sur 12");
    expect(screen.getByText("T-shirt en coton")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Voir tous les articles" }));
    expect(screen.getByRole("status").textContent).toContain("12 articles");
    expect((screen.getByRole("searchbox", { name: "Votre recherche" }) as HTMLInputElement).value).toBe("");
  });

  it("labels empty shelves and makes the switch contextual to the shelf view", () => {
    render(<ArticleSearchExample />);
    expect(screen.queryByText("R-04 · Réserve")).toBeNull();
    fireEvent.click(screen.getByRole("switch", { name: "Inclure les rayons vides" }));
    expect(screen.getByText("R-04 · Réserve")).toBeTruthy();
    expect(screen.getByText("Vide")).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Par zone" }), { button: 0, ctrlKey: false });
    expect(screen.queryByRole("switch", { name: "Inclure les rayons vides" })).toBeNull();
    expect(screen.getByRole("status").textContent).toContain("12 articles");
  });
});
