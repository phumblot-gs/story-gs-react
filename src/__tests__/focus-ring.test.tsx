import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";

import { Button } from "@/components/ui/button";
import { Button as ButtonBase } from "@/components/ui/button-base";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Layout } from "@/components/layout/Layout";
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger } from "@/components/ui/segmented-control";
import { ButtonPlus } from "@/components/ui/button-plus";

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

function tokenIn(css: string, selector: string, token: string): string | undefined {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1];
  return block?.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1].trim();
}

const ringIn = (css: string, selector: string) => tokenIn(css, selector, "--ring");

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

// CR-1151: the white Tailwind default offset merged with the white ring on black into a solid 4px border.
describe("--ring-offset token is the context background", () => {
  it.each([
    ['[data-bg="white"]', tokensCss, "#ffffff"],
    ['[data-bg="grey"]', tokensCss, "var(--color-grey-light)"],
    ['[data-bg="black"]', tokensCss, "#292828"],
    [":root", shadcnCss, "#ffffff"],
  ])("%s", (selector, css, value) => {
    expect(tokenIn(css, selector, "--ring-offset")).toBe(value);
  });

  it("matches the background of each data-bg context", () => {
    for (const bg of ["white", "grey", "black"]) {
      const selector = `[data-bg="${bg}"]`;
      expect(tokenIn(tokensCss, selector, "--ring-offset")).toBe(tokenIn(tokensCss, selector, "--background"));
    }
    expect(tokenIn(tokensCss, ":root", "--color-grey-light")).toBe("#efefef");
  });

  it(".dark does not override it (white offset, as without data-bg)", () => {
    expect(tokenIn(shadcnCss, ".dark", "--ring-offset")).toBeUndefined();
  });
});

describe.skipIf(!existsSync(LIB_CSS))("built lib.css (after npm run build:lib)", () => {
  const libCss = existsSync(LIB_CSS) ? readFileSync(LIB_CSS, "utf8") : "";

  it("ring-ring resolves through hsl(var(--ring))", () => {
    expect(libCss).toContain(".focus-visible\\:ring-ring:focus-visible{--tw-ring-color: hsl(var(--ring))}");
  });

  it("ring-offset-context paints --ring-offset, with the preset's #fff fallback", () => {
    expect(libCss).toContain(".focus-visible\\:ring-offset-context:focus-visible{--tw-ring-offset-color: var(--ring-offset, #fff)}");
  });

  it.each(["white", "grey", "black"])("data-bg=%s ships --ring-offset", (bg) => {
    const block = libCss.match(new RegExp(`\\[data-bg="?${bg}"?\\]\\{([^}]*--ring-offset:[^}]*)\\}`))?.[1];
    expect(block).toBeDefined();
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
  if (classes.some((c) => /^focus-visible:ring-offset-\d$/.test(c))) {
    expect(classes).toContain("focus-visible:ring-offset-context");
  }
}

const COMPONENTS_DIR = resolve(__dirname, "../components");
// Kept unchanged on purpose: unknown external projects may still import it.
const RING_OFFSET_BACKGROUND_ALLOWED = ["ui/select-old.tsx"];

describe("no ring-offset-background in the components", () => {
  it("only the legacy select-old.tsx keeps it", () => {
    const offenders = (readdirSync(COMPONENTS_DIR, { recursive: true }) as string[])
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => relative(COMPONENTS_DIR, resolve(COMPONENTS_DIR, file)).split("\\").join("/"))
      .filter((file) => !RING_OFFSET_BACKGROUND_ALLOWED.includes(file))
      .filter((file) => readFileSync(resolve(COMPONENTS_DIR, file), "utf8").includes("ring-offset-background"));
    expect(offenders).toEqual([]);
  });
});

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

  it("ButtonPlus and SegmentedControl trigger", () => {
    render(
      <Layout bg="black">
        <ButtonPlus label="Plus" />
        <SegmentedControl defaultValue="a">
          <SegmentedControlList>
            <SegmentedControlTrigger value="a">A</SegmentedControlTrigger>
          </SegmentedControlList>
        </SegmentedControl>
      </Layout>,
    );
    expectKeyboardOnlyRing(screen.getByRole("button", { name: "Plus" }));
    expectKeyboardOnlyRing(screen.getByRole("tab", { name: "A" }));
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
