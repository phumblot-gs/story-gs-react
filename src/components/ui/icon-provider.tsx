
import React from "react";
import { AllowedPictogram } from "@/components/ui/button-circle/types";
import { renderIcon } from "@/components/ui/button-circle/icon-renderer";

export interface IconProviderProps {
  icon: AllowedPictogram;
  className?: string;
  size?: number;
}

/**
 * IconProvider component that renders custom pictograms
 * This component isolates the icon rendering logic so it can be used by other components
 */
export const IconProvider: React.FC<IconProviderProps> = ({
  icon,
  className = "",
  size = 12,
}) => {
  return (
    <span className={className}>
      {renderIcon(icon, size)}
    </span>
  );
};

export default IconProvider;
