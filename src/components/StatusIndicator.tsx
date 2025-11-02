
import React from "react";
import { MediaStatus, getStatusDotClass } from "@/utils/mediaStatus";

export type StatusIndicatorSize = "small" | "medium" | "large";

interface StatusIndicatorProps {
  status: MediaStatus;
  size?: StatusIndicatorSize;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "medium",
  className = "",
}) => {
  // Size mapping - matching Button component sizes
  const sizeClasses: Record<StatusIndicatorSize, string> = {
    small: "w-[7px] h-[7px]",    // 7px x 7px
    medium: "w-[10px] h-[10px]",  // 10px x 10px
    large: "w-[15px] h-[15px]",   // 15px x 15px
  };

  return (
    <div 
      className={`rounded-full ${sizeClasses[size]} ${getStatusDotClass(status)} ${className}`}
      aria-label={`Status: ${MediaStatus[status]}`}
    />
  );
};
