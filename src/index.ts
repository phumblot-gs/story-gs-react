// Import styles
import "./lib.css";

// Import all components first
import * as React from "react";
import { buttonVariants } from "./components/ui/button-base";
import { Button } from "./components/ui/button";
import { LanguageSwitcher } from "./components/ui/language-switcher";
import { FileBrowser } from "./components/ui/file-browser";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./components/ui/select";
import { Input } from "./components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./components/ui/input-otp";
import { Search } from "./components/ui/search";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/ui/tabs";
import { Modal } from "./components/layout/Modal";
import { FullFrame } from "./components/layout/FullFrame";
import { FolderBrowser } from "./components/ui/folder-browser";
import ButtonNotifications from "./components/ButtonNotifications";
import { ButtonNotificationsRef } from "./components/notifications/types";
import PageHeader from "./components/PageHeader";

// Import additional UI components
import { Toggle, toggleVariants } from "./components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Workflow } from "./components/ui/workflow";
import { WorkflowStep } from "./components/ui/workflow-step";
import type { WorkflowStepState } from "./components/ui/workflow-step";
import { TruncatedText } from "./components/ui/truncated-text";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/ui/accordion";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { AspectRatio } from "./components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import { Badge, badgeVariants } from "./components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb";
import { Calendar } from "./components/ui/calendar";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./components/ui/carousel";
import { Checkbox } from "./components/ui/checkbox";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/ui/collapsible";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/ui/command";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./components/ui/context-menu";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./components/ui/form";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./components/ui/hover-card";
import { Label } from "./components/ui/label";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
} from "./components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./components/ui/pagination";
import { Popover, PopoverTrigger, PopoverContent } from "./components/ui/popover";
import { Progress } from "./components/ui/progress";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/ui/resizable";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";
import { Skeleton } from "./components/ui/skeleton";
import { Slider } from "./components/ui/slider";
import { Toaster, toast } from "./components/ui/sonner";
import { Switch } from "./components/ui/switch";
import { TagText } from "./components/ui/tag-text";
import { TagStar } from "./components/ui/tag-star";
import { TagLabel } from "./components/ui/tag-label";
import { TagGrade } from "./components/ui/tag-grade";
import { Grade } from "./components/ui/grade";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";
import { Textarea } from "./components/ui/textarea";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/ui/tooltip";

// Import types for re-export
import type {
  ButtonProps,
  ButtonSize,
  ButtonVariant
} from "./components/ui/button";

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
  InputProps
} from "./components/ui/input";

import type {
  SearchProps
} from "./components/ui/search";

import type {
  PageHeaderProps
} from "./components/PageHeader";

import type {
  ModalProps
} from "./components/layout/Modal";

import type {
  FullFrameProps
} from "./components/layout/FullFrame";

import type {
  FolderItem,
  FolderBrowserProps
} from "./components/ui/folder-browser";

// Export layout components
export { Layout, HStack, VStack, Modal, FullFrame, ActionBar, ActionBarProvider } from "./components/layout";
export type { LayoutProps, HStackProps, VStackProps, ModalProps, FullFrameProps, ActionBarProps } from "./components/layout";

// Export icons
export * from "./components/ui/icons";
export * from "./components/ui/icon-provider";

// Export UI components
export { buttonVariants };
export { Button };
export { LanguageSwitcher };
export { FileBrowser };
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
export { Input };
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
export { Search };
export { Tabs, TabsList, TabsTrigger, TabsContent };
export { FolderBrowser };
export { Icon } from "./components/ui/icons";

// Export additional UI components
export { Toggle, toggleVariants, ToggleGroup, ToggleGroupItem };
export { Workflow, WorkflowStep };
export type { WorkflowStepState };
export { TruncatedText };
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
export { Alert, AlertTitle, AlertDescription };
export { AspectRatio };
export { Avatar, AvatarImage, AvatarFallback };
export { Badge, badgeVariants };
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
export { Calendar };
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
export { Checkbox };
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
export { HoverCard, HoverCardTrigger, HoverCardContent };
export { Label };
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
};
export { Popover, PopoverTrigger, PopoverContent };
export { Progress };
export { RadioGroup, RadioGroupItem };
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
export { ScrollArea, ScrollBar };
export { Separator };
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
export { Skeleton };
export { Slider };
export { Toaster, toast };
export { Switch };
export { TagText };
export { TagStar };
export { TagLabel };
export { TagGrade };
export { Grade };
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
export { Textarea };
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

// Backward compatibility - ModalLayer is now Modal in layout
export { Modal as ModalLayer };
export { ButtonNotifications };
export type { ButtonNotificationsRef };
export { PageHeader };

// Export types
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  AvatarSize,
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
  InputProps,
  SearchProps,
  PageHeaderProps,
  FolderItem,
  FolderBrowserProps
};

export type { IconProps } from "./components/ui/icons";

// Backward compatibility types
export type ButtonBackground = "white" | "grey" | "black";  // Deprecated, use Layout bg instead

// For backward compatibility, export ButtonSmall as a type alias
// and create a simple function that returns Button with size="small"
// Avoid using JSX in .ts file by using createElement instead
export const ButtonSmall = (props: Omit<ButtonProps, "size">) => {
  return React.createElement(Button, { ...props, size: "small" });
};

export type ButtonSmallProps = Omit<ButtonProps, "size">;

// Backward compatibility type
export type { ModalProps as ModalLayerProps };

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

export { TranslationProvider, useTranslation, useTranslationSafe } from "./contexts/TranslationContext";
export type { Language as TranslationLanguage, TranslationProviderProps, TranslationMap } from "./contexts/TranslationContext";

export { StyleProvider, useStyles, useGlobalStyles } from "./contexts/StyleProvider";
export type { StyleConfig } from "./contexts/StyleProvider";

// Export root components for easy setup
export { GSComponentsRoot, GSGlobalStyles } from "./components/GSComponentsRoot";
export type { GSComponentsRootProps } from "./components/GSComponentsRoot";
