import React, { createContext, useContext, useEffect, useState } from 'react';
import '../styles/fonts.css';
import '../styles/figma-tokens.css';
import '../styles/theme-variables.css';

export interface StyleConfig {
  /**
   * Apply GS styles globally to the entire app
   * @default false
   */
  applyGlobalStyles?: boolean;

  /**
   * Custom font family to use instead of AvenirNextLTPro
   * Can be a CSS font-family string
   */
  customFontFamily?: string;

  /**
   * Enable font loading from the library
   * Set to false if you want to use your own fonts
   * @default true
   */
  loadFonts?: boolean;

  /**
   * Custom CSS variables to override theme
   */
  cssVariables?: Record<string, string>;

  /**
   * Additional className to apply to the root element
   */
  rootClassName?: string;

  /**
   * Prefix for component classes to avoid conflicts
   * @default 'gs'
   */
  classPrefix?: string;
}

interface StyleContextType {
  config: StyleConfig;
  updateConfig: (config: Partial<StyleConfig>) => void;
  applyStyles: (element?: HTMLElement) => void;
  removeStyles: (element?: HTMLElement) => void;
}

const defaultConfig: StyleConfig = {
  applyGlobalStyles: false,
  loadFonts: true,
  classPrefix: 'gs',
};

const StyleContext = createContext<StyleContextType>({
  config: defaultConfig,
  updateConfig: () => {},
  applyStyles: () => {},
  removeStyles: () => {},
});

export const useStyles = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyles must be used within a StyleProvider');
  }
  return context;
};

interface StyleProviderProps {
  children: React.ReactNode;
  config?: StyleConfig;
}

export const StyleProvider: React.FC<StyleProviderProps> = ({
  children,
  config: initialConfig = {}
}) => {
  const [config, setConfig] = useState<StyleConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  // Apply custom font family
  useEffect(() => {
    if (config.customFontFamily) {
      document.documentElement.style.setProperty(
        '--gs-font-sans',
        config.customFontFamily
      );
    }
  }, [config.customFontFamily]);

  // Apply custom CSS variables
  useEffect(() => {
    if (config.cssVariables) {
      Object.entries(config.cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [config.cssVariables]);

  // Apply global styles if requested
  useEffect(() => {
    if (config.applyGlobalStyles) {
      applyStyles(document.body);
    } else {
      removeStyles(document.body);
    }

    return () => {
      if (config.applyGlobalStyles) {
        removeStyles(document.body);
      }
    };
  }, [config.applyGlobalStyles]);

  const applyStyles = (element: HTMLElement = document.body) => {
    // Apply font styles
    if (config.loadFonts) {
      element.classList.add('gs-font-base');
    }

    // Apply global styles if requested
    if (config.applyGlobalStyles) {
      element.classList.add('gs-global-styles');
    }

    // Apply custom root class
    if (config.rootClassName) {
      element.classList.add(config.rootClassName);
    }
  };

  const removeStyles = (element: HTMLElement = document.body) => {
    element.classList.remove('gs-font-base', 'gs-global-styles');
    if (config.rootClassName) {
      element.classList.remove(config.rootClassName);
    }
  };

  const updateConfig = (updates: Partial<StyleConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <StyleContext.Provider value={{
      config,
      updateConfig,
      applyStyles,
      removeStyles,
    }}>
      <div className={`${config.classPrefix}-components`}>
        {children}
      </div>
    </StyleContext.Provider>
  );
};

/**
 * Hook to inject GS styles into any component or app
 * Usage:
 * ```tsx
 * const MyApp = () => {
 *   useGlobalStyles({ applyGlobalStyles: true });
 *   return <div>...</div>
 * }
 * ```
 */
export const useGlobalStyles = (config?: Partial<StyleConfig>) => {
  useEffect(() => {
    const mergedConfig = { ...defaultConfig, ...config };

    // Create temporary style element for font loading
    if (mergedConfig.loadFonts) {
      const styleId = 'gs-fonts-loader';
      if (!document.getElementById(styleId)) {
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = '/fonts.css'; // This will need to be adjusted based on deployment
        document.head.appendChild(link);
      }
    }

    // Apply styles to body or root
    const target = mergedConfig.applyGlobalStyles ? document.body : null;
    if (target) {
      target.classList.add('gs-font-base');
      if (mergedConfig.applyGlobalStyles) {
        target.classList.add('gs-global-styles');
      }
    }

    // Apply custom font
    if (mergedConfig.customFontFamily) {
      document.documentElement.style.setProperty(
        '--gs-font-sans',
        mergedConfig.customFontFamily
      );
    }

    // Apply custom CSS variables
    if (mergedConfig.cssVariables) {
      Object.entries(mergedConfig.cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }

    // Cleanup
    return () => {
      if (target) {
        target.classList.remove('gs-font-base', 'gs-global-styles');
      }
    };
  }, [config]);
};