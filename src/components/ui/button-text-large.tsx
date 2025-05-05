
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

export type ButtonVariant = "primary" | "secondary" | "black" | "blue" | "grey" | "disabled"

export interface ButtonTextLargeProps extends Omit<ButtonProps, 'variant'> {
  variant?: ButtonVariant
  indicator?: number
  disabled?: boolean
}

const ButtonTextLarge = React.forwardRef<HTMLButtonElement, ButtonTextLargeProps>(
  ({ className, variant = "primary", indicator, disabled, children, ...props }, ref) => {
    // Determine background color based on variant and disabled state
    const getBgColor = () => {
      if (disabled) return "bg-grey-strongest text-white"
      
      switch (variant) {
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
            "relative rounded-full p-4 font-medium h-10 w-10 flex items-center justify-center",
            getBgColor(),
            className
          )}
          disabled={disabled}
          {...props}
        >
          {children}
        </Button>
        
        {indicator !== undefined && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow flex items-center justify-center text-black text-xs">
            {indicator}
          </div>
        )}
      </div>
    )
  }
)

ButtonTextLarge.displayName = "ButtonTextLarge"

export { ButtonTextLarge }
