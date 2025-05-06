
import React from 'react';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { useThemeValues } from '@/hooks/useThemeValues';
import ButtonStatus from '@/components/ButtonStatus';
import { MediaStatus } from '@/utils/mediaStatus';
import { Button } from '@/components/ui/button-default';
import { ButtonCircle } from '@/components/ui/button-circle';

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
