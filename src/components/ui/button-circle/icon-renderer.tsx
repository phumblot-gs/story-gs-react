
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
  // Common class for all icons to ensure consistent sizing
  const iconClasses = "max-w-[14px] max-h-[14px]";
  
  // Check if it's a custom icon first
  if (icon === "Pencil") {
    return <div className={iconClasses}><CustomPencilIcon /></div>;
  } else if (icon === "Tag") {
    return <div className={iconClasses}><CustomTagIcon /></div>;
  } else if (icon === "Bell") {
    return <div className={iconClasses}><CustomBellIcon /></div>;
  } else if (icon === "Sort") {
    return <div className={iconClasses}><CustomSortIcon /></div>;
  } else if (icon === "Help") {
    return <div className={iconClasses}><CustomHelpIcon /></div>;
  } else if (icon === "Logout") {
    return <div className={iconClasses}><CustomLogoutIcon /></div>;
  } else if (icon === "Filter") {
    return <div className={iconClasses}><CustomFilterIcon /></div>;
  } else if (icon === "Settings") {
    return <div className={iconClasses}><CustomSettingsIcon /></div>;
  } else if (icon === "User") {
    return <div className={iconClasses}><CustomUserIcon /></div>;
  } else if (icon === "Star") {
    return <div className={iconClasses}><CustomStarIcon /></div>;
  } else if (icon === "Status") {
    return <div className={iconClasses}><CustomStatusIcon /></div>;
  } else {
    // It's a Lucide icon
    const IconComponent = LucideIcons[icon] as React.ElementType;
    return <IconComponent size={iconSize} className={iconClasses} />;
  }
}
