
// Export UI components - only export buttonVariants, not the Button component itself
export { buttonVariants } from "./components/ui/button";

// Export default button component (previously ButtonTextLarge)
export { Button } from "./components/ui/button-default";
export type { 
  ButtonBackground,
  ButtonProps
} from "./components/ui/button-default";

// Export button small component (previously ButtonTextSmall)
export { ButtonSmall } from "./components/ui/button-small";
export type { 
  ButtonBackground as ButtonSmallBackground,
  ButtonSmallProps
} from "./components/ui/button-small";

// Export ButtonCircle and its types separately to avoid conflicts
export { ButtonCircle } from "./components/ui/button-circle";
export type { 
  AllowedPictogram,
  ButtonSize,
  ButtonCircleProps 
} from "./components/ui/button-circle/types";

// Export status components
export * from "./components/ButtonStatus";
export * from "./components/StatusIndicator";

// Export utilities
export * from "./utils/mediaStatus";
export * from "./lib/utils";

// Export icon components
export * from "./components/ui/button-circle/custom-icons";
export * from "./components/ui/button-circle/icon-renderer";
export * from "./components/ui/button-circle/types";
export * from "./components/ui/icon-provider";
