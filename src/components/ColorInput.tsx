
import React, { useState, useEffect, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Helper function to normalize color values for comparison
export const normalizeColorValue = (color?: string): string => {
  if (!color) return '';
  // Convert color to lowercase to ensure case-insensitive comparison
  return color.toLowerCase().trim();
};

interface ColorInputProps {
  label: string;
  colorKey: string;
  defaultValue: string;
  value?: string;
  onChange: (key: string, value: string) => void;
}

const ColorInput = memo(({ 
  label, 
  colorKey, 
  defaultValue, 
  value: externalValue, 
  onChange 
}: ColorInputProps) => {
  // Track the local input value internally
  const [localValue, setLocalValue] = useState<string>(externalValue || defaultValue);
  
  // Update local value when external value changes, but only if it's different
  useEffect(() => {
    // Only update if external value is significantly different
    if (externalValue !== undefined && normalizeColorValue(externalValue) !== normalizeColorValue(localValue)) {
      setLocalValue(externalValue);
    }
  }, [externalValue]);

  // Handle input change without notifying parent immediately
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  // Only notify parent component on blur to reduce state updates
  const handleBlur = () => {
    // Only update parent if value has actually changed
    if (normalizeColorValue(localValue) !== normalizeColorValue(externalValue)) {
      onChange(colorKey, localValue);
    }
  };

  // Check if current value differs from default for reset button
  const showResetButton = normalizeColorValue(localValue) !== normalizeColorValue(defaultValue) && 
                          normalizeColorValue(localValue) !== '';

  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2 items-center">
        <div 
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: localValue || defaultValue }}
        />
        <Input
          type="text"
          value={localValue}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          className="h-6 text-xs"
        />
        {showResetButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 p-0" 
            onClick={() => {
              setLocalValue('');
              onChange(colorKey, '');
            }}
            title="Reset to default"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
});

ColorInput.displayName = "ColorInput";

export default ColorInput;
