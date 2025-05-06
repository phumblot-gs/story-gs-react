
// Export UI components - only export buttonVariants, not the Button component itself
export { buttonVariants } from "./components/ui/button";

// Export default button component with size property
export { Button } from "./components/ui/button-default";
export type { 
  ButtonBackground,
  ButtonProps,
  ButtonSize
} from "./components/ui/button-default";

// Export ButtonSmall as an alias of Button with size="small" for backward compatibility
import { Button as BaseButton } from "./components/ui/button-default";
import * as React from "react";

// Create ButtonSmall as a wrapper around Button with size="small"
const ButtonSmall = React.forwardRef<
  HTMLButtonElement, 
  Omit<React.ComponentPropsWithRef<typeof BaseButton>, "size">
>((props, ref) => {
  return <BaseButton {...props} size="small" ref={ref} />;
});
ButtonSmall.displayName = "ButtonSmall";

export { ButtonSmall };
export type ButtonSmallProps = Omit<React.ComponentPropsWithRef<typeof BaseButton>, "size">;

// Export ButtonCircle and its types separately to avoid conflicts
export { ButtonCircle } from "./components/ui/button-circle";
export type { 
  AllowedPictogram,
  ButtonSize as ButtonCircleSize,
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
export * from "./components/ui/button-circle/icon-provider";
