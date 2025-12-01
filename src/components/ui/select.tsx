"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icons";
import { useBgContext } from "@/components/layout/BgContext";

export interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  debug?: boolean;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  size?: "normal" | "small";
}

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  debug?: boolean;
  allowClear?: boolean;
  hasValue?: boolean;
  onClear?: () => void;
  size?: "normal" | "small";
}

export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  debug?: boolean;
}

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  debug?: boolean;
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ children, debug = false, className, allowClear = false, value, onValueChange, size = "normal", ...props }, ref) => {
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
    console.log("Select: props", { debug, allowClear, hasValue, currentValue, size, ...props });
  }

  return (
    <SelectPrimitive.Root value={currentValue} onValueChange={handleValueChange} {...props}>
      <div className={cn("relative", className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectTrigger) {
            return React.cloneElement(child, {
              allowClear,
              hasValue,
              onClear: handleClear,
              size,
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
>(({ className, children, debug = false, disabled, allowClear = false, hasValue = false, onClear, size = "normal", ...props }, ref) => {
  const bg = useBgContext();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [triggerNode, setTriggerNode] = React.useState<HTMLButtonElement | null>(null);

  // Observer pour détecter l'état ouvert/fermé du Select
  React.useEffect(() => {
    const element = triggerNode;
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
  }, [triggerNode]);

  // Styles basés sur la maquette Figma
  // Hérite du contexte bg via useBgContext()
  const getBackgroundStyles = () => {
    if (disabled) {
      // État désactivé - toujours gris peu importe le fond
      return "bg-grey-lighter text-grey-stronger border-grey-lighter";
    }

    switch (bg) {
      case "white":
        // Le composant s'affiche sur fond blanc - bordure invisible (même couleur que bg)
        return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]";
      case "black":
        // Le composant s'affiche sur fond noir - bordure invisible (même couleur que bg)
        return "bg-black-secondary text-white border-black-secondary hover:border-white/50 focus:border-white/50 hover:border-[0.5px] focus:border-[0.5px]";
      case "grey":
        // Le composant s'affiche sur fond gris - bordure invisible (même couleur que bg)
        return "bg-white text-black border-white hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]";
      default:
        return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]";
    }
  };

  // Détermine quelle icône afficher
  const getIcon = () => {
    if (allowClear && hasValue && !isOpen) {
      return "X";
    }
    return isOpen ? "ArrowUp" : "ArrowDown";
  };

  // Détermine les styles du bouton circulaire selon le bg et l'état
  const getIconButtonStyles = () => {
    // État ouvert (liste déroulée) - même pour tous les backgrounds
    if (isOpen) {
      return "bg-blue-primary text-black";
    }

    // État pressé - même pour tous les backgrounds
    if (isPressed) {
      return "bg-black text-blue-primary";
    }

    // État hover - même pour tous les backgrounds
    if (isHovered) {
      return "bg-black text-white";
    }

    // État par défaut selon le background
    switch (bg) {
      case "grey":
        return "bg-grey-lighter text-black";
      case "white":
      case "black":
      default:
        return "bg-white text-black";
    }
  };

  // Gère le clic sur l'icône X pour effacer
  const handleClearPointerDown = (e: React.PointerEvent) => {
    if (allowClear && hasValue && !isOpen) {
      e.stopPropagation();
      e.preventDefault();
      onClear?.();
    }
  };

  // Styles conditionnels selon la taille
  const getSizeStyles = () => {
    if (size === "small") {
      return {
        trigger: "h-4 py-0 pl-2 pr-[2px]",
        button: "h-3 w-3",
        iconWrapper: "w-[5px] h-[5px]",
        iconSize: 5,
      };
    }
    return {
      trigger: "h-[30px] py-1 pl-3 pr-[4px]",
      button: "h-4 w-4",
      iconWrapper: "w-[10px] h-[10px]",
      iconSize: 10,
    };
  };

  const sizeStyles = getSizeStyles();

  if (debug) {
    console.log("SelectTrigger: props", { bg, disabled, debug, allowClear, hasValue, isOpen, size, icon: getIcon() });
  }

  return (
    <SelectPrimitive.Trigger
      ref={(node) => {
        setTriggerNode(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        // Base styles selon Figma
        "flex w-full items-center justify-between rounded-full border",
        sizeStyles.trigger,
        "text-sm font-light transition-colors duration-200",
        "focus:outline-none focus:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[placeholder]:text-grey-strongest",
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
      <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis min-w-0">{children}</span>
      <div className="ml-2">
        <SelectPrimitive.Icon asChild>
          <div
            className={cn(
              "flex items-center justify-center rounded-full transition-colors duration-200",
              sizeStyles.button,
              getIconButtonStyles(),
              allowClear && hasValue && !isOpen ? "cursor-pointer" : ""
            )}
            onPointerDown={handleClearPointerDown}
            data-icon-clear={allowClear && hasValue && !isOpen ? "true" : "false"}
          >
            <span className={cn("flex items-center justify-center", sizeStyles.iconWrapper)}>
              <Icon name={getIcon()} size={sizeStyles.iconSize} />
            </span>
          </div>
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  );
});

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, debug = false, ...props }, ref) => {
  const bg = useBgContext();

  // Styles basés sur la maquette Figma selon le background
  const getContentStyles = () => {
    switch (bg) {
      case "white":
        // Quand le composant s'affiche sur fond blanc, la dropdown a fond noir avec texte blanc
        return "bg-black text-white border-grey-strongest";
      case "black":
        // Quand le composant s'affiche sur fond noir, la dropdown reste blanche
        return "bg-white text-black border-grey-lighter";
      case "grey":
        // Quand le composant s'affiche sur fond gris, la dropdown reste blanche
        return "bg-white text-black border-grey-lighter";
      default:
        return "bg-white text-black border-grey-lighter";
    }
  };

  if (debug) {
    console.log("SelectContent: rendering content", { bg });
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          // Styles de base de la liste déroulante selon Figma
          "relative z-50 max-h-96 overflow-hidden rounded-none shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          getContentStyles(),
          className
        )}
        position="popper"
        sideOffset={5}
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
>(({ className, children, debug = false, ...props }, ref) => {
  const bg = useBgContext();

  // Styles basés sur la maquette Figma selon le background
  const getItemStyles = () => {
    switch (bg) {
      case "white":
        // Quand le dropdown a fond noir (bg="white")
        // Défaut: fond black, texte white
        // Hover: fond grey-lighter, texte black
        // Focus: fond grey-lighter, texte black
        // Pressed: fond grey-lighter, texte blue-primary
        return "bg-black text-white hover:bg-grey-lighter hover:text-black focus:bg-grey-lighter focus:text-black active:bg-grey-lighter active:text-blue-primary";
      case "grey":
        // Quand le dropdown a fond noir (bg="grey")
        // Défaut: fond black, texte white
        // Hover: fond white, texte black
        // Focus: fond white, texte black
        // Pressed: fond white, texte blue-primary
        return "bg-black text-white hover:bg-white hover:text-black focus:bg-white focus:text-black active:bg-white active:text-blue-primary";
      case "black":
        // Quand le dropdown a fond noir (bg="black")
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
    console.log("SelectItem: props", { bg, ...props });
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        // Styles des items selon Figma
        "relative flex h-8 w-full cursor-default select-none items-center",
        "px-3 py-2 text-sm font-light",
        "focus:outline-none focus:ring-0 focus:border-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "transition-colors duration-150",
        getItemStyles(),
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="whitespace-nowrap overflow-hidden text-ellipsis">{children}</SelectPrimitive.ItemText>
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