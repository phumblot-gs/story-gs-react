
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { hexToRgb, isHexColor } from "@/utils/color-utils";

// Define the theme customization options
export interface ThemeCustomization {
  // Brand colors (extended to support the requested colors)
  colors: {
    // Old options - removed
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;

    // Background colors
    bgWhite?: string;
    bgBlack?: string;
    bgGrey?: string;
    bgGreyLighter?: string;
    bgGreyStrongest?: string;
    
    // Text colors
    textGreyStronger?: string;
    textBlack?: string;
    textWhite?: string;
    textBluePrimary?: string;
    textBlue?: string;
    
    // Status colors
    statusIgnored?: string;
    statusReshoot?: string;
    statusNotSelected?: string;
    statusSelected?: string;
    statusRefused?: string;
    statusForApproval?: string;
    statusValidated?: string;
    statusToPublish?: string;
    statusError?: string;
    statusPublished?: string;

    // Header colors
    headerGradientStart?: string;
    headerGradientEnd?: string;
  };
  // Brand assets
  assets: {
    logo?: string; // URL or SVG string
  };
  // Custom text for components
  text: {
    brandName?: string;
    // Add other text customization options as needed
  };
}

// Theme context interface
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  customization: ThemeCustomization;
  updateCustomization: (updates: Partial<ThemeCustomization>) => void;
  resetCustomization: () => void;
}

// Default SVG logo
const DEFAULT_SVG_LOGO = `<svg width="25" height="14" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.32271 0.519775C4.47411 0.519775 0.784544 3.41519 0.106003 6.96598C-0.233268 8.7267 0.212025 10.37 1.33586 11.6123C2.43849 12.8253 4.07123 13.4904 5.93722 13.4904C7.50634 13.4904 9.07547 13.0209 10.475 12.1405C10.581 12.0819 10.6446 11.9743 10.6658 11.8667L11.4186 7.93437L10.4219 8.7267L9.87063 11.6123C8.66198 12.3362 7.3155 12.7177 5.99023 12.7177C4.36809 12.7177 2.94739 12.1405 1.9932 11.0939C1.01779 10.0179 0.636113 8.57997 0.932975 7.04423C1.5479 3.87493 4.83459 1.29254 8.2697 1.29254C9.62678 1.29254 10.8354 1.69359 11.7578 2.43701L12.1077 2.72068L12.2773 1.80119L12.1607 1.71315C11.1217 0.940392 9.78582 0.519775 8.32271 0.519775Z" fill="#292828"/>
  <path d="M15.4369 4.39315C14.9598 6.85816 17.4513 7.65049 19.2643 8.22761C20.7168 8.68736 21.7346 9.05907 21.6285 9.60685C21.5119 10.2231 20.4835 10.898 19.19 10.898C18.204 10.898 17.3134 10.585 16.6667 10.0079L14.3342 11.8567L14.4933 12.0132C15.5641 12.9718 17.059 13.5 18.6917 13.5C21.4483 13.5 24.0246 11.7588 24.4381 9.60685C24.9152 7.13205 22.4237 6.33973 20.6107 5.7626C19.1688 5.30286 18.151 4.93115 18.257 4.39315C18.3737 3.7769 19.4021 3.10196 20.6956 3.10196H24.5123L25.0106 0.509781H21.1939C18.4373 0.509781 15.8609 2.25094 15.4475 4.40293L15.4369 4.39315Z" fill="#292828"/>
</svg>`;

