
import React, { useState, useEffect, useRef } from 'react';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { useThemeValues, normalizeColorValue } from '@/hooks/useThemeValues';
import { Sun, Moon, Palette, Upload, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ColorInput from './ColorInput';
import BrandLogo from './PageHeader/BrandLogo';
import { toast } from './ui/use-toast';

interface ThemeCustomizerProps {
  className?: string;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  className
}) => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const { defaultColors } = useThemeValues();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use state instead of ref to track form values and ensure re-renders
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  
  // Initialize form values when component mounts or customization changes
  useEffect(() => {
    // Initialize with current customization values or defaults
    const initialValues: Record<string, string> = {
      brandName: customization.text.brandName || 'GS Components',
      logo: customization.assets.logo || '',
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

  // Handle logo file upload
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a valid image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPEG, PNG, SVG)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    
    if (file.type === 'image/svg+xml') {
      // Handle SVG files - read as text to get SVG markup
      reader.readAsText(file);
      reader.onload = () => {
        const svgContent = reader.result as string;
        handleInputChange('logo', svgContent);
      };
    } else {
      // Handle other image types - read as data URL
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        handleInputChange('logo', dataUrl);
      };
    }
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to process the uploaded image",
        variant: "destructive"
      });
    };
  };
  
  // Apply changes from state to theme context
  const applyChanges = () => {
    const updates = {
      colors: {} as any,
      text: {
        brandName: formValues.brandName !== 'GS Components' ? formValues.brandName : undefined,
      },
      assets: {
        logo: formValues.logo || undefined
      }
    };
    
    // Add only color values that differ from defaults using normalized comparison
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'brandName' || key === 'logo') return; // Skip non-color values
      
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
      logo: '',
    };
    
    Object.keys(defaultColors).forEach(key => {
      const typedKey = key as keyof typeof defaultColors;
      defaultValues[key] = defaultColors[typedKey] || '';
    });
    
    setFormValues(defaultValues);
  };

  // Reset logo handler
  const handleResetLogo = () => {
    handleInputChange('logo', '');
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

            {/* Brand Logo Section */}
            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <div className="flex items-center justify-between gap-4">
                <div className="border rounded-md p-3 flex-grow flex items-center justify-center h-16 bg-gray-50">
                  {formValues.logo ? (
                    <BrandLogo logo={formValues.logo} width={50} height={28} />
                  ) : (
                    <span className="text-sm text-gray-400">No custom logo</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                  {formValues.logo && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResetLogo}
                    >
                      Reset
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </div>
            </div>
            
            <Tabs defaultValue="background">
              <TabsList className="grid grid-cols-4 mb-2">
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="header">Header</TabsTrigger>
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
              
              <TabsContent value="header" className="space-y-3">
                <ColorInput 
                  label="Header Gradient Start" 
                  colorKey="headerGradientStart" 
                  defaultValue={defaultColors.headerGradientStart}
                  value={formValues.headerGradientStart || ''}
                  onChange={handleInputChange} 
                />
                <ColorInput 
                  label="Header Gradient End" 
                  colorKey="headerGradientEnd" 
                  defaultValue={defaultColors.headerGradientEnd}
                  value={formValues.headerGradientEnd || ''}
                  onChange={handleInputChange} 
                />
                {/* Preview of the gradient */}
                <div className="mt-4">
                  <Label className="mb-2 block">Gradient Preview</Label>
                  <div 
                    className="h-8 w-full rounded-md"
                    style={{ 
                      background: `linear-gradient(to right, ${formValues.headerGradientStart || defaultColors.headerGradientStart}, ${formValues.headerGradientEnd || defaultColors.headerGradientEnd})` 
                    }}
                  ></div>
                </div>
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
