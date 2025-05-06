
// Import all components first
import * as React from "react";
import { buttonVariants } from "./components/ui/button";
import { Button } from "./components/ui/button-default";
import { ButtonCircle } from "./components/ui/button-circle";

// Import types for re-export
import type { 
  ButtonBackground,
  ButtonProps,
  ButtonSize
} from "./components/ui/button-default";

import type {
  AllowedPictogram,
  ButtonCircleProps,
  ButtonSize as ButtonCircleSize
} from "./components/ui/button-circle/types";

// Export UI components
export { buttonVariants };
export { Button };
export { ButtonCircle };

// Export types
export type { 
  ButtonBackground,
  ButtonProps,
  ButtonSize
};

// Create ButtonSmall as a wrapper around Button with size="small"
const ButtonSmall = React.forwardRef<HTMLButtonElement, Omit<React.ComponentPropsWithRef<typeof Button>, "size">>(
  (props, ref) => {
    return <Button {...props} size="small" ref={ref} />;
  }
);
ButtonSmall.displayName = "ButtonSmall";

export { ButtonSmall };
export type ButtonSmallProps = Omit<React.ComponentPropsWithRef<typeof Button>, "size">;

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
