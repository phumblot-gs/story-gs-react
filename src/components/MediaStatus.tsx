
import React from "react";
import { MediaStatus as MediaStatusEnum, getMediaStatusColorClass } from "@/utils/mediaStatus";

export interface MediaStatusProps {
  status: MediaStatusEnum;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * MediaStatus Component
 * 
 * Displays a colored dash that represents the status of a media item
 * 
 * @param {MediaStatusEnum} status - The status code of the media
 * @param {string} className - Additional CSS classes
 * @param {number} width - Width of the dash in pixels (default: 12px)
 * @param {number} height - Height of the dash in pixels (default: 3px)
 */
const MediaStatus: React.FC<MediaStatusProps> = ({
  status,
  className = "",
  width = 12,
  height = 3
}) => {
  const statusClass = getMediaStatusColorClass(status);
  
  return (
    <div 
      className={`flex-none justify-items-center inline-block ${statusClass} ${className}`} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
      }}
      title={`Status: ${status}`}
      role="status"
      aria-label={`Media status: ${status}`}
    />
  );
};

export default MediaStatus;
