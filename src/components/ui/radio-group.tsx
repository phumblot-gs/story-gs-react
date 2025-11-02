
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  debug?: boolean;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, debug, onValueChange, value, defaultValue, ...props }, ref) => {
  const bg = useBgContext();

  // Debug mode : wrapper pour onValueChange avec log
  const handleValueChange = React.useCallback((newValue: string) => {
    if (debug) {
      console.log('[RadioGroup ValueChange]', {
        newValue,
        previousValue: value ?? defaultValue,
        bg,
        event: { type: 'valueChange', value: newValue },
      });
    }
    onValueChange?.(newValue);
  }, [debug, value, defaultValue, bg, onValueChange]);

  return (
    <RadioGroupPrimitive.Root
      className={cn("grid", className)}
      onValueChange={debug ? handleValueChange : onValueChange}
      value={value}
      defaultValue={defaultValue}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioGroupItemVariants = cva(
  "aspect-square h-3 w-3 rounded-full align-baseline border-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 radio-group-item-default relative",
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  debug?: boolean;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, debug, onFocus, onBlur, value, ...props }, ref) => {
  const bg = useBgContext();

  // Debug mode : wrapper pour onFocus avec log
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (debug) {
      console.log('[RadioGroupItem Focus]', {
        value,
        bg,
        event: e,
      });
    }
    onFocus?.(e);
  }, [debug, value, bg, onFocus]);

  // Debug mode : wrapper pour onBlur avec log
  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (debug) {
      console.log('[RadioGroupItem Blur]', {
        value,
        bg,
        event: e,
      });
    }
    onBlur?.(e);
  }, [debug, value, bg, onBlur]);

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-bg={bg || undefined}
      className={cn(
        radioGroupItemVariants(),
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      onFocus={debug ? handleFocus : onFocus}
      onBlur={debug ? handleBlur : onBlur}
      value={value}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <svg 
          className="h-2 w-2 fill-current text-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      </RadioGroupPrimitive.Indicator>
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
          {value || 'no-value'}
        </span>
      )}
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem, radioGroupItemVariants }
