import * as React from "react";
import { cn } from "@/lib/utils";

export type GradeValue = "A" | "B" | "C" | "D" | "E";
export type GradeSize = "small" | "medium" | "large";

export interface GradeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valeur du grade (A, B, C, D, ou E) */
  value: GradeValue;

  /**
   * Taille du badge. Default: "small" (comportement historique inchangé).
   * - "small"  : ~14×14 px, texte 8 px (rétrocompatible)
   * - "medium" : 20×20 px, rond, texte 11 px medium
   * - "large"  : 50×50 px, rond, texte 26 px bold
   */
  size?: GradeSize;

  /** Mode debug : affiche un label et log les props dans la console */
  debug?: boolean;
}

// Classes spécifiques à chaque taille. La couleur de fond / police vient de la
// classe `.grade-{a..e}` définie dans `figma-tokens.css`.
const sizeClasses: Record<GradeSize, string> = {
  // Comportement historique : on s'appuie sur les min-width/height/padding
  // posés par la classe `.grade` dans figma-tokens.css.
  small: "rounded-[7px] text-[8px] leading-[9px] font-normal",
  // 20×20 strictement (override du min-width/height de `.grade`).
  medium: "w-4 h-4 p-0 rounded-full text-[11px] leading-none font-medium",
  // 50×50 strictement.
  large: "w-10 h-10 p-0 rounded-full text-[26px] leading-none font-bold",
};

/**
 * Composant Grade pour afficher des grades avec couleur de fond selon la valeur.
 *
 * Le composant applique automatiquement la couleur de fond et de texte correspondante
 * à la valeur du grade (A: vert, B: bleu, C: jaune, D: rouge, E: gris foncé).
 *
 * @example
 * ```tsx
 * <Grade value="A" />                    // taille small (défaut)
 * <Grade value="B" size="medium" />      // 20×20 rond
 * <Grade value="C" size="large" />       // 50×50 rond
 * ```
 */
export const Grade = React.forwardRef<HTMLDivElement, GradeProps>(
  ({ value, size = "small", debug = false, className, ...props }, ref) => {
    // Debug mode : log des props au montage
    React.useEffect(() => {
      if (debug) {
        console.log('[Grade Debug]', {
          value,
          size,
        });
      }
    }, [debug, value, size]);

    return (
      <div
        ref={ref}
        className={cn(
          "grade",
          `grade-${value.toLowerCase()}`,
          "inline-flex items-center justify-center",
          "font-['Avenir_Next',_sans-serif]",
          "text-white",
          "shrink-0",
          sizeClasses[size],
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        {...props}
      >
        <span>{value}</span>
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            Grade {value} ({size})
          </span>
        )}
      </div>
    );
  }
);

Grade.displayName = "Grade";

