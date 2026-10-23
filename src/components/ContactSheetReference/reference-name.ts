type NamedReference = { ref?: string | null; smalltext?: string | null; [key: string]: unknown };

const trimmed = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/**
 * Display name of a reference: its `smalltext` when not blank, otherwise its `ref`
 * (same rule as gs_node and gs_w). Empty string for a missing reference.
 */
export function getReferenceDisplayName(reference: NamedReference | null | undefined): string {
  if (!reference) return "";
  return trimmed(reference.smalltext) || trimmed(reference.ref);
}

/** Tooltip of the title: "smalltext — ref" when both differ, otherwise the display name. */
export function getReferenceTooltip(reference: NamedReference | null | undefined): string {
  const name = getReferenceDisplayName(reference);
  const ref = trimmed(reference?.ref);
  return ref && name !== ref ? `${name} — ${ref}` : name;
}
