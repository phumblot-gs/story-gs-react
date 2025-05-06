import React, { useState, useRef, useEffect, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Helper function to normalize color values for comparison
const normalizeColorValue = (color?: string): string => {
  if (!color) return '';
  // Convert color to lowercase to ensure case-insensitive comparison
  return color.toLowerCase().trim();
};

interface ColorInputProps {
  label: string;
  colorKey: string;
  defaultValue: string;
  onChange: (key: string, value: string) => void;
}

const ColorInput = memo(({ 
  label, 
  colorKey, 
  defaultValue, 
  onChange 
}: ColorInputProps) => {
  // Local state for preview color only
  const [previewColor, setPreviewColor] = useState<string>(defaultValue);
  // Keep the current value in a ref to avoid re-renders
  const inputValueRef = useRef<string>(defaultValue);
  
  // Update local preview whenever defaultValue changes externally
  useEffect(() => {
    inputValueRef.current = defaultValue;
    setPreviewColor(defaultValue);
  }, [defaultValue]);

  // Handle local input change without triggering re-renders
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    inputValueRef.current = value;
    setPreviewColor(value); // Only update preview state
  };

  // Only notify parent component on blur to reduce re-renders
  const handleBlur = () => {
    onChange(colorKey, inputValueRef.current);
  };

  // Check if current value differs from default for reset button
  const showResetButton = normalizeColorValue(inputValueRef.current) !== normalizeColorValue(defaultValue) && 
                          normalizeColorValue(inputValueRef.current) !== '';

  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2 items-center">
        <div 
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: previewColor }}
        />
        <Input
          type="text"
          value={inputValueRef.current}
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
              inputValueRef.current = '';
              setPreviewColor('');
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
