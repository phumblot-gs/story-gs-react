
import * as LucideIcons from "lucide-react"

// Define a list of approved custom icons to be used
export type IconName = 
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
  | "ToastSuccessIcon"
  | "ToastErrorIcon";

export type IconProps = {
  size?: number;
  className?: string;
}
