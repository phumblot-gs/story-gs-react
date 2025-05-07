
import * as LucideIcons from "lucide-react"
import { AVAILABLE_ICONS } from "./constants"

// Define IconName type based on the available icons array
export type IconName = typeof AVAILABLE_ICONS[number];

export type IconProps = {
  size?: number;
  className?: string;
}
