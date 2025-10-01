
import { ButtonBackground } from "./types"

/**
 * Returns the appropriate button styles based on background and state
 */
export const getButtonStyles = (
  background: ButtonBackground | undefined,
  disabled: boolean | undefined,
  featured: boolean,
  isActive: boolean,
  originalBackground: ButtonBackground | undefined
) => {
  if (disabled) {
    if (originalBackground === "white") {
      return "bg-white text-grey-stronger"
    } else if (originalBackground === "black") {
      return "bg-black text-grey-stronger"
    } else {
      return "bg-grey text-grey-stronger"
    }
  }

  // When isActive is true, apply black-secondary background with hover state based on original background
  if (isActive) {
    if (featured) {
      switch (originalBackground) {
        case "white":
          return "bg-black-secondary text-white hover:bg-grey-lighter hover:text-black active:bg-black active:text-blue-primary"
        case "black":
          return "bg-black-secondary text-white hover:bg-grey-strongest hover:text-white active:bg-black active:text-blue-primary"
        case "grey":
          return "bg-black-secondary text-white hover:bg-white hover:text-black active:bg-black active:text-blue-primary"
        default:
          return "bg-black-secondary text-white hover:bg-grey-lighter hover:text-black active:bg-black active:text-blue-primary"
      }
    } else {
      switch (originalBackground) {
        case "white":
          return "bg-black-secondary text-white hover:bg-white hover:text-black active:bg-black active:text-blue-primary"
        case "black":
          return "bg-black-secondary text-white hover:bg-black hover:text-white active:bg-black active:text-blue-primary"
        case "grey":
          return "bg-black-secondary text-white hover:bg-grey hover:text-black active:bg-black active:text-blue-primary"
        default:
          return "bg-black-secondary text-white hover:bg-white hover:text-black"
      }
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
