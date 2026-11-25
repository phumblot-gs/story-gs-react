import type * as React from "react";

/**
 * Un menu rendu dans un Portal (sous <body>) est hors de la fenêtre d'un SidePanel ou d'un Dialog Radix. Leur verrou
 * de défilement (react-remove-scroll, écouteur wheel / touchmove sur document) n'accepte que les évènements venus de
 * l'overlay ou de la fenêtre : il annule la molette et le doigt dans le menu, dont la liste ne défile plus. (La Modal
 * de la librairie y échappe : sa fenêtre est rendue dans l'overlay.) Arrêter la propagation dans le menu empêche le
 * verrou de voir l'évènement ; le défilement natif reprend, et le verrou reste actif partout ailleurs.
 *
 * Renvoie un gestionnaire qui appelle d'abord celui de l'appelant.
 */
export function stopScrollLockPropagation<E extends React.SyntheticEvent>(handler?: (event: E) => void) {
  return (event: E) => {
    handler?.(event);
    event.stopPropagation();
  };
}
