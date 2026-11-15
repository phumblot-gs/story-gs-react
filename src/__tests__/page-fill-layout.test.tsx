import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { PageFillLayout } from "@/components/layout/PageFillLayout";
import { NATIVE_SCROLL_ATTRIBUTE, PAGE_SCROLLBAR_HIDDEN_CLASS, wheelDeltaPixels } from "@/hooks/usePageFirstScroll";
import { TabsWithViews } from "@/components/ui/tabs-with-views";
import PageHeader from "@/components/PageHeader";
import { mockAnimationFrames } from "./helpers/animation-frames";

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
let frames: ReturnType<typeof mockAnimationFrames>;
const scrollBy = vi.fn((options: ScrollToOptions) => {
  scrollY += options.top ?? 0;
});

beforeEach(() => {
  scrollY = 0;
  panelTopExtra = 0;
  headerHeight = 0;
  scrollBy.mockClear();
  frames = mockAnimationFrames();
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
    frames.flushFrames();
    expect(scrollY).toBe(220);
  });

  it("le dernier cran ne dépasse pas le repli complet", () => {
    renderLayout();
    scrollY = 350;
    wheel();
    frames.flushFrames();
    expect(scrollY).toBe(400);
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

/** Liste qui défile dans le panneau : 300px visibles sur 1000px. */
function renderWithList(style: React.CSSProperties = {}) {
  render(
    <PageFillLayout collapsible={<div>Top</div>}>
      <div data-testid="list" style={{ overflowY: "auto", ...style }}>
        <span data-testid="item">item</span>
      </div>
    </PageFillLayout>,
  );
  const list = screen.getByTestId("list");
  Object.defineProperty(list, "clientHeight", { value: 300, configurable: true });
  Object.defineProperty(list, "scrollHeight", { value: 1000, configurable: true });
  list.scrollBy = vi.fn((options: ScrollToOptions) => {
    list.scrollTop = Math.max(0, Math.min(700, list.scrollTop + (options.top ?? 0)));
  }) as unknown as typeof list.scrollBy;
  return list;
}

describe("PageFillLayout — molette vers le haut et jonction page / liste", () => {
  it("liste en haut, page repliée : la page déplie la partie haute", () => {
    const list = renderWithList();
    scrollY = 400;
    const event = wheel({ deltaY: -40 }, screen.getByTestId("item"));
    expect(event.defaultPrevented).toBe(true);
    expect(scrollBy).toHaveBeenCalledWith({ top: -40, behavior: "instant" });
    expect(list.scrollBy).not.toHaveBeenCalled();
  });

  it("liste pas en haut : comportement natif", () => {
    const list = renderWithList();
    scrollY = 400;
    list.scrollTop = 200;
    expect(wheel({ deltaY: -40 }, screen.getByTestId("item")).defaultPrevented).toBe(false);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("liste presque en haut : elle consomme ce qui lui reste, la page prend l'excédent dans le même événement", () => {
    const list = renderWithList();
    scrollY = 400;
    list.scrollTop = 15;
    expect(wheel({ deltaY: -40 }, screen.getByTestId("item")).defaultPrevented).toBe(true);
    expect(list.scrollTop).toBe(0);
    expect(scrollY).toBe(375);
  });

  it("inertie d'un geste commencé dans la liste : la page se déplie sans interruption", () => {
    const list = renderWithList();
    scrollY = 400;
    list.scrollTop = 45;
    const deltas = [-65, -45, -40, -30, -20, -10];
    const prevented = deltas.map((deltaY) => wheel({ deltaY }, screen.getByTestId("item")).defaultPrevented);
    expect(prevented).toEqual(deltas.map(() => true));
    frames.flushFrames(); // le premier événement (≥ 50 px, sans précédent) est traité comme un cran
    expect(list.scrollTop).toBe(0);
    expect(scrollY).toBe(400 - (65 + 45 + 40 + 30 + 20 + 10 - 45));
  });

  it("borné au haut de la page, puis natif une fois la page en haut", () => {
    renderWithList();
    scrollY = 10;
    wheel({ deltaY: -40 }, screen.getByTestId("item"));
    expect(scrollBy).toHaveBeenCalledWith({ top: -10, behavior: "instant" });
    expect(scrollY).toBe(0);
    expect(wheel({ deltaY: -40 }, screen.getByTestId("item")).defaultPrevented).toBe(false);
  });

  it("hors d'une zone qui défile : natif (la fenêtre remonte d'elle-même)", () => {
    renderLayout();
    scrollY = 400;
    expect(wheel({ deltaY: -40 }).defaultPrevented).toBe(false);
  });

  it.each(["contain", "none"])("overscroll-behavior: %s sur la liste : pas de report vers la page", (value) => {
    renderWithList({ overscrollBehaviorY: value } as React.CSSProperties);
    scrollY = 400;
    expect(wheel({ deltaY: -40 }, screen.getByTestId("item")).defaultPrevented).toBe(false);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("[data-native-scroll] : natif vers le haut aussi", () => {
    render(
      <PageFillLayout collapsible={<div>Top</div>}>
        <div {...{ [NATIVE_SCROLL_ATTRIBUTE]: "" }} style={{ overflowY: "auto" }}>
          <span data-testid="inner">inner</span>
        </div>
      </PageFillLayout>,
    );
    scrollY = 400;
    expect(wheel({ deltaY: -40 }, screen.getByTestId("inner")).defaultPrevented).toBe(false);
  });

  it("vers le bas : l'excédent du dernier événement passe à la liste (pas d'image figée)", () => {
    const list = renderWithList();
    scrollY = 370;
    expect(wheel({ deltaY: 40 }, screen.getByTestId("item")).defaultPrevented).toBe(true);
    expect(scrollY).toBe(400);
    expect(list.scrollTop).toBe(10);
  });
});

describe("PageFillLayout — cran de molette de souris", () => {
  it("un cran isolé est animé sur plusieurs images, pas appliqué d'un coup", () => {
    renderLayout();
    const start = performance.now();
    expect(wheel({ deltaY: 100 }).defaultPrevented).toBe(true);
    expect(scrollBy).not.toHaveBeenCalled();
    frames.runFrames(start + 40);
    expect(scrollY).toBeGreaterThan(0);
    expect(scrollY).toBeLessThan(100);
    frames.flushFrames();
    expect(scrollY).toBe(100);
    expect(scrollBy.mock.calls.every(([options]) => Number.isInteger(options.top))).toBe(true);
  });

  it("vers le haut aussi, liste en haut", () => {
    renderWithList();
    scrollY = 400;
    expect(wheel({ deltaY: -100 }, screen.getByTestId("item")).defaultPrevented).toBe(true);
    frames.flushFrames();
    expect(scrollY).toBe(300);
  });

  it("molette tournée vite : le cran suivant tient compte de l'animation en cours", () => {
    const list = renderWithList();
    scrollY = 300;
    wheel({ deltaY: 100 }, screen.getByTestId("item"));
    wheel({ deltaY: 100 }, screen.getByTestId("item"));
    frames.flushFrames();
    expect(scrollY).toBe(400);
    expect(list.scrollTop).toBe(100);
  });

  it("le trackpad (petits deltas rapprochés) n'est pas animé", () => {
    renderLayout();
    wheel({ deltaY: 20 });
    wheel({ deltaY: 20 });
    expect(scrollBy).toHaveBeenCalledTimes(2);
    expect(frames.pending()).toBe(0);
    expect(scrollY).toBe(40);
  });

  it("une animation en cours est arrêtée au démontage", () => {
    const { unmount } = renderLayout();
    wheel({ deltaY: 100 });
    unmount();
    frames.flushFrames();
    expect(scrollBy).not.toHaveBeenCalled();
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
