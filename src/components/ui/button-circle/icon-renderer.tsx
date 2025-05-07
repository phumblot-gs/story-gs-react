import React from "react"
import * as LucideIcons from "lucide-react"
import { AllowedPictogram } from "./types"
import * as CustomIcons from "./custom-icons"
import {
  ToastSuccessIcon,
  ToastErrorIcon
} from "./custom-icons"

/**
 * Renders the appropriate icon based on the icon name
 */
export const renderIcon = (
  icon: AllowedPictogram,
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
      return <ToastSuccessIcon size={size} />;
    case "ToastErrorIcon":
      return <ToastErrorIcon size={size} />;
      
    default:
      // It's a Lucide icon
      const IconComponent = LucideIcons[icon] as React.ElementType;
      return <IconComponent size={size} className="max-w-[12px] max-h-[12px]" />;
  }
}
