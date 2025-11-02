import * as React from "react"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export interface SwitchProps extends 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  // Toggle state
  value?: boolean
  onValueChange?: (value: boolean) => void
  
  // Text labels
  onText?: string
  offText?: string
  
  disabled?: boolean
  debug?: boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ 
    className,
    value = true,
    onValueChange,
    onText = "On",
    offText = "Off",
    disabled = false,
    debug,
    onClick,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const bg = useBgContext();
    
    // Handle click to toggle state (always needed)
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[Switch Click]', {
          value,
          newValue: !value,
          bg,
          disabled,
          onText,
          offText,
          event: e,
        });
      }
      if (!disabled) {
        onValueChange?.(!value)
      }
      onClick?.(e)
    }, [debug, value, bg, disabled, onText, offText, onValueChange, onClick]);

    // Debug mode : wrapper pour onFocus avec log
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[Switch Focus]', {
          value,
          bg,
          disabled,
          event: e,
        });
      }
      onFocus?.(e);
    }, [debug, value, bg, disabled, onFocus]);

    // Debug mode : wrapper pour onBlur avec log
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[Switch Blur]', {
          value,
          bg,
          disabled,
          event: e,
        });
      }
      onBlur?.(e);
    }, [debug, value, bg, disabled, onBlur]);
    
    const displayText = value ? onText : offText
    
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={displayText}
        disabled={disabled}
        data-bg={bg || undefined}
        data-state={value ? "on" : "off"}
        className={cn(
          // Base container styles with fixed height
          "relative inline-flex items-center justify-start p-1 rounded-[10px]",
          "min-w-[40px] h-[20px] min-h-[20px] max-h-[20px] box-border",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          !disabled && "cursor-pointer",
          // Use CSS classes for background adaptation
          "button-toggle-default",
          debug && "ring-2 ring-pink ring-offset-2",
          className
        )}
        onClick={handleClick}
        onFocus={debug ? handleFocus : onFocus}
        onBlur={debug ? handleBlur : onBlur}
        {...props}
      >
        {/* Toggle pill and label container */}
        <div className={cn(
          "flex items-center w-full h-full gap-1",
          value ? "flex-row-reverse" : "flex-row"
        )}>
          {/* Circular pill */}
          <div className="button-toggle-pill" />
          
          {/* Label */}
          <div className="flex-1 flex items-center justify-center px-[3px] min-w-0">
            <span className="button-toggle-text text-[8px] leading-[8px] font-['Avenir_Next',_sans-serif] font-normal select-none whitespace-nowrap">
              {displayText}
            </span>
          </div>
        </div>
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
            {value ? 'on' : 'off'}/{bg || 'no-bg'}
          </span>
        )}
      </button>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
