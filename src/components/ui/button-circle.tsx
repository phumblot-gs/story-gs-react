
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "black" | "blue" | "grey" | "disabled"
export type ButtonBackground = "white" | "black" | "grey"
export type ButtonSize = "small" | "large"

// Define a list of approved pictogram icons to be used
export type AllowedPictogram = 
  | "Bell" 
  | "Check" 
  | "Plus" 
  | "Minus" 
  | "X" 
  | "Mail" 
  | "Heart" 
  | "Star" 
  | "Info" 
  | "AlertCircle" 
  | "Calendar" 
  | "Clock"
  | "Tag"
  | "Pencil"

export interface ButtonCircleProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant
  background?: ButtonBackground
  indicator?: boolean
  disabled?: boolean
  featured?: boolean
  size?: ButtonSize
  icon?: keyof typeof LucideIcons | AllowedPictogram
  letter?: string
}

// Custom SVG components for the icons provided by the user
const CustomPencilIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.7434 2.56069L2.61283 10.6444L1.18394 10.9946C1.07325 11.0246 0.982691 10.9245 1.00282 10.8145L1.35501 9.39384L9.49564 1.32012C9.83777 0.979963 10.4013 0.979963 10.7434 1.32012C11.0855 1.66028 11.0855 2.22053 10.7434 2.56069Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
    <path d="M7.05043 1L3.93103 4.10143" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
);

const ButtonCircle = React.forwardRef<HTMLButtonElement, ButtonCircleProps>(
  ({ className, variant, background, indicator, disabled, featured = false, size = "large", icon, letter, children, ...props }, ref) => {
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

    // Determine size based on prop
    const sizeClasses = size === "small" ? "w-[20px] h-[20px]" : "w-[30px] h-[30px]";
    
    // Maximum icon size is 12px regardless of button size to ensure pictograms never exceed 12x12px
    const iconSize = 12;

    // Render the content based on what's provided (icon, letter, or children)
    const renderContent = () => {
      if (icon) {
        // Check if it's a custom icon first
        if (icon === "Pencil") {
          return <CustomPencilIcon />;
        } else {
          const IconComponent = LucideIcons[icon] as React.ElementType;
          return <IconComponent size={iconSize} className="max-w-[12px] max-h-[12px]" />;
        }
      } else if (letter) {
        return <span className="text-sm leading-none">{letter.charAt(0)}</span>;
      } else {
        return children;
      }
    };

    return (
      <div className="relative">
        <Button
          ref={ref}
          className={cn(
            `relative rounded-full flex items-center justify-center font-custom transition-colors duration-200 p-0 ${sizeClasses}`,
            getButtonStyles(),
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
