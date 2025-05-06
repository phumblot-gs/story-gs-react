
import React, { useState } from 'react';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { hexToHSLString } from '@/utils/colorUtils';
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

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  className
}) => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for form inputs
  const [brandName, setBrandName] = useState(customization.text.brandName || '');
  
  // Background colors
  const [bgWhite, setBgWhite] = useState(customization.colors.bgWhite || '');
  const [bgBlack, setBgBlack] = useState(customization.colors.bgBlack || '');
  const [bgGrey, setBgGrey] = useState(customization.colors.bgGrey || '');
  const [bgGreyLighter, setBgGreyLighter] = useState(customization.colors.bgGreyLighter || '');
  const [bgGreyStrongest, setBgGreyStrongest] = useState(customization.colors.bgGreyStrongest || '');
  
  // Text colors
  const [textGreyStronger, setTextGreyStronger] = useState(customization.colors.textGreyStronger || '');
  const [textBlack, setTextBlack] = useState(customization.colors.textBlack || '');
  const [textWhite, setTextWhite] = useState(customization.colors.textWhite || '');
  const [textBluePrimary, setTextBluePrimary] = useState(customization.colors.textBluePrimary || '');
  const [textBlue, setTextBlue] = useState(customization.colors.textBlue || '');
  
  // Status colors
  const [statusIgnored, setStatusIgnored] = useState(customization.colors.statusIgnored || '');
  const [statusReshoot, setStatusReshoot] = useState(customization.colors.statusReshoot || '');
  const [statusNotSelected, setStatusNotSelected] = useState(customization.colors.statusNotSelected || '');
  const [statusSelected, setStatusSelected] = useState(customization.colors.statusSelected || '');
  const [statusRefused, setStatusRefused] = useState(customization.colors.statusRefused || '');
  const [statusForApproval, setStatusForApproval] = useState(customization.colors.statusForApproval || '');
  const [statusValidated, setStatusValidated] = useState(customization.colors.statusValidated || '');
  const [statusToPublish, setStatusToPublish] = useState(customization.colors.statusToPublish || '');
  const [statusError, setStatusError] = useState(customization.colors.statusError || '');
  const [statusPublished, setStatusPublished] = useState(customization.colors.statusPublished || '');
  
  // Apply changes from local state to theme context
  const applyChanges = () => {
    updateCustomization({
      colors: {
        // Background colors
        bgWhite: bgWhite || undefined,
        bgBlack: bgBlack || undefined,
        bgGrey: bgGrey || undefined,
        bgGreyLighter: bgGreyLighter || undefined,
        bgGreyStrongest: bgGreyStrongest || undefined,
        
        // Text colors
        textGreyStronger: textGreyStronger || undefined,
        textBlack: textBlack || undefined,
        textWhite: textWhite || undefined,
        textBluePrimary: textBluePrimary || undefined,
        textBlue: textBlue || undefined,
        
        // Status colors
        statusIgnored: statusIgnored || undefined,
        statusReshoot: statusReshoot || undefined,
        statusNotSelected: statusNotSelected || undefined,
        statusSelected: statusSelected || undefined,
        statusRefused: statusRefused || undefined,
        statusForApproval: statusForApproval || undefined,
        statusValidated: statusValidated || undefined,
        statusToPublish: statusToPublish || undefined,
        statusError: statusError || undefined,
        statusPublished: statusPublished || undefined,
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
      // Brand name
      setBrandName(customization.text.brandName || '');
      
      // Background colors
      setBgWhite(customization.colors.bgWhite || '');
      setBgBlack(customization.colors.bgBlack || '');
      setBgGrey(customization.colors.bgGrey || '');
      setBgGreyLighter(customization.colors.bgGreyLighter || '');
      setBgGreyStrongest(customization.colors.bgGreyStrongest || '');
      
      // Text colors
      setTextGreyStronger(customization.colors.textGreyStronger || '');
      setTextBlack(customization.colors.textBlack || '');
      setTextWhite(customization.colors.textWhite || '');
      setTextBluePrimary(customization.colors.textBluePrimary || '');
      setTextBlue(customization.colors.textBlue || '');
      
      // Status colors
      setStatusIgnored(customization.colors.statusIgnored || '');
      setStatusReshoot(customization.colors.statusReshoot || '');
      setStatusNotSelected(customization.colors.statusNotSelected || '');
      setStatusSelected(customization.colors.statusSelected || '');
      setStatusRefused(customization.colors.statusRefused || '');
      setStatusForApproval(customization.colors.statusForApproval || '');
      setStatusValidated(customization.colors.statusValidated || '');
      setStatusToPublish(customization.colors.statusToPublish || '');
      setStatusError(customization.colors.statusError || '');
      setStatusPublished(customization.colors.statusPublished || '');
    }
  }, [isOpen, customization]);
  
  // Color input component to reduce repetition
  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <div 
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: value || 'transparent' }}
        />
        <Input
          type="text"
          placeholder="#000000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 text-xs"
        />
      </div>
    </div>
  );
  
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
                placeholder="GS Components"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="background">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              
              <TabsContent value="background" className="space-y-3">
                <ColorInput label="bg-white" value={bgWhite} onChange={setBgWhite} />
                <ColorInput label="bg-black" value={bgBlack} onChange={setBgBlack} />
                <ColorInput label="bg-grey" value={bgGrey} onChange={setBgGrey} />
                <ColorInput label="bg-grey-lighter" value={bgGreyLighter} onChange={setBgGreyLighter} />
                <ColorInput label="bg-grey-strongest" value={bgGreyStrongest} onChange={setBgGreyStrongest} />
              </TabsContent>
              
              <TabsContent value="text" className="space-y-3">
                <ColorInput label="text-grey-stronger" value={textGreyStronger} onChange={setTextGreyStronger} />
                <ColorInput label="text-black" value={textBlack} onChange={setTextBlack} />
                <ColorInput label="text-white" value={textWhite} onChange={setTextWhite} />
                <ColorInput label="text-blue-primary" value={textBluePrimary} onChange={setTextBluePrimary} />
                <ColorInput label="text-blue" value={textBlue} onChange={setTextBlue} />
              </TabsContent>
              
              <TabsContent value="status" className="space-y-3">
                <ColorInput label="status-ignored" value={statusIgnored} onChange={setStatusIgnored} />
                <ColorInput label="status-reshoot" value={statusReshoot} onChange={setStatusReshoot} />
                <ColorInput label="status-not-selected" value={statusNotSelected} onChange={setStatusNotSelected} />
                <ColorInput label="status-selected" value={statusSelected} onChange={setStatusSelected} />
                <ColorInput label="status-refused" value={statusRefused} onChange={setStatusRefused} />
                <ColorInput label="status-for-approval" value={statusForApproval} onChange={setStatusForApproval} />
                <ColorInput label="status-validated" value={statusValidated} onChange={setStatusValidated} />
                <ColorInput label="status-to-publish" value={statusToPublish} onChange={setStatusToPublish} />
                <ColorInput label="status-error" value={statusError} onChange={setStatusError} />
                <ColorInput label="status-published" value={statusPublished} onChange={setStatusPublished} />
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
