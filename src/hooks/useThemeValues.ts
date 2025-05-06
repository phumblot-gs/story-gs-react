
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
  
  // Convert custom colors to CSS variable format if available
  const getCssVars = () => {
    const cssVars: Record<string, string> = {};
    
    // Process background colors
    if (customization.colors.bgWhite) {
      cssVars["--bg-white"] = customization.colors.bgWhite;
    }
    if (customization.colors.bgBlack) {
      cssVars["--bg-black"] = customization.colors.bgBlack;
    }
    if (customization.colors.bgGrey) {
      cssVars["--bg-grey"] = customization.colors.bgGrey;
    }
    if (customization.colors.bgGreyLighter) {
      cssVars["--bg-grey-lighter"] = customization.colors.bgGreyLighter;
    }
    if (customization.colors.bgGreyStrongest) {
      cssVars["--bg-grey-strongest"] = customization.colors.bgGreyStrongest;
    }
    
    // Process text colors
    if (customization.colors.textGreyStronger) {
      cssVars["--text-grey-stronger"] = customization.colors.textGreyStronger;
    }
    if (customization.colors.textBlack) {
      cssVars["--text-black"] = customization.colors.textBlack;
    }
    if (customization.colors.textWhite) {
      cssVars["--text-white"] = customization.colors.textWhite;
    }
    if (customization.colors.textBluePrimary) {
      cssVars["--text-blue-primary"] = customization.colors.textBluePrimary;
    }
    if (customization.colors.textBlue) {
      cssVars["--text-blue"] = customization.colors.textBlue;
    }
    
    // Process status colors
    if (customization.colors.statusIgnored) {
      cssVars["--status-ignored-color"] = customization.colors.statusIgnored;
    }
    if (customization.colors.statusReshoot) {
      cssVars["--status-reshoot-color"] = customization.colors.statusReshoot;
    }
    if (customization.colors.statusNotSelected) {
      cssVars["--status-not-selected-color"] = customization.colors.statusNotSelected;
    }
    if (customization.colors.statusSelected) {
      cssVars["--status-selected-color"] = customization.colors.statusSelected;
    }
    if (customization.colors.statusRefused) {
      cssVars["--status-refused-color"] = customization.colors.statusRefused;
    }
    if (customization.colors.statusForApproval) {
      cssVars["--status-for-approval-color"] = customization.colors.statusForApproval;
    }
    if (customization.colors.statusValidated) {
      cssVars["--status-validated-color"] = customization.colors.statusValidated;
    }
    if (customization.colors.statusToPublish) {
      cssVars["--status-to-publish-color"] = customization.colors.statusToPublish;
    }
    if (customization.colors.statusError) {
      cssVars["--status-error-color"] = customization.colors.statusError;
    }
    if (customization.colors.statusPublished) {
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
    // Add additional theme values as needed
  };
}
