import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ViewIndicatorProps {
  /** Code de vue à afficher (ex: "F", "B", "L", "R", etc.) */
  view: string;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Indicateur de vue pour les thumbnails
 * Affiche un badge avec le code de vue (Face, Back, Left, Right, etc.)
 *
 * @example
 * <ViewIndicator view="F" />
 * <ViewIndicator view={file.view_type_code} />
 */
export const ViewIndicator: React.FC<ViewIndicatorProps> = ({
  view,
  className,
}) => {
  if (!view) return null;

  return (
    <Badge
      className={cn(
        "border-none bg-white px-1 text-black",
        className
      )}
      size="small"
    >
      {view}
    </Badge>
  );
};

ViewIndicator.displayName = "ViewIndicator";
