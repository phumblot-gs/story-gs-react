
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button-base"
import { ButtonCircleProps } from "./types"
import { getButtonStyles } from "./styles"
import { sizeVariants } from "./variants"
import { IconProvider } from "@/components/ui/icon-provider"

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
    debug = false,
    onClick,
    onFocus,
    onBlur,
    style,
    ...props 
  }, ref) => {
    
    // Determine button styling based on background and states
    const buttonStyles = getButtonStyles(background, disabled, featured)
    
    // Get size classes using CVA
    const sizeClasses = sizeVariants({ size })
    
    // Maximum icon size is 12px regardless of button size to ensure pictograms never exceed 12x12px
    const iconSize = 12

    // Event handlers with debug mode
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (debug) console.log("ButtonCircle: onClick triggered");
      onClick?.(e);
    };

    const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (e) => {
      if (debug) console.log("ButtonCircle: onFocus triggered");
      onFocus?.(e);
    };

    const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (e) => {
      if (debug) console.log("ButtonCircle: onBlur triggered");
      onBlur?.(e);
    };

    // Render the content based on what's provided (icon or children)
    const renderContent = () => {
      if (icon) {
        return <IconProvider icon={icon} size={iconSize} />;
      } else {
        return children;
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
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={style}
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
