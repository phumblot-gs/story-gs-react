
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { useThemeValues } from '@/hooks/useThemeValues';
import { Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ThemeCustomizerProps {
  className?: string;
}

// Default theme colors to pre-populate inputs
const defaultThemeColors = {
  // Background colors
  bgWhite: '#FFFFFF',
  bgBlack: '#000000',
  bgGrey: '#8E9196',
  bgGreyLighter: '#E5E7EB',
  bgGreyStrongest: '#1A1F2C',
  
  // Text colors
  textGreyStronger: '#4B5563',
  textBlack: '#000000',
  textWhite: '#FFFFFF',
  textBluePrimary: '#1EAEDB',
  textBlue: '#3B82F6',
  
  // Status colors
  statusIgnored: '#8E9196',
  statusReshoot: '#F59E0B',
  statusNotSelected: '#6B7280',
  statusSelected: '#10B981',
  statusRefused: '#EF4444',
  statusForApproval: '#9b87f5',
  statusValidated: '#34D399',
  statusToPublish: '#3B82F6',
  statusError: '#ea384c',
  statusPublished: '#8B5CF6',
};

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  className
}) => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const { defaultColors } = useThemeValues();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for color previews only - doesn't affect input values
  const [colorPreviews, setColorPreviews] = useState<Record<string, string>>({});
  
  // Use a ref object to store form values, preventing re-renders on every keystroke
  const formValuesRef = useRef<Record<string, string>>({});
  
  // Initialize form values when the popover opens
  useEffect(() => {
    if (isOpen) {
      // Initialize with current customization values or defaults
      const initialValues: Record<string, string> = {
        brandName: customization.text.brandName || 'GS Components',
      };
      
      // Add color values
      Object.keys(defaultColors).forEach(key => {
        const typedKey = key as keyof typeof defaultColors;
        const customValue = customization.colors[typedKey as keyof typeof customization.colors];
        initialValues[key] = customValue || defaultColors[typedKey] || '';
      });
      
      formValuesRef.current = initialValues;
      setColorPreviews({...initialValues});
    }
  }, [isOpen, customization, defaultColors]);

  // Handle input change without triggering re-renders
  const handleInputChange = useCallback((key: string, value: string) => {
    // Update the ref immediately (no re-render)
    formValuesRef.current[key] = value;
    
    // Only update preview state (which causes re-render) for color values that need visual feedback
    if (key !== 'brandName') {
      setColorPreviews(prev => ({
        ...prev,
        [key]: value
      }));
    }
  }, []);
  
  // Apply changes from ref state to theme context
  const applyChanges = useCallback(() => {
    const updates = {
      colors: {} as any,
      text: {
        brandName: formValuesRef.current.brandName !== 'GS Components' ? formValuesRef.current.brandName : undefined,
      }
    };
    
    // Add only color values that differ from defaults
    Object.entries(formValuesRef.current).forEach(([key, value]) => {
      if (key === 'brandName') return; // Skip brandName, it's handled separately
      
      const defaultValue = defaultColors[key as keyof typeof defaultColors];
      if (value !== defaultValue && value !== '') {
        updates.colors[key] = value;
      }
    });
    
    updateCustomization(updates);
    setIsOpen(false);
  }, [updateCustomization, defaultColors]);
  
  // Reset handler
  const handleReset = useCallback(() => {
    resetCustomization();
    setIsOpen(false);
  }, [resetCustomization]);
  
  // Color input component to reduce repetition - now using uncontrolled inputs with keys
  const ColorInput = ({ label, colorKey }: { label: string; colorKey: string }) => {
    const defaultValue = defaultColors[colorKey as keyof typeof defaultColors] || '';
    const currentValue = formValuesRef.current[colorKey] || defaultValue;
    const previewColor = colorPreviews[colorKey] || defaultValue;
    
    // Create a stable unique key that includes the initial value but doesn't change during typing
    const inputKey = `${colorKey}-${isOpen ? 'open' : 'closed'}`;
    
    return (
      <div className="space-y-1">
        <Label className="text-xs">{label}</Label>
        <div className="flex gap-2 items-center">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: previewColor }}
          />
          <Input
            key={inputKey}
            type="text"
            name={colorKey}
            defaultValue={currentValue}
            onChange={(e) => handleInputChange(colorKey, e.target.value)}
            className="h-6 text-xs"
          />
          {currentValue !== defaultValue && currentValue !== '' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 p-0" 
              onClick={() => {
                handleInputChange(colorKey, '');
                setColorPreviews(prev => ({
                  ...prev,
                  [colorKey]: ''
                }));
              }}
              title="Reset to default"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    );
  };
  
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
        <PopoverContent className="w-96 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Customize Theme</h4>
            
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                key={`brandName-${isOpen ? 'open' : 'closed'}`}
                id="brand-name"
                type="text"
                name="brandName"
                defaultValue={customization.text.brandName || 'GS Components'}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="background">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              
              <TabsContent value="background" className="space-y-3">
                <ColorInput label="bg-white" colorKey="bgWhite" />
                <ColorInput label="bg-black" colorKey="bgBlack" />
                <ColorInput label="bg-grey" colorKey="bgGrey" />
                <ColorInput label="bg-grey-lighter" colorKey="bgGreyLighter" />
                <ColorInput label="bg-grey-strongest" colorKey="bgGreyStrongest" />
              </TabsContent>
              
              <TabsContent value="text" className="space-y-3">
                <ColorInput label="text-grey-stronger" colorKey="textGreyStronger" />
                <ColorInput label="text-black" colorKey="textBlack" />
                <ColorInput label="text-white" colorKey="textWhite" />
                <ColorInput label="text-blue-primary" colorKey="textBluePrimary" />
                <ColorInput label="text-blue" colorKey="textBlue" />
              </TabsContent>
              
              <TabsContent value="status" className="space-y-3">
                <ColorInput label="status-ignored" colorKey="statusIgnored" />
                <ColorInput label="status-reshoot" colorKey="statusReshoot" />
                <ColorInput label="status-not-selected" colorKey="statusNotSelected" />
                <ColorInput label="status-selected" colorKey="statusSelected" />
                <ColorInput label="status-refused" colorKey="statusRefused" />
                <ColorInput label="status-for-approval" colorKey="statusForApproval" />
                <ColorInput label="status-validated" colorKey="statusValidated" />
                <ColorInput label="status-to-publish" colorKey="statusToPublish" />
                <ColorInput label="status-error" colorKey="statusError" />
                <ColorInput label="status-published" colorKey="statusPublished" />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
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
