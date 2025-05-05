
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
  | "Sort"
  | "Help"
  | "Logout"
  | "Filter"
  | "Settings"
  | "User"
  | "Status"

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

// Add custom Bell icon with the provided SVG
const CustomBellIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.54287 10.1952C7.54287 11.0592 6.84763 11.76 5.99049 11.76C5.13335 11.76 4.43811 11.0592 4.43811 10.1952H7.54287Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.24756 7.75681L1.23804 10.1952H5.99994H10.7618L9.75232 7.75681" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 0.23999V1.57439" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.75232 7.75679V5.39519C9.75232 3.29279 8.06661 1.56479 5.99994 1.56479C3.93327 1.56479 2.24756 3.28319 2.24756 5.39519V7.75679" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add custom Sort icon with the provided SVG
const CustomSortIcon = () => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.64001 11.76V0.23999" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.23999 9.56158L2.30399 11.6256C2.49599 11.8176 2.79359 11.8176 2.98559 11.6256L5.04959 9.56158" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.35999 0.23999V11.76" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.76 2.43839L9.69604 0.38399C9.50404 0.19199 9.20644 0.19199 9.01444 0.38399L6.95044 2.44799" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add custom Help icon with the provided SVG
const CustomHelpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.99999 11.76C9.18115 11.76 11.76 9.18115 11.76 5.99999C11.76 2.81883 9.18115 0.23999 5.99999 0.23999C2.81883 0.23999 0.23999 2.81883 0.23999 5.99999C0.23999 9.18115 2.81883 11.76 5.99999 11.76Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M6.00006 8.832C6.18563 8.832 6.33606 8.68157 6.33606 8.496C6.33606 8.31044 6.18563 8.16 6.00006 8.16C5.81449 8.16 5.66406 8.31044 5.66406 8.496C5.66406 8.68157 5.81449 8.832 6.00006 8.832Z" fill="currentColor"/>
    <path d="M4.80005 4.80001C4.80005 4.13761 5.33765 3.60001 6.00005 3.60001C6.66245 3.60001 7.20005 4.13761 7.20005 4.80001C7.20005 5.46241 6.00005 7.20961 6.00005 7.20961" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
);

// Add custom Logout icon with the provided SVG
const CustomLogoutIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.57599 8.40959V9.83999C6.57599 10.896 5.71199 11.76 4.65599 11.76H2.15999C1.10399 11.76 0.23999 10.896 0.23999 9.83999V2.15999C0.23999 1.10399 1.10399 0.23999 2.15999 0.23999H4.65599C5.71199 0.23999 6.57599 1.10399 6.57599 2.15999V3.59039" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.76 6H3.40796" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.552 8.40961L11.616 6.34561C11.808 6.15361 11.808 5.85601 11.616 5.66401L9.552 3.60001" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add custom Filter icon with the provided SVG
const CustomFilterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.83997 6H11.76" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.07996 1.68041L11.76 1.67041" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.47998 10.32H11.76" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.39996 7.44C9.19525 7.44 9.83996 6.79529 9.83996 6C9.83996 5.20471 9.19525 4.56 8.39996 4.56C7.60467 4.56 6.95996 5.20471 6.95996 6C6.95996 6.79529 7.60467 7.44 8.39996 7.44Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.03998 11.76C5.83527 11.76 6.47998 11.1153 6.47998 10.32C6.47998 9.52471 5.83527 8.88 5.03998 8.88C4.24469 8.88 3.59998 9.52471 3.59998 10.32C3.59998 11.1153 4.24469 11.76 5.03998 11.76Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.63995 3.11999C3.43524 3.11999 4.07995 2.47528 4.07995 1.67999C4.07995 0.8847 3.43524 0.23999 2.63995 0.23999C1.84466 0.23999 1.19995 0.8847 1.19995 1.67999C1.19995 2.47528 1.84466 3.11999 2.63995 3.11999Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.23999 1.67999H1.19999" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.23999 6H6.95999" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.23999 10.32H3.59999" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add custom Settings icon with the provided SVG
const CustomSettingsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0.23999V1.47839" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M0.23999 6H1.47839" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M9.19678 2.8032L10.0704 1.9296" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M2.80317 2.8032L1.92957 1.9296" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M5.99041 10.5216H6.00001C8.49722 10.5216 10.5216 8.49722 10.5216 6.00001V5.99041C10.5216 3.4932 8.49722 1.46881 6.00001 1.46881H5.99041C3.4932 1.46881 1.46881 3.4932 1.46881 5.99041V6.00001C1.46881 8.49722 3.4932 10.5216 5.99041 10.5216Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M4.55994 6C4.55994 6.79529 5.20465 7.44 5.99994 7.44C6.79523 7.44 7.43994 6.79529 7.43994 6C7.43994 5.20471 6.79523 4.56 5.99994 4.56C5.20465 4.56 4.55994 5.20471 4.55994 6Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
    <path d="M1.90076 10.0992L2.73596 9.26401" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M6 10.5216V11.76" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M10.1184 10.1184L9.19678 9.19681" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M10.5216 6H11.76" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
);

// Add custom User icon with the provided SVG
const CustomUserIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.00005 6C7.38032 6 8.49925 4.88071 8.49925 3.5C8.49925 2.11929 7.38032 1 6.00005 1C4.61978 1 3.50085 2.11929 3.50085 3.5C3.50085 4.88071 4.61978 6 6.00005 6Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.04163 13C1.04163 10.5 3.26092 8 6.00004 8C8.73916 8 10.9585 10.5 10.9585 13" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add custom Star icon with the provided SVG
const CustomStarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.42003 1.22L7.60039 3.75C7.66649 3.9 7.79869 4 7.95922 4.02L10.5938 4.43C10.9809 4.49 11.132 4.99 10.8582 5.28L8.95072 7.25C8.8374 7.36 8.79019 7.53 8.81852 7.69L9.27178 10.47C9.33788 10.88 8.93183 11.19 8.58245 11L6.22173 9.69001C6.08009 9.61001 5.91956 9.61001 5.77791 9.69001L3.4172 11C3.06781 11.19 2.66177 10.88 2.72787 10.47L3.18112 7.69C3.20945 7.53 3.1528 7.36 3.04892 7.25L1.14146 5.28C0.858178 4.99 1.01871 4.49 1.40586 4.43L4.04043 4.02C4.19151 4 4.32371 3.89 4.39925 3.75L5.57961 1.22C5.74958 0.850005 6.25006 0.850005 6.42947 1.22H6.42003Z" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);

// Add custom Status icon with the provided SVG
const CustomStatusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5.36425H0V6.66425H12V5.36425Z" className="status-yellow" />
    <path d="M12 3.51855H0V4.81855H12V3.51855Z" className="status-purple" />
    <path d="M12 7.22266H0V8.52266H12V7.22266Z" className="status-green" />
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
        } else if (icon === "Bell") {
          return <CustomBellIcon />;
        } else if (icon === "Sort") {
          return <CustomSortIcon />;
        } else if (icon === "Help") {
          return <CustomHelpIcon />;
        } else if (icon === "Logout") {
          return <CustomLogoutIcon />;
        } else if (icon === "Filter") {
          return <CustomFilterIcon />;
        } else if (icon === "Settings") {
          return <CustomSettingsIcon />;
        } else if (icon === "User") {
          return <CustomUserIcon />;
        } else if (icon === "Star") {
          return <CustomStarIcon />;
        } else if (icon === "Status") {
          return <CustomStatusIcon />;
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
