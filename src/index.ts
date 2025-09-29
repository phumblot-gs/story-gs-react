
// Import all components first
import * as React from "react";
import { buttonVariants } from "./components/ui/button-base";
import { Button } from "./components/ui/button";
import { ButtonCircle } from "./components/ui/button-circle";
import { LanguageSwitcher } from "./components/ui/language-switcher";
import { FileBrowser } from "./components/ui/file-browser";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./components/ui/select";
import ButtonNotifications from "./components/ButtonNotifications";
import { ButtonNotificationsRef } from "./components/notifications/types";

// Import types for re-export
import type { 
  ButtonBackground,
  ButtonProps,
  ButtonSize
} from "./components/ui/button";

import type {
  ButtonBackground as ButtonCircleBackground,
  ButtonSize as ButtonCircleSize,
  ButtonCircleProps
} from "./components/ui/button-circle/types";

import type {
  IconName
} from "./components/ui/icons/types";

import type {
  Language,
  LanguageSwitcherProps
} from "./components/ui/language-switcher";

import type {
  FileItem,
  FileBrowserProps
} from "./components/ui/file-browser";

import type {
  SelectBackground
} from "./components/ui/select";

// Export icons
export * from "./components/ui/icons";
export * from "./components/ui/icon-provider";

// Export UI components
export { buttonVariants };
export { Button };
export { ButtonCircle };
export { LanguageSwitcher };
export { FileBrowser };
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
export { ButtonNotifications };
export type { ButtonNotificationsRef };

// Export types
export type {
  ButtonBackground,
  ButtonProps,
  ButtonSize,
  ButtonCircleBackground,
  ButtonCircleProps,
  ButtonCircleSize,
  IconName,
  Language,
  LanguageSwitcherProps,
  FileItem,
  FileBrowserProps,
  SelectBackground
};

// For backward compatibility, export ButtonSmall as a type alias
// and create a simple function that returns Button with size="small"
// Avoid using JSX in .ts file by using createElement instead
export const ButtonSmall = (props: Omit<ButtonProps, "size">) => {
  return React.createElement(Button, { ...props, size: "small" });
};

export type ButtonSmallProps = Omit<ButtonProps, "size">;

// Export status components
export * from "./components/ButtonStatus";
export * from "./components/StatusIndicator";

// Export utilities
export * from "./utils/mediaStatus";
export * from "./lib/utils";
