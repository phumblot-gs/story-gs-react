
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

const checkboxVariants = cva(
  "peer h-3 w-3 shrink-0 border border-[1px] rounded-[2px] align-baseline ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checkbox-default relative",
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  debug?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, debug, onCheckedChange, onFocus, onBlur, ...props }, ref) => {
  const bg = useBgContext();

  // Debug mode : wrapper pour onCheckedChange avec log
  const handleCheckedChange = React.useCallback((checked: boolean) => {
    if (debug) {
      console.log('[Checkbox CheckedChange]', {
        checked,
        bg,
        event: { type: 'checkedChange', checked },
      });
    }
    onCheckedChange?.(checked);
  }, [debug, bg, onCheckedChange]);

  // Debug mode : wrapper pour onFocus avec log
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (debug) {
      console.log('[Checkbox Focus]', {
        checked: props.checked ?? props.defaultChecked,
        bg,
        event: e,
      });
    }
    onFocus?.(e);
  }, [debug, props.checked, props.defaultChecked, bg, onFocus]);

  // Debug mode : wrapper pour onBlur avec log
  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (debug) {
      console.log('[Checkbox Blur]', {
        checked: props.checked ?? props.defaultChecked,
        bg,
        event: e,
      });
    }
    onBlur?.(e);
  }, [debug, props.checked, props.defaultChecked, bg, onBlur]);

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-bg={bg || undefined}
      className={cn(
        checkboxVariants(),
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      onCheckedChange={debug ? handleCheckedChange : onCheckedChange}
      onFocus={debug ? handleFocus : onFocus}
      onBlur={debug ? handleBlur : onBlur}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-2 w-2" />
      </CheckboxPrimitive.Indicator>
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
          {props.checked !== undefined ? 'controlled' : 'uncontrolled'}/{props.checked ?? props.defaultChecked ? 'checked' : 'unchecked'}
        </span>
      )}
    </CheckboxPrimitive.Root>
  );
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, checkboxVariants }
