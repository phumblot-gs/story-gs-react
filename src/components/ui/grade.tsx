import * as React from "react";
import { cn } from "@/lib/utils";

export type GradeValue = "A" | "B" | "C" | "D" | "E";

export interface GradeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valeur du grade (A, B, C, D, ou E) */
  value: GradeValue;
  
  /** Mode debug : affiche un label et log les props dans la console */
  debug?: boolean;
}

/**
 * Composant Grade pour afficher des grades avec couleur de fond selon la valeur
 * 
 * Le composant applique automatiquement la couleur de fond et de texte correspondante
 * à la valeur du grade (A: vert, B: bleu, C: jaune, D: rouge, E: gris foncé).
 * 
 * @example
 * ```tsx
 * <Grade value="A" />
 * <Grade value="B" />
 * ```
 */
export const Grade = React.forwardRef<HTMLDivElement, GradeProps>(
  ({ value, debug = false, className, ...props }, ref) => {
    // Debug mode : log des props au montage
    React.useEffect(() => {
      if (debug) {
        console.log('[Grade Debug]', {
          value,
        });
      }
    }, [debug, value]);

    return (
      <div
        ref={ref}
        className={cn(
          "grade",
          `grade-${value.toLowerCase()}`,
          "inline-flex items-center justify-center",
          "rounded-[7px]",
          "font-['Avenir_Next',_sans-serif] font-normal",
          "text-[8px] leading-[9px]",
          "text-white",
          "shrink-0",
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        {...props}
      >
        <span>{value}</span>
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            Grade {value}
          </span>
        )}
      </div>
    );
  }
);

Grade.displayName = "Grade";

