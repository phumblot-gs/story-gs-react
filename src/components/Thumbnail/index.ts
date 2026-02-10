// Main component
export { Thumbnail } from "./Thumbnail";
export type {
  ThumbnailProps,
  ThumbnailSize,
  ThumbnailPresetSize,
  ThumbnailAction,
} from "./Thumbnail";

// Re-export LabelColor for convenience
export type { LabelColor } from "@/components/ui/button-thumbnail-labels";

// Indicators
export { AlertIndicator } from "./AlertIndicator";
export type { AlertIndicatorProps } from "./AlertIndicator";

export { VedetteIndicator } from "./VedetteIndicator";
export type { VedetteIndicatorProps } from "./VedetteIndicator";

export { UrgentIndicator } from "./UrgentIndicator";
export type { UrgentIndicatorProps } from "./UrgentIndicator";

export { Three60Indicator } from "./Three60Indicator";
export type { Three60IndicatorProps } from "./Three60Indicator";

export { ViewIndicator } from "./ViewIndicator";
export type { ViewIndicatorProps } from "./ViewIndicator";
