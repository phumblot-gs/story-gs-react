
import React from "react"
import * as LucideIcons from "lucide-react"
import { IconName } from "./icons/types"
import * as CustomIcons from "./icons"

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
      return <CustomIcons.CustomXIcon size={size} />;
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
      return <CustomIcons.ToastSuccessIcon size={size} />;
    case "ToastErrorIcon":
      return <CustomIcons.ToastErrorIcon size={size} />;
      
    default:
      // For other icons, check if they're in Lucide icons and return them
      if (LucideIcons[icon as keyof typeof LucideIcons]) {
        const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] as React.ElementType;
        return <IconComponent size={size} className="max-w-[12px] max-h-[12px]" />;
      }
      // Fallback for unknown icons
      return null;
  }
}
