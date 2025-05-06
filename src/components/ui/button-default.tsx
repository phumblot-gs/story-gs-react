
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button as ButtonBase, ButtonProps as ButtonBaseProps } from "@/components/ui/button"

export type ButtonVariant = "primary" | "secondary" | "black" | "blue" | "grey" | "disabled"
export type ButtonBackground = "white" | "black" | "grey"

export interface ButtonProps extends Omit<ButtonBaseProps, 'variant'> {
  variant?: ButtonVariant
  background?: ButtonBackground
  indicator?: boolean
  disabled?: boolean
  featured?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, background, indicator, disabled, featured = false, children, ...props }, ref) => {
    // Determine automatic variant based on background if variant is not explicitly provided
    const effectiveVariant = variant || (background ? 
      (background === "white" ? "primary" : 
       background === "black" ? "black" : 
       "grey") : "primary")
    
    // Determine button styling based on background, variant and states
    const getButtonStyles = () => {
      if (disabled) {
        if (background === "white" || effectiveVariant === "primary" || effectiveVariant === "secondary") {
          return "bg-white text-grey-stronger"
        } else if (background === "black" || effectiveVariant === "black" || effectiveVariant === "blue") {
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
            // Default to white background behavior if background is not specified
            return "bg-grey-lighter text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        }
      }

      // Default styles (non-featured)
      switch (background || effectiveVariant) {
        case "white":
        case "primary":
        case "secondary":
          return "bg-white text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        case "black":
        case "blue":
          return "bg-black text-white hover:bg-white hover:text-black active:bg-black active:text-blue-primary"
        case "grey":
          return "bg-grey text-black hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        default:
          return "bg-white text-black hover:bg-black hover:text-white"
      }
    }

    return (
      <div className="relative">
        <ButtonBase
          ref={ref}
          className={cn(
            "relative rounded-full text-sm py-[10px] px-[15px] font-light h-[30px] flex items-center leading-none justify-center font-custom transition-colors duration-200",
            getButtonStyles(),
            className
          )}
          disabled={disabled}
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

export { Button }
