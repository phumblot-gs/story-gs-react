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

const CustomTagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.9895 5.50125L12.6391 3.05084C12.519 2.18069 11.8283 1.50058 10.9575 1.37055L8.50501 1.0205C7.88439 0.930481 7.26377 1.14052 6.82333 1.58059L1.57808 6.84147C0.807307 7.6116 0.807307 8.86181 1.57808 9.63194L4.37087 12.4224C5.14164 13.1925 6.3929 13.1925 7.16367 12.4224L12.4189 7.17153C12.8594 6.73145 13.0696 6.11135 12.9795 5.49124L12.9895 5.50125Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <mask id="path-2-inside-1_270_3576" fill="white">
      <path d="M9.35563 3.72086C9.59583 3.72086 9.83603 3.81086 10.0262 4.00086C10.3965 4.37086 10.3965 4.96086 10.0262 5.33086C9.84604 5.51086 9.59583 5.61086 9.35563 5.61086C9.11543 5.61086 8.87523 5.52086 8.68507 5.33086C8.31476 4.96086 8.31476 4.37086 8.68507 4.00086C8.86522 3.82086 9.11543 3.72086 9.35563 3.72086ZM9.35563 3.22086C8.96531 3.22086 8.605 3.37086 8.33478 3.64086C8.06455 3.91086 7.91443 4.27086 7.91443 4.66086C7.91443 5.05086 8.06455 5.41086 8.33478 5.68086C8.605 5.95086 8.96531 6.10086 9.35563 6.10086C9.74596 6.10086 10.1063 5.95086 10.3765 5.68086C10.6467 5.41086 10.7968 5.05086 10.7968 4.66086C10.7968 4.27086 10.6467 3.91086 10.3765 3.64086C10.1063 3.37086 9.74596 3.22086 9.35563 3.22086Z"/>
    </mask>
    <path d="M9.35563 3.72086V4.72086C9.35055 4.72086 9.34251 4.71981 9.33329 4.71607C9.32885 4.71427 9.32511 4.71222 9.32229 4.71034C9.31944 4.70845 9.31854 4.70742 9.31938 4.70826L10.0262 4.00086L10.733 3.29345C10.3486 2.90942 9.8513 2.72086 9.35563 2.72086V3.72086ZM10.0262 4.00086L9.31938 4.70826C9.31717 4.70606 9.31261 4.70032 9.30897 4.69143C9.30558 4.68315 9.30392 4.67441 9.30392 4.66586C9.30392 4.6573 9.30558 4.64857 9.30897 4.64028C9.31261 4.63139 9.31717 4.62566 9.31938 4.62345L10.0262 5.33086L10.733 6.03826C11.4942 5.27767 11.4942 4.05405 10.733 3.29345L10.0262 4.00086ZM10.0262 5.33086L9.31938 4.62345C9.32688 4.61596 9.33136 4.61422 9.33194 4.61398C9.33273 4.61366 9.33441 4.61303 9.33751 4.6124C9.34057 4.61178 9.34652 4.61086 9.35563 4.61086V5.61086V6.61086C9.85933 6.61086 10.3642 6.40672 10.733 6.03826L10.0262 5.33086ZM9.35563 5.61086V4.61086C9.36071 4.61086 9.36875 4.6119 9.37796 4.61564C9.38241 4.61745 9.38615 4.6195 9.38897 4.62137C9.39182 4.62326 9.39272 4.6243 9.39188 4.62345L8.68507 5.33086L7.97826 6.03826C8.36262 6.4223 8.85997 6.61086 9.35563 6.61086V5.61086ZM8.68507 5.33086L9.39188 4.62345C9.39409 4.62566 9.39865 4.63139 9.40229 4.64028C9.40568 4.64857 9.40734 4.6573 9.40734 4.66586C9.40734 4.67441 9.40568 4.68315 9.40229 4.69143C9.39865 4.70032 9.39409 4.70606 9.39188 4.70826L8.68507 4.00086L7.97826 3.29345C7.21703 4.05405 7.21703 5.27767 7.97826 6.03826L8.68507 5.33086ZM8.68507 4.00086L9.39188 4.70826C9.38438 4.71576 9.3799 4.71749 9.37932 4.71773C9.37853 4.71806 9.37685 4.71869 9.37375 4.71931C9.37069 4.71994 9.36474 4.72086 9.35563 4.72086V3.72086V2.72086C8.85193 2.72086 8.34703 2.92499 7.97826 3.29345L8.68507 4.00086ZM9.35563 3.22086V2.22086C8.7018 2.22086 8.08681 2.47499 7.62797 2.93345L8.33478 3.64086L9.04159 4.34826C9.1232 4.26672 9.22881 4.22086 9.35563 4.22086V3.22086ZM8.33478 3.64086L7.62797 2.93345C7.16909 3.39195 6.91443 4.00681 6.91443 4.66086H7.91443H8.91443C8.91443 4.5349 8.96001 4.42977 9.04159 4.34826L8.33478 3.64086ZM7.91443 4.66086H6.91443C6.91443 5.3149 7.16909 5.92977 7.62797 6.38826L8.33478 5.68086L9.04159 4.97345C8.96001 4.89195 8.91443 4.78681 8.91443 4.66086H7.91443ZM8.33478 5.68086L7.62797 6.38826C8.08681 6.84672 8.7018 7.10086 9.35563 7.10086V6.10086V5.10086C9.22881 5.10086 9.1232 5.05499 9.04159 4.97345L8.33478 5.68086ZM9.35563 6.10086V7.10086C10.0095 7.10086 10.6244 6.84672 11.0833 6.38826L10.3765 5.68086L9.66967 4.97345C9.58806 5.05499 9.48245 5.10086 9.35563 5.10086V6.10086ZM10.3765 5.68086L11.0833 6.38826C11.5422 5.92977 11.7968 5.3149 11.7968 4.66086H10.7968H9.79683C9.79683 4.78681 9.75125 4.89195 9.66967 4.97345L10.3765 5.68086ZM10.7968 4.66086H11.7968C11.7968 4.00681 11.5422 3.39195 11.0833 2.93345L10.3765 3.64086L9.66967 4.34826C9.75125 4.42977 9.79683 4.5349 9.79683 4.66086H10.7968ZM10.3765 3.64086L11.0833 2.93345C10.6244 2.47499 10.0095 2.22086 9.35563 2.22086V3.22086V4.22086C9.48245 4.22086 9.58806 4.26672 9.66967 4.34826L10.3765 3.64086Z" fill="currentColor" mask="url(#path-2-inside-1_270_3576)"/>
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
        } else if (icon === "Tag") {
          return <CustomTagIcon />;
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
