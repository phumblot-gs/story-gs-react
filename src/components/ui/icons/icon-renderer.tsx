
import React from "react"
import * as LucideIcons from "lucide-react"
import { IconName } from "./types"
import * as CustomIcons from "./index"

/**
 * Renders the appropriate icon based on the icon name
 */
export const renderIcon = (
  icon: IconName,
  size: number = 12
): React.ReactNode => {
  // Check which custom icon to render
  switch(icon) {
    // Status icons
    case "Check":
      return <CustomIcons.CustomCheckIcon />;
    case "X":
      return <CustomIcons.CustomXIcon />;
    case "Alert":
      return <CustomIcons.CustomAlertIcon />;
    case "Status":
      return <CustomIcons.CustomStatusIcon />;
    case "Urgent":
      return <CustomIcons.CustomUrgentIcon />;
      
    // Action icons
    case "Plus":
      return <CustomIcons.CustomPlusIcon />;
    case "Pencil":
      return <CustomIcons.CustomPencilIcon />;
    case "Sort":
      return <CustomIcons.CustomSortIcon />;
    case "Filter":
      return <CustomIcons.CustomFilterIcon />;
    case "Eye":
      return <CustomIcons.CustomEyeIcon />;
    case "Logout":
      return <CustomIcons.CustomLogoutIcon />;
    case "Refresh":
      return <CustomIcons.CustomRefreshIcon />;
    case "Search":
      return <CustomIcons.CustomSearchIcon />;
    case "Flag":
      return <CustomIcons.CustomFlagIcon />;
    case "Switch":
      return <CustomIcons.CustomSwitchIcon />;
    case "Scroll":
      return <CustomIcons.CustomScrollIcon />;
      
    // Item icons
    case "Tag":
      return <CustomIcons.CustomTagIcon />;
    case "Bell":
      return <CustomIcons.CustomBellIcon />;
    case "Star":
      return <CustomIcons.CustomStarIcon />;
    case "Vedette":
      return <CustomIcons.CustomVedetteIcon />;
    case "Comment":
      return <CustomIcons.CustomCommentIcon />;
    case "FolderOpened":
      return <CustomIcons.CustomFolderOpenedIcon />;
    case "FolderMoved":
      return <CustomIcons.CustomFolderMovedIcon />;
      
    // Navigation icons
    case "ArrowRight":
      return <CustomIcons.CustomArrowRightIcon />;
    case "ArrowLeft":
      return <CustomIcons.CustomArrowLeftIcon />;
    case "ArrowUp":
      return <CustomIcons.CustomArrowUpIcon />;
    case "ArrowDown":
      return <CustomIcons.CustomArrowDownIcon />;
      
    // Utility icons
    case "Help":
      return <CustomIcons.CustomHelpIcon />;
    case "Settings":
      return <CustomIcons.CustomSettingsIcon />;
    case "User":
      return <CustomIcons.CustomUserIcon />;
      
    // Custom icons
    case "ToastSuccessIcon":
      return <CustomIcons.ToastSuccessIcon size={size} />;
    case "ToastErrorIcon":
      return <CustomIcons.ToastErrorIcon size={size} />;
      
    // Lucide icons mapping
    case "AlertTriangle":
      return <LucideIcons.AlertTriangle size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Loader":
      return <LucideIcons.Loader2 size={size} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronDown":
      return <LucideIcons.ChevronDown size={size} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronLeft":
      return <LucideIcons.ChevronLeft size={size} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronRight":
      return <LucideIcons.ChevronRight size={size} className="max-w-[12px] max-h-[12px]" />;
    case "ChevronUp":
      return <LucideIcons.ChevronUp size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Download":
      return <LucideIcons.Download size={size} className="max-w-[12px] max-h-[12px]" />;
    case "File":
      return <LucideIcons.File size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Folder":
      return <LucideIcons.Folder size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Globe":
      return <LucideIcons.Globe size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Grip":
      return <LucideIcons.GripVertical size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Mail":
      return <LucideIcons.Mail size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Menu":
      return <LucideIcons.Menu size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Minus":
      return <LucideIcons.Minus size={size} className="max-w-[12px] max-h-[12px]" />;
    case "MoreHorizontal":
      return <LucideIcons.MoreHorizontal size={size} className="max-w-[12px] max-h-[12px]" />;
    case "MoreVertical":
      return <LucideIcons.MoreVertical size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Move":
      return <LucideIcons.Move size={size} className="max-w-[12px] max-h-[12px]" />;
    case "RotateCcw":
      return <LucideIcons.RotateCcw size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Share":
      return <LucideIcons.Share2 size={size} className="max-w-[12px] max-h-[12px]" />;
    case "StarFilled":
      return <LucideIcons.Star size={size} className="max-w-[12px] max-h-[12px] fill-current" />;
    case "Trash":
      return <LucideIcons.Trash2 size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Upload":
      return <LucideIcons.Upload size={size} className="max-w-[12px] max-h-[12px]" />;
    case "Users":
      return <LucideIcons.Users size={size} className="max-w-[12px] max-h-[12px]" />;

    default:
      // Fallback for unknown icons
      return null;
  }
}
