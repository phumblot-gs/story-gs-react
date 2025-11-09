import React from "react"
import { AnimatedName } from "./types"
import { renderAnimation, AnimationProps } from "./animation-renderer"
import { cn } from "@/lib/utils"

/**
 * Available color tokens from the design system
 */
export type ColorToken =
  | "green"
  | "green-primary"
  | "blue"
  | "blue-primary"
  | "red-strong"
  | "yellow"
  | "orange"
  | "pink"
  | "purple"
  | "khaki"
  | "pastel-blue"
  | "pastel-green"
  | "pastel-yellow"

/**
 * Converts a color token to CSS variable
 */
const getColorValue = (token: ColorToken | string): string => {
  // If it's already a hex color or CSS variable, return as is
  if (token.startsWith("#") || token.startsWith("rgb") || token.startsWith("var(")) {
    return token
  }
  // Convert token to CSS variable
  return `var(--color-${token})`
}

export interface AnimatedProps {
  /** Animation name to display */
  name: AnimatedName

  /** Badge/icon color (default: "white"). Can be a color token or hex value */
  color?: string

  /** Circle background color (default: "green" for success). Can be a color token (e.g., "green", "blue-primary", "red-strong") or hex value */
  bgColor?: ColorToken | string

  /** Badge animation duration in seconds (default: 0.8) */
  duration?: number

  /** Delay before checkmark appears in seconds (default: 0.8) */
  checkDelay?: number

  /** Additional Tailwind CSS classes. Use w-x and h-x to control size */
  className?: string

  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void

  /** Debug mode: displays pink border and logs clicks to console */
  debug?: boolean
}

/**
 * Reusable Animated component
 *
 * Displays animations to illustrate application behavior.
 * Similar to the Icon component, but for animations.
 *
 * @example
 * ```tsx
 * // Default success animation
 * <Animated name="success" className="w-11 h-11" />
 *
 * // Success animation with custom size using Tailwind classes
 * <Animated name="success" className="w-16 h-16" />
 *
 * // Success animation with custom colors using color tokens
 * <Animated name="success" className="w-16 h-16" color="white" bgColor="blue-primary" />
 *
 * // Success animation with custom colors using hex values (still supported)
 * <Animated name="success" className="w-16 h-16" color="white" bgColor="#2196F3" />
 *
 * // Animation with custom timing
 * <Animated 
 *   name="success" 
 *   className="w-20 h-20"
 *   duration={1.2} 
 *   checkDelay={1.0} 
 * />
 * ```
 */
export const Animated: React.FC<AnimatedProps> = ({
  name,
  color,
  bgColor,
  duration = 0.8,
  checkDelay = 0.8,
  className,
  onClick,
  debug = false,
}) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (debug) {
        console.log("[Animated Click]", {
          name,
          color,
          bgColor,
          duration,
          checkDelay,
          className,
          event: e,
        })
      }
      onClick?.(e)
    },
    [debug, name, color, bgColor, duration, checkDelay, className, onClick]
  )

  // Determine default values based on animation type
  const defaultBgColor = bgColor || (name === "success" ? "green" : undefined)
  const defaultColor = color || "white"

  const animationElement = renderAnimation(name, {
    color: getColorValue(defaultColor),
    bgColor: defaultBgColor ? getColorValue(defaultBgColor) : undefined,
    duration,
    checkDelay,
    className,
  })

  if (!animationElement) {
    console.warn(`[Animated] Animation "${name}" not found`)
    return null
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0",
        onClick && "cursor-pointer",
        debug && "ring-2 ring-pink"
      )}
      onClick={debug || onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {animationElement}
    </div>
  )
}

Animated.displayName = "Animated"

