import React from "react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface VedetteIndicatorProps {
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Indicateur vedette pour les thumbnails
 * Affiche un badge avec une icône vedette (star/featured)
 *
 * @example
 * // L'application parente détermine quand afficher l'indicateur
 * {file.isVedette && <VedetteIndicator />}
 */
export const VedetteIndicator: React.FC<VedetteIndicatorProps> = ({
  className,
}) => {
  return (
    <Badge
      className={cn(
        "border-none bg-white justify-center items-center p-1 w-4 h-4",
        className
      )}
    >
      <Icon name="Vedette" size={14} />
    </Badge>
  );
};

VedetteIndicator.displayName = "VedetteIndicator";
