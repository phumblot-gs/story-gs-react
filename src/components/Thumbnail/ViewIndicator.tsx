import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ViewIndicatorProps {
  /** Code de vue à afficher (ex: "F", "B", "L", "R", etc.). Si null/undefined/vide, affiche "?" */
  view?: string | null;
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
  const displayView = view ? (view.length > 5 ? `${view.slice(0, 4)}...` : view) : "?";

  return (
    <Badge
      className={cn(
        "border-none bg-white px-1 text-black min-w-3 min-h-3 py-0 justify-center items-center",
        className
      )}
    >
      {displayView}
    </Badge>
  );
};

ViewIndicator.displayName = "ViewIndicator";
