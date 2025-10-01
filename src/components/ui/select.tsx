"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { IconProvider } from "@/components/ui/icon-provider";

export type SelectBackground = "white" | "black" | "grey";

export interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  background?: SelectBackground;
  debug?: boolean;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
}

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  background?: SelectBackground;
  debug?: boolean;
  allowClear?: boolean;
  hasValue?: boolean;
  onClear?: () => void;
}

export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  background?: SelectBackground;
  debug?: boolean;
}

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  background?: SelectBackground;
  debug?: boolean;
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ children, background = "white", debug = false, className, allowClear = false, value, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(props.defaultValue || "");
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = Boolean(currentValue);

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("");
    }
    onValueChange?.("");
  };

  if (debug) {
    console.log("Select: props", { background, debug, allowClear, hasValue, currentValue, ...props });
  }

  return (
    <SelectPrimitive.Root value={currentValue} onValueChange={handleValueChange} {...props}>
      <div className={cn("relative", className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectTrigger) {
            return React.cloneElement(child, {
              background,
              allowClear,
              hasValue,
              onClear: handleClear,
              ...child.props,
            });
          }
          return child;
        })}
      </div>
    </SelectPrimitive.Root>
  );
});

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, background = "white", debug = false, disabled, allowClear = false, hasValue = false, onClear, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Observer pour détecter l'état ouvert/fermé du Select
  React.useEffect(() => {
    const element = triggerRef.current;
    if (!element) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          const state = element.getAttribute('data-state');
          setIsOpen(state === 'open');
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['data-state']
    });

    return () => observer.disconnect();
  }, []);
  // Styles basés sur la maquette Figma
  // background indique la couleur du fond sur lequel le composant s'affiche
  const getBackgroundStyles = () => {
    if (disabled) {
      // État désactivé - toujours gris peu importe le fond
      return "bg-grey-lighter text-grey-stronger border-grey-lighter";
    }

    switch (background) {
      case "white":
        // Le composant s'affiche sur fond blanc
        // Couleur du composant: inputSelectSingle/w/color-bg-default (gris)
        return "bg-grey-lighter text-black border-grey-lighter hover:border-black focus:border-black";
      case "black":
        // Le composant s'affiche sur fond noir (à définir)
        return "bg-black text-white border-grey-strongest hover:border-white focus:border-white";
      case "grey":
        // Le composant s'affiche sur fond gris (à définir)
        return "bg-grey text-black border-grey-stronger hover:border-black focus:border-black";
      default:
        return "bg-grey-lighter text-black border-grey-lighter hover:border-black focus:border-black";
    }
  };

  // Détermine quelle icône afficher
  const getIcon = () => {
    if (allowClear && hasValue && !isOpen) {
      return "X";
    }
    return isOpen ? "ArrowUp" : "ArrowDown";
  };

  // Gère le clic sur l'icône X pour effacer
  const handleClearPointerDown = (e: React.PointerEvent) => {
    if (allowClear && hasValue && !isOpen) {
      e.stopPropagation();
      e.preventDefault();
      onClear?.();
    }
  };

  if (debug) {
    console.log("SelectTrigger: props", { background, disabled, debug, allowClear, hasValue, isOpen, icon: getIcon() });
  }

  return (
    <SelectPrimitive.Trigger
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        // Base styles selon Figma
        "flex h-[30px] w-full items-center justify-between rounded-full border pl-[10px] pr-[5px] py-[10px]",
        "text-sm font-light transition-colors duration-200",
        "focus:outline-none focus:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[placeholder]:text-grey-stronger",
        getBackgroundStyles(),
        className
      )}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <div className="ml-[5px]">
        <SelectPrimitive.Icon asChild>
          <div
            className={cn(
              // Base styles from ButtonCircle small size
              "flex h-5 w-5 items-center justify-center rounded-full",
              "bg-grey transition-all duration-200",
              (isHovered || isOpen) && "!bg-black [&_svg]:text-white",
              isPressed && "brightness-90 scale-95",
              allowClear && hasValue && !isOpen ? "cursor-pointer" : ""
            )}
            onPointerDown={handleClearPointerDown}
            data-icon-clear={allowClear && hasValue && !isOpen ? "true" : "false"}
          >
            <IconProvider icon={getIcon()} size={12} />
          </div>
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  );
});

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, background = "white", debug = false, ...props }, ref) => {
  // Styles basés sur la maquette Figma selon le background
  const getContentStyles = () => {
    switch (background) {
      case "white":
        // Quand le composant s'affiche sur fond blanc, la dropdown a fond noir avec texte blanc
        return "bg-black text-white border-grey-strongest";
      case "black":
        // Quand le composant s'affiche sur fond noir, la dropdown reste blanche (à définir)
        return "bg-white text-black border-grey-lighter";
      case "grey":
        // Quand le composant s'affiche sur fond gris, la dropdown reste blanche (à définir)
        return "bg-white text-black border-grey-lighter";
      default:
        return "bg-white text-black border-grey-lighter";
    }
  };

  if (debug) {
    console.log("SelectContent: rendering content", { background });
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          // Styles de base de la liste déroulante selon Figma
          "relative z-50 max-h-96 overflow-hidden rounded-none border shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          getContentStyles(),
          className
        )}
        position="popper"
        style={{ minWidth: "var(--radix-select-trigger-width)" }}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-0">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, background = "white", debug = false, ...props }, ref) => {
  // Styles basés sur la maquette Figma selon le background
  const getItemStyles = () => {
    switch (background) {
      case "white":
      case "grey":
        // Quand le dropdown a fond noir (background="white" ou "grey")
        // Défaut: fond black-secondary, texte white
        // Hover: fond white, texte black
        // Focus: fond white, texte black
        // Pressed: fond white, texte blue-primary
        return "bg-black-secondary text-white hover:bg-white hover:text-black focus:bg-white focus:text-black active:bg-white active:text-blue-primary";
      case "black":
        // Quand le dropdown a fond noir (background="black")
        // Défaut: fond black-secondary, texte white
        // Hover: fond white, texte black
        // Focus: fond white, texte black
        // Pressed: fond white, texte blue-primary
        return "bg-black-secondary text-white hover:bg-white hover:text-black focus:bg-white focus:text-black active:bg-white active:text-blue-primary";
      default:
        // Fallback - fond blanc avec texte noir
        return "text-black hover:bg-grey-lighter focus:bg-grey-lighter";
    }
  };

  if (debug) {
    console.log("SelectItem: props", { background, ...props });
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        // Styles des items selon Figma
        "relative flex h-[30px] w-full cursor-default select-none items-center",
        "px-[10px] py-[10px] text-sm font-light",
        "focus:outline-none focus:ring-0 focus:border-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "transition-colors duration-150",
        getItemStyles(),
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

const SelectValue = SelectPrimitive.Value;

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
SelectValue.displayName = "SelectValue";

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
};