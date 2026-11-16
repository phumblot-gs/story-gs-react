/** Schemes allowed in a link: anything else (javascript:, data:, file:…) is refused. */
export const RICH_TEXT_LINK_PROTOCOLS = ["https:", "http:", "mailto:"] as const;

/**
 * The URL if it may be used as a link target (`https:`, `http:` or `mailto:`, written in
 * full), normalized by `URL` (e.g. `https://a.test` → `https://a.test/`); else `null`.
 * A protocol-relative URL (`//host`) or a URL without a scheme is refused: see
 * `richTextNormalizeUrl` for user input.
 */
export function richTextSafeHref(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^(https?:\/\/|mailto:)/i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    return (RICH_TEXT_LINK_PROTOCOLS as readonly string[]).includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * User input → link target, or `null` if refused. Without a scheme, `https://` is added
 * (`gs.com/depot` → `https://gs.com/depot`), or `mailto:` for an email address. A scheme
 * other than `https:`, `http:` or `mailto:` is refused.
 */
export function richTextNormalizeUrl(input: string): string | null {
  const value = input.trim();
  if (!value || value.startsWith("//")) return null;
  // A scheme, but not "host:port" (localhost:3000).
  if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(value)) return richTextSafeHref(value);
  if (/^[^\s@/:]+@[^\s@/:]+\.[^\s@/:]+$/.test(value)) return richTextSafeHref(`mailto:${value}`);
  return richTextSafeHref(`https://${value}`);
}
