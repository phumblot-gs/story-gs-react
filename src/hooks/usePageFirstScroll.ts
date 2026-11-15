import * as React from "react";

/**
 * Attribut qui exclut une zone de la molette « page d'abord » : sous un élément
 * `[data-native-scroll]`, la molette garde son comportement natif.
 */
export const NATIVE_SCROLL_ATTRIBUTE = "data-native-scroll";

/** Classe posée sur <html> pour masquer la barre de défilement de la fenêtre. */
export const PAGE_SCROLLBAR_HIDDEN_CLASS = "gs-page-scrollbar-hidden";

/** Classe posée sur un conteneur de défilement pour masquer sa barre. */
export const SCROLLBAR_HIDDEN_CLASS = "gs-scrollbar-hidden";

const LINE_HEIGHT_PX = 16;

/** Delta vertical d'un événement molette, en pixels quel que soit `deltaMode`. */
export function wheelDeltaPixels(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * LINE_HEIGHT_PX; // lignes
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // pages
  return event.deltaY; // pixels
}

/** Défilement encore possible vers le bas (fenêtre ou conteneur), en pixels. */
function remainingDocumentScroll(container?: HTMLElement | null): number {
  if (container) return container.scrollHeight - container.clientHeight - container.scrollTop;
  const root = document.scrollingElement ?? document.documentElement;
  return root.scrollHeight - window.innerHeight - window.scrollY;
}

/** Haut de la zone visible de défilement, dans le repère de la fenêtre (0 pour la fenêtre). */
function scrollViewportTop(container?: HTMLElement | null): number {
  return container ? container.getBoundingClientRect().top + container.clientTop : 0;
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
export function remainingPageScroll(panel: HTMLElement, stickyTop = 0, container?: HTMLElement | null): number {
  const toPanel = panel.getBoundingClientRect().top - scrollViewportTop(container) - stickyTop;
  return Math.max(0, Math.min(toPanel, remainingDocumentScroll(container)));
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

type ScrollTarget = HTMLElement | Window;

/** Position verticale de défilement de la fenêtre ou d'un élément. */
function scrollTopOf(target: ScrollTarget): number {
  return target instanceof HTMLElement ? target.scrollTop : target.scrollY;
}

/** Peut défiler verticalement : `overflow-y` auto/scroll/overlay et contenu plus haut que la zone visible. */
function isVerticalScroller(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement) || element.scrollHeight <= element.clientHeight) return false;
  return /^(auto|scroll|overlay)$/.test(getComputedStyle(element).overflowY);
}

/**
 * Zone qui défile sous le pointeur : l'ancêtre de `target` le plus proche, dans
 * `panel` (inclus), qui peut défiler verticalement. `contain` : un ancêtre entre
 * `target` et `panel` a `overscroll-behavior-y: contain` (ou `none`), ce qui
 * interdit le report de la molette vers la page.
 */
function scrollZoneUnder(target: EventTarget | null, panel: HTMLElement): { zone: HTMLElement | null; contain: boolean } {
  let zone: HTMLElement | null = null;
  let contain = false;
  for (let node = target instanceof Element ? target : null; node && panel.contains(node); node = node.parentElement) {
    if (!(node instanceof HTMLElement)) continue;
    if (!zone && isVerticalScroller(node)) zone = node;
    if (zone && /^(contain|none)$/.test(getComputedStyle(node).overscrollBehaviorY)) contain = true;
    if (node === panel) break;
  }
  return { zone, contain };
}

/** Cran de molette discret : |delta| ≥ 50 px. */
const DISCRETE_WHEEL_PX = 50;
/** Écart (ms) en dessous duquel deux événements wheel font partie d'une même série (trackpad, inertie). */
const WHEEL_SERIES_MS = 50;
/** Durée (ms) de l'animation d'un cran de molette intercepté. */
const WHEEL_ANIMATION_MS = 120;

const instant = "instant" as ScrollBehavior;

