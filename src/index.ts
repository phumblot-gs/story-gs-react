
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

// For backward compatibility, export ButtonSmall as a type alias
// and create a simple function that returns Button with size="small"
export const ButtonSmall: React.FC<Omit<ButtonProps, "size">> = (props) => {
  return <Button {...props} size="small" />;
};

export type ButtonSmallProps = Omit<ButtonProps, "size">;

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
