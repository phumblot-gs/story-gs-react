
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

// Define the theme customization options
export interface ThemeCustomization {
  // Brand colors (can be extended based on needs)
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
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
    // Use existing theme colors as defaults
    primary: undefined,
    secondary: undefined,
    accent: undefined,
    background: undefined,
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
      // Apply custom colors as CSS variables if defined
      Object.entries(customization.colors).forEach(([key, value]) => {
        if (value) {
          document.documentElement.style.setProperty(`--custom-${key}`, value);
        } else {
          document.documentElement.style.removeProperty(`--custom-${key}`);
        }
      });
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
