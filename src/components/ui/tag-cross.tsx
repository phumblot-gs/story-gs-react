import * as React from "react";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";
import { Icon } from "@/components/ui/icons";

// Composant TagCross partagé (utilisé par TagText et TagStar)
export interface TagCrossProps {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const TagCross: React.FC<TagCrossProps> = ({ className, onClick, disabled }) => {
  const bg = useBgContext();
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "tag-cross",
        "flex items-center justify-center",
        "rounded-2",
        "w-2 h-2",
        "shrink-0",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        !disabled && "cursor-pointer",
        disabled && "cursor-not-allowed",
        className
      )}
      data-bg={bg || undefined}
      aria-label="Remove tag"
    >
      <Icon name="X" size={8} />
    </button>
  );
};

