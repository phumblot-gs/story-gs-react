
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

export type ButtonVariant = "primary" | "secondary" | "black" | "blue" | "grey" | "disabled"
export type ButtonBackground = "white" | "black" | "grey"

export interface ButtonTextLargeProps extends Omit<ButtonProps, 'variant'> {
  variant?: ButtonVariant
  background?: ButtonBackground
  indicator?: boolean
  disabled?: boolean
}

const ButtonTextLarge = React.forwardRef<HTMLButtonElement, ButtonTextLargeProps>(
  ({ className, variant, background, indicator, disabled, children, ...props }, ref) => {
    // Determine automatic variant based on background if variant is not explicitly provided
    const effectiveVariant = variant || (background ? 
      (background === "white" ? "primary" : 
       background === "black" ? "black" : 
       "grey") : "primary")
    
    // Determine background color based on variant and disabled state
    const getBgColor = () => {
      if (disabled) return "bg-grey-strongest text-white"
      
      switch (effectiveVariant) {
        case "primary":
          return "bg-white text-black"
        case "secondary":
          return "bg-grey-lighter text-black"
        case "black":
          return "bg-black text-white"
        case "blue":
          return "bg-black text-blue-primary"
        case "grey":
          return "bg-grey text-black"
        case "disabled":
          return "bg-grey-strongest text-white"
      }
    }

    return (
      <div className="relative">
        <Button
          ref={ref}
          className={cn(
            "relative rounded-full text-[0.8125rem] py-[10px] px-[10px] font-medium h-[30px] flex items-center justify-center font-custom",
            getBgColor(),
            className
          )}
          disabled={disabled}
          {...props}
        >
          {children}
        </Button>
        
        {indicator && (
          <div className="absolute -bottom-1 -right-1 w-[7px] h-[7px] rounded-full bg-yellow"></div>
        )}
      </div>
    )
  }
)

ButtonTextLarge.displayName = "ButtonTextLarge"

export { ButtonTextLarge }
