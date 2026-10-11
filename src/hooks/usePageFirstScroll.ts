import * as React from "react";

/**
 * Attribut qui exclut une zone de la molette « page d'abord » : sous un élément
 * `[data-native-scroll]`, la molette garde son comportement natif.
 */
export const NATIVE_SCROLL_ATTRIBUTE = "data-native-scroll";

/** Classe posée sur <html> pour masquer la barre de défilement de la fenêtre. */
export const PAGE_SCROLLBAR_HIDDEN_CLASS = "gs-page-scrollbar-hidden";

const LINE_HEIGHT_PX = 16;

/** Delta vertical d'un événement molette, en pixels quel que soit `deltaMode`. */
export function wheelDeltaPixels(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * LINE_HEIGHT_PX; // lignes
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // pages
  return event.deltaY; // pixels
}

/** Défilement de la fenêtre encore possible vers le bas, en pixels. */
function remainingDocumentScroll(): number {
  const root = document.scrollingElement ?? document.documentElement;
  return root.scrollHeight - window.innerHeight - window.scrollY;
}

/**
 * Ce que la page doit encore défiler pour que le haut de `panel` atteigne
 * `stickyTop` (partie haute entièrement repliée).
 *
 * Mesuré depuis la position du panneau — juste même s'il y a du contenu sous
 * lui — et borné par le défilement réellement possible de la fenêtre : avec un
 * arrondi (zoom, pixels fractionnaires) ou une page un peu trop courte, la page
 * ne bougerait plus alors que l'écart au header resterait > 1, et la molette
 * serait annulée à chaque cran.
 */
export function remainingPageScroll(panel: HTMLElement, stickyTop = 0): number {
  const toPanel = panel.getBoundingClientRect().top - stickyTop;
  return Math.max(0, Math.min(toPanel, remainingDocumentScroll()));
}

// Compteur de références : la classe reste tant qu'au moins une instance la demande.
let hiddenScrollbarRefs = 0;

function retainHiddenPageScrollbar(): () => void {
  hiddenScrollbarRefs += 1;
  document.documentElement.classList.add(PAGE_SCROLLBAR_HIDDEN_CLASS);
  return () => {
    hiddenScrollbarRefs = Math.max(0, hiddenScrollbarRefs - 1);
    if (hiddenScrollbarRefs === 0) document.documentElement.classList.remove(PAGE_SCROLLBAR_HIDDEN_CLASS);
  };
}

export interface UsePageFirstScrollOptions {
  /** Active la molette « page d'abord ». Défaut true. */
  enabled?: boolean;
  /** Masque la barre de défilement de la fenêtre tant que le hook est actif. Défaut false. */
  hidePageScrollbar?: boolean;
  /**
   * Hauteur (px) des éléments collés au-dessus de l'élément (header) : la partie
   * haute est repliée quand le haut de l'élément l'atteint. Nombre ou fonction
   * (valeur lue à chaque événement). Défaut 0.
   */
  stickyTop?: number | (() => number);
}

/**
 * Molette « page d'abord » : au-dessus de l'élément `ref` (un panneau dont le
 * contenu défile), la molette vers le bas fait d'abord défiler la fenêtre —
 * pour replier ce qui est au-dessus — puis, une fois l'élément calé sous le
 * header, laisse défiler son contenu. Vers le haut, comportement natif.
 *
 * Hors périmètre : tactile, clavier, menus en portail (hors de l'élément).
 * Hypothèse : c'est la fenêtre qui défile (aucun ancêtre en overflow ou à
 * hauteur fixe).
 */
export function usePageFirstScroll(
  ref: React.RefObject<HTMLElement>,
  { enabled = true, hidePageScrollbar = false, stickyTop = 0 }: UsePageFirstScrollOptions = {},
): void {
  // Lu à chaque événement : une fonction ou une valeur qui change ne réabonne pas l'écouteur.
  const stickyTopRef = React.useRef(stickyTop);
  stickyTopRef.current = stickyTop;

  React.useEffect(() => {
    if (!hidePageScrollbar) return;
    return retainHiddenPageScrollbar();
  }, [hidePageScrollbar]);

  React.useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return; // horizontal dominant
      if (event.deltaY <= 0) return; // vers le haut : natif
      if (event.target instanceof Element && event.target.closest(`[${NATIVE_SCROLL_ATTRIBUTE}]`)) return;
      const top = typeof stickyTopRef.current === "function" ? stickyTopRef.current() : stickyTopRef.current;
      const remaining = remainingPageScroll(element, top);
      if (remaining <= 1) return; // partie haute repliée : le contenu défile
      event.preventDefault();
      window.scrollBy({ top: Math.min(wheelDeltaPixels(event), remaining), behavior: "instant" as ScrollBehavior });
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [ref, enabled]);
}