// Default customization values
const defaultCustomization: ThemeCustomization = {
  colors: {
    // Old options - removed
    primary: undefined,
    secondary: undefined,
    accent: undefined,
    background: undefined,

    // Background colors
    bgWhite: undefined,
    bgBlack: undefined,
    bgGrey: undefined,
    bgGreyLighter: undefined,
    bgGreyStrongest: undefined,
    
    // Text colors
    textGreyStronger: undefined,
    textBlack: undefined,
    textWhite: undefined,
    textBluePrimary: undefined,
    textBlue: undefined,
    
    // Status colors
    statusIgnored: undefined,
    statusReshoot: undefined,
    statusNotSelected: undefined,
    statusSelected: undefined,
    statusRefused: undefined,
    statusForApproval: undefined,
    statusValidated: undefined,
    statusToPublish: undefined,
    statusError: undefined,
    statusPublished: undefined,

    // Header colors
    headerGradientStart: undefined,
    headerGradientEnd: undefined,
  },
  assets: {
    logo: DEFAULT_SVG_LOGO,
  },
  text: {
    brandName: "GS Components",
  },
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  customization: defaultCustomization,
  updateCustomization: () => {},
  resetCustomization: () => {},
});

// Custom hook to use the theme context
export const useCustomTheme = () => {
  return useContext(ThemeContext);
};

// Local storage key for theme customizations
const THEME_CUSTOMIZATION_KEY = "gs-components-theme-customization";