interface WheelAnimation {
  /** Défilement total de l'animation en cours (px, signé). */
  total: number;
  /** Part déjà appliquée (px entiers, signés). */
  applied: number;
  start: number;
  frame: number;
}

/**
 * Défilements programmés par le hook. `scroll` applique un delta tout de suite
 * (trackpad) ou l'anime (cran de molette) ; `pending` donne ce qu'une animation
 * doit encore appliquer, pour raisonner sur la position d'arrivée.
 */
function createScroller() {
  const animations = new Map<ScrollTarget, WheelAnimation>();

  const step = (target: ScrollTarget, animation: WheelAnimation, now: number) => {
    const progress = Math.min(1, Math.max(0, (now - animation.start) / WHEEL_ANIMATION_MS));
    const eased = 1 - (1 - progress) ** 3;
    // Pas entiers : un pas fractionnaire peut être arrondi à 0 par le navigateur.
    const next = progress >= 1 ? animation.total : Math.round(animation.total * eased);
    if (next !== animation.applied) target.scrollBy({ top: next - animation.applied, behavior: instant });
    animation.applied = next;
    if (progress >= 1) {
      animations.delete(target);
      return;
    }
    animation.frame = requestAnimationFrame((time) => step(target, animation, time));
  };

  const flush = (target: ScrollTarget) => {
    const animation = animations.get(target);
    if (!animation) return;
    cancelAnimationFrame(animation.frame);
    animations.delete(target);
    const rest = animation.total - animation.applied;
    if (rest !== 0) target.scrollBy({ top: rest, behavior: instant });
  };

  return {
    pending: (target: ScrollTarget) => {
      const animation = animations.get(target);
      return animation ? animation.total - animation.applied : 0;
    },
    animating: (target: ScrollTarget) => animations.has(target),
    flush,
    scroll(target: ScrollTarget, delta: number, animate: boolean) {
      if (delta === 0) return;
      if (!animate) {
        flush(target);
        target.scrollBy({ top: delta, behavior: instant });
        return;
      }
      const current = animations.get(target);
      if (current) cancelAnimationFrame(current.frame);
      // Repart de ce qui restait à faire, plus le nouveau cran.
      const animation: WheelAnimation = {
        total: (current ? current.total - current.applied : 0) + delta,
        applied: 0,
        start: performance.now(),
        frame: 0,
      };
      animations.set(target, animation);
      animation.frame = requestAnimationFrame((time) => step(target, animation, time));
    },
    cancel() {
      animations.forEach((animation) => cancelAnimationFrame(animation.frame));
      animations.clear();
    },
  };
}

