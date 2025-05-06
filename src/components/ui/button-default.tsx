
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button as ButtonBase, ButtonProps as ButtonBaseProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"

export type ButtonBackground = "white" | "black" | "grey"

// Create a size variant using CVA
const sizeVariants = cva('', {
  variants: {
    size: {
      small: "text-xs py-[8px] px-[12px] h-[24px]",
      large: "text-sm py-[10px] px-[15px] h-[30px]",
    },
  },
  defaultVariants: { size: "large" },
});

export type ButtonSize = "small" | "large"

export interface ButtonProps extends Omit<ButtonBaseProps, 'variant' | 'size'>, VariantProps<typeof sizeVariants> {
  background?: ButtonBackground
  indicator?: boolean
  disabled?: boolean
  featured?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, background = "white", indicator, disabled, featured = false, size, children, ...props }, ref) => {
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

    return (
      <div className="relative">
        <ButtonBase
          ref={ref}
          className={cn(
            "relative rounded-full font-light flex items-center leading-none justify-center font-custom transition-colors duration-200",
            sizeClasses,
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