// ThemeProvider component
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  initialCustomization?: Partial<ThemeCustomization>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
  initialCustomization = {},
}) => {
  // Use next-themes for light/dark mode
  const { theme, setTheme } = useNextTheme();
  
  // Initialize customization state with merged defaults and initial values
  const [customization, setCustomization] = useState<ThemeCustomization>(() => {
    // Try to get saved customization from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedCustomization = localStorage.getItem(THEME_CUSTOMIZATION_KEY);
        if (savedCustomization) {
          const parsed = JSON.parse(savedCustomization);
          return {
            ...defaultCustomization,
            ...parsed,
            // Ensure nested objects are properly merged
            colors: { ...defaultCustomization.colors, ...(parsed.colors || {}) },
            assets: { ...defaultCustomization.assets, ...(parsed.assets || {}) },
            text: { ...defaultCustomization.text, ...(parsed.text || {}) },
          };
        }
      } catch (error) {
        console.error("Failed to parse saved theme customization:", error);
      }
    }
    
    // If no saved customization or error, merge defaults with initialCustomization
    return {
      ...defaultCustomization,
      ...initialCustomization,
      // Ensure nested objects are properly merged
      colors: { ...defaultCustomization.colors, ...(initialCustomization.colors || {}) },
      assets: { ...defaultCustomization.assets, ...(initialCustomization.assets || {}) },
      text: { ...defaultCustomization.text, ...(initialCustomization.text || {}) },
    };
  });

  // Save customization to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_CUSTOMIZATION_KEY, JSON.stringify(customization));
    }
  }, [customization]);

  // Update customization with partial updates
  const updateCustomization = (updates: Partial<ThemeCustomization>) => {
    setCustomization(prev => {
      // Deep clone the previous state to avoid modifying it
      const newCustomization = JSON.parse(JSON.stringify(prev)) as ThemeCustomization;
      
      // Update colors, removing any that are explicitly set to undefined
      if (updates.colors) {
        Object.entries(updates.colors).forEach(([key, value]) => {
          if (value === undefined) {
            // If a color is set to undefined, delete it from the customization
            delete newCustomization.colors[key as keyof ThemeCustomization['colors']];
          } else {
            // Otherwise set it to the new value
            newCustomization.colors[key as keyof ThemeCustomization['colors']] = value;
          }
        });
      }
      
      // Update assets
      if (updates.assets) {
        Object.entries(updates.assets).forEach(([key, value]) => {
          if (value === undefined) {
            delete newCustomization.assets[key as keyof ThemeCustomization['assets']];
          } else {
            newCustomization.assets[key as keyof ThemeCustomization['assets']] = value;
          }
        });
      }
      
      // Update text properties
      if (updates.text) {
        Object.entries(updates.text).forEach(([key, value]) => {
          if (value === undefined) {
            delete newCustomization.text[key as keyof ThemeCustomization['text']];
          } else {
            newCustomization.text[key as keyof ThemeCustomization['text']] = value;
          }
        });
      }
      
      return newCustomization;
    });
  };

  // Reset customization to defaults
  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  // Helper function to set CSS variable with RGB conversion
  const setCSSVariable = (name: string, value: string | undefined) => {
    if (!value) return;
    const cssValue = isHexColor(value) ? hexToRgb(value) : value;
    document.documentElement.style.setProperty(name, cssValue);
  };

  // Apply CSS variables for theme colors
  useEffect(() => {
    if (typeof window !== "undefined" && document.documentElement) {
      // First reset all CSS variables to their defaults by clearing them
      document.documentElement.style.removeProperty('--bg-white');
      document.documentElement.style.removeProperty('--bg-black');
      document.documentElement.style.removeProperty('--bg-grey');
      document.documentElement.style.removeProperty('--bg-grey-lighter');
      document.documentElement.style.removeProperty('--bg-grey-strongest');
      
      document.documentElement.style.removeProperty('--text-grey-stronger');
      document.documentElement.style.removeProperty('--text-black');
      document.documentElement.style.removeProperty('--text-white');
      document.documentElement.style.removeProperty('--text-blue-primary');
      document.documentElement.style.removeProperty('--text-blue');
      
      document.documentElement.style.removeProperty('--status-ignored-color');
      document.documentElement.style.removeProperty('--status-reshoot-color');
      document.documentElement.style.removeProperty('--status-not-selected-color');
      document.documentElement.style.removeProperty('--status-selected-color');
      document.documentElement.style.removeProperty('--status-refused-color');
      document.documentElement.style.removeProperty('--status-for-approval-color');
      document.documentElement.style.removeProperty('--status-validated-color');
      document.documentElement.style.removeProperty('--status-to-publish-color');
      document.documentElement.style.removeProperty('--status-error-color');
      document.documentElement.style.removeProperty('--status-published-color');
      
      // Add header gradient colors
      document.documentElement.style.removeProperty('--header-gradient-start');
      document.documentElement.style.removeProperty('--header-gradient-end');
      
      // Now apply only the custom colors that are defined
      // Apply background colors
      setCSSVariable('--bg-white', customization.colors.bgWhite);
      setCSSVariable('--bg-black', customization.colors.bgBlack);
      setCSSVariable('--bg-grey', customization.colors.bgGrey);
      setCSSVariable('--bg-grey-lighter', customization.colors.bgGreyLighter);
      setCSSVariable('--bg-grey-strongest', customization.colors.bgGreyStrongest);

      // Apply text colors
      setCSSVariable('--text-grey-stronger', customization.colors.textGreyStronger);
      setCSSVariable('--text-black', customization.colors.textBlack);
      setCSSVariable('--text-white', customization.colors.textWhite);
      setCSSVariable('--text-blue-primary', customization.colors.textBluePrimary);
      setCSSVariable('--text-blue', customization.colors.textBlue);
      
      // Apply status colors (keeping original format for status colors as they're hex)
      setCSSVariable('--status-ignored-color', customization.colors.statusIgnored);
      setCSSVariable('--status-reshoot-color', customization.colors.statusReshoot);
      setCSSVariable('--status-not-selected-color', customization.colors.statusNotSelected);
      setCSSVariable('--status-selected-color', customization.colors.statusSelected);
      setCSSVariable('--status-refused-color', customization.colors.statusRefused);
      setCSSVariable('--status-for-approval-color', customization.colors.statusForApproval);
      setCSSVariable('--status-validated-color', customization.colors.statusValidated);
      setCSSVariable('--status-to-publish-color', customization.colors.statusToPublish);
      setCSSVariable('--status-error-color', customization.colors.statusError);
      setCSSVariable('--status-published-color', customization.colors.statusPublished);

      // Apply header gradient colors (keeping hex format for gradients)
      setCSSVariable('--header-gradient-start', customization.colors.headerGradientStart);
      setCSSVariable('--header-gradient-end', customization.colors.headerGradientEnd);
    }
  }, [customization.colors]);

  return (
    <ThemeContext.Provider value={{
      theme: theme || defaultTheme,
      setTheme,
      customization,
      updateCustomization,
      resetCustomization
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
