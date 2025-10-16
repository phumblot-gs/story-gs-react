// Import styles
import "./lib.css";

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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/ui/tabs";
import { ModalLayer } from "./components/ui/modal-layer";
import { FolderBrowser } from "./components/ui/folder-browser";
import ButtonNotifications from "./components/ButtonNotifications";
import { ButtonNotificationsRef } from "./components/notifications/types";
import PageHeader from "./components/PageHeader";

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
  FileBrowserProps,
  DateFilter,
  SortConfig,
  SortField,
  SortDirection
} from "./components/ui/file-browser";

import type {
  SelectBackground
} from "./components/ui/select";

import type {
  PageHeaderProps
} from "./components/PageHeader";

import type {
  ModalLayerProps
} from "./components/ui/modal-layer";

import type {
  FolderItem,
  FolderBrowserProps
} from "./components/ui/folder-browser";

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
export { Tabs, TabsList, TabsTrigger, TabsContent };
export { ModalLayer };
export { FolderBrowser };
export { ButtonNotifications };
export type { ButtonNotificationsRef };
export { PageHeader };

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
  DateFilter,
  SortConfig,
  SortField,
  SortDirection,
  SelectBackground,
  PageHeaderProps,
  ModalLayerProps,
  FolderItem,
  FolderBrowserProps
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

// Export Contexts and Providers
export { ThemeProvider, useCustomTheme } from "./contexts/ThemeContext";
export type { ThemeCustomization, ThemeProviderProps } from "./contexts/ThemeContext";
export { useTheme } from "next-themes";

export { TranslationProvider, useTranslation } from "./contexts/TranslationContext";
export type { Language as TranslationLanguage, TranslationProviderProps } from "./contexts/TranslationContext";

export { StyleProvider, useStyles, useGlobalStyles } from "./contexts/StyleProvider";
export type { StyleConfig } from "./contexts/StyleProvider";

// Export root components for easy setup
export { GSComponentsRoot, GSGlobalStyles } from "./components/GSComponentsRoot";
export type { GSComponentsRootProps } from "./components/GSComponentsRoot";
