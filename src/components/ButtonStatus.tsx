
import React from "react";
import { MediaStatus, getMediaStatusColorClass, mediaStatusNames } from "@/utils/mediaStatus";
import { ButtonCircle } from "@/components/ui/button-circle";
import { cn } from "@/lib/utils";
import { AllowedPictogram } from "@/components/ui/button-circle/types";

export interface ButtonStatusProps {
  status: MediaStatus;
  icon: "Check" | "X"; // Using capitalized names to match AllowedPictogram type
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "small" | "large";
}

export const ButtonStatus: React.FC<ButtonStatusProps> = ({
  status,
  icon,
  isActive = false,
  disabled = false,
  onClick,
  className = "",
  size = "large",
}) => {
  // Get the status color class from the utility function
  const statusColorClass = getMediaStatusColorClass(status);
  const statusName = mediaStatusNames[status];
  
  return (
    <ButtonCircle
      className={cn(
        "relative transition-colors",
        // Default state
        `[&_svg]:${statusColorClass}`,
        // Hover state
        `hover:bg-[var(--status-bg-color)]`,
        // Active state - should match hover state exactly
        isActive && "bg-[var(--status-bg-color)]",
        className
      )}
      size={size}
      disabled={disabled}
      onClick={onClick}
      aria-label={`${icon === "Check" ? "Approve" : "Reject"} - ${statusName}`}
      style={{
        // Set CSS variables for dynamic colors
        "--status-bg-color": `var(--${statusColorClass}-color)`,
      } as React.CSSProperties}
      icon={icon as AllowedPictogram}
    />
  );
};

export default ButtonStatus;
