
import React from "react";
import { MediaStatus, getMediaStatusColorClass, mediaStatusNames } from "@/utils/mediaStatus";
import { ButtonCircle } from "@/components/ui/button-circle";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonStatusProps {
  status: MediaStatus;
  icon: "check" | "x";
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
  
  // Determine icon component
  const IconComponent = icon === "check" ? Check : X;
  
  // CSS variables to control colors based on state
  // Default state: white background, status color for the icon
  // Hover/Active state: status color background, white icon
  // Disabled state: grey background, grey icon
  
  return (
    <ButtonCircle
      className={cn(
        "relative transition-colors",
        // Default state
        `[&_svg]:${statusColorClass}`,
        // Hover state
        `hover:bg-[var(--status-bg-color)] hover:[&_svg]:fill-white`,
        // Active state
        isActive && "bg-[var(--status-bg-color)] [&_svg]:fill-white",
        className
      )}
      size={size}
      disabled={disabled}
      onClick={onClick}
      aria-label={`${icon === "check" ? "Approve" : "Reject"} - ${statusName}`}
      style={{
        // Set CSS variables for dynamic colors
        "--status-bg-color": `var(--${statusColorClass}-color)`,
      } as React.CSSProperties}
    >
      <IconComponent className="w-3 h-3" />
    </ButtonCircle>
  );
};

export default ButtonStatus;
