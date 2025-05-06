
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonCircleProps } from "./types"
import { getButtonStyles } from "./styles"
import { renderIcon } from "./icon-renderer"
import { sizeVariants } from "./variants"

const ButtonCircle = React.forwardRef<HTMLButtonElement, ButtonCircleProps>(
  ({ 
    background = "white", 
    children,
    className, 
    disabled, 
    featured = false, 
    icon,
    indicator, 
    size = "large", 
    ...props 
  }, ref) => {
    
    // Determine button styling based on background and states
    const buttonStyles = getButtonStyles(background, disabled, featured)
    
    // Get size classes using CVA
    const sizeClasses = sizeVariants({ size })
    
    // Maximum icon size is 12px regardless of button size to ensure pictograms never exceed 12x12px
    const iconSize = 12

    // Render the content based on what's provided (icon or children)
    const renderContent = () => {
      if (icon) {
        return renderIcon(icon, iconSize)
      } else {
        return children
      }
    }

    return (
      <div className="relative">
        <Button
          ref={ref}
          className={cn(
            `relative rounded-full flex items-center justify-center font-light transition-colors duration-200 p-0 [&_svg]:w-[12px] [&_svg]:h-[12px]`,
            sizeClasses,
            buttonStyles,
            className
          )}
          disabled={disabled}
          {...props}
        >
          {renderContent()}
        </Button>
        
        {indicator && (
          <div className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow"></div>
        )}
      </div>
    )
  }
)

ButtonCircle.displayName = "ButtonCircle"

export { ButtonCircle }
