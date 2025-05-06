
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
    
    // Process color customizations
    if (customization.colors.primary) {
      const hslValue = hexToHSLString(customization.colors.primary);
      if (hslValue) cssVars["--primary"] = hslValue;
    }
    
    if (customization.colors.secondary) {
      const hslValue = hexToHSLString(customization.colors.secondary);
      if (hslValue) cssVars["--secondary"] = hslValue;
    }
    
    if (customization.colors.accent) {
      const hslValue = hexToHSLString(customization.colors.accent);
      if (hslValue) cssVars["--accent"] = hslValue;
    }
    
    if (customization.colors.background) {
      const hslValue = hexToHSLString(customization.colors.background);
      if (hslValue) cssVars["--background"] = hslValue;
    }
    
    return cssVars;
  };
  
  // Return value includes:
  // - CSS variables for custom colors
  // - Brand text values
  // - Current theme mode
  // - Other custom theme values
  return {
    cssVars: getCssVars(),
    brandName: customization.text.brandName || "GS Components",
    logo: customization.assets.logo,
    isDarkMode: resolvedTheme === "dark",
    // Add additional theme values as needed
  };
}
