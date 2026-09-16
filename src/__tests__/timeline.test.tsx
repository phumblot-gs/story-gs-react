import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { BgProvider } from "@/components/layout/BgContext";
import { Card } from "@/components/ui/card";
import { TranslationProvider, useTranslation } from "@/contexts/TranslationContext";

afterEach(cleanup);
const items: TimelineItem[] = [
  { id: "a", title: "Alpha", timestamp: "2026-09-16T10:00:00Z" },
  { id: "b", title: "Beta", timestamp: "2026-09-16T09:00:00Z" },
  { id: "c", title: "Unavailable", timestamp: "2026-09-16T08:00:00Z", disabled: true },
];
const entry = (name: string) => screen.getByRole("button", { name: new RegExp(name) });
describe("Timeline", () => {
  it("selects uncontrolled items, emits the item and retains a repeated selection", () => {
    const change = vi.fn();
    render(<Timeline items={items} defaultSelectedId="a" onSelectionChange={change} />);
    expect(entry("Alpha").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(entry("Beta")); fireEvent.click(entry("Beta"));
    expect(entry("Alpha").getAttribute("aria-pressed")).toBe("false");
    expect(entry("Beta").getAttribute("data-has-active-element")).toBe("true");
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith("b", items[1]);
  });
  it("requests controlled changes without applying them until the parent updates", () => {
    const change = vi.fn();
    const { rerender } = render(<Timeline items={items} selectedId={null} onSelectionChange={change} />);
    fireEvent.click(entry("Alpha"));
    expect(change).toHaveBeenCalledWith("a", items[0]);
    expect(entry("Alpha").getAttribute("aria-pressed")).toBe("false");
    rerender(<Timeline items={items} selectedId="a" onSelectionChange={change} />);
    expect(entry("Alpha").getAttribute("aria-pressed")).toBe("true");
  });
  it("supports Enter and Space and prevents disabled activation", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<Timeline items={items} onSelectionChange={change} />);
    entry("Alpha").focus(); await user.keyboard("{Enter}");
    expect(entry("Alpha").getAttribute("aria-pressed")).toBe("true");
    await user.tab(); await user.keyboard(" ");
    expect(entry("Beta").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(entry("Unavailable")); expect(change).toHaveBeenCalledTimes(2);
  });
  it("inherits the immediate background through Card and defaults to white", () => {
    const { rerender } = render(<Timeline items={items} />);
    expect(entry("Alpha").getAttribute("data-bg")).toBe("white");
    rerender(<BgProvider value="black"><Timeline items={items} /></BgProvider>);
    expect(entry("Alpha").getAttribute("data-bg")).toBe("black");
    rerender(<BgProvider value="grey"><Card><Timeline items={items} /></Card></BgProvider>);
    expect(entry("Alpha").getAttribute("data-bg")).toBe("white");
  });
  it("renders noninteractive or empty content", () => {
    const { rerender } = render(<Timeline items={items} selectable={false} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByText("Empty group")).toBeNull();
    rerender(<Timeline items={[]} emptyContent="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });
  it("keeps selection across data changes and supports custom content", () => {
    const { rerender } = render(<Timeline items={items} defaultSelectedId="b" />);
    rerender(<Timeline items={[]} />);
    rerender(<Timeline items={items} renderItem={(item, state) => <span>{item.title} {state.selected ? "chosen" : ""}</span>} />);
    expect(entry("Beta chosen").getAttribute("aria-pressed")).toBe("true");
  });
  it("uses unique accessible IDs across instances and supports disabling all entries", () => {
    const { container } = render(<><Timeline items={items} disabled /><Timeline items={items} disabled /></>);
    const ids = Array.from(container.querySelectorAll('[id]')).map(node => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    screen.getAllByRole("button").forEach(button => expect(button.hasAttribute("disabled")).toBe(true));
  });
  it("updates dates with the provider language and lets the language prop override it", () => {
    function Example({ language }: { language?: string }) {
      const { setLanguage } = useTranslation();
      return <><button onClick={() => setLanguage({ code: "FR", name: "Français" })}>French</button>
        <Timeline items={items} language={language} timeZone="UTC" /></>;
    }
    const { rerender } = render(<TranslationProvider initialLanguage={{ code: "EN", name: "English" }}><Example /></TranslationProvider>);
    fireEvent.click(screen.getByRole("button", { name: "French" }));
    expect(screen.getByRole("heading").textContent).toContain("septembre");
    rerender(<TranslationProvider><Example language="DE" /></TranslationProvider>);
    expect(screen.getByRole("heading").textContent).toContain("Mittwoch");
    localStorage.clear();
  });
  it("regroups on timezone changes while preserving selection and the UTC time attribute", () => {
    const input = [{ id: "a", title: "Alpha", timestamp: "2026-09-16T23:30:00.000Z" }];
    const { rerender, container } = render(<Timeline items={input} defaultSelectedId="a" language="EN" timeZone="UTC" />);
    expect(screen.getByRole("heading").textContent).toContain("16 September");
    rerender(<Timeline items={input} defaultSelectedId="a" language="EN" timeZone="Europe/Paris" />);
    expect(screen.getByRole("heading").textContent).toContain("17 September");
    expect(entry("Alpha").getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelector("time")?.textContent).toBe("01:30");
    expect(container.querySelector("time")?.getAttribute("datetime")).toBe(input[0].timestamp);
  });
});
