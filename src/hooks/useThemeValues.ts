
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
    
    // Only add CSS variables for colors that differ from the defaults
    
    // Process background colors - only if they differ from defaults
    if (customization.colors.bgWhite && customization.colors.bgWhite !== defaultColors.bgWhite) {
      cssVars["--bg-white"] = customization.colors.bgWhite;
    }
    if (customization.colors.bgBlack && customization.colors.bgBlack !== defaultColors.bgBlack) {
      cssVars["--bg-black"] = customization.colors.bgBlack;
    }
    if (customization.colors.bgGrey && customization.colors.bgGrey !== defaultColors.bgGrey) {
      cssVars["--bg-grey"] = customization.colors.bgGrey;
    }
    if (customization.colors.bgGreyLighter && customization.colors.bgGreyLighter !== defaultColors.bgGreyLighter) {
      cssVars["--bg-grey-lighter"] = customization.colors.bgGreyLighter;
    }
    if (customization.colors.bgGreyStrongest && customization.colors.bgGreyStrongest !== defaultColors.bgGreyStrongest) {
      cssVars["--bg-grey-strongest"] = customization.colors.bgGreyStrongest;
    }
    
    // Process text colors - only if they differ from defaults
    if (customization.colors.textGreyStronger && customization.colors.textGreyStronger !== defaultColors.textGreyStronger) {
      cssVars["--text-grey-stronger"] = customization.colors.textGreyStronger;
    }
    if (customization.colors.textBlack && customization.colors.textBlack !== defaultColors.textBlack) {
      cssVars["--text-black"] = customization.colors.textBlack;
    }
    if (customization.colors.textWhite && customization.colors.textWhite !== defaultColors.textWhite) {
      cssVars["--text-white"] = customization.colors.textWhite;
    }
    if (customization.colors.textBluePrimary && customization.colors.textBluePrimary !== defaultColors.textBluePrimary) {
      cssVars["--text-blue-primary"] = customization.colors.textBluePrimary;
    }
    if (customization.colors.textBlue && customization.colors.textBlue !== defaultColors.textBlue) {
      cssVars["--text-blue"] = customization.colors.textBlue;
    }
    
    // Process status colors - only if they differ from defaults
    if (customization.colors.statusIgnored && customization.colors.statusIgnored !== defaultColors.statusIgnored) {
      cssVars["--status-ignored-color"] = customization.colors.statusIgnored;
    }
    if (customization.colors.statusReshoot && customization.colors.statusReshoot !== defaultColors.statusReshoot) {
      cssVars["--status-reshoot-color"] = customization.colors.statusReshoot;
    }
    if (customization.colors.statusNotSelected && customization.colors.statusNotSelected !== defaultColors.statusNotSelected) {
      cssVars["--status-not-selected-color"] = customization.colors.statusNotSelected;
    }
    if (customization.colors.statusSelected && customization.colors.statusSelected !== defaultColors.statusSelected) {
      cssVars["--status-selected-color"] = customization.colors.statusSelected;
    }
    if (customization.colors.statusRefused && customization.colors.statusRefused !== defaultColors.statusRefused) {
      cssVars["--status-refused-color"] = customization.colors.statusRefused;
    }
    if (customization.colors.statusForApproval && customization.colors.statusForApproval !== defaultColors.statusForApproval) {
      cssVars["--status-for-approval-color"] = customization.colors.statusForApproval;
    }
    if (customization.colors.statusValidated && customization.colors.statusValidated !== defaultColors.statusValidated) {
      cssVars["--status-validated-color"] = customization.colors.statusValidated;
    }
    if (customization.colors.statusToPublish && customization.colors.statusToPublish !== defaultColors.statusToPublish) {
      cssVars["--status-to-publish-color"] = customization.colors.statusToPublish;
    }
    if (customization.colors.statusError && customization.colors.statusError !== defaultColors.statusError) {
      cssVars["--status-error-color"] = customization.colors.statusError;
    }
    if (customization.colors.statusPublished && customization.colors.statusPublished !== defaultColors.statusPublished) {
      cssVars["--status-published-color"] = customization.colors.statusPublished;
    }
    
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
