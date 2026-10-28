import * as React from "react";
import {
  GroupedImageLoader,
  type GroupedImageItem,
  type GroupedImageKey,
  type GroupedImageState,
  type ImageLoadScheduler,
  type PreloadImageFn,
  type ContactSheetImageCache,
} from "@/lib/grouped-image-loading";

/** Zone de préchargement : l'écran (ou le conteneur qui défile) élargi de 300px en haut et en bas. */
export const PRELOAD_ROOT_MARGIN = "300px 0px";

export interface UseGroupedImageLoadingOptions {
  /** Désactivé : rien n'est piloté, `getState` rend toujours `undefined`. */
  enabled: boolean;
  /** Images de la grille dans l'ordre d'affichage (emplacements vides et vignettes sans src exclus). */
  items: readonly GroupedImageItem[];
  /** Vignettes par ligne : taille des blocs des grandes références. */
  columns: number;
  /** Grille : sert à trouver le conteneur qui défile. */
  containerRef: React.RefObject<HTMLElement>;
  /** Cellule d'une image, observée pour savoir si elle approche de l'écran. */
  getNode: (key: GroupedImageKey) => HTMLElement | undefined;
  /** Injection pour les tests. */
  scheduler?: ImageLoadScheduler;
  preload?: PreloadImageFn;
  revealTimeoutMs?: number;
  imageCache?: ContactSheetImageCache;
}

/** Premier ancêtre qui défile verticalement : racine de l'IntersectionObserver (sinon l'écran). */
export function findScrollRoot(node: HTMLElement | null): HTMLElement | null {
  if (typeof getComputedStyle === "undefined") return null;
  let parent = node?.parentElement ?? null;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY) && parent.scrollHeight > parent.clientHeight) return parent;
    parent = parent.parentElement;
  }
  return null;
}

/**
 * Chargement groupé des images d'une grille (voir `GroupedImageLoader`) :
 * observe les cellules, ne lance un bloc qu'à son approche de l'écran, et
 * redessine la grille quand des vignettes sont révélées.
 *
 * Sans IntersectionObserver (SSR, tests), tout est considéré visible.
 */
export function useGroupedImageLoading({
  enabled,
  items,
  columns,
  containerRef,
  getNode,
  scheduler,
  preload,
  revealTimeoutMs,
  imageCache,
}: UseGroupedImageLoadingOptions): (key: GroupedImageKey, src: string) => GroupedImageState | undefined {
  const [, rerender] = React.useReducer((n: number) => n + 1, 0);
  const mountedRef = React.useRef(false);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const getNodeRef = React.useRef(getNode);
  getNodeRef.current = getNode;

  const loaderRef = React.useRef<GroupedImageLoader | null>(null);
  if (enabled && !loaderRef.current) {
    loaderRef.current = new GroupedImageLoader({
      scheduler,
      preload,
      revealTimeoutMs,
      imageCache,
      onChange: () => {
        if (mountedRef.current) rerender();
      },
      // Bloc à l'écran : au moins une de ses cellules montées est visible.
      isVisible: (keys) => {
        if (typeof IntersectionObserver === "undefined") return true;
        const root = rootRef.current;
        const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
        const bounds = root?.getBoundingClientRect();
        const top = Math.max(0, bounds?.top ?? 0);
        const bottom = Math.min(viewportBottom, bounds?.bottom ?? viewportBottom);
        // Une fenêtre virtualisée peut ne monter qu'une partie du bloc.
        return keys.some((key) => {
          const rect = getNodeRef.current(key)?.getBoundingClientRect();
          return !!rect && rect.top < bottom && rect.bottom > top;
        });
      },
    });
  }

  const observerRef = React.useRef<IntersectionObserver | null>(null);
  /** Cellule observée pour chaque clé, et clé de chaque cellule observée. */
  const observedRef = React.useRef(new Map<GroupedImageKey, HTMLElement>());
  const keyOfNodeRef = React.useRef(new Map<Element, GroupedImageKey>());

  // À chaque rendu : images à jour, cellules observées à jour (les nœuds
  // changent quand la mise en page des exports change).
  React.useLayoutEffect(() => {
    const loader = loaderRef.current;
    if (!enabled || !loader) return;
    mountedRef.current = true;
    loader.setCacheOptions(imageCache);
    const supported = typeof IntersectionObserver !== "undefined";
    if (!supported) {
      loader.setAllNear(true);
      loader.setItems(items, columns);
      return;
    }
    if (!observerRef.current) {
      rootRef.current = findScrollRoot(containerRef.current);
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const key = keyOfNodeRef.current.get(entry.target);
            if (key !== undefined) loader.setNear(key, entry.isIntersecting);
          });
          loader.sync();
        },
        { root: rootRef.current, rootMargin: PRELOAD_ROOT_MARGIN },
      );
    }
    const observer = observerRef.current;
    const observed = observedRef.current;
    const wanted = new Set<GroupedImageKey>();
    items.forEach(({ key }) => {
      wanted.add(key);
      const node = getNodeRef.current(key);
      const previous = observed.get(key);
      if (node === previous) return;
      if (previous) {
        observer.unobserve(previous);
        keyOfNodeRef.current.delete(previous);
        loader.setNear(key, false);
      }
      if (node) {
        observed.set(key, node);
        keyOfNodeRef.current.set(node, key);
        observer.observe(node);
      } else {
        observed.delete(key);
      }
    });
    observed.forEach((node, key) => {
      if (wanted.has(key)) return;
      observer.unobserve(node);
      keyOfNodeRef.current.delete(node);
      observed.delete(key);
      loader.setNear(key, false);
    });
    loader.setItems(items, columns);
  });

  // Démontage (ou passage en mode natif) : tout est abandonné.
  React.useEffect(() => {
    if (!enabled) return;
    const observed = observedRef.current;
    const keyOfNode = keyOfNodeRef.current;
    return () => {
      mountedRef.current = false;
      observerRef.current?.disconnect();
      observerRef.current = null;
      observed.clear();
      keyOfNode.clear();
      loaderRef.current?.reset();
    };
  }, [enabled]);

  return React.useCallback(
    (key: GroupedImageKey, src: string) => {
      if (!enabled) return undefined;
      // Image pas encore enregistrée (premier rendu) : en attente.
      return loaderRef.current?.getState(key) ?? { src, pending: true, error: false };
    },
    // Le rendu suivant une révélation relit l'état : pas de dépendance à la version.
    [enabled],
  );
}
