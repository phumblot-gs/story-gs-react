import type { ReferenceData } from "./types";

/** Lit un champ par chemin pointé ("extra.supplier_ref", "eans.0"). */
export function getAttributeValue(reference: ReferenceData, key: string): unknown {
  return key.split(".").reduce<unknown>((value, segment) => {
    if (value === null || value === undefined || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, reference);
}

/** Valeur brute → texte affichable. Vide pour null / undefined / objet. */
export function formatAttributeValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(formatAttributeValue).filter(Boolean).join(", ");
  if (typeof value === "object") return "";
  return String(value);
}
