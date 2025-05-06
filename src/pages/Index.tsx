
import React from 'react';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { useThemeValues } from '@/hooks/useThemeValues';
import ButtonStatus from '@/components/ButtonStatus';
import { MediaStatus } from '@/utils/mediaStatus';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { brandName, cssVars, isDarkMode } = useThemeValues();
  
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
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Status Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <ButtonStatus status={MediaStatus.yellow} icon="Check" />
              <ButtonStatus status={MediaStatus.green} icon="Check" />
              <ButtonStatus status={MediaStatus.blue} icon="Check" />
              <ButtonStatus status={MediaStatus.red} icon="X" />
            </div>
          </section>
          
          <section className="p-4 rounded-md bg-card border">
            <h3 className="text-lg font-medium mb-2">Current Theme Settings</h3>
            <div className="text-sm">
              <p><strong>Mode:</strong> {isDarkMode ? 'Dark' : 'Light'}</p>
              <p><strong>Brand Name:</strong> {brandName}</p>
              <div className="mt-2">
                <p><strong>Custom Colors:</strong></p>
                <pre className="bg-muted p-2 mt-1 rounded text-xs overflow-auto">
                  {JSON.stringify(cssVars, null, 2)}
                </pre>
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
