import * as React from "react";
import { cn } from "@/lib/utils";
import { BgProvider } from "./BgContext";
import { remainingPageScroll, usePageFirstScroll } from "@/hooks/usePageFirstScroll";

type BgValue = "white" | "grey" | "black";

/** Hauteur d'un élément collant : px, valeur CSS ("64px", "var(--x)"), ou ref d'un élément à mesurer. */
export type PageFillStickyValue = number | string | React.RefObject<HTMLElement>;

export interface PageFillLayoutProps {
  /**
   * Collapsible top part (welcome, counters, KPIs…). It scrolls with the page and folds away before
   * the panel content scrolls. Optional: without it, the panel simply fills the screen.
   */
  collapsible?: React.ReactNode;
  /** Panel content (e.g. `<TabsWithViews fillHeight>`), in a flex column of height `--page-panel-height`. */
  children: React.ReactNode;
  /**
   * Height of the elements stuck above the panel (application header): a number (px), a CSS value
   * ("64px", "var(--app-header-height)") or a ref of an element to measure (ResizeObserver).
   * Default 0.
   */
  stickyTop?: PageFillStickyValue;
  /** Same at the bottom (footer). Default 0. */
  stickyBottom?: PageFillStickyValue;
  /** Minimum panel height, in px (very small windows). Default 240. */
  minPanelHeight?: number;
  /** Mouse wheel down over the panel: the page folds the collapsible part first. Default true. */
  pageFirstScroll?: boolean;
  /** Hides the window scrollbar while the component is mounted. Default false. */
  hidePageScrollbar?: boolean;
  /** Collapsible part fully folded (true) or visible again (false). Called on state changes only. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Background, as Layout (BgContext). Default "grey". */
  bg?: BgValue;
  /** Root element. Default "main" (only one per page). */
  as?: React.ElementType;
  className?: string;
  /** Classes of the collapsible part. */
  collapsibleClassName?: string;
  /** Classes of the panel. */
  panelClassName?: string;
}

const isRef = (value: PageFillStickyValue | undefined): value is React.RefObject<HTMLElement> =>
  typeof value === "object" && value !== null && "current" in value;

const toCssLength = (value: number | string | undefined): string =>
  value === undefined ? "0px" : typeof value === "number" ? `${value}px` : value;

/** Hauteur mesurée d'un élément référencé, tenue à jour (ResizeObserver + resize). */
function useMeasuredHeight(value: PageFillStickyValue | undefined): number | null {
  const [height, setHeight] = React.useState<number | null>(null);
  React.useLayoutEffect(() => {
    // Lu dans l'effet et non au rendu : un header rendu avant ce composant n'a
    // attaché sa ref qu'au moment du commit.
    const element = isRef(value) ? value.current : null;
    if (!element) return;
    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(element);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [value]);
  return height;
}

/**
 * Page layout: a collapsible top part that scrolls with the page, then a panel whose height is
 * exactly the window height minus the sticky header (and footer). Once the top part is folded,
 * the panel sits right under the header and its content scrolls inside it.
 *
 * Assumption: the **window** scrolls — no ancestor with `overflow` or a fixed height.
 */
export const PageFillLayout = React.forwardRef<HTMLElement, PageFillLayoutProps>(
  (
    {
      collapsible,
      children,
      stickyTop = 0,
      stickyBottom = 0,
      minPanelHeight = 240,
      pageFirstScroll = true,
      hidePageScrollbar = false,
      onCollapsedChange,
      bg = "grey",
      as: Component = "main",
      className,
      collapsibleClassName,
      panelClassName,
    },
    ref,
  ) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const topProbeRef = React.useRef<HTMLDivElement>(null);

    // Hauteurs des éléments collants : mesurées pour une ref, CSS sinon. Avant la
    // première mesure d'une ref, 0 : le panneau prend toute la fenêtre, puis se
    // corrige au premier rendu mesuré.
    const measuredTop = useMeasuredHeight(stickyTop);
    const measuredBottom = useMeasuredHeight(stickyBottom);
    const topCss = isRef(stickyTop) ? `${measuredTop ?? 0}px` : toCssLength(stickyTop);
    const bottomCss = isRef(stickyBottom) ? `${measuredBottom ?? 0}px` : toCssLength(stickyBottom);
    // Calcul CSS pur : pas de JavaScript ni de décalage au premier rendu.
    const panelHeight = `max(${minPanelHeight}px, calc(100dvh - ${topCss} - ${bottomCss}))`;

    // stickyTop en px, pour la molette et l'état replié. Une valeur CSS (var(),
    // calc()…) est résolue par une sonde invisible de cette hauteur.
    const getStickyTopPx = React.useCallback((): number => {
      if (isRef(stickyTop)) return stickyTop.current?.getBoundingClientRect().height ?? 0;
      if (typeof stickyTop === "number") return stickyTop;
      return topProbeRef.current?.getBoundingClientRect().height ?? 0;
    }, [stickyTop]);

    usePageFirstScroll(panelRef, { enabled: pageFirstScroll, hidePageScrollbar, stickyTop: getStickyTopPx });

    // État replié : même mesure (bornée) que la molette, signalé au changement seulement.
    const collapsedRef = React.useRef(false);
    const onCollapsedChangeRef = React.useRef(onCollapsedChange);
    onCollapsedChangeRef.current = onCollapsedChange;
    React.useEffect(() => {
      const update = () => {
        const panel = panelRef.current;
        if (!panel) return;
        const collapsed = remainingPageScroll(panel, getStickyTopPx()) <= 1;
        if (collapsed === collapsedRef.current) return;
        collapsedRef.current = collapsed;
        onCollapsedChangeRef.current?.(collapsed);
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }, [getStickyTopPx]);

    return (
      <BgProvider value={bg}>
        {/* Racine sans overflow : c'est la fenêtre qui défile. */}
        <Component
          ref={ref}
          data-bg={bg}
          data-page-fill-layout
          className={cn(
            "flex flex-col",
            bg === "white" && "bg-white",
            bg === "grey" && "bg-grey",
            bg === "black" && "bg-black",
            className,
          )}
          style={{ "--page-panel-height": panelHeight } as React.CSSProperties}
        >
          {typeof stickyTop === "string" && (
            <div
              ref={topProbeRef}
              aria-hidden
              style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: 0, height: stickyTop }}
            />
          )}
          {collapsible && (
            <div className={collapsibleClassName} data-page-fill-collapsible>
              {collapsible}
            </div>
          )}
          <div
            ref={panelRef}
            data-page-fill-panel
            className={cn("flex flex-col min-h-0", panelClassName)}
            style={{ height: "var(--page-panel-height)" }}
          >
            {children}
          </div>
        </Component>
      </BgProvider>
    );
  },
);

PageFillLayout.displayName = "PageFillLayout";
