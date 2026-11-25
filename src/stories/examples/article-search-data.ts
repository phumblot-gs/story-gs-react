import { referenceKey } from "./reference-list";

export type SearchField = "all" | "reference" | "shelf" | "zone";
export type ArticleView = "articles" | "shelf" | "zone";
export type Stage = "todo" | "planned" | "progress" | "done";
export interface Article {
  id: string;
  reference: string;
  name: string;
  shelf: string;
  stage: Stage;
  inStock: boolean;
}
export interface ArticleSearch { field: SearchField; query: string; references?: string[]; criteria?: string[]; }
export interface ArticleGroup {
  id: string;
  label: string;
  todo: number;
  planned: number;
  progress: number;
  done: number;
  total: number;
}
export const shelves = [
  { id: "R-01", name: "Prêt-à-porter", zone: "Zone A" },
  { id: "R-02", name: "Chaussures", zone: "Zone A" },
  { id: "R-03", name: "Accessoires", zone: "Zone B" },
  { id: "R-04", name: "Réserve", zone: "Zone B" },
];
export const articles: Article[] = [
  { id: "1", reference: "TSH-001", name: "T-shirt en coton", shelf: "R-01", stage: "todo", inStock: true },
  { id: "2", reference: "TSH-002", name: "T-shirt rayé", shelf: "R-01", stage: "planned", inStock: true },
  { id: "3", reference: "PUL-001", name: "Pull en laine", shelf: "R-01", stage: "progress", inStock: true },
  { id: "4", reference: "VST-001", name: "Veste en denim", shelf: "R-01", stage: "done", inStock: true },
  { id: "5", reference: "ROB-001", name: "Robe longue", shelf: "R-01", stage: "todo", inStock: false },
  { id: "6", reference: "SNE-001", name: "Baskets blanches", shelf: "R-02", stage: "planned", inStock: true },
  { id: "7", reference: "BOT-001", name: "Bottines en cuir", shelf: "R-02", stage: "progress", inStock: true },
  { id: "8", reference: "SAN-001", name: "Sandales", shelf: "R-02", stage: "done", inStock: false },
  { id: "9", reference: "SAC-001", name: "Sac en toile", shelf: "R-03", stage: "progress", inStock: true },
  { id: "10", reference: "CEI-001", name: "Ceinture en cuir", shelf: "R-03", stage: "done", inStock: true },
  { id: "11", reference: "ECH-001", name: "Écharpe", shelf: "", stage: "todo", inStock: true },
  { id: "12", reference: "BON-001", name: "Bonnet", shelf: "", stage: "planned", inStock: false },
];
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("fr-FR");
export function shelfLabel(id: string) {
  const shelf = shelves.find(item => item.id === id);
  return shelf ? `${shelf.id} · ${shelf.name}` : "Sans rayon";
}
export function zoneLabel(shelfId: string) { return shelves.find(item => item.id === shelfId)?.zone ?? "Sans zone"; }
export function matchesArticle(article: Article, search: ArticleSearch): boolean {
  if (search.criteria) return search.criteria.some(value => search.field === "reference"
    ? referenceKey(value) === referenceKey(article.reference)
    : matchesArticle(article, { field: search.field, query: value }));
  if (search.references) return search.references.some(reference => referenceKey(reference) === referenceKey(article.reference));
  const query = normalize(search.query);
  if (!query) return true;
  const values = {
    reference: article.reference,
    shelf: shelfLabel(article.shelf),
    zone: zoneLabel(article.shelf),
    all: [article.reference, article.name, shelfLabel(article.shelf), zoneLabel(article.shelf)].join(" "),
  };
  return normalize(values[search.field]).includes(query);
}
export function groupArticles(rows: Article[], view: "shelf" | "zone", search: ArticleSearch, includeEmpty: boolean): ArticleGroup[] {
  const groups = new Map<string, ArticleGroup>();
  const createGroup = (id: string, label: string) => ({ id, label, todo: 0, planned: 0, progress: 0, done: 0, total: 0 });
  for (const row of rows) {
    const id = view === "shelf" ? row.shelf : zoneLabel(row.shelf);
    const group = groups.get(id) ?? createGroup(id, view === "shelf" ? shelfLabel(id) : id);
    group[row.stage] += 1;
    group.total += 1;
    groups.set(id, group);
  }
  // Include genuinely empty locations, not occupied shelves with no matching articles.
  if (view === "shelf" && includeEmpty && !search.references && !(search.criteria && search.field === "reference")) {
    for (const shelf of shelves) {
      if (articles.some(article => article.shelf === shelf.id)) continue;
      const value = search.field === "zone" ? shelf.zone : search.field === "shelf" ? shelfLabel(shelf.id) : [shelfLabel(shelf.id), shelf.zone].join(" ");
      const queries = search.criteria ?? [search.query];
      if (!queries.some(query => !normalize(query) || (search.field !== "reference" && normalize(value).includes(normalize(query))))) continue;
      groups.set(shelf.id, createGroup(shelf.id, shelfLabel(shelf.id)));
    }
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label, "fr"));
}
