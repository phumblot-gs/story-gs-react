
import { useCustomTheme } from "@/contexts/ThemeContext";
import { hexToHSLString } from "@/utils/colorUtils";
import { useTheme } from "next-themes";

/**
 * Hook to get theme values that can be applied directly to components
 * including CSS variable overrides
 */
export function useThemeValues() {
  const { customization } = useCustomTheme();
  const { resolvedTheme } = useTheme();
  
  // Default theme colors that will be used when custom colors are empty/undefined
  const defaultColors = {
    // Background colors
    bgWhite: "#FFFFFF",
    bgBlack: "#292828",
    bgGrey: "#EAEAEA",
    bgGreyLighter: "#F3F3F3",
    bgGreyStrongest: "#595959",
    
    // Text colors
    textGreyStronger: "#4B5563",
    textBlack: "#000000",
    textWhite: "#FFFFFF",
    textBluePrimary: "#CDEDFF",
    textBlue: "#74D4DA",
    
    // Status colors
    statusIgnored: "#EAEAEA",
    statusReshoot: "#A44C9F",
    statusNotSelected: "transparent",
    statusSelected: "#74D4DA",
    statusRefused: "#595959",
    statusForApproval: "#FFD331",
    statusValidated: "#89CC52",
    statusToPublish: "#B7BB28",
    statusError: "#DD3733",
    statusPublished: "#8B4513",
  };
  
  // Convert custom colors to CSS variable format if available, otherwise use defaults
  const getCssVars = () => {
    const cssVars: Record<string, string> = {};
    
    // Process background colors - use default if empty or undefined
    cssVars["--bg-white"] = customization.colors.bgWhite || defaultColors.bgWhite;
    cssVars["--bg-black"] = customization.colors.bgBlack || defaultColors.bgBlack;
    cssVars["--bg-grey"] = customization.colors.bgGrey || defaultColors.bgGrey;
    cssVars["--bg-grey-lighter"] = customization.colors.bgGreyLighter || defaultColors.bgGreyLighter;
    cssVars["--bg-grey-strongest"] = customization.colors.bgGreyStrongest || defaultColors.bgGreyStrongest;
    
    // Process text colors - use default if empty or undefined
    cssVars["--text-grey-stronger"] = customization.colors.textGreyStronger || defaultColors.textGreyStronger;
    cssVars["--text-black"] = customization.colors.textBlack || defaultColors.textBlack;
    cssVars["--text-white"] = customization.colors.textWhite || defaultColors.textWhite;
    cssVars["--text-blue-primary"] = customization.colors.textBluePrimary || defaultColors.textBluePrimary;
    cssVars["--text-blue"] = customization.colors.textBlue || defaultColors.textBlue;
    
    // Process status colors - use default if empty or undefined
    cssVars["--status-ignored-color"] = customization.colors.statusIgnored || defaultColors.statusIgnored;
    cssVars["--status-reshoot-color"] = customization.colors.statusReshoot || defaultColors.statusReshoot;
    cssVars["--status-not-selected-color"] = customization.colors.statusNotSelected || defaultColors.statusNotSelected;
    cssVars["--status-selected-color"] = customization.colors.statusSelected || defaultColors.statusSelected;
    cssVars["--status-refused-color"] = customization.colors.statusRefused || defaultColors.statusRefused;
    cssVars["--status-for-approval-color"] = customization.colors.statusForApproval || defaultColors.statusForApproval;
    cssVars["--status-validated-color"] = customization.colors.statusValidated || defaultColors.statusValidated;
    cssVars["--status-to-publish-color"] = customization.colors.statusToPublish || defaultColors.statusToPublish;
    cssVars["--status-error-color"] = customization.colors.statusError || defaultColors.statusError;
    cssVars["--status-published-color"] = customization.colors.statusPublished || defaultColors.statusPublished;
    
    return cssVars;
  };

  // Return computed CSS variables and other theme values
  return {
    cssVars: getCssVars(),
    brandName: customization.text.brandName || "GS Components",
    logo: customization.assets.logo,
    isDarkMode: resolvedTheme === "dark",
    // Export the default colors for use in other components
    defaultColors,
  };
}
