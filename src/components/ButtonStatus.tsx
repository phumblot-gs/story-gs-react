
import React from "react";
import { MediaStatus, getMediaStatusColorClass, mediaStatusNames, shouldUseWhiteIcon } from "@/utils/mediaStatus";
import { Button } from "@/components/ui/button-base";
import { cn } from "@/lib/utils";
import { IconProvider } from "@/components/ui/icon-provider";
import { IconName } from "@/components/ui/icons/types";
import { cva } from "class-variance-authority";

// Size variants for circular buttons
const sizeVariants = cva('', {
  variants: {
    size: {
      small: "w-[20px] h-[20px]",
      medium: "w-[30px] h-[30px]",
      large: "w-[40px] h-[40px]",
    },
  },
  defaultVariants: { size: "medium" },
});

export interface ButtonStatusProps {
  status: MediaStatus;
  icon: "Check" | "X"; // Using capitalized names to match IconName type
  isActive?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  className?: string;
  size?: "small" | "medium" | "large";
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
  size = "medium",
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

  // Get size classes
  const sizeClasses = sizeVariants({ size });
  
  // Calculate icon size based on button size
  const iconSize = size === "small" ? 8 : size === "large" ? 16 : 12;
  
  // Icon size classes based on button size
  const iconSizeClasses = size === "small" 
    ? "[&_svg]:w-[8px] [&_svg]:h-[8px]" 
    : size === "large" 
    ? "[&_svg]:w-[16px] [&_svg]:h-[16px]" 
    : "[&_svg]:w-[12px] [&_svg]:h-[12px]";
  
  return (
    <div className="relative">
      <Button
        className={cn(
          "relative rounded-full flex items-center justify-center font-light transition-colors duration-200 p-0",
          sizeClasses,
          iconSizeClasses,
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
        disabled={disabled}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={`${icon === "Check" ? "Approve" : "Reject"} - ${statusName}`}
        style={{
          // Set CSS variables for dynamic colors
          "--status-bg-color": `var(--${statusColorClass}-color)`,
        } as React.CSSProperties}
      >
        <IconProvider icon={icon as IconName} size={iconSize} />
      </Button>
    </div>
  );
};
