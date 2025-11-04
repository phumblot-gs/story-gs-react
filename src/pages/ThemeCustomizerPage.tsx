import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { useThemeValues, normalizeColorValue } from '@/hooks/useThemeValues';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SegmentedControl, SegmentedControlContent, SegmentedControlList, SegmentedControlTrigger } from '@/components/ui/segmented-control';
import { ArrowLeft, Upload, FileImage } from 'lucide-react';
import { ColorInput } from '@/components/ColorInput';
import PageHeader from '@/components/PageHeader';
import { toast } from '@/components/ui/use-toast';
import BrandLogo from '@/components/PageHeader/BrandLogo';

const ThemeCustomizerPage: React.FC = () => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const { defaultColors } = useThemeValues();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use state to track form values
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  // Add a flag to track if initial values are loaded
  const initialValuesLoaded = useRef(false);
  
  // Initialize form values only when component mounts or customization changes intentionally
  useEffect(() => {
    // Only initialize values if they haven't been loaded yet or if resetCustomization was called
    if (!initialValuesLoaded.current) {
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
      initialValuesLoaded.current = true;
    }
  }, [customization, defaultColors]);

  // Handler to reset form after reset button is clicked
  const handleReset = () => {
    resetCustomization();
    // Mark that we need to reinitialize values
    initialValuesLoaded.current = false;
    
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
    
    toast({
      title: "Theme reset",
      description: "Your theme customization has been reset to defaults.",
      type: "default"
    });
  };
  
  // Handle input change without triggering reinitializing
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
        type: "error"
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
        type: "error"
      });
    };
  };

  // Reset logo handler
  const handleResetLogo = () => {
    handleInputChange('logo', '');
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
    toast({
      title: "Theme updated",
      description: "Your theme customization has been applied.",
      type: "default"
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

            {/* Brand Logo Section */}
            <div className="space-y-3">
              <Label className="text-base">Brand Logo</Label>
              <div className="border rounded-md p-6 flex items-center justify-between gap-6">
                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="border rounded-md p-4 mb-4 min-h-20 min-w-40 flex items-center justify-center bg-gray-50">
                    {formValues.logo ? (
                      <BrandLogo logo={formValues.logo} width={80} height={45} />
                    ) : (
                      <FileImage className="h-10 w-10 text-gray-300" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formValues.logo ? 'Custom logo uploaded' : 'No custom logo set'}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Logo</span>
                  </Button>
                  {formValues.logo && (
                    <Button 
                      variant="outline" 
                      onClick={handleResetLogo}
                    >
                      Reset Logo
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
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: SVG (recommended), PNG, JPEG
              </p>
            </div>
            
            <SegmentedControl defaultValue="background" className="w-full">
              <SegmentedControlList className="grid grid-cols-4 mb-6">
                <SegmentedControlTrigger value="background">Background</SegmentedControlTrigger>
                <SegmentedControlTrigger value="text">Text</SegmentedControlTrigger>
                <SegmentedControlTrigger value="status">Status</SegmentedControlTrigger>
                <SegmentedControlTrigger value="header">Header</SegmentedControlTrigger>
              </SegmentedControlList>
              
              <SegmentedControlContent value="background" className="space-y-4">
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
              </SegmentedControlContent>
              
              <SegmentedControlContent value="text" className="space-y-4">
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
              </SegmentedControlContent>
              
              <SegmentedControlContent value="status" className="space-y-4">
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
              </SegmentedControlContent>
              
              <SegmentedControlContent value="header" className="space-y-4">
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
              </SegmentedControlContent>
            </SegmentedControl>
            
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
