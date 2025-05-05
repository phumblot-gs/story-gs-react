
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonCircleProps } from "./types"
import { getButtonStyles, getSizeClasses } from "./styles"
import { renderIcon } from "./icon-renderer"

const ButtonCircle = React.forwardRef<HTMLButtonElement, ButtonCircleProps>(
  ({ 
    className, 
    variant, 
    background, 
    indicator, 
    disabled, 
    featured = false, 
    size = "large", 
    icon, 
    letter, 
    children, 
    ...props 
  }, ref) => {
    
    // Determine button styling based on background, variant and states
    const buttonStyles = getButtonStyles(variant, background, disabled, featured)
    
    // Determine size based on prop
    const sizeClasses = getSizeClasses(size)
    
    // Maximum icon size is 12px regardless of button size to ensure pictograms never exceed 12x12px
    const iconSize = 12

    // Render the content based on what's provided (icon, letter, or children)
    const renderContent = () => {
      if (icon) {
        return renderIcon(icon, iconSize)
      } else if (letter) {
        return <span className="text-sm leading-none">{letter.charAt(0)}</span>
      } else {
        return children
      }
    }

    return (
      <div className="relative">
        <Button
          ref={ref}
          className={cn(
            `relative rounded-full flex items-center justify-center font-custom transition-colors duration-200 p-0 [&_svg]:w-[14px] [&_svg]:h-[14px] ${sizeClasses}`,
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
