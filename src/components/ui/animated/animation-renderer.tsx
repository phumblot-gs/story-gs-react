import React from "react"
import { AnimatedName } from "./types"
import { SuccessAnimation } from "./animations/success"

export interface AnimationProps {
  color: string
  bgColor?: string
  duration?: number
  checkDelay?: number
  className?: string
}

/**
 * Renders the appropriate animation based on the animation name
 */
export const renderAnimation = (
  name: AnimatedName,
  props: AnimationProps
): React.ReactNode => {
  switch (name) {
    case "success":
      return <SuccessAnimation {...props} />
    default:
      console.warn(`[Animated] Animation "${name}" not found`)
      return null
  }
}

