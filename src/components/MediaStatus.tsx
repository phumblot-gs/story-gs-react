
import React from "react";
import { MediaStatus as MediaStatusEnum, getMediaStatusColorClass } from "@/utils/mediaStatus";
import { useTranslationSafe } from "@/contexts/TranslationContext";

export interface MediaStatusProps {
  status: MediaStatusEnum;
  className?: string;
  /** Width in pixels, or "full" for 100% width */
  width?: number | "full";
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
  const { t } = useTranslationSafe();
  const statusClass = getMediaStatusColorClass(status);
  const widthStyle = width === "full" ? "100%" : `${width}px`;

  return (
    <div
      className={`flex-none justify-items-center ${width === "full" ? "block" : "inline-block"} ${statusClass} ${className}`}
      style={{
        width: widthStyle,
        height: `${height}px`,
      }}
      title={t("mediaStatus.tooltip", { status })}
      role="status"
      aria-label={t("mediaStatus.label", { status })}
    />
  );
};

export default MediaStatus;
