
import { ButtonBackground } from "./types"

/**
 * Returns the appropriate button styles based on background and state
 */
export const getButtonStyles = (
  background: ButtonBackground | undefined, 
  disabled: boolean | undefined, 
  featured: boolean
) => {
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
        // Default to white background behavior if background is not specified
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

/**
 * Returns the size classes for the button
 */
export const getSizeClasses = (size: "small" | "large" = "large") => {
  return size === "small" ? "w-[20px] h-[20px]" : "w-[30px] h-[30px]";
}
