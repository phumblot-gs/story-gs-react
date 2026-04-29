
import React from "react"
import * as LucideIcons from "lucide-react"
import { IconName } from "./types"
import * as CustomIcons from "./index"

/**
 * Renders the appropriate icon based on the icon name
 */
export const renderIcon = (
  icon: IconName,
  size: number = 12,
  strokeWidth?: number
): React.ReactNode => {
  // Check which custom icon to render
  switch(icon) {
    // Status icons
    case "Check":
      return <CustomIcons.CustomCheckIcon size={size} strokeWidth={strokeWidth} />;
    case "X":
      return <CustomIcons.CustomXIcon size={size} strokeWidth={strokeWidth} />;
    case "Alert":
      return <CustomIcons.CustomAlertIcon size={size} strokeWidth={strokeWidth} />;
    case "Status":
      return <CustomIcons.CustomStatusIcon size={size} />;
    case "Urgent":
      return <CustomIcons.CustomUrgentIcon size={size} strokeWidth={strokeWidth} />;

    // Action icons
    case "Plus":
      return <CustomIcons.CustomPlusIcon size={size} strokeWidth={strokeWidth} />;
    case "Pencil":
      return <CustomIcons.CustomPencilIcon size={size} strokeWidth={strokeWidth} />;
    case "Sort":
      return <CustomIcons.CustomSortIcon size={size} strokeWidth={strokeWidth} />;
    case "Filter":
      return <CustomIcons.CustomFilterIcon size={size} strokeWidth={strokeWidth} />;
    case "Eye":
      return <CustomIcons.CustomEyeIcon size={size} strokeWidth={strokeWidth} />;
    case "Logout":
      return <CustomIcons.CustomLogoutIcon size={size} strokeWidth={strokeWidth} />;
    case "Refresh":
      return <CustomIcons.CustomRefreshIcon size={size} strokeWidth={strokeWidth} />;
    case "Search":
      return <LucideIcons.Search size={size} strokeWidth={strokeWidth} />;
    case "Flag":
      return <CustomIcons.CustomFlagIcon size={size} />;
    case "FlagEmpty":
      return <CustomIcons.CustomFlagEmptyIcon size={size} strokeWidth={strokeWidth} />;
    case "Switch":
      return <CustomIcons.CustomSwitchIcon size={size} strokeWidth={strokeWidth} />;
    case "Scroll":
      return <CustomIcons.CustomScrollIcon size={size} strokeWidth={strokeWidth} />;

    // Item icons
    case "Tag":
      return <CustomIcons.CustomTagIcon size={size} strokeWidth={strokeWidth} />;
    case "Bell":
      return <CustomIcons.CustomBellIcon size={size} strokeWidth={strokeWidth} />;
    case "Star":
      return <CustomIcons.CustomStarIcon size={size} strokeWidth={strokeWidth} />;
    case "Vedette":
      return <CustomIcons.CustomVedetteIcon size={size} strokeWidth={strokeWidth} />;
    case "Comment":
      return <CustomIcons.CustomCommentIcon size={size} strokeWidth={strokeWidth} />;
    case "FolderOpened":
      return <CustomIcons.CustomFolderOpenedIcon size={size} strokeWidth={strokeWidth} />;
    case "FolderMoved":
      return <CustomIcons.CustomFolderMovedIcon size={size} strokeWidth={strokeWidth} />;

    // Navigation icons
    case "ArrowRight":
      return <CustomIcons.CustomArrowRightIcon size={size} strokeWidth={strokeWidth} />;
    case "ArrowLeft":
      return <CustomIcons.CustomArrowLeftIcon size={size} strokeWidth={strokeWidth} />;
    case "ArrowUp":
      return <CustomIcons.CustomArrowUpIcon size={size} strokeWidth={strokeWidth} />;
    case "ArrowDown":
      return <CustomIcons.CustomArrowDownIcon size={size} strokeWidth={strokeWidth} />;

    // Utility icons
    case "Help":
      return <CustomIcons.CustomHelpIcon size={size} strokeWidth={strokeWidth} />;
    case "Settings":
      return <CustomIcons.CustomSettingsIcon size={size} strokeWidth={strokeWidth} />;
    case "User":
      return <CustomIcons.CustomUserIcon size={size} strokeWidth={strokeWidth} />;

    // Custom icons
    case "ToastSuccessIcon":
      return <CustomIcons.ToastSuccessIcon size={size} />;
    case "ToastErrorIcon":
      return <CustomIcons.ToastErrorIcon size={size} />;

    // Lucide icons mapping
    case "AlertTriangle":
      return <LucideIcons.AlertTriangle size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Loader":
      return <LucideIcons.Loader2 size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronDown":
      return <LucideIcons.ChevronDown size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronLeft":
      return <LucideIcons.ChevronLeft size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronRight":
      return <LucideIcons.ChevronRight size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronUp":
      return <LucideIcons.ChevronUp size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Download":
      return <LucideIcons.Download size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "File":
      return <LucideIcons.File size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Folder":
      return <LucideIcons.Folder size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Globe":
      return <LucideIcons.Globe size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Grip":
      return <LucideIcons.GripVertical size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Mail":
      return <LucideIcons.Mail size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Menu":
      return <LucideIcons.Menu size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Minus":
      return <LucideIcons.Minus size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "MoreHorizontal":
      return <LucideIcons.MoreHorizontal size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "MoreVertical":
      return <LucideIcons.MoreVertical size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Move":
      return <LucideIcons.Move size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "RotateCcw":
      return <LucideIcons.RotateCcw size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Share":
      return <LucideIcons.Share2 size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "StarFilled":
      return <LucideIcons.Star size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px] fill-current" />;
    case "Trash":
      return <LucideIcons.Trash2 size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Upload":
      return <LucideIcons.Upload size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;
    case "Users":
      return <LucideIcons.Users size={size} strokeWidth={strokeWidth} className="max-w-[12px] max-h-[12px]" />;

    default:
      // Fallback for unknown icons
      return null;
  }
}
