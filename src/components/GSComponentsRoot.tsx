import React from 'react';
import { ThemeProvider, ThemeProviderProps } from '@/contexts/ThemeContext';
import { TranslationProvider, TranslationProviderProps } from '@/contexts/TranslationContext';
import { StyleProvider, StyleConfig } from '@/contexts/StyleProvider';

export interface GSComponentsRootProps {
  children: React.ReactNode;

  /**
   * Style configuration
   */
  styleConfig?: StyleConfig;

  /**
   * Theme provider props
   */
  themeConfig?: Omit<ThemeProviderProps, 'children'>;

  /**
   * Translation provider props
   */
  translationConfig?: Omit<TranslationProviderProps, 'children'>;

  /**
   * Whether to wrap with providers
   * Set to false if you want to use providers separately
   * @default true
   */
  withProviders?: boolean;
}

/**
 * Root component that sets up all necessary providers and styles for GS Components
 *
 * Usage for entire app:
 * ```tsx
 * <GSComponentsRoot
 *   styleConfig={{ applyGlobalStyles: true }}
 *   translationConfig={{ defaultLanguage: 'FR' }}
 * >
 *   <App />
 * </GSComponentsRoot>
 * ```
 *
 * Usage for components only:
 * ```tsx
 * <GSComponentsRoot styleConfig={{ applyGlobalStyles: false }}>
 *   <FileBrowser {...props} />
 * </GSComponentsRoot>
 * ```
 */
export const GSComponentsRoot: React.FC<GSComponentsRootProps> = ({
  children,
  styleConfig,
  themeConfig,
  translationConfig,
  withProviders = true,
}) => {
  if (!withProviders) {
    return <>{children}</>;
  }

  return (
    <StyleProvider config={styleConfig}>
      <ThemeProvider {...themeConfig}>
        <TranslationProvider {...translationConfig}>
          {children}
        </TranslationProvider>
      </ThemeProvider>
    </StyleProvider>
  );
};

/**
 * Convenience wrapper for applying GS styles globally to an existing app
 * without using the full provider system
 */
export const GSGlobalStyles: React.FC<{ config?: StyleConfig }> = ({ config }) => {
  React.useEffect(() => {
    const mergedConfig = {
      applyGlobalStyles: true,
      loadFonts: true,
      ...config,
    };

    // Apply font class to body
    if (mergedConfig.loadFonts) {
      document.body.classList.add('gs-font-base');
    }

    // Apply global styles
    if (mergedConfig.applyGlobalStyles) {
      document.body.classList.add('gs-global-styles');
    }

    // Apply custom font
    if (mergedConfig.customFontFamily) {
      document.documentElement.style.setProperty(
        '--gs-font-sans',
        mergedConfig.customFontFamily
      );
    }

    return () => {
      document.body.classList.remove('gs-font-base', 'gs-global-styles');
    };
  }, [config]);

  return null;
};