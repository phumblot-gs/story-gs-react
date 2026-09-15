import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Three60IndicatorProps {
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Indicateur 360 pour les thumbnails
 * Affiche un badge "360" pour les images panoramiques
 *
 * @example
 * // L'application parente détermine quand afficher l'indicateur
 * {file.is360 && <Three60Indicator />}
 */
export const Three60Indicator: React.FC<Three60IndicatorProps> = ({
  className,
}) => {
  return (
    <Badge
      className={cn(
        // Pas de `text-[10px]` ici : la taille vient de `text-badge-label` (10px) dans
        // les classes de base du Badge. Une taille arbitraire est reconnue comme
        // font-size par tailwind-merge, donc elle supprimait le `leading-tight` de la
        // base — ce Badge etait le seul de la librairie a perdre cette correction.
        "border-none bg-white justify-center items-center p-1 w-4 h-4 font-medium",
        className
      )}
    >
      360
    </Badge>
  );
};

Three60Indicator.displayName = "Three60Indicator";
