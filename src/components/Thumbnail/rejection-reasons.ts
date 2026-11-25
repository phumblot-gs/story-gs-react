const foldForSearch = (value: string) =>
  value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Main then secondary reasons whose label contains the query (case and accent insensitive), without duplicates. */
export function filterRejectionReasons(
  main: readonly unknown[] | undefined,
  secondary: readonly unknown[] | undefined,
  query: string
): string[] {
  const needle = foldForSearch(query.trim());
  const labels = [...(main ?? []), ...(secondary ?? [])].filter((reason): reason is string => typeof reason === "string");
  const reasons = Array.from(new Set(labels));
  return reasons.filter((reason) => foldForSearch(reason).includes(needle));
}
