import React from 'react';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { useThemeValues } from '@/hooks/useThemeValues';
import ButtonStatus from '@/components/ButtonStatus';
import { MediaStatus } from '@/utils/mediaStatus';
import { Button } from '@/components/ui/button-default';
import { ButtonCircle } from '@/components/ui/button-circle';

const ColorSwatch = ({ color, name, value }: { color: string; name: string; value: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="color-swatch" 
        style={{ backgroundColor: value }}
        title={`${name}: ${value}`}
      />
      <span className="color-swatch-label">{name}</span>
    </div>
  );
};

const Index = () => {
  const { brandName, cssVars, isDarkMode, defaultColors } = useThemeValues();
  
  // Group colors by categories for display
  const backgroundColors = [
    { name: 'bg-white', value: 'var(--bg-white)' },
    { name: 'bg-black', value: 'var(--bg-black)' },
    { name: 'bg-grey', value: 'var(--bg-grey)' },
    { name: 'bg-grey-lighter', value: 'var(--bg-grey-lighter)' },
    { name: 'bg-grey-strongest', value: 'var(--bg-grey-strongest)' },
  ];
  
  const textColors = [
    { name: 'text-grey-stronger', value: 'var(--text-grey-stronger)' },
    { name: 'text-black', value: 'var(--text-black)' },
    { name: 'text-white', value: 'var(--text-white)' },
    { name: 'text-blue-primary', value: 'var(--text-blue-primary)' },
    { name: 'text-blue', value: 'var(--text-blue)' },
  ];
  
  const statusColors = [
    { name: 'status-ignored', value: 'var(--status-ignored-color)' },
    { name: 'status-reshoot', value: 'var(--status-reshoot-color)' },
    { name: 'status-not-selected', value: 'var(--status-not-selected-color)' },
    { name: 'status-selected', value: 'var(--status-selected-color)' },
    { name: 'status-refused', value: 'var(--status-refused-color)' },
    { name: 'status-for-approval', value: 'var(--status-for-approval-color)' },
    { name: 'status-validated', value: 'var(--status-validated-color)' },
    { name: 'status-to-publish', value: 'var(--status-to-publish-color)' },
    { name: 'status-error', value: 'var(--status-error-color)' },
    { name: 'status-published', value: 'var(--status-published-color)' },
  ];
  
  // Filter cssVars to only show those that differ from defaults
  const filteredCssVars: Record<string, string> = {};
  Object.entries(cssVars).forEach(([key, value]) => {
    // Extract color key from CSS variable name
    const colorKey = key.replace('--', '').replace('-color', '').replaceAll('-', '');
    const defaultKey = key.replace('--', '').replace('-color', '');
    
    // Check if this is a status color and transform the key accordingly
    const isStatusColor = key.includes('status-') && key.includes('-color');
    
    // Get the corresponding default color
    const defaultValue = isStatusColor 
      ? defaultColors[`status${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}` as keyof typeof defaultColors]
      : defaultColors[colorKey as keyof typeof defaultColors];
    
    // Only include the variable if it differs from the default
    if (value !== defaultValue) {
      filteredCssVars[key] = value;
    }
  });
  
  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={cssVars as React.CSSProperties}
    >
      <header className="bg-background border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{brandName}</h1>
        <ThemeCustomizer />
      </header>
      
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Theme Customization Demo</h2>
            <p className="text-muted-foreground">
              This page demonstrates the theme provider functionality. Use the customizer in the header to change colors and settings.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Example Components</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Button Component</h3>
                <div className="flex flex-wrap gap-4">
                  <Button background="white">White Button</Button>
                  <Button background="black">Black Button</Button>
                  <Button background="grey">Grey Button</Button>
                  <Button background="white" featured={true}>Featured Button</Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">ButtonCircle Component</h3>
                <div className="flex flex-wrap gap-4">
                  <ButtonCircle icon="Plus" />
                  <ButtonCircle icon="Check" />
                  <ButtonCircle icon="Bell" />
                  <ButtonCircle background="black" icon="Tag" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Size Variations</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="small" background="white">Small Button</Button>
                  <Button background="white">Default Button</Button>
                  <ButtonCircle size="small" icon="Plus" />
                  <ButtonCircle icon="Plus" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">With Indicators</h3>
                <div className="flex flex-wrap gap-4">
                  <Button indicator={true} background="white">Button with Indicator</Button>
                  <ButtonCircle indicator={true} icon="Bell" />
                </div>
              </div>
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Status Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <ButtonStatus status={MediaStatus.SUBMITTED_FOR_APPROVAL} icon="Check" />
              <ButtonStatus status={MediaStatus.VALIDATED} icon="Check" />
              <ButtonStatus status={MediaStatus.SELECTED} icon="Check" />
              <ButtonStatus status={MediaStatus.ERROR_DURING_BROADCAST} icon="X" />
            </div>
          </section>
          
          <section className="space-y-6 p-6 rounded-md bg-card border">
            <h2 className="text-xl font-semibold">Theme Colors Preview</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Background Colors</h3>
              <div className="theme-colors-grid">
                {backgroundColors.map((color) => (
                  <ColorSwatch 
                    key={color.name} 
                    color={color.name} 
                    name={color.name} 
                    value={color.value}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Text Colors</h3>
              <div className="theme-colors-grid">
                {textColors.map((color) => (
                  <ColorSwatch 
                    key={color.name} 
                    color={color.name} 
                    name={color.name} 
                    value={color.value}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status Colors</h3>
              <div className="theme-colors-grid">
                {statusColors.map((color) => (
                  <ColorSwatch 
                    key={color.name} 
                    color={color.name} 
                    name={color.name} 
                    value={color.value}
                  />
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Current Theme Settings</h3>
              <div className="text-sm">
                <p><strong>Mode:</strong> {isDarkMode ? 'Dark' : 'Light'}</p>
                <p><strong>Brand Name:</strong> {brandName}</p>
                <div className="mt-2">
                  <p><strong>Custom CSS Variables:</strong> {Object.keys(filteredCssVars).length === 0 && 'None (using defaults)'}</p>
                  {Object.keys(filteredCssVars).length > 0 && (
                    <pre className="bg-muted p-2 mt-1 rounded text-xs overflow-auto">
                      {JSON.stringify(filteredCssVars, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        {brandName} Theme Provider Demo &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
