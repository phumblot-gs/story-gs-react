import React from "react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface AlertIndicatorProps {
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Indicateur d'alerte pour les thumbnails
 * Affiche un badge rouge avec une icône d'alerte
 *
 * @example
 * // L'application parente détermine quand afficher l'indicateur
 * {file.hasAlert && <AlertIndicator />}
 */
export const AlertIndicator: React.FC<AlertIndicatorProps> = ({
  className,
}) => {
  return (
    <Badge
      variant="destructive"
      className={cn(
        "text-white justify-center items-center p-1 w-4 h-4 border-none",
        className
      )}
    >
      <Icon name="Alert" size={10} />
    </Badge>
  );
};

AlertIndicator.displayName = "AlertIndicator";
