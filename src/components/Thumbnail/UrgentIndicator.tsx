import React from "react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface UrgentIndicatorProps {
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Indicateur urgent pour les thumbnails
 * Affiche un badge orange avec une icône d'urgence
 *
 * @example
 * // L'application parente détermine quand afficher l'indicateur
 * {file.isUrgent && <UrgentIndicator />}
 */
export const UrgentIndicator: React.FC<UrgentIndicatorProps> = ({
  className,
}) => {
  return (
    <Badge
      className={cn(
        "!bg-orange text-white p-1 w-4 h-4 border-none",
        className
      )}
    >
      <Icon name="Urgent" size={10} />
    </Badge>
  );
};

UrgentIndicator.displayName = "UrgentIndicator";