export interface UsePageFirstScrollOptions {
  /**
   * Conteneur qui défile à la place de la fenêtre (corps d'un FullFrame…).
   * Défaut : la fenêtre. `stickyTop` est alors mesuré depuis le haut de sa zone
   * visible.
   */
  scrollContainer?: React.RefObject<HTMLElement> | null;
  /** Active la molette « page d'abord ». Défaut true. */
  enabled?: boolean;
  /** Masque la barre de défilement de la fenêtre (ou du conteneur) tant que le hook est actif. Défaut false. */
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
 * header, laisse défiler son contenu. Vers le haut, symétrique : le contenu
 * remonte jusqu'en haut, puis la page déplie la partie haute, dans le même
 * geste (Chrome verrouille un geste trackpad sur la zone qui défilait à son
 * début et ne reporte pas l'inertie vers la page : le hook s'en charge).
 *
 * Au passage de la page au contenu (et inversement), l'excédent d'un événement
 * est reporté sur l'autre surface. Une zone en `overscroll-behavior: contain`
 * ne reporte pas sa molette vers la page. Un cran de molette de souris
 * intercepté est animé (~120 ms), les événements fins du trackpad non.
 *
 * Hors périmètre : tactile, clavier, menus en portail (hors de l'élément).
 * Hypothèse : c'est la fenêtre qui défile (aucun ancêtre en overflow ou à
 * hauteur fixe), ou le `scrollContainer` fourni.
 */
export function usePageFirstScroll(
  ref: React.RefObject<HTMLElement>,
  { enabled = true, hidePageScrollbar = false, stickyTop = 0, scrollContainer = null }: UsePageFirstScrollOptions = {},
): void {
  // Lu à chaque événement : une fonction ou une valeur qui change ne réabonne pas l'écouteur.
  const stickyTopRef = React.useRef(stickyTop);
  stickyTopRef.current = stickyTop;

  React.useEffect(() => {
    if (!hidePageScrollbar) return;
    const container = scrollContainer?.current;
    if (container) {
      container.classList.add(SCROLLBAR_HIDDEN_CLASS);
      return () => container.classList.remove(SCROLLBAR_HIDDEN_CLASS);
    }
    return retainHiddenPageScrollbar();
  }, [hidePageScrollbar, scrollContainer]);

  React.useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    const scroller = createScroller();
    let lastWheelTime = -Infinity;

    const onWheel = (event: WheelEvent) => {
      const now = performance.now();
      const inSeries = now - lastWheelTime < WHEEL_SERIES_MS;
      lastWheelTime = now;
      if (event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return; // horizontal dominant
      if (event.target instanceof Element && event.target.closest(`[${NATIVE_SCROLL_ATTRIBUTE}]`)) return;

      const container = scrollContainer?.current ?? null;
      const page: ScrollTarget = container ?? window;
      const delta = wheelDeltaPixels(event);
      if (delta === 0) return;
      const { zone, contain } = scrollZoneUnder(event.target, element);
      // Cran de molette isolé, ou suite d'une animation déjà lancée (molette tournée vite).
      const discrete = Math.abs(delta) >= DISCRETE_WHEEL_PX;
      const animate = discrete && (!inSeries || scroller.animating(page) || (zone !== null && scroller.animating(zone)));

      // Applique `pageDelta` à la page et `zoneDelta` à la zone, à la place du navigateur.
      const take = (pageDelta: number, zoneDelta: number) => {
        event.preventDefault();
        scroller.scroll(page, pageDelta, animate);
        if (zone) scroller.scroll(zone, zoneDelta, animate);
      };
      // Laisse faire le navigateur : on termine d'abord nos animations, pour ne pas mêler deux défilements.
      const native = () => {
        scroller.flush(page);
        if (zone) scroller.flush(zone);
      };

      if (delta > 0) {
        const top = typeof stickyTopRef.current === "function" ? stickyTopRef.current() : stickyTopRef.current;
        const remaining = remainingPageScroll(element, top, container) - scroller.pending(page);
        if (remaining <= 1) {
          // Partie haute repliée : le contenu défile. Pendant une animation, on la prolonge sur la zone (pas de saut).
          if (zone && animate && (scroller.animating(zone) || scroller.animating(page))) take(0, delta);
          else native();
          return;
        }
        const pageDelta = Math.min(delta, remaining);
        // Excédent reporté sur la zone : pas d'image figée à la jonction.
        take(pageDelta, zone ? delta - pageDelta : 0);
        return;
      }

      // Vers le haut. Sans zone qui défile sous le pointeur, le natif remonte la page.
      if (!zone) return native();
      const zoneUp = scrollTopOf(zone) + scroller.pending(zone); // place pour remonter (≥ 0)
      const pageUp = contain ? 0 : scrollTopOf(page) + scroller.pending(page);
      if (zoneUp >= -delta || pageUp <= 0) {
        // La zone peut absorber tout le delta, ou la page est déjà en haut : natif (ou suite de l'animation de la zone).
        if (animate && (scroller.animating(zone) || scroller.animating(page))) take(0, Math.max(delta, -zoneUp));
        else native();
        return;
      }
      // La zone est en haut (ou presque) : elle consomme ce qui lui reste, la page déplie avec l'excédent.
      const zoneDelta = -Math.max(0, zoneUp);
      take(Math.max(delta - zoneDelta, -pageUp), zoneDelta);
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
      scroller.cancel();
    };
  }, [ref, enabled, scrollContainer]);
}
