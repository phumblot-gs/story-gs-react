
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

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
  };
  // Brand assets
  assets: {
    logo?: string;
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
  },
  assets: {
    logo: undefined,
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
      const newCustomization = {
        ...prev,
        ...updates,
        // Ensure nested objects are properly merged
        colors: { ...prev.colors, ...(updates.colors || {}) },
        assets: { ...prev.assets, ...(updates.assets || {}) },
        text: { ...prev.text, ...(updates.text || {}) },
      };
      
      return newCustomization;
    });
  };

  // Reset customization to defaults
  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  // Apply CSS variables for theme colors
  useEffect(() => {
    if (typeof window !== "undefined" && document.documentElement) {
      // Apply background colors
      if (customization.colors.bgWhite) {
        document.documentElement.style.setProperty('--bg-white', customization.colors.bgWhite);
      }
      if (customization.colors.bgBlack) {
        document.documentElement.style.setProperty('--bg-black', customization.colors.bgBlack);
      }
      if (customization.colors.bgGrey) {
        document.documentElement.style.setProperty('--bg-grey', customization.colors.bgGrey);
      }
      if (customization.colors.bgGreyLighter) {
        document.documentElement.style.setProperty('--bg-grey-lighter', customization.colors.bgGreyLighter);
      }
      if (customization.colors.bgGreyStrongest) {
        document.documentElement.style.setProperty('--bg-grey-strongest', customization.colors.bgGreyStrongest);
      }
      
      // Apply text colors
      if (customization.colors.textGreyStronger) {
        document.documentElement.style.setProperty('--text-grey-stronger', customization.colors.textGreyStronger);
      }
      if (customization.colors.textBlack) {
        document.documentElement.style.setProperty('--text-black', customization.colors.textBlack);
      }
      if (customization.colors.textWhite) {
        document.documentElement.style.setProperty('--text-white', customization.colors.textWhite);
      }
      if (customization.colors.textBluePrimary) {
        document.documentElement.style.setProperty('--text-blue-primary', customization.colors.textBluePrimary);
      }
      if (customization.colors.textBlue) {
        document.documentElement.style.setProperty('--text-blue', customization.colors.textBlue);
      }
      
      // Apply status colors
      if (customization.colors.statusIgnored) {
        document.documentElement.style.setProperty('--status-ignored-color', customization.colors.statusIgnored);
      }
      if (customization.colors.statusReshoot) {
        document.documentElement.style.setProperty('--status-reshoot-color', customization.colors.statusReshoot);
      }
      if (customization.colors.statusNotSelected) {
        document.documentElement.style.setProperty('--status-not-selected-color', customization.colors.statusNotSelected);
      }
      if (customization.colors.statusSelected) {
        document.documentElement.style.setProperty('--status-selected-color', customization.colors.statusSelected);
      }
      if (customization.colors.statusRefused) {
        document.documentElement.style.setProperty('--status-refused-color', customization.colors.statusRefused);
      }
      if (customization.colors.statusForApproval) {
        document.documentElement.style.setProperty('--status-for-approval-color', customization.colors.statusForApproval);
      }
      if (customization.colors.statusValidated) {
        document.documentElement.style.setProperty('--status-validated-color', customization.colors.statusValidated);
      }
      if (customization.colors.statusToPublish) {
        document.documentElement.style.setProperty('--status-to-publish-color', customization.colors.statusToPublish);
      }
      if (customization.colors.statusError) {
        document.documentElement.style.setProperty('--status-error-color', customization.colors.statusError);
      }
      if (customization.colors.statusPublished) {
        document.documentElement.style.setProperty('--status-published-color', customization.colors.statusPublished);
      }
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
