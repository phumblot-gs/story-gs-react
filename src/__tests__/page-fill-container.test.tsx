import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";

import { PageFillLayout } from "@/components/layout/PageFillLayout";
import { ScrollContainerProvider } from "@/components/layout/ScrollContainerContext";
import { FullFrame } from "@/components/layout/FullFrame";
import { SCROLLBAR_HIDDEN_CLASS, PAGE_SCROLLBAR_HIDDEN_CLASS } from "@/hooks/usePageFirstScroll";

/**
 * Conteneur simulé : zone visible de 500px dont le haut est à 60px dans la
 * fenêtre (sous un header), contenu de 900px, partie repliable de 300px.
 * Le haut du panneau est à 60 + 300 - scrollTop.
 */
const CONTAINER_TOP = 60;
const CLIENT_HEIGHT = 500;
const SCROLL_HEIGHT = 900;
const COLLAPSIBLE = 300;
let scrollTop = 0;
const containerScrollBy = vi.fn((options: ScrollToOptions) => {
  scrollTop += options.top ?? 0;
});
const windowScrollBy = vi.fn();

beforeEach(() => {
  scrollTop = 0;
  containerScrollBy.mockClear();
  windowScrollBy.mockClear();
  window.scrollBy = windowScrollBy as unknown as typeof window.scrollBy;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    let top = 0;
    if (this.hasAttribute("data-test-container")) top = CONTAINER_TOP;
    if (this.hasAttribute("data-page-fill-panel")) top = CONTAINER_TOP + COLLAPSIBLE - scrollTop;
    return { top, height: 0, bottom: top, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Container({ children, padding = 0 }: { children: React.ReactNode; padding?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (!node) return;
    Object.defineProperty(node, "clientHeight", { value: CLIENT_HEIGHT, configurable: true });
    Object.defineProperty(node, "scrollHeight", { value: SCROLL_HEIGHT, configurable: true });
    Object.defineProperty(node, "scrollTop", { get: () => scrollTop, configurable: true });
    node.scrollBy = containerScrollBy as unknown as typeof node.scrollBy;
  }, []);
  return (
    <div ref={setRef} data-test-container style={{ paddingTop: `${padding}px`, overflow: "auto" }}>
      <ScrollContainerProvider value={ref}>{children}</ScrollContainerProvider>
    </div>
  );
}

const panel = () => document.querySelector("[data-page-fill-panel]") as HTMLElement;
const wheel = (deltaY = 120) => {
  const event = new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true });
  panel().dispatchEvent(event);
  return event;
};

describe("PageFillLayout dans un conteneur de défilement", () => {
  it("la molette fait défiler le conteneur, pas la fenêtre", () => {
    render(
      <Container>
        <PageFillLayout collapsible={<div>Top</div>}>content</PageFillLayout>
      </Container>,
    );
    const event = wheel();
    expect(event.defaultPrevented).toBe(true);
    expect(containerScrollBy).toHaveBeenCalledWith({ top: 120, behavior: "instant" });
    expect(windowScrollBy).not.toHaveBeenCalled();
  });

  it("dernier cran borné au repli complet (panneau contre le haut du conteneur), puis natif", () => {
    render(
      <Container>
        <PageFillLayout collapsible={<div>Top</div>}>content</PageFillLayout>
      </Container>,
    );
    scrollTop = 250;
    wheel();
    expect(containerScrollBy).toHaveBeenLastCalledWith({ top: 50, behavior: "instant" });
    expect(wheel().defaultPrevented).toBe(false);
  });

  it("panneau déjà passé au-dessus du haut du conteneur : comportement natif", () => {
    render(
      <Container>
        <PageFillLayout collapsible={<div>Top</div>}>content</PageFillLayout>
      </Container>,
    );
    scrollTop = 390;
    expect(wheel().defaultPrevented).toBe(false);
    expect(containerScrollBy).not.toHaveBeenCalled();
  });

  it("hauteur du panneau en cqh + padding haut du conteneur", () => {
    const { container } = render(
      <Container padding={30}>
        <PageFillLayout collapsible={<div>Top</div>} stickyBottom={20}>content</PageFillLayout>
      </Container>,
    );
    const root = container.querySelector("[data-page-fill-layout]") as HTMLElement;
    expect(root).toHaveAttribute("data-scroll-container");
    expect(root.style.getPropertyValue("--page-panel-height")).toBe("max(240px, calc((100cqh + 30px) - 0px - 20px))");
  });

  it("onCollapsedChange suit le défilement du conteneur", () => {
    const onCollapsedChange = vi.fn();
    render(
      <Container>
        <PageFillLayout collapsible={<div>Top</div>} onCollapsedChange={onCollapsedChange}>content</PageFillLayout>
      </Container>,
    );
    const containerEl = document.querySelector("[data-test-container]")!;
    act(() => {
      scrollTop = 300;
      containerEl.dispatchEvent(new Event("scroll"));
    });
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
    act(() => {
      scrollTop = 100;
      containerEl.dispatchEvent(new Event("scroll"));
    });
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
  });

  it("hidePageScrollbar masque la barre du conteneur, pas celle de la fenêtre", () => {
    const { unmount } = render(
      <Container>
        <PageFillLayout hidePageScrollbar>content</PageFillLayout>
      </Container>,
    );
    expect(document.querySelector("[data-test-container]")).toHaveClass(SCROLLBAR_HIDDEN_CLASS);
    expect(document.documentElement).not.toHaveClass(PAGE_SCROLLBAR_HIDDEN_CLASS);
    unmount();
  });

  it("scrollContainer={null} force la fenêtre", () => {
    const { container } = render(
      <Container>
        <PageFillLayout scrollContainer={null}>content</PageFillLayout>
      </Container>,
    );
    const root = container.querySelector("[data-page-fill-layout]") as HTMLElement;
    expect(root).not.toHaveAttribute("data-scroll-container");
    expect(root.style.getPropertyValue("--page-panel-height")).toContain("100dvh");
  });
});

describe("FullFrame — conteneur de défilement et footer", () => {
  it("un PageFillLayout dans le body l'utilise comme conteneur (cqh)", () => {
    render(
      <FullFrame padding={6}>
        <PageFillLayout collapsible={<div>Top</div>}>content</PageFillLayout>
      </FullFrame>,
    );
    const root = document.querySelector("[data-page-fill-layout]") as HTMLElement;
    expect(root).toHaveAttribute("data-scroll-container");
    expect(root.style.getPropertyValue("--page-panel-height")).toContain("100cqh");
    const body = root.parentElement as HTMLElement;
    expect(body.style.containerType).toBe("size");
    expect(body).toHaveClass("overflow-auto", "p-6");
  });

  it("footer fixe hors de la zone qui défile, même padding horizontal que le header", () => {
    render(
      <FullFrame padding={6} headerContent={<span>Projet</span>} footer={<button>Suivant</button>}>
        <p>Body</p>
      </FullFrame>,
    );
    const footer = screen.getByRole("button", { name: "Suivant" }).parentElement as HTMLElement;
    const body = screen.getByText("Body").parentElement as HTMLElement;
    expect(footer).toHaveClass("shrink-0", "px-6");
    expect(body).not.toContainElement(footer);
    expect(body.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("sans footer : rien sous le body", () => {
    render(
      <FullFrame>
        <p>Body</p>
      </FullFrame>,
    );
    expect((screen.getByText("Body").parentElement as HTMLElement).nextElementSibling).toBeNull();
  });
});
