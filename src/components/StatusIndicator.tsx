
import React from "react";
import { MediaStatus, getStatusDotClass } from "@/utils/mediaStatus";

interface StatusIndicatorProps {
  status: MediaStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  // Size mapping
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div 
      className={`rounded-full ${sizeClasses[size]} ${getStatusDotClass(status)} ${className}`}
      aria-label={`Status: ${MediaStatus[status]}`}
    />
  );
};
