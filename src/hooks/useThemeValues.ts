
import { useCustomTheme } from "@/contexts/ThemeContext";
import { hexToHSLString } from "@/utils/colorUtils";
import { useTheme } from "next-themes";

/**
 * Normalize color value for consistent comparison
 */
export const normalizeColorValue = (color?: string): string => {
  if (!color) return '';
  return color.toLowerCase().trim();
};

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
    bgGrey: "#EFEFEF",
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
    
    // Header gradient colors
    headerGradientStart: "#74D2D8",
    headerGradientEnd: "#EBED8C",
  };
  
  // Convert custom colors to CSS variable format if available, otherwise use defaults
  const getCssVars = () => {
    const cssVars: Record<string, string> = {};
    
    // Process all colors using a more consistent approach with normalized values
    const processColor = (key: string, cssVarName: string, defaultColorKey: keyof typeof defaultColors) => {
      const customColor = customization.colors[defaultColorKey as keyof typeof customization.colors];
      const defaultColor = defaultColors[defaultColorKey];
      
      // Only add if custom color is defined and different from default (using normalized comparison)
      if (customColor && normalizeColorValue(customColor) !== normalizeColorValue(defaultColor)) {
        cssVars[cssVarName] = customColor;
      }
    };
    
    // Process background colors
    processColor("bgWhite", "--bg-white", "bgWhite");
    processColor("bgBlack", "--bg-black", "bgBlack");
    processColor("bgGrey", "--bg-grey", "bgGrey");
    processColor("bgGreyLighter", "--bg-grey-lighter", "bgGreyLighter");
    processColor("bgGreyStrongest", "--bg-grey-strongest", "bgGreyStrongest");
    
    // Process text colors
    processColor("textGreyStronger", "--text-grey-stronger", "textGreyStronger");
    processColor("textBlack", "--text-black", "textBlack");
    processColor("textWhite", "--text-white", "textWhite");
    processColor("textBluePrimary", "--text-blue-primary", "textBluePrimary");
    processColor("textBlue", "--text-blue", "textBlue");
    
    // Process status colors
    processColor("statusIgnored", "--status-ignored-color", "statusIgnored");
    processColor("statusReshoot", "--status-reshoot-color", "statusReshoot");
    processColor("statusNotSelected", "--status-not-selected-color", "statusNotSelected");
    processColor("statusSelected", "--status-selected-color", "statusSelected");
    processColor("statusRefused", "--status-refused-color", "statusRefused");
    processColor("statusForApproval", "--status-for-approval-color", "statusForApproval");
    processColor("statusValidated", "--status-validated-color", "statusValidated");
    processColor("statusToPublish", "--status-to-publish-color", "statusToPublish");
    processColor("statusError", "--status-error-color", "statusError");
    processColor("statusPublished", "--status-published-color", "statusPublished");
    
    // Process header gradient colors
    processColor("headerGradientStart", "--header-gradient-start", "headerGradientStart");
    processColor("headerGradientEnd", "--header-gradient-end", "headerGradientEnd");
    
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
