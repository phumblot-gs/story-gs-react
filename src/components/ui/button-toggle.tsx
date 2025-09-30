import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonToggleBackground = "White" | "Black" | "Grey"

export interface ButtonToggleProps extends 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  // Toggle state
  value?: boolean
  onValueChange?: (value: boolean) => void
  
  // Text labels
  onText?: string
  offText?: string
  
  // Styling props following Figma design
  bg?: ButtonToggleBackground
  disabled?: boolean
}

const ButtonToggle = React.forwardRef<HTMLButtonElement, ButtonToggleProps>(
  ({ 
    className,
    value = true,
    onValueChange,
    onText = "On",
    offText = "Off",
    bg = "White",
    disabled = false,
    onClick,
    ...props 
  }, ref) => {
    
    // Container styles based on state and background
    const getContainerStyles = () => {
      if (value) {
        // ON state
        if (disabled) {
          return bg === "White" || bg === "Grey" ? "bg-[#c1c1c1]" : "bg-white"
        }
        switch (bg) {
          case "Grey":
          case "White":
            return "bg-[#292828]"
          case "Black":
            return "bg-white"
          default:
            return "bg-[#292828]"
        }
      } else {
        // OFF state
        if (disabled) {
          switch (bg) {
            case "Grey":
              return "bg-white"
            case "Black":
              return "bg-[#3a3a3a]"
            case "White":
              return "bg-[#f3f3f3]"
            default:
              return "bg-[#f3f3f3]"
          }
        }
        switch (bg) {
          case "Grey":
            return "bg-white"
          case "Black":
            return "bg-[#3a3a3a]"
          case "White":
            return "bg-[#f3f3f3]"
          default:
            return "bg-[#f3f3f3]"
        }
      }
    }
    
    // Pill/circle styles
    const getPillStyles = () => {
      if (disabled) {
        return "bg-[#c1c1c1]"
      }
      if (value) {
        // ON state - pill on the right
        return bg === "Black" ? "bg-[#292828]" : "bg-white"
      } else {
        // OFF state - pill on the left
        return "bg-[#292828]"
      }
    }
    
    // Text color styles
    const getTextStyles = () => {
      if (disabled) {
        return "text-[#c1c1c1]"
      }
      if (value) {
        // ON state
        return bg === "Black" ? "text-[#292828]" : "text-white"
      } else {
        // OFF state
        return bg === "Black" ? "text-white" : "text-[#292828]"
      }
    }
    
    // Handle click to toggle state
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onValueChange?.(!value)
      }
      onClick?.(e)
    }
    
    const displayText = value ? onText : offText
    
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={displayText}
        disabled={disabled}
        className={cn(
          // Base container styles with fixed height
          "relative inline-flex items-center justify-start p-[3px] rounded-[10px]",
          "min-w-[40px] h-[20px] min-h-[20px] max-h-[20px] box-border",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          !disabled && "cursor-pointer",
          // Dynamic container background
          getContainerStyles(),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Toggle pill and label container */}
        <div className={cn(
          "flex items-center w-full h-full gap-[2px]",
          value ? "flex-row-reverse" : "flex-row"
        )}>
          {/* Circular pill */}
          <div 
            className={cn(
              "w-[14px] h-[14px] rounded-[7px] shrink-0",
              "transition-all duration-200",
              getPillStyles()
            )}
          />
          
          {/* Label */}
          <div className="flex-1 flex items-center justify-center px-[3px] min-w-0">
            <span className={cn(
              "text-[8px] leading-[8px] font-['Avenir_Next',_sans-serif] font-normal select-none whitespace-nowrap",
              getTextStyles()
            )}>
              {displayText}
            </span>
          </div>
        </div>
      </button>
    )
  }
)

ButtonToggle.displayName = "ButtonToggle"

export { ButtonToggle }