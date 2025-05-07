
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { useThemeValues, normalizeColorValue } from '@/hooks/useThemeValues';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import ColorInput from '@/components/ColorInput';
import PageHeader from '@/components/PageHeader';
import { toast } from '@/components/ui/use-toast';

const ThemeCustomizerPage: React.FC = () => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const { defaultColors } = useThemeValues();
  
  // Use state to track form values
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

  // Handle input change
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
    toast({
      title: "Theme updated",
      description: "Your theme customization has been applied.",
    });
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
    toast({
      title: "Theme reset",
      description: "Your theme customization has been reset to defaults.",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Theme Customizer"
        showTitleButton={false}
        rightContent={
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        }
      />
      
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Customize Theme</h1>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="brand-name" className="text-base">Brand Name</Label>
              <Input
                id="brand-name"
                type="text"
                value={formValues.brandName || ''}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="header">Header</TabsTrigger>
              </TabsList>
              
              <TabsContent value="background" className="space-y-4">
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
              
              <TabsContent value="text" className="space-y-4">
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
              
              <TabsContent value="status" className="space-y-4">
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
              
              <TabsContent value="header" className="space-y-4">
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
                <div className="mt-6">
                  <Label className="mb-2 block">Gradient Preview</Label>
                  <div 
                    className="h-12 w-full rounded-md"
                    style={{ 
                      background: `linear-gradient(to right, ${formValues.headerGradientStart || defaultColors.headerGradientStart}, ${formValues.headerGradientEnd || defaultColors.headerGradientEnd})` 
                    }}
                  ></div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <Button onClick={applyChanges}>Apply Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizerPage;
