
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button as ButtonBase, ButtonProps as ButtonBaseProps, buttonVariants } from "@/components/ui/button-base"
import { cva, type VariantProps } from "class-variance-authority"

export type ButtonBackground = "white" | "black" | "grey"

// Create a size variant using CVA
const sizeVariants = cva('', {
  variants: {
    size: {
      small: "text-xs py-[8px] px-[12px] h-[24px]",
      large: "text-sm py-[10px] px-[15px] h-[30px]",
      // Compatibility aliases
      sm: "text-xs py-[8px] px-[12px] h-[24px]",
      default: "text-sm py-[10px] px-[15px] h-[30px]",
      lg: "text-sm py-[12px] px-[18px] h-[32px]",
      icon: "p-0 h-8 w-8",
    },
  },
  defaultVariants: { size: "large" },
});

export type ButtonSize = "small" | "large" | "sm" | "default" | "lg" | "icon"

export interface ButtonProps extends Omit<ButtonBaseProps, 'size'>, VariantProps<typeof sizeVariants> {
  background?: ButtonBackground
  indicator?: boolean
  disabled?: boolean
  featured?: boolean
  debug?: boolean
  variant?: string // For backward compatibility
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    background = "white", 
    indicator, 
    disabled, 
    featured = true, 
    size, 
    children,
    variant, // Accept but don't use directly
    debug = false,
    onClick,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    // Get size-specific classes using CVA
    const sizeClasses = sizeVariants({ size });
    
    // Determine button styling based on background and states
    const getButtonStyles = () => {
      if (disabled) {
        if (background === "white") {
          return "bg-white text-grey-stronger"
        } else if (background === "black") {
          return "bg-black text-grey-stronger"
        } else {
          return "bg-grey text-grey-stronger"
        }
      }

      // For featured buttons, apply special background based on context
      if (featured) {
        switch (background) {
          case "white":
            return "bg-grey-lighter text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
          case "black":
            return "bg-grey-strongest text-white hover:bg-white hover:text-black active:bg-black active:text-blue-primary"
          case "grey":
            return "bg-white text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
          default:
            // Default to white background behavior
            return "bg-grey-lighter text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        }
      }

      // Default styles (non-featured)
      switch (background) {
        case "white":
          return "bg-white text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        case "black":
          return "bg-black text-white hover:bg-white hover:text-black active:bg-black active:text-blue-primary"
        case "grey":
          return "bg-grey text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        default:
          return "bg-white text-black hover:bg-black hover:text-white"
      }
    }

    // Event handlers with debug mode
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (debug) console.log("Button: onClick triggered");
      onClick?.(e);
    };

    const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (e) => {
      if (debug) console.log("Button: onFocus triggered");
      onFocus?.(e);
    };

    const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (e) => {
      if (debug) console.log("Button: onBlur triggered");
      onBlur?.(e);
    };

    // Handle variant prop for compatibility (map old variant props to appropriate styling)
    let compatibilityClasses = "";
    if (variant) {
      switch(variant) {
        case "outline":
          compatibilityClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
          break;
        case "ghost":
          compatibilityClasses = "hover:bg-accent hover:text-accent-foreground";
          break;
        case "link":
          compatibilityClasses = "text-primary underline-offset-4 hover:underline";
          break;
        case "destructive":
          compatibilityClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
          break;
        case "secondary":
          compatibilityClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
          break;
        default:
          // Default variant styling already handled by other props
          break;
      }
    }

    return (
      <div className="relative">
        <ButtonBase
          ref={ref}
          className={cn(
            "relative rounded-full font-light flex items-center leading-none justify-center font-custom transition-colors duration-200",
            sizeClasses,
            getButtonStyles(),
            compatibilityClasses,
            className
          )}
          disabled={disabled}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {children}
        </ButtonBase>
        
        {indicator && (
          <div className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow"></div>
        )}
      </div>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
