
import { ButtonProps } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"

// These types are still needed internally but for background only
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
  | "Urgent"
  | "Vedette"
  | "Comment"
  | "Alert"
  | "ArrowRight"
  | "ArrowLeft"
  | "ArrowUp"
  | "ArrowDown"
  | "Eye"

export interface ButtonCircleProps extends Omit<ButtonProps, 'variant' | 'size'> {
  background?: ButtonBackground
  indicator?: boolean
  disabled?: boolean
  featured?: boolean
  size?: ButtonSize
  icon?: keyof typeof LucideIcons | AllowedPictogram
  letter?: string
}
