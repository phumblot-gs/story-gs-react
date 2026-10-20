import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TruncatedText } from "@/components/ui/truncated-text";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

/** jsdom does no layout: scrollWidth / clientWidth are stubbed to simulate a cut text. */
const stubWidths = (scroll: number, client: number) => {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(scroll);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(client);
};

describe("TruncatedText", () => {
  it("passes other HTML attributes to the text element", () => {
    render(<TruncatedText text="Batch 7610" data-testid="name" style={{ fontWeight: 500 }} aria-describedby="hint" />);
    const el = screen.getByTestId("name");
    expect(el.textContent).toBe("Batch 7610");
    expect(el.style.fontWeight).toBe("500");
    expect(el.getAttribute("aria-describedby")).toBe("hint");
  });

  it("attaches no tooltip when the text fits", () => {
    stubWidths(100, 100);
    render(<TruncatedText text="Short" data-testid="t" />);
    expect(screen.getByTestId("t").getAttribute("data-state")).toBeNull();
  });

  it("attaches a tooltip trigger when the text is cut", () => {
    stubWidths(400, 100);
    render(<TruncatedText text="A very long batch name" data-testid="t" as="p" />);
    const el = screen.getByTestId("t");
    expect(el.tagName).toBe("P");
    expect(el.getAttribute("data-state")).toBe("closed");
  });
});
