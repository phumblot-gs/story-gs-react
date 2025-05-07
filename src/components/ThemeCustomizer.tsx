
import React, { useState, useEffect, useRef } from 'react';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { useThemeValues, normalizeColorValue } from '@/hooks/useThemeValues';
import { Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ColorInput from './ColorInput';

interface ThemeCustomizerProps {
  className?: string;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  className
}) => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const { defaultColors } = useThemeValues();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use state instead of ref to track form values and ensure re-renders
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  
  // Initialize form values when component mounts or customization changes
  useEffect(() => {
    // Initialize with current customization values or defaults
    const initialValues: Record<string, string> = {
      brandName: customization.text.brandName || 'GS Components',
    };
    
    // Add color values
    Object.keys(defaultColors).forEach(key => {
      const typedKey = key as keyof typeof defaultColors;
      // First check if we have a custom color
      const customValue = customization.colors[typedKey as keyof typeof customization.colors];
      // Use the custom value if it exists, otherwise use the default
      initialValues[key] = customValue || defaultColors[typedKey] || '';
    });
    
    setFormValues(initialValues);
  }, [customization, defaultColors]);

  // Handle input change with state update
  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Apply changes from state to theme context
  const applyChanges = () => {
    const updates = {
      colors: {} as any,
      text: {
        brandName: formValues.brandName !== 'GS Components' ? formValues.brandName : undefined,
      }
    };
    
    // Add only color values that differ from defaults using normalized comparison
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'brandName') return; // Skip brandName, it's handled separately
      
      const defaultValue = defaultColors[key as keyof typeof defaultColors];
      
      if (normalizeColorValue(value) !== normalizeColorValue(defaultValue) && normalizeColorValue(value) !== '') {
        updates.colors[key] = value;
      }
    });
    
    updateCustomization(updates);
    setIsOpen(false);
  };
  
  // Reset handler
  const handleReset = () => {
    resetCustomization();
    // Reset form values to defaults
    const defaultValues: Record<string, string> = {
      brandName: 'GS Components',
    };
    
    Object.keys(defaultColors).forEach(key => {
      const typedKey = key as keyof typeof defaultColors;
      defaultValues[key] = defaultColors[typedKey] || '';
    });
    
    setFormValues(defaultValues);
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
                id="brand-name"
                type="text"
                value={formValues.brandName || ''}
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
                <ColorInput 
                  label="bg-white" 
                  colorKey="bgWhite" 
                  defaultValue={defaultColors.bgWhite}
                  value={formValues.bgWhite || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="bg-black" 
                  colorKey="bgBlack" 
                  defaultValue={defaultColors.bgBlack}
                  value={formValues.bgBlack || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="bg-grey" 
                  colorKey="bgGrey" 
                  defaultValue={defaultColors.bgGrey}
                  value={formValues.bgGrey || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="bg-grey-lighter" 
                  colorKey="bgGreyLighter" 
                  defaultValue={defaultColors.bgGreyLighter}
                  value={formValues.bgGreyLighter || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="bg-grey-strongest" 
                  colorKey="bgGreyStrongest" 
                  defaultValue={defaultColors.bgGreyStrongest}
                  value={formValues.bgGreyStrongest || ''}
                  onChange={handleInputChange} 
                />
              </TabsContent>
              
              <TabsContent value="text" className="space-y-3">
                <ColorInput 
                  label="text-grey-stronger" 
                  colorKey="textGreyStronger" 
                  defaultValue={defaultColors.textGreyStronger}
                  value={formValues.textGreyStronger || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="text-black" 
                  colorKey="textBlack" 
                  defaultValue={defaultColors.textBlack}
                  value={formValues.textBlack || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="text-white" 
                  colorKey="textWhite" 
                  defaultValue={defaultColors.textWhite}
                  value={formValues.textWhite || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="text-blue-primary" 
                  colorKey="textBluePrimary" 
                  defaultValue={defaultColors.textBluePrimary}
                  value={formValues.textBluePrimary || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="text-blue" 
                  colorKey="textBlue" 
                  defaultValue={defaultColors.textBlue}
                  value={formValues.textBlue || ''}
                  onChange={handleInputChange} 
                />
              </TabsContent>
              
              <TabsContent value="status" className="space-y-3">
                <ColorInput 
                  label="status-ignored" 
                  colorKey="statusIgnored" 
                  defaultValue={defaultColors.statusIgnored}
                  value={formValues.statusIgnored || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-reshoot" 
                  colorKey="statusReshoot" 
                  defaultValue={defaultColors.statusReshoot}
                  value={formValues.statusReshoot || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-not-selected" 
                  colorKey="statusNotSelected" 
                  defaultValue={defaultColors.statusNotSelected}
                  value={formValues.statusNotSelected || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-selected" 
                  colorKey="statusSelected" 
                  defaultValue={defaultColors.statusSelected}
                  value={formValues.statusSelected || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-refused" 
                  colorKey="statusRefused" 
                  defaultValue={defaultColors.statusRefused}
                  value={formValues.statusRefused || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-for-approval" 
                  colorKey="statusForApproval" 
                  defaultValue={defaultColors.statusForApproval}
                  value={formValues.statusForApproval || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-validated" 
                  colorKey="statusValidated" 
                  defaultValue={defaultColors.statusValidated}
                  value={formValues.statusValidated || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-to-publish" 
                  colorKey="statusToPublish" 
                  defaultValue={defaultColors.statusToPublish}
                  value={formValues.statusToPublish || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-error" 
                  colorKey="statusError" 
                  defaultValue={defaultColors.statusError}
                  value={formValues.statusError || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="status-published" 
                  colorKey="statusPublished" 
                  defaultValue={defaultColors.statusPublished}
                  value={formValues.statusPublished || ''}
                  onChange={handleInputChange} 
                />
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
