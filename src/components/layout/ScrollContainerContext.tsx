import * as React from "react";

/**
 * Zone qui défile à la place de la fenêtre (corps d'un FullFrame…). Un
 * PageFillLayout posé dedans s'y adapte sans configuration : hauteur du
 * panneau, molette « page d'abord », état replié et barre de défilement
 * portent sur ce conteneur au lieu de la fenêtre.
 *
 * Le conteneur doit être une zone de défilement (`overflow: auto`) de hauteur
 * définie, avec `container-type: size` pour que le panneau puisse se
 * dimensionner en `cqh` (hauteur du conteneur, padding exclu).
 */
const ScrollContainerContext = React.createContext<React.RefObject<HTMLElement> | null>(null);

export const ScrollContainerProvider = ScrollContainerContext.Provider;

/** Conteneur de défilement le plus proche, ou `null` si c'est la fenêtre qui défile. */
export function useScrollContainer(): React.RefObject<HTMLElement> | null {
  return React.useContext(ScrollContainerContext);
}
