
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
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
>(({ className, debug, onCheckedChange, onFocus, onBlur, checked, defaultChecked, ...props }, ref) => {
  const bg = useBgContext();
  
  // Pour les composants non-contrôlés, gérer l'état local pour appliquer le comportement par défaut
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState<boolean | "indeterminate">(
    defaultChecked ?? false
  );
  
  // Utiliser une ref pour obtenir la valeur actuelle dans les callbacks
  const checkedStateRef = React.useRef<boolean | "indeterminate">(
    isControlled ? (checked ?? false) : internalChecked
  );
  
  // Determine the current state
  const checkedState = isControlled 
    ? (checked ?? false)
    : internalChecked;
  
  // Mettre à jour la ref quand l'état change
  React.useEffect(() => {
    checkedStateRef.current = checkedState;
  }, [checkedState]);
  
  const isIndeterminate = checkedState === "indeterminate";
  const isChecked = checkedState === true;

  // Comportement par défaut : false/indeterminate → true, true → false
  const handleCheckedChange = React.useCallback((checked: boolean | "indeterminate") => {
    // Utiliser la ref pour obtenir la valeur actuelle
    const currentState = checkedStateRef.current;
    
    // Appliquer le comportement par défaut basé sur l'état actuel AVANT le clic
    // false ou indeterminate → true, true → false
    let newChecked: boolean | "indeterminate";
    if (currentState === false || currentState === "indeterminate") {
      newChecked = true;
    } else {
      newChecked = false;
    }
    
    if (debug) {
      console.log('[Checkbox CheckedChange]', {
        currentState,
        radixValue: checked,
        newChecked,
        isControlled,
        bg,
        event: { type: 'checkedChange', checked, newChecked },
      });
    }
    
    // Pour les composants non-contrôlés, mettre à jour l'état local
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    // Appeler le handler personnalisé s'il existe avec le nouvel état calculé
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  }, [debug, bg, onCheckedChange, isControlled]);

  // Debug mode : wrapper pour onFocus avec log
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (debug) {
      console.log('[Checkbox Focus]', {
        checked: checkedState,
        bg,
        event: e,
      });
    }
    onFocus?.(e);
  }, [debug, checkedState, bg, onFocus]);

  // Debug mode : wrapper pour onBlur avec log
  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (debug) {
      console.log('[Checkbox Blur]', {
        checked: checkedState,
        bg,
        event: e,
      });
    }
    onBlur?.(e);
  }, [debug, checkedState, bg, onBlur]);

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-bg={bg || undefined}
      data-state={isIndeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"}
      checked={isControlled ? checked : internalChecked}
      className={cn(
        checkboxVariants(),
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      onCheckedChange={handleCheckedChange}
      onFocus={debug ? handleFocus : onFocus}
      onBlur={debug ? handleBlur : onBlur}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {isIndeterminate ? (
          <Minus className="h-2 w-2" />
        ) : (
          <Check className="h-2 w-2" />
        )}
      </CheckboxPrimitive.Indicator>
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
          {isControlled ? 'controlled' : 'uncontrolled'}/{isIndeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'}
        </span>
      )}
    </CheckboxPrimitive.Root>
  );
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, checkboxVariants }
