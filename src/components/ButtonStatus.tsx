
import React from "react";
import { MediaStatus, getMediaStatusColorClass, mediaStatusNames, shouldUseWhiteIcon } from "@/utils/mediaStatus";
import { ButtonCircle } from "@/components/ui/button-circle";
import { cn } from "@/lib/utils";
import { IconName } from "@/components/ui/icons/types";

export interface ButtonStatusProps {
  status: MediaStatus;
  icon: "Check" | "X"; // Using capitalized names to match IconName type
  isActive?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  className?: string;
  size?: "small" | "large";
  debug?: boolean;
}

export const ButtonStatus: React.FC<ButtonStatusProps> = ({
  status,
  icon,
  isActive = false,
  disabled = false,
  onClick,
  onFocus,
  onBlur,
  className = "",
  size = "large",
  debug = false,
}) => {
  // Get the status color class from the utility function
  const statusColorClass = getMediaStatusColorClass(status);
  const statusName = mediaStatusNames[status];
  const useWhiteIcon = shouldUseWhiteIcon(status);
  
  // Handle events with debug mode
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (debug) console.log(`ButtonStatus (${statusName}): onClick triggered`);
    onClick?.(e);
  };

  const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (e) => {
    if (debug) console.log(`ButtonStatus (${statusName}): onFocus triggered`);
    onFocus?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (e) => {
    if (debug) console.log(`ButtonStatus (${statusName}): onBlur triggered`);
    onBlur?.(e);
  };
  
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
        // Determine icon color based on status background
        useWhiteIcon ? 
          "hover:[&_svg]:text-white active:[&_svg]:text-white" : 
          "hover:[&_svg]:text-black active:[&_svg]:text-black",
        useWhiteIcon && isActive ? "[&_svg]:text-white" : "",
        !useWhiteIcon && isActive ? "[&_svg]:text-black" : "",
        className
      )}
      size={size}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      debug={debug}
      aria-label={`${icon === "Check" ? "Approve" : "Reject"} - ${statusName}`}
      style={{
        // Set CSS variables for dynamic colors
        "--status-bg-color": `var(--${statusColorClass}-color)`,
      } as React.CSSProperties}
      icon={icon as IconName}
    />
  );
};
