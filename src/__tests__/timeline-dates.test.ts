import { beforeEach, afterEach, vi, describe, expect, it } from "vitest";
import { groupTimelineItems, parseTimelineTimestamp } from "@/lib/timeline-dates";
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-12-01T12:00:00Z")); });
afterEach(() => vi.useRealTimers());
const items = [
  { id: "early", timestamp: "2026-09-16T15:00:54.037Z" },
  { id: "late", timestamp: "2026-09-16T23:30:00Z" },
];
describe("Timeline dates", () => {
  it("converts before grouping and sorts without mutating input", () => {
    const paris = groupTimelineItems(items, "FR", "Europe/Paris");
    expect(paris.map(group => group.id)).toEqual(["2026-09-17", "2026-09-16"]);
    expect(paris[0].items[0].time).toBe("01:30");
    expect(paris[1].items[0].time).toBe("17:00");
    expect(paris[0].items[0].item).toBe(items[1]);
    const ny = groupTimelineItems(items, "FR", "America/New_York");
    expect(ny.map(group => group.id)).toEqual(["2026-09-16"]);
    expect(ny[0].items.map(entry => entry.time)).toEqual(["19:30", "11:00"]);
    expect(items[0].id).toBe("early");
  });
  it.each([['EN', 'September'], ['FR', 'septembre'], ['ES', 'septiembre'], ['IT', 'settembre'], ['DE', 'September']])("localizes %s dates", (language, month) => {
    expect(groupTimelineItems(items, language, "UTC")[0].label).toContain(month);
  });
  it("handles DST gaps and repeated hours using event-time offsets", () => {
    const data = ["2026-03-29T00:30:00Z", "2026-03-29T01:30:00Z", "2026-10-25T00:30:00Z", "2026-10-25T01:30:00Z"].map(timestamp => ({ timestamp }));
    const groups = groupTimelineItems(data, "EN", "Europe/Paris");
    expect(groups[0].items.map(item => item.time)).toEqual(["02:30", "02:30"]);
    expect(groups[0].items[0].fullDate).not.toBe(groups[0].items[1].fullDate);
    expect(groups[1].items.map(item => item.time)).toEqual(["03:30", "01:30"]);
  });
  it.each(["2026-09-16", "2026-09-16T15:00:00", "2026-09-16T15:00:00+02:00", "2026-02-30T15:00:00Z", "2026-09-16T24:00:00Z", "bad"])("rejects invalid UTC input %s", timestamp => {
    expect(() => parseTimelineTimestamp(timestamp)).toThrow(RangeError);
  });
  it("accepts optional milliseconds and leap days", () => {
    expect(parseTimelineTimestamp("2024-02-29T00:00:00.1Z").toISOString()).toBe("2024-02-29T00:00:00.100Z");
  });
  it("rejects invalid zones and falls back to English for unsupported languages", () => {
    expect(() => groupTimelineItems(items, "EN", "Invalid/Zone")).toThrow(RangeError);
    expect(groupTimelineItems(items, "other", "UTC")[0].label).toBe(groupTimelineItems(items, "EN", "UTC")[0].label);
  });
  it("uses the runtime zone by default and preserves order for identical instants", () => {
    expect(groupTimelineItems(items, "EN")).toEqual(groupTimelineItems(items, "EN", Intl.DateTimeFormat().resolvedOptions().timeZone));
    const same = [{ id: "1", timestamp: items[0].timestamp }, { id: "2", timestamp: items[0].timestamp }];
    expect(groupTimelineItems(same, "EN", "UTC")[0].items.map(entry => entry.item.id)).toEqual(["1", "2"]);
  });
});

describe("Timeline relative headings", () => {
  it.each([['EN', 'today', 'yesterday'], ['FR', 'aujourd’hui', 'hier'], ['ES', 'hoy', 'ayer'], ['IT', 'oggi', 'ieri'], ['DE', 'heute', 'gestern']])("translates %s and keeps full dates", (language, today, yesterday) => {
    const result = groupTimelineItems([{ timestamp: "2026-09-16T10:00:00Z" }, { timestamp: "2026-09-15T10:00:00Z" }], language, "UTC", new Date("2026-09-16T12:00:00Z"));
    expect(result.map(group => group.label)).toEqual([today, yesterday]);
    expect(result.every(group => group.description?.includes("2026"))).toBe(true);
  });
  it("compares local calendar days across midnight and DST", () => {
    const input = [{ timestamp: "2026-03-29T00:30:00Z" }];
    const now = new Date("2026-03-29T22:30:00Z");
    expect(groupTimelineItems(input, "EN", "Europe/Paris", now)[0].label).toBe("yesterday");
    expect(groupTimelineItems(input, "EN", "UTC", now)[0].label).toBe("today");
    expect(groupTimelineItems([{ timestamp: "2025-12-31T23:00:00Z" }], "EN", "UTC", new Date("2026-01-01T01:00:00Z"))[0].label).toBe("yesterday");
  });
});
