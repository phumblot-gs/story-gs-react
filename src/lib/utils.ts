import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge ne reconnait comme font-size que les cles en « taille de
 * t-shirt » (xs, sm, lg, 2xl...). Les cles fontSize personnalisees du preset GS
 * (`badge-label`, `header-title`, `button-header`) retombaient donc dans le
 * groupe text-color : `cn("text-badge-label", "text-black")` supprimait la
 * TAILLE au profit de la couleur. Cas reel : Thumbnail/ViewIndicator, qui passe
 * `text-black` a un Badge.
 *
 * On les declare explicitement dans le groupe font-size. Effet : une classe de
 * couleur ne chasse plus la taille, et une taille passee par le consommateur
 * (`text-sm`) remplace bien celle de la librairie.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["badge-label", "header-title", "button-header"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
