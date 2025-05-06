
import React, { useState } from 'react';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { hexToHSLString } from '@/utils/colorUtils';
import { Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ThemeCustomizerProps {
  className?: string;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  className
}) => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for form inputs
  const [primaryColor, setPrimaryColor] = useState(customization.colors.primary || '');
  const [secondaryColor, setSecondaryColor] = useState(customization.colors.secondary || '');
  const [accentColor, setAccentColor] = useState(customization.colors.accent || '');
  const [brandName, setBrandName] = useState(customization.text.brandName || '');
  
  // Apply changes from local state to theme context
  const applyChanges = () => {
    updateCustomization({
      colors: {
        primary: primaryColor || undefined,
        secondary: secondaryColor || undefined,
        accent: accentColor || undefined,
      },
      text: {
        brandName: brandName || undefined,
      }
    });
    setIsOpen(false);
  };
  
  // Reset local state when popover opens
  React.useEffect(() => {
    if (isOpen) {
      setPrimaryColor(customization.colors.primary || '');
      setSecondaryColor(customization.colors.secondary || '');
      setAccentColor(customization.colors.accent || '');
      setBrandName(customization.text.brandName || '');
    }
  }, [isOpen, customization]);
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Theme mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      
      {/* Theme customizer */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Customize theme">
            <Palette className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Customize Theme</h4>
            
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: primaryColor || 'transparent' }}
                />
                <Input
                  id="primary-color"
                  type="text"
                  placeholder="#000000"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: secondaryColor || 'transparent' }}
                />
                <Input
                  id="secondary-color"
                  type="text"
                  placeholder="#000000"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: accentColor || 'transparent' }}
                />
                <Input
                  id="accent-color"
                  type="text"
                  placeholder="#000000"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                type="text"
                placeholder="GS Components"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => {
                resetCustomization();
                setIsOpen(false);
              }}>
                Reset
              </Button>
              <Button onClick={applyChanges}>Apply</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeCustomizer;
