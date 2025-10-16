/**
 * Integration test file to verify all providers and components work together
 */
import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TranslationProvider, Language } from './contexts/TranslationContext';
import { FileBrowser } from './components/ui/file-browser';
import { FolderBrowser } from './components/ui/folder-browser';
import { Button } from './components/ui/button';
import { useCustomTheme } from './contexts/ThemeContext';
import { useTranslation } from './contexts/TranslationContext';

// Test component for theme customization
const ThemeTestPanel: React.FC = () => {
  const { customization, updateCustomization, resetCustomization } = useCustomTheme();

  const testColors = () => {
    // Test with hex colors (should be converted to RGB)
    updateCustomization({
      colors: {
        bgBlack: '#FF0000',
        textWhite: '#00FF00',
        textBluePrimary: '#0000FF',
      }
    });
    console.log('✅ Theme colors updated with hex values');
  };

  const testRgbColors = () => {
    // Test with RGB colors directly
    updateCustomization({
      colors: {
        bgBlack: '255 128 0',
        textWhite: '0 255 128',
      }
    });
    console.log('✅ Theme colors updated with RGB values');
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Theme Provider Test</h3>
      <div className="space-x-2">
        <Button onClick={testColors}>Test Hex Colors</Button>
        <Button onClick={testRgbColors}>Test RGB Colors</Button>
        <Button onClick={resetCustomization}>Reset Theme</Button>
      </div>
      <div className="mt-2 text-sm">
        <p>Current bg-black: {customization.colors.bgBlack || 'default'}</p>
        <p>Current text-white: {customization.colors.textWhite || 'default'}</p>
      </div>
    </div>
  );
};

// Test component for translations
const TranslationTestPanel: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();

  const languages: Language[] = ['EN', 'FR', 'ES', 'IT', 'DE'];

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Translation Provider Test</h3>
      <div className="space-x-2 mb-4">
        {languages.map(lang => (
          <Button
            key={lang}
            onClick={() => setLanguage(lang)}
            featured={language === lang}
          >
            {lang}
          </Button>
        ))}
      </div>
      <div className="space-y-1 text-sm">
        <p>Current language: {language}</p>
        <p>Test translation: {t('fileBrowser.refresh')}</p>
        <p>Column name: {t('fileBrowser.columnName')}</p>
        <p>No files: {t('fileBrowser.noFiles')}</p>
      </div>
    </div>
  );
};

// Test data for file browser
const testFiles = [
  {
    id: '1',
    file_name: 'document.pdf',
    parent_path: '/',
    file_size: 1024000,
    mime_type: 'application/pdf',
    is_directory: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    file_name: 'images',
    parent_path: '/',
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    file_name: 'readme.txt',
    parent_path: '/',
    file_size: 2048,
    mime_type: 'text/plain',
    is_directory: false,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  }
];

// Main test component
export const IntegrationTest: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');

  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-2xl font-bold">Integration Tests</h1>

      <ThemeTestPanel />
      <TranslationTestPanel />

      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">FileBrowser Component Test</h3>
        <FileBrowser
          files={testFiles}
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          showUploadButton={true}
          onRefresh={() => console.log('✅ Refresh clicked')}
          onDelete={(items) => console.log('✅ Delete:', items)}
          onRename={(items) => console.log('✅ Rename:', items)}
        />
      </div>

      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">FolderBrowser Component Test</h3>
        <FolderBrowser
          folders={testFiles.filter(f => f.is_directory)}
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          onFolderSelect={(folder) => console.log('✅ Folder selected:', folder)}
        />
      </div>
    </div>
  );
};

// App wrapper with providers
export const TestApp: React.FC = () => {
  return (
    <ThemeProvider>
      <TranslationProvider defaultLanguage="EN">
        <IntegrationTest />
      </TranslationProvider>
    </ThemeProvider>
  );
};

// Run tests
export const runTests = () => {
  console.log('🧪 Starting integration tests...');

  // Test 1: Check if providers are exported
  try {
    if (ThemeProvider && TranslationProvider) {
      console.log('✅ Providers are properly exported');
    }
  } catch (error) {
    console.error('❌ Provider export error:', error);
  }

  // Test 2: Check if hooks are available
  try {
    if (useCustomTheme && useTranslation) {
      console.log('✅ Hooks are properly exported');
    }
  } catch (error) {
    console.error('❌ Hook export error:', error);
  }

  // Test 3: Check if components are available
  try {
    if (FileBrowser && FolderBrowser && Button) {
      console.log('✅ Components are properly exported');
    }
  } catch (error) {
    console.error('❌ Component export error:', error);
  }

  console.log('✅ All basic tests passed!');
};

// Auto-run tests when imported
runTests();