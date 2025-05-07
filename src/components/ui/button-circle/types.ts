
import { ButtonProps } from "@/components/ui/button"
import { IconName } from "@/components/ui/icons/types"
import { VariantProps } from "class-variance-authority"
import { sizeVariants } from "./variants"

// These types are still needed internally but for background only
export type ButtonBackground = "white" | "black" | "grey" 
export type ButtonSize = "small" | "large"

export interface ButtonCircleProps extends Omit<ButtonProps, 'variant' | 'size'>, VariantProps<typeof sizeVariants> {
  background?: ButtonBackground
  disabled?: boolean
  featured?: boolean
  icon?: IconName
  indicator?: boolean
  debug?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
}
