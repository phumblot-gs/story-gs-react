
import React from "react"
import * as LucideIcons from "lucide-react"
import { AllowedPictogram } from "./types"
import {
  CustomPencilIcon,
  CustomTagIcon,
  CustomBellIcon,
  CustomSortIcon,
  CustomHelpIcon,
  CustomLogoutIcon,
  CustomFilterIcon,
  CustomSettingsIcon,
  CustomUserIcon,
  CustomStarIcon,
  CustomStatusIcon
} from "./custom-icons"

/**
 * Renders the appropriate icon based on the icon name
 */
export const renderIcon = (
  icon: keyof typeof LucideIcons | AllowedPictogram,
  iconSize: number = 14
) => {
  // Check if it's a custom icon first
  if (icon === "Pencil") {
    return <CustomPencilIcon />;
  } else if (icon === "Tag") {
    return <CustomTagIcon />;
  } else if (icon === "Bell") {
    return <CustomBellIcon />;
  } else if (icon === "Sort") {
    return <CustomSortIcon />;
  } else if (icon === "Help") {
    return <CustomHelpIcon />;
  } else if (icon === "Logout") {
    return <CustomLogoutIcon />;
  } else if (icon === "Filter") {
    return <CustomFilterIcon />;
  } else if (icon === "Settings") {
    return <CustomSettingsIcon />;
  } else if (icon === "User") {
    return <CustomUserIcon />;
  } else if (icon === "Star") {
    return <CustomStarIcon />;
  } else if (icon === "Status") {
    return <CustomStatusIcon />;
  } else {
    // It's a Lucide icon
    const IconComponent = LucideIcons[icon] as React.ElementType;
    return <IconComponent size={iconSize} className="max-w-[14px] max-h-[14px]" />;
  }
}
