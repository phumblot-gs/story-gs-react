/**
 * Logique du glisser-déposer interne du FileBrowser (déplacement de lignes
 * vers un sous-dossier), isolée du composant pour être testable sans
 * navigateur : jsdom / happy-dom n'implémentent ni `DataTransfer` ni
 * `setDragImage`, donc seul ce qui est pur peut être vérifié en test.
 */

import type { FileItem } from "@/components/ui/file-browser";

/**
 * Type MIME du drag interne. Il distingue un déplacement de lignes d'un import
 * de fichiers depuis le bureau (qui, lui, expose le type "Files") : les deux
 * gestes déclenchent les mêmes événements sur le même conteneur.
 */
export const INTERNAL_DRAG_TYPE = "application/x-gs-file-browser-items";

/** Un drag venant du bureau, à distinguer d'un déplacement de lignes. */
export function isExternalFileDrag(types: readonly string[] | undefined): boolean {
  return types ? Array.from(types).includes("Files") : false;
}

/** Un déplacement de lignes en cours, émis par ce composant. */
export function isInternalItemsDrag(types: readonly string[] | undefined): boolean {
  return types ? Array.from(types).includes(INTERNAL_DRAG_TYPE) : false;
}

/**
 * Cible de drop valide : un dossier, actif, qui ne fait pas partie des lignes
 * déplacées — on ne déplace pas un dossier dans lui-même.
 */
export function canDropOnItem(item: FileItem, draggedIds: ReadonlySet<string>): boolean {
  return item.is_directory === true && item.disabled !== true && !draggedIds.has(item.id);
}

/**
 * Lignes effectivement déplacées au démarrage d'un drag.
 *
 * Glisser une ligne sélectionnée déplace toute la sélection ; glisser une ligne
 * hors sélection ne déplace qu'elle. Sans cette seconde règle, le geste
 * déplacerait une sélection invisible à l'écran, faite plus tôt ailleurs dans
 * la liste. L'ordre d'affichage est conservé.
 */
export function getDraggedItems(
  item: FileItem,
  selectedIds: ReadonlySet<string>,
  sortedFiles: readonly FileItem[],
): FileItem[] {
  if (!selectedIds.has(item.id)) return [item];

  const dragged = sortedFiles.filter((file) => selectedIds.has(file.id) && file.disabled !== true);
  return dragged.length > 0 ? dragged : [item];
}

export interface AutoScrollOptions {
  /** Hauteur de la zone sensible, en haut et en bas du conteneur (px). */
  zone?: number;
  /** Vitesse maximale, atteinte au bord du conteneur (px par frame). */
  maxSpeed?: number;
}

/**
 * Vitesse de défilement pendant un drag, selon la position du curseur.
 *
 * Négative vers le haut, positive vers le bas, `0` hors des zones sensibles.
 * La vitesse croît linéairement à mesure qu'on approche du bord, et reste au
 * maximum au-delà : pendant un drag, le curseur sort volontiers du conteneur.
 *
 * Le défilement est piloté par une boucle d'animation et non par les
 * événements `dragover` : ceux-ci cessent d'être émis dès que le curseur
 * s'immobilise, ce qui figerait le défilement alors que l'utilisateur attend
 * qu'il continue.
 */
export function computeAutoScrollSpeed(
  rect: { top: number; bottom: number },
  clientY: number,
  { zone = 48, maxSpeed = 18 }: AutoScrollOptions = {},
): number {
  if (zone <= 0 || maxSpeed <= 0) return 0;

  const height = rect.bottom - rect.top;
  if (height <= 0) return 0;

  // Conteneur plus petit que deux zones : on les réduit pour qu'elles ne se
  // chevauchent pas, sans quoi le haut et le bas se disputeraient le curseur.
  const effectiveZone = Math.min(zone, height / 2);

  const fromTop = clientY - rect.top;
  if (fromTop < effectiveZone) {
    const intensity = Math.min(1, (effectiveZone - fromTop) / effectiveZone);
    return -Math.ceil(intensity * maxSpeed);
  }

  const fromBottom = rect.bottom - clientY;
  if (fromBottom < effectiveZone) {
    const intensity = Math.min(1, (effectiveZone - fromBottom) / effectiveZone);
    return Math.ceil(intensity * maxSpeed);
  }

  return 0;
}
