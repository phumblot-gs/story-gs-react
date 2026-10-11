import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { PageFillLayout } from "@/components/layout/PageFillLayout";
import { NATIVE_SCROLL_ATTRIBUTE, PAGE_SCROLLBAR_HIDDEN_CLASS, wheelDeltaPixels } from "@/hooks/usePageFirstScroll";
import { TabsWithViews } from "@/components/ui/tabs-with-views";
import PageHeader from "@/components/PageHeader";

/**
 * Page simulée : fenêtre de 800px, document de 1200px, partie repliable de
 * 400px au-dessus du panneau. Le haut du panneau est à `PANEL_OFFSET - scrollY`
 * (+ décalage optionnel pour simuler un arrondi).
 */
const VIEWPORT = 800;
const DOCUMENT = 1200;
const PANEL_OFFSET = 400;
let scrollY = 0;
let panelTopExtra = 0;
let headerHeight = 0;
const scrollBy = vi.fn((options: ScrollToOptions) => {
  scrollY += options.top ?? 0;
});

beforeEach(() => {
  scrollY = 0;
  panelTopExtra = 0;
  headerHeight = 0;
  scrollBy.mockClear();
  Object.defineProperty(window, "innerHeight", { value: VIEWPORT, configurable: true });
  Object.defineProperty(window, "scrollY", { get: () => scrollY, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: DOCUMENT, configurable: true });
  Object.defineProperty(document, "scrollingElement", { value: document.documentElement, configurable: true });
  window.scrollBy = scrollBy as unknown as typeof window.scrollBy;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const top = this.hasAttribute("data-page-fill-panel") ? PANEL_OFFSET - scrollY + panelTopExtra : 0;
    const height = this.hasAttribute("data-test-header") ? headerHeight : 0;
    return { top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const panel = () => document.querySelector("[data-page-fill-panel]") as HTMLElement;
const wheel = (init: WheelEventInit & { ctrl?: boolean } = {}, target: Element = panel()) => {
  const { ctrl, ...rest } = init;
  const event = new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true, ...rest });
  // happy-dom ignore ctrlKey / deltaMode dans le constructeur.
  if (ctrl) Object.defineProperty(event, "ctrlKey", { value: true });
  if (rest.deltaMode !== undefined) Object.defineProperty(event, "deltaMode", { value: rest.deltaMode });
  target.dispatchEvent(event);
  return event;
};
const renderLayout = (props: Partial<React.ComponentProps<typeof PageFillLayout>> = {}) =>
  render(
    <PageFillLayout collapsible={<div>Top</div>} {...props}>
      <div data-testid="content">Content</div>
    </PageFillLayout>,
  );

describe("PageFillLayout — molette « page d'abord »", () => {
  it("partie haute visible : la page défile d'abord", () => {
    renderLayout();
    scrollY = 100;
    const event = wheel();
    expect(event.defaultPrevented).toBe(true);
    expect(scrollBy).toHaveBeenCalledWith({ top: 120, behavior: "instant" });
  });

  it("le dernier cran ne dépasse pas le repli complet", () => {
    renderLayout();
    scrollY = 350;
    wheel();
    expect(scrollBy).toHaveBeenCalledWith({ top: 50, behavior: "instant" });
  });

  it("partie haute repliée : comportement natif", () => {
    renderLayout();
    scrollY = 400;
    const event = wheel();
    expect(event.defaultPrevented).toBe(false);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("borne remaining par le défilement possible : arrondi ou page trop courte → natif", () => {
    renderLayout();
    // La page est en bas (400 = 1200 - 800) mais le panneau est encore 5px sous
    // le header (arrondi, page un peu courte) : la molette ne doit pas être annulée.
    scrollY = 400;
    panelTopExtra = 5;
    const event = wheel();
    expect(event.defaultPrevented).toBe(false);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("tient compte de stickyTop", () => {
    renderLayout({ stickyTop: 64 });
    // Panneau à 400-340 = 60px du haut, header de 64px : déjà replié.
    scrollY = 340;
    expect(wheel().defaultPrevented).toBe(false);
  });

  it.each([
    ["vers le haut", { deltaY: -120 }],
    ["horizontal dominant", { deltaY: 10, deltaX: 40 }],
    ["Ctrl + molette (zoom)", { ctrl: true }],
  ])("comportement natif : %s", (_label, init) => {
    renderLayout();
    scrollY = 100;
    expect(wheel(init).defaultPrevented).toBe(false);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("comportement natif dans une zone [data-native-scroll]", () => {
    render(
      <PageFillLayout collapsible={<div>Top</div>}>
        <div {...{ [NATIVE_SCROLL_ATTRIBUTE]: "" }}>
          <span data-testid="inner">inner</span>
        </div>
      </PageFillLayout>,
    );
    scrollY = 100;
    expect(wheel({}, screen.getByTestId("inner")).defaultPrevented).toBe(false);
  });

  it("convertit deltaMode en pixels", () => {
    expect(wheelDeltaPixels({ deltaY: 3, deltaMode: 1 } as WheelEvent)).toBe(48);
    expect(wheelDeltaPixels({ deltaY: 1, deltaMode: 2 } as WheelEvent)).toBe(VIEWPORT);
    expect(wheelDeltaPixels({ deltaY: 120, deltaMode: 0 } as WheelEvent)).toBe(120);
    renderLayout();
    wheel({ deltaY: 3, deltaMode: 1 });
    expect(scrollBy).toHaveBeenCalledWith({ top: 48, behavior: "instant" });
  });

  it("pageFirstScroll={false} : comportement natif", () => {
    renderLayout({ pageFirstScroll: false });
    scrollY = 100;
    expect(wheel().defaultPrevented).toBe(false);
  });
});

describe("PageFillLayout — barre de défilement de la page", () => {
  const hidden = () => document.documentElement.classList.contains(PAGE_SCROLLBAR_HIDDEN_CLASS);

  it("n'est pas masquée par défaut", () => {
    renderLayout();
    expect(hidden()).toBe(false);
  });

  it("masquée tant qu'au moins une instance le demande (compteur de références)", () => {
    const first = render(<PageFillLayout hidePageScrollbar>a</PageFillLayout>);
    const second = render(<PageFillLayout hidePageScrollbar>b</PageFillLayout>);
    expect(hidden()).toBe(true);
    first.unmount();
    expect(hidden()).toBe(true);
    second.unmount();
    expect(hidden()).toBe(false);
  });
});

describe("PageFillLayout — hauteur du panneau", () => {
  const panelHeight = (container: HTMLElement) =>
    (container.querySelector("[data-page-fill-layout]") as HTMLElement).style.getPropertyValue("--page-panel-height");

  it("calcul CSS avec stickyTop / stickyBottom en nombre et minPanelHeight", () => {
    const { container } = renderLayout({ stickyTop: 64, stickyBottom: 20, minPanelHeight: 300 });
    expect(panelHeight(container)).toBe("max(300px, calc(100dvh - 64px - 20px))");
    expect(panel().style.height).toBe("var(--page-panel-height)");
  });

  it("stickyTop en valeur CSS", () => {
    const { container } = renderLayout({ stickyTop: "var(--page-header-height)" });
    expect(panelHeight(container)).toBe("max(240px, calc(100dvh - var(--page-header-height) - 0px))");
  });

  it("stickyTop en ref : hauteur mesurée", () => {
    headerHeight = 72;
    function Page() {
      const headerRef = React.useRef<HTMLDivElement>(null);
      return (
        <>
          <div ref={headerRef} data-test-header />
          <PageFillLayout stickyTop={headerRef}>content</PageFillLayout>
        </>
      );
    }
    const { container } = render(<Page />);
    expect(panelHeight(container)).toBe("max(240px, calc(100dvh - 72px - 0px))");
  });

  it("racine sans overflow (c'est la fenêtre qui défile)", () => {
    const { container } = renderLayout();
    expect((container.querySelector("[data-page-fill-layout]") as HTMLElement).className).not.toMatch(/overflow/);
  });
});

describe("PageFillLayout — onCollapsedChange", () => {
  it("n'est appelé qu'au changement d'état", () => {
    const onCollapsedChange = vi.fn();
    renderLayout({ onCollapsedChange });
    expect(onCollapsedChange).not.toHaveBeenCalled();

    const scrollTo = (y: number) => act(() => {
      scrollY = y;
      window.dispatchEvent(new Event("scroll"));
    });
    scrollTo(200);
    expect(onCollapsedChange).not.toHaveBeenCalled();
    scrollTo(400);
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
    scrollTo(400);
    expect(onCollapsedChange).toHaveBeenCalledTimes(1);
    scrollTo(100);
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
    expect(onCollapsedChange).toHaveBeenCalledTimes(2);
  });
});

describe("TabsWithViews — fillHeight", () => {
  const baseProps = {
    fixedTabs: [{ id: "a", label: "A" }],
    views: [],
    activeTab: "a",
    onActiveTabChange: () => {},
    onCreateView: () => {},
    onRenameView: () => {},
    onDeleteView: () => {},
  };

  it("enveloppe le contenu dans une colonne flex-1 min-h-0", () => {
    render(
      <TabsWithViews {...baseProps} fillHeight>
        <div data-testid="tab-content" />
      </TabsWithViews>,
    );
    const wrapper = screen.getByTestId("tab-content").parentElement!;
    expect(wrapper).toHaveClass("flex-1", "min-h-0", "flex", "flex-col");
    expect(wrapper.parentElement).toHaveClass("flex", "flex-col", "h-full", "min-h-0");
    expect(document.querySelector(".tabs-header")).toHaveClass("shrink-0");
  });

  it("sans fillHeight : rendu inchangé", () => {
    render(
      <TabsWithViews {...baseProps}>
        <div data-testid="tab-content" />
      </TabsWithViews>,
    );
    expect(document.querySelector("[data-tabs-fill-content]")).toBeNull();
    expect(document.querySelector(".tabs-header")).not.toHaveClass("shrink-0");
  });
});

describe("PageHeader — forwardRef", () => {
  it("transmet la ref à l'élément racine", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PageHeader ref={ref} title="Title" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toContainElement(screen.getByText("Title"));
  });
});
