
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Use a ref object to store form values, preventing re-renders on every keystroke
  const formValuesRef = useRef({
    // Brand name
    brandName: customization.text.brandName || 'GS Components',
    
    // Background colors
    bgWhite: customization.colors.bgWhite || defaultColors.bgWhite,
    bgBlack: customization.colors.bgBlack || defaultColors.bgBlack,
    bgGrey: customization.colors.bgGrey || defaultColors.bgGrey,
    bgGreyLighter: customization.colors.bgGreyLighter || defaultColors.bgGreyLighter,
    bgGreyStrongest: customization.colors.bgGreyStrongest || defaultColors.bgGreyStrongest,
    
    // Text colors
    textGreyStronger: customization.colors.textGreyStronger || defaultColors.textGreyStronger,
    textBlack: customization.colors.textBlack || defaultColors.textBlack,
    textWhite: customization.colors.textWhite || defaultColors.textWhite,
    textBluePrimary: customization.colors.textBluePrimary || defaultColors.textBluePrimary,
    textBlue: customization.colors.textBlue || defaultColors.textBlue,
    
    // Status colors
    statusIgnored: customization.colors.statusIgnored || defaultColors.statusIgnored,
    statusReshoot: customization.colors.statusReshoot || defaultColors.statusReshoot,
    statusNotSelected: customization.colors.statusNotSelected || defaultColors.statusNotSelected,
    statusSelected: customization.colors.statusSelected || defaultColors.statusSelected,
    statusRefused: customization.colors.statusRefused || defaultColors.statusRefused,
    statusForApproval: customization.colors.statusForApproval || defaultColors.statusForApproval,
    statusValidated: customization.colors.statusValidated || defaultColors.statusValidated,
    statusToPublish: customization.colors.statusToPublish || defaultColors.statusToPublish,
    statusError: customization.colors.statusError || defaultColors.statusError,
    statusPublished: customization.colors.statusPublished || defaultColors.statusPublished,
  });
  
  // Local state for UI rendering - we'll update this less frequently
  const [formValues, setFormValues] = useState(formValuesRef.current);
  
  // Handle input change without losing focus by updating the ref without triggering re-render
  const handleInputChange = (key: string, value: string) => {
    // Update the ref immediately (no re-render)
    formValuesRef.current = {
      ...formValuesRef.current,
      [key]: value
    };
  };
  
  // Apply changes from ref state to theme context
  const applyChanges = () => {
    // First, update the local state for UI rendering
    setFormValues({...formValuesRef.current});
    
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
  };
  
  // Reset local state when popover opens to match current theme
  useEffect(() => {
    if (isOpen) {
      const newValues = {
        // Brand name
        brandName: customization.text.brandName || 'GS Components',
        
        // Background colors
        bgWhite: customization.colors.bgWhite || defaultColors.bgWhite,
        bgBlack: customization.colors.bgBlack || defaultColors.bgBlack,
        bgGrey: customization.colors.bgGrey || defaultColors.bgGrey,
        bgGreyLighter: customization.colors.bgGreyLighter || defaultColors.bgGreyLighter,
        bgGreyStrongest: customization.colors.bgGreyStrongest || defaultColors.bgGreyStrongest,
        
        // Text colors
        textGreyStronger: customization.colors.textGreyStronger || defaultColors.textGreyStronger,
        textBlack: customization.colors.textBlack || defaultColors.textBlack,
        textWhite: customization.colors.textWhite || defaultColors.textWhite,
        textBluePrimary: customization.colors.textBluePrimary || defaultColors.textBluePrimary,
        textBlue: customization.colors.textBlue || defaultColors.textBlue,
        
        // Status colors
        statusIgnored: customization.colors.statusIgnored || defaultColors.statusIgnored,
        statusReshoot: customization.colors.statusReshoot || defaultColors.statusReshoot,
        statusNotSelected: customization.colors.statusNotSelected || defaultColors.statusNotSelected,
        statusSelected: customization.colors.statusSelected || defaultColors.statusSelected,
        statusRefused: customization.colors.statusRefused || defaultColors.statusRefused,
        statusForApproval: customization.colors.statusForApproval || defaultColors.statusForApproval,
        statusValidated: customization.colors.statusValidated || defaultColors.statusValidated,
        statusToPublish: customization.colors.statusToPublish || defaultColors.statusToPublish,
        statusError: customization.colors.statusError || defaultColors.statusError,
        statusPublished: customization.colors.statusPublished || defaultColors.statusPublished,
      };
      formValuesRef.current = newValues;
      setFormValues(newValues);
    }
  }, [isOpen, customization, defaultColors]);
  
  // Color input component to reduce repetition
  const ColorInput = ({ label, colorKey }: { label: string; colorKey: string }) => {
    const defaultValue = defaultColors[colorKey as keyof typeof defaultColors] || '';
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
      <div className="space-y-1">
        <Label className="text-xs">{label}</Label>
        <div className="flex gap-2 items-center">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: formValuesRef.current[colorKey as keyof typeof formValuesRef.current] || defaultValue }}
          />
          <Input
            ref={inputRef}
            type="text"
            placeholder={defaultValue}
            defaultValue={formValuesRef.current[colorKey as keyof typeof formValuesRef.current]}
            onChange={(e) => handleInputChange(colorKey, e.target.value)}
            className="h-6 text-xs"
          />
          {formValuesRef.current[colorKey as keyof typeof formValuesRef.current] !== defaultValue && 
           formValuesRef.current[colorKey as keyof typeof formValuesRef.current] !== '' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 p-0" 
              onClick={() => {
                handleInputChange(colorKey, '');
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
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
                id="brand-name"
                type="text"
                defaultValue={formValuesRef.current.brandName}
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
