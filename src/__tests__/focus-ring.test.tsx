import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Button } from "@/components/ui/button";
import { Button as ButtonBase } from "@/components/ui/button-base";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Layout } from "@/components/layout/Layout";

afterEach(cleanup);

const tokensCss = readFileSync(resolve(__dirname, "../styles/figma-tokens.css"), "utf8");
const shadcnCss = readFileSync(resolve(__dirname, "../styles/shadcn-theme.css"), "utf8");
const LIB_CSS = resolve(__dirname, "../../dist/lib.css");

const HSL_TRIPLET = /^(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%$/;

function hslTripletToHex(triplet: string): string {
  const match = triplet.match(HSL_TRIPLET);
  if (!match) throw new Error(`not an HSL triplet: ${triplet}`);
  const [h, s, l] = [Number(match[1]), Number(match[2]) / 100, Number(match[3]) / 100];
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return `#${[0, 8, 4].map((n) => channel(n).toString(16).padStart(2, "0")).join("")}`;
}

function ringIn(css: string, selector: string): string | undefined {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1];
  return block?.match(/--ring:\s*([^;]+);/)?.[1].trim();
}

// CR-1151: Tailwind maps `ring` to hsl(var(--ring)); a hex --ring made the rule invalid and no ring rendered.
describe("--ring token is an HSL triplet with the charter colour", () => {
  it.each([
    ['[data-bg="white"]', tokensCss, "#292828"],
    ['[data-bg="grey"]', tokensCss, "#292828"],
    ['[data-bg="black"]', tokensCss, "#ffffff"],
    [":root", shadcnCss, "#292828"],
  ])("%s", (selector, css, hex) => {
    const ring = ringIn(css, selector);
    expect(ring).toMatch(HSL_TRIPLET);
    expect(hslTripletToHex(ring!)).toBe(hex);
  });

  it(".dark stays a valid HSL triplet", () => {
    expect(ringIn(shadcnCss, ".dark")).toMatch(HSL_TRIPLET);
  });
});

describe.skipIf(!existsSync(LIB_CSS))("built lib.css (after npm run build:lib)", () => {
  const libCss = existsSync(LIB_CSS) ? readFileSync(LIB_CSS, "utf8") : "";

  it("ring-ring resolves through hsl(var(--ring))", () => {
    expect(libCss).toContain(".focus-visible\\:ring-ring:focus-visible{--tw-ring-color: hsl(var(--ring))}");
  });

  it.each(["white", "grey", "black"])("data-bg=%s ships an HSL --ring", (bg) => {
    const block = libCss.match(new RegExp(`\\[data-bg="?${bg}"?\\]\\{([^}]*--ring:[^}]*)\\}`))?.[1];
    expect(block?.match(/--ring:\s*([^;]+)/)?.[1].trim()).toMatch(HSL_TRIPLET);
  });
});

const KEYBOARD_RING = /^focus-visible:ring-[12]$/;

function expectKeyboardOnlyRing(element: HTMLElement) {
  const classes = Array.from(element.classList);
  expect(classes.some((c) => KEYBOARD_RING.test(c))).toBe(true);
  expect(classes).toContain("focus-visible:ring-ring");
  // A plain focus: ring would also show on mouse click and on dialog auto-focus.
  expect(classes.filter((c) => /^focus:ring-[1-9]/.test(c))).toEqual([]);
  // hsl(var(--background)) is invalid under data-bg (hex) and would drop the whole box-shadow.
  expect(classes).not.toContain("ring-offset-background");
}

describe("components carry a keyboard-only ring", () => {
  it.each(["white", "grey", "black"] as const)("on bg=%s", (bg) => {
    render(
      <Layout bg={bg}>
        <Button>Button</Button>
        <Checkbox aria-label="Checkbox" />
        <Switch aria-label="Switch" />
        <Slider aria-label="Slider" defaultValue={[3]} min={1} max={7} />
        <RadioGroup aria-label="Radio" defaultValue="a">
          <RadioGroupItem value="a" aria-label="Option A" />
        </RadioGroup>
      </Layout>,
    );
    expect(screen.getByRole("button", { name: "Button" })).toHaveAttribute("data-bg", bg);
    expectKeyboardOnlyRing(screen.getByRole("button", { name: "Button" }));
    expectKeyboardOnlyRing(screen.getByRole("checkbox", { name: "Checkbox" }));
    expectKeyboardOnlyRing(screen.getByRole("switch"));
    expectKeyboardOnlyRing(screen.getByRole("slider"));
    expectKeyboardOnlyRing(screen.getByRole("radio", { name: "Option A" }));
  });

  it("ButtonBase", () => {
    render(<ButtonBase>Base</ButtonBase>);
    expectKeyboardOnlyRing(screen.getByRole("button", { name: "Base" }));
  });

  it("Badge", () => {
    render(<Badge tabIndex={0}>Badge</Badge>);
    expectKeyboardOnlyRing(screen.getByText("Badge").closest(".badge-normal") as HTMLElement);
  });

  it("Dialog close button", () => {
    render(
      <Dialog open>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expectKeyboardOnlyRing(screen.getByRole("button", { name: "Close" }));
  });
});
