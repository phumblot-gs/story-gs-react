/**
 * Type validation test file
 * This file tests that all types are properly exported from the library
 */

import {
  // Components
  Button,
  FileBrowser,
  FolderBrowser,
  ModalLayer,
  Select,
  LanguageSwitcher,

  // Providers
  ThemeProvider,
  TranslationProvider,

  // Hooks
  useCustomTheme,
  useTranslation,

  // Types
  ButtonProps,
  FileBrowserProps,
  FolderBrowserProps,
  ModalLayerProps,
  ThemeCustomization,
  ThemeProviderProps,
  TranslationProviderProps,
  TranslationLanguage,
  FileItem,
  FolderItem,
  IconName,
} from './index';

// Type tests - these will fail at compile time if types are wrong
const buttonTest: ButtonProps = {
  children: 'Test',
  onClick: () => {},
  size: 'large',
};

const fileTest: FileItem = {
  id: '1',
  file_name: 'test.txt',
  parent_path: '/',
  file_size: 100,
  mime_type: 'text/plain',
  is_directory: false,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const themeTest: ThemeCustomization = {
  colors: {
    bgWhite: '#FFFFFF',
    textBlack: '#000000',
    statusError: '#FF0000',
  },
  assets: {
    logo: '<svg>...</svg>',
  },
  text: {
    brandName: 'Test Brand',
  },
};

// Test that language type works
const languageTest: TranslationLanguage = { code: 'FR', name: 'Français' };

// Test that icon names are exported
const iconTest: IconName = 'File';

// Function type tests
const testHooksAvailable = () => {
  // These would fail at runtime but we're testing they compile
  const theme = typeof useCustomTheme;
  const translation = typeof useTranslation;

  return theme === 'function' && translation === 'function';
};

// Component type tests
const testComponentsAvailable = () => {
  return (
    typeof Button === 'function' &&
    typeof FileBrowser === 'function' &&
    typeof FolderBrowser === 'function' &&
    typeof ThemeProvider === 'function' &&
    typeof TranslationProvider === 'function'
  );
};

// Export test results
export const typeTestResults = {
  buttonProps: buttonTest,
  fileItem: fileTest,
  themeCustomization: themeTest,
  language: languageTest,
  icon: iconTest,
  hooksAvailable: testHooksAvailable(),
  componentsAvailable: testComponentsAvailable(),
};

console.log('✅ All type tests compiled successfully!');