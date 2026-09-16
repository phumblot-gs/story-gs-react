/** Accepted input: UTC ISO 8601 with seconds and optional 1–3 millisecond digits. */
export function parseTimelineTimestamp(timestamp: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(timestamp)) {
    throw new RangeError(`Timeline: expected a UTC ISO 8601 timestamp ending in Z, received "${timestamp}".`);
  }
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 19) !== timestamp.slice(0, 19)) {
    throw new RangeError(`Timeline: invalid timestamp "${timestamp}".`);
  }
  return date;
}

const locales: Record<string, string> = { EN: "en-GB", FR: "fr-FR", ES: "es-ES", IT: "it-IT", DE: "de-DE" };

/** Groups after conversion to the target timezone, without mutating source items. */
export function groupTimelineItems<T extends { timestamp: string }>(items: T[], language: string, timeZone?: string, now = new Date()) {
  const locale = locales[language.toUpperCase()] ?? locales.EN;
  const dayFormatter = new Intl.DateTimeFormat("en-GB", { timeZone, calendar: "gregory", numberingSystem: "latn", year: "numeric", month: "2-digit", day: "2-digit" });
  const dateFormatter = new Intl.DateTimeFormat(locale, { timeZone, weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeFormatter = new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const fullFormatter = new Intl.DateTimeFormat(locale, { timeZone, year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZoneName: "short" });
  const dayKey = (date: Date) => {
    const parts = dayFormatter.formatToParts(date);
    return ["year", "month", "day"].map(type => parts.find(part => part.type === type)!.value).join("-");
  };
  const todayKey = dayKey(now);
  // Compare calendar dates, not elapsed 24-hour periods (DST days vary in length).
  const yesterdayKey = new Date(Date.parse(`${todayKey}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
  const relativeFormatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const sorted = items.map(item => ({ item, date: parseTimelineTimestamp(item.timestamp) })).sort((a, b) => b.date.getTime() - a.date.getTime());
  const groups = new Map<string, { id: string; label: string; description?: string; items: { item: T; time: string; fullDate: string }[] }>();
  for (const { item, date } of sorted) {
    const id = dayKey(date);
    const relativeDay = id === todayKey ? 0 : id === yesterdayKey ? -1 : undefined;
    if (!groups.has(id)) groups.set(id, {
      id,
      label: relativeDay === undefined ? dateFormatter.format(date) : relativeFormatter.format(relativeDay, "day"),
      description: relativeDay === undefined ? undefined : dateFormatter.format(date),
      items: [],
    });
    groups.get(id)!.items.push({ item, time: timeFormatter.format(date), fullDate: fullFormatter.format(date) });
  }
  return [...groups.values()];
}
