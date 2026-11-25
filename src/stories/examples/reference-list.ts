/** Compare identifiers without coercing them to numbers or removing punctuation. */
export const referenceKey = (reference: string) => reference.trim().toLocaleUpperCase("fr-FR");
export interface ParsedReferenceList {
  references: string[];
  duplicates: number;
  headerRemoved: boolean;
  error: string | null;
}

/** Excel single-column clipboard text, optionally headed by Référence/Ref. */
export function parseReferenceList(raw: string, headerPattern = /^(ref|références?|references?)$/i): ParsedReferenceList {
  const rows = raw.split(/\r\n|\n|\r/).map(row => row.split("\t").map(cell => cell.trim()).filter(Boolean)).filter(row => row.length);
  if (rows.some(row => row.length > 1)) return { references: [], duplicates: 0, headerRemoved: false, error: "Plusieurs colonnes détectées. Copiez uniquement la colonne des références depuis Excel." };
  const entries = rows.map(row => row[0]);
  const headerRemoved = headerPattern.test(entries[0] ?? "");
  if (headerRemoved) entries.shift();
  const seen = new Set<string>();
  const references: string[] = [];
  let duplicates = 0;
  for (const value of entries) {
    const key = referenceKey(value);
    if (seen.has(key)) { duplicates++; continue; }
    seen.add(key); references.push(value);
  }
  return { references, duplicates, headerRemoved, error: null };
}

export const referenceListSample = "Référence\nTSH-001\nPUL-001\nSAC-001\nECH-001\nREF-ABSENTE\nTSH-001";

/** Same column parser, with a header appropriate to the selected search criterion. */
export function parseSearchCriteria(raw: string, field: "all" | "reference" | "shelf" | "zone") {
  const headers = field === "shelf" ? /^(rayons?|shelves?|shelf)$/i : field === "zone" ? /^zones?$/i : /^(ref|références?|references?)$/i;
  return parseReferenceList(raw, headers);
}
